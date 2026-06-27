const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/aiService")
const interviewReportModel = require("../models/interviewReportModel")

async function generateInterViewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a resume PDF file." })
        }

        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        const { selfDescription, jobDescription } = req.body

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });


        // Ultimate structural safety check to satisfy Mongoose requirements
        const finalReportData = {
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            title: interViewReportByAi?.title || "Interview Performance Report",
            ...interViewReportByAi
        }

        const interviewReport = await interviewReportModel.create(finalReportData)
      
        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error in generateInterViewReportController:", error);
        
        // Handle Gemini High Demand Error gracefully
        if (error.status === "UNAVAILABLE" || error.message?.includes("503")) {
            return res.status(503).json({
                message: "The AI service is currently experiencing heavy load. Please try submitting again in a few moments."
            });
        }

        res.status(500).json({ 
            message: "An internal server error occurred while processing the report.",
            error: error.message 
        })
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error in getInterviewReportByIdController:", error);
        res.status(500).json({ message: "Internal server error.", error: error.message })
    }
}

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (error) {
        console.error("Error in getAllInterviewReportsController:", error);
        res.status(500).json({ message: "Internal server error.", error: error.message })
    }
}

async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params
        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport
        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (error) {
        console.error("Error in generateResumePdfController:", error);

        if (error.status === "UNAVAILABLE" || error.message?.includes("503")) {
            return res.status(503).json({
                message: "The AI document service is temporarily busy. Please wait a moment and click download again."
            });
        }

        res.status(500).json({ message: "Could not compile the PDF resume.", error: error.message })
    }
}

module.exports = { 
    generateInterViewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    generateResumePdfController 
}