from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import fitz
import os
import re
import json
import base64
import httpx

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text("text")
    return text.strip()

PROMPT = """
You are a legal document analyst. Analyze this legal document and provide:

1. SUMMARY: A clear, plain English summary (3-4 sentences)
2. RISK SCORE: A score from 0-100 (100 = very risky)
3. RISKY CLAUSES: List top 5 risky clauses with explanation
4. KEY TERMS: List 5 important legal terms with simple definitions
5. RECOMMENDATIONS: 3 actionable recommendations

Respond in JSON format exactly like this, no extra text, no markdown:
{
    "summary": "...",
    "risk_score": 45,
    "risky_clauses": [
        {"clause": "...", "risk": "High/Medium/Low", "explanation": "..."}
    ],
    "key_terms": [
        {"term": "...", "definition": "..."}
    ],
    "recommendations": ["...", "...", "..."]
}
"""

async def analyze_with_groq(text):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "user", "content": f"{PROMPT}\n\nDocument:\n{text[:6000]}"}
        ],
        "temperature": 0.1
    }

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=body
        )
        data = response.json()
        
        if "choices" not in data:
            raise Exception(f"Groq error: {data}")
        
        raw = data["choices"][0]["message"]["content"]
        raw = raw.strip().replace("```json", "").replace("```", "").strip()
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        return json.loads(match.group())

@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):
    contents = await file.read()
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(contents)
    elif filename.endswith((".png", ".jpg", ".jpeg", ".webp")):
        return {"error": "Image support coming soon. Please upload a PDF."}
    else:
        return {"error": "Only PDF files are supported."}

    result = await analyze_with_groq(text=text)
    return result

@app.get("/")
def root():
    return {"status": "LegalEaseAI backend running"}