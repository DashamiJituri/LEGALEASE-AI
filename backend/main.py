from fastapi import FastAPI, UploadFile, File, Form
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
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text("text")
    return text.strip()

def get_prompt(language="English"):
    return f"""
You are a legal document analyst. Analyze this legal document and provide your response in {language}.

1. SUMMARY: A clear, plain English summary (3-4 sentences)
2. RISK SCORE: A score from 0-100 (100 = very risky)
3. RISKY CLAUSES: List top 5 risky clauses with explanation
4. KEY TERMS: List 5 important legal terms with simple definitions
5. RECOMMENDATIONS: 3 actionable recommendations

Respond in JSON format exactly like this, no extra text, no markdown:
{{
    "summary": "...",
    "risk_score": 45,
    "risky_clauses": [
        {{"clause": "...", "risk": "High/Medium/Low", "explanation": "..."}}
    ],
    "key_terms": [
        {{"term": "...", "definition": "..."}}
    ],
    "recommendations": ["...", "...", "..."]
}}
"""

async def analyze_with_groq(text, language="English"):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "user", "content": f"{get_prompt(language)}\n\nDocument:\n{text[:6000]}"}
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

async def analyze_document(file: UploadFile = File(...), language: str = Form("English")):
    contents = await file.read()
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(contents)
    elif filename.endswith((".png", ".jpg", ".jpeg", ".webp")):
        return {"error": "Image support coming soon. Please upload a PDF."}
    else:
        return {"error": "Only PDF files are supported."}

    result = await analyze_with_groq(text=text, language=language)
    return result


from typing import List

chat_sessions = {}

@app.post("/chat")
async def chat_with_document(request: dict):
    session_id = request.get("session_id")
    question = request.get("question")
    context = request.get("context")
    
    messages = chat_sessions.get(session_id, [])
    
    prompt = f"""You are a legal document assistant. The user has uploaded a legal document with the following analysis:

{context}

Answer the user's question about this document clearly and concisely.

User question: {question}"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    body = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3
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
        
        answer = data["choices"][0]["message"]["content"]
        
        messages.append({"role": "user", "content": question})
        messages.append({"role": "assistant", "content": answer})
        chat_sessions[session_id] = messages
        
        return {"answer": answer}

@app.get("/")
def root():
    return {"status": "LegalEaseAI backend running"}