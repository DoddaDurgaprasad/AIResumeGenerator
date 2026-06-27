# AI Resume Generator & Interview Preparation Platform

An AI-powered full-stack web application that helps job seekers optimize their resumes, prepare for technical interviews, and generate ATS-friendly resumes tailored to specific job descriptions.

Built with the MERN stack and Google's Gemini AI, the platform analyzes a candidate's resume against a target job description, identifies skill gaps, generates interview questions, and creates an optimized resume in PDF format.

---

# Features

* 🔐 JWT Authentication (Login & Registration)
* 📄 Resume PDF Upload
* 🤖 AI-powered Resume Analysis
* 🎯 AI-generated Interview Preparation Report
* 📊 Resume Match Score
* 💻 Technical Interview Questions with Detailed Answers
* 🗣 Behavioral Interview Questions using STAR Method
* 📉 Skill Gap Analysis
* 📅 Personalized Day-wise Preparation Plan
* 📑 ATS-Optimized Resume Generation
* 📥 Download Resume as PDF
* 📂 Interview Report History
* 🔄 Automatic Retry Handling for Gemini API Errors

---

# Tech Stack

## Frontend

* React.js
* Vite
* React Router DOM
* SCSS (Sass)
* Axios
* React Icons
* Context API


## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* pdf-parse
* Puppeteer

## AI

* Google Gemini 2.5 Flash
* Google GenAI SDK

---

# Project Structure

```
AIResumeGenerator
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── config/
│   │   └── utils/
│   │
│   ├── uploads/
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

# Workflow

```
User Login
      │
      ▼
Upload Resume (PDF)
      │
      ▼
Enter Self Description
      │
      ▼
Paste Job Description
      │
      ▼
Gemini AI Analysis
      │
      ├── Resume Match Score
      ├── Technical Questions
      ├── Behavioral Questions
      ├── Skill Gap Analysis
      └── Preparation Roadmap
      │
      ▼
Save Report in MongoDB
      │
      ▼
Generate ATS Resume
      │
      ▼
Download PDF
```

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/<DoddaDurgaPrasad>/AIResumeGenerator.git

cd AIResumeGenerator
```

---

## Backend Setup

```bash
cd server

npm install

npm run dev
```

---

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

# Environment Variables

Create a `.env` file inside the `server` directory.

Required environment variables:

* PORT
* MONGODB_URI
* JWT_SECRET
* GOOGLE_GENAI_API_KEY

---

# Key Functionalities

### Authentication

* Secure user registration
* JWT-based login
* Protected API routes

### AI Interview Report

Generates:

* Job Match Score
* Technical Questions
* Behavioral Questions
* Skill Gap Analysis
* Preparation Plan

### Resume Generator

* ATS-friendly resume
* Tailored to target job description
* Professional formatting
* PDF export using Puppeteer

---

# Future Enhancements

* Mock Interview Simulator
* Voice-based AI Interview
* Resume Version Management
* AI Cover Letter Generator
* Company-specific Interview Preparation
* Coding Interview Practice
* Dashboard Analytics
* Docker Support
* Cloud Deployment
* Email Notifications

---

# Learning Outcomes

This project demonstrates practical experience with:

* Full Stack Web Development
* RESTful API Design
* JWT Authentication
* MongoDB Data Modeling
* File Upload Handling
* PDF Processing
* AI Integration using Google Gemini
* Prompt Engineering
* Structured AI Responses
* PDF Generation using Puppeteer
* Error Handling & Retry Logic

---

# Author

**Dodda Durga Prasad**

Computer Science Engineering Student

National Institute of Technology Raipur

GitHub: https://github.com/DoddaDurgaprasad

LinkedIn: www.linkedin.com/in/durga-prasad-dodda-84ba6128a


