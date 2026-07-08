const { GoogleGenAI, Type } = require("@google/genai") // Import Type
const puppeteer = require("puppeteer")
const pdfParse = require("pdf-parse")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── NATIVE SCHEMAS ────────────────────────────────────────────────────────────

// Schema for Interview Report
const nativeInterviewSchema = {
    type: Type.OBJECT,
    properties: {
        title: { 
            type: Type.STRING, 
            description: "The job title matching the job description (e.g., Software Development Engineer)" 
        },
        matchScore: { 
            type: Type.INTEGER, 
            description: "A score between 0 and 100 indicating profile match." 
        },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "Technical questions based on the candidate's stack and CS core topics.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The technical interview question." },
                    intention: { type: Type.STRING, description: "Why the interviewer is asking this." },
                    answer: { type: Type.STRING, description: "Deeply detailed model answer and approach." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Behavioral and situational questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The behavioral question." },
                    intention: { type: Type.STRING, description: "What soft skill they are analyzing." },
                    answer: { type: Type.STRING, description: "The ideal response structure (e.g., using STAR method)." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            description: "Identified weaknesses or missing requirements.",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The name of the missing skill or concept." },
                    severity: { type: Type.STRING, enum: ["low", "medium", "high"], description: "The risk level." }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "A step-by-step roadmap to prepare.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER, description: "Day count starting from 1." },
                    focus: { type: Type.STRING, description: "Topic domain focus for the day." },
                    tasks: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Actionable study or practice items."
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

const nativeResumePdfSchema = {
    type: Type.OBJECT,
    properties: {
        html: {
            type: Type.STRING,
            description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer"
        }
    },
    required: ["html"]
};

// ── SERVICE FUNCTIONS ─────────────────────────────────────────────────────────

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert technical interviewer. Analyze the provided details and return a complete, robust interview report containing real questions and strategic breakdowns. Do not leave array values empty.
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}
    `;

    let retries = 3;
    let delayMs = 2000;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: nativeInterviewSchema, 
                }
            })

            const parsedData = JSON.parse(response.text);
            
            if (!parsedData.title) {
                parsedData.title = "Software Development Engineer Interview Report";
            }

            return parsedData;

        } catch (error) {
            const is503Error = error.status === "UNAVAILABLE" || (error.message && error.message.includes("503"));
            
            if (is503Error && attempt < retries) {
                console.warn(`[Gemini API] Server busy (503). Retrying attempt ${attempt}/${retries} in ${delayMs}ms...`);
                await delay(delayMs);
                delayMs *= 2;
            } else {
                throw error;
            }
        }
    }
}

async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: "/opt/render/.cache/puppeteer/chrome/linux-150.0.7871.24/chrome-linux64/chrome",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, {
        waitUntil: "networkidle0"
    });

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();

    return pdfBuffer;
}
async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert ATS (Applicant Tracking System) Optimization Engineer and professional resume writer. 
Your task is to take the candidate's original resume data, self-description, and target job description, and completely re-engineer it into an optimized, professional HTML resume.

CANDIDATE DATA:
- Original Resume Data: ${resume}
- Candidate Self-Description: ${selfDescription}
- Target Job Description: ${jobDescription}

STRICT GENERATION RULES:
1. OVERALL OBJECTIVE: Do not just copy-paste the original text. Rewrite the content aggressively to match the Target Job Description. Highlighting relevant technical stack matching, frameworks, and core CS concepts required by the target role.
2. PROFESSIONAL SUMMARY: Add a compelling, high-impact 3-4 line professional summary tailored specifically toward the target company and role, highlighting why the candidate is a perfect technical match.
3. EXPERIENCE & PROJECTS TRANSFORMATION: Rewrite every single bullet point under Experience and Projects using the "X-Y-Z formula" (Accomplished [X] as measured by [Y], by doing [Z]). Infuse technical terms, optimize verbs (e.g., "Architected", "Optimized", "Engineered"), and quantify impact where logical.
4. TECHNICAL SKILLS RE-ORDERING: Dynamically sort and group the Technical Skills section so that the languages, frameworks, and tools most highly prioritized in the target Job Description appear first.
5. ATS LOGIC: Ensure the wording is completely clean, human-written, avoiding generic AI fluff phrases, and optimized heavily for ATS keyword matching parsing algorithms.
6. FORMAT REQUIREMENT: Return a JSON object containing a single "html" key. The HTML string must be clean, structured, and use a professional inline-styled design (clean typography, crisp section margins, subtle accent borders) that compiles beautifully into a 1-2 page print layout via Puppeteer.`;


    let retries = 3;
    let delayMs = 2000;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: nativeResumePdfSchema, 
                }
            })

            const jsonContent = JSON.parse(response.text)
            const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
            return pdfBuffer

        } catch (error) {
            const is503Error = error.status === "UNAVAILABLE" || (error.message && error.message.includes("503"));
            
            if (is503Error && attempt < retries) {
                console.warn(`[Gemini API] Server busy (503). Retrying resume compilation attempt ${attempt}/${retries} in ${delayMs}ms...`);
                await delay(delayMs);
                delayMs *= 2;
            } else {
                throw error;
            }
        }
    }
}

module.exports = { generateInterviewReport, generateResumePdf }