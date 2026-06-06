# ⚖️ LegalEase AI

> AI-powered legal document analyzer — understand any contract in seconds.

🔗 **[Live Demo](https://legalease-ai-two.vercel.app)** | [GitHub](https://github.com/DashamiJituri/LEGALEASE-AI)

---

## 🚀 What it does

Upload any legal PDF — get instant:
- **Risk Score** (0-100) with animated meter
- **Plain English Summary** of complex clauses
- **Risky Clause Detection** — High/Medium/Low
- **Key Legal Terms** explained simply
- **AI Recommendations** on what to negotiate
- **Chat with Document** — ask anything about your contract
- **Multilingual Analysis** — English, Hindi, Marathi, Tamil & more

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, Framer Motion, GSAP |
| Backend | FastAPI, Python |
| AI/LLM | Groq API (Llama 3.3 70B) |
| Auth | Supabase |
| Deploy | Vercel (frontend) + Render (backend) |

---

## ✨ Features

- 🔍 **Smart PDF Parsing** — extracts and analyzes full document text
- 🤖 **LLM-powered Analysis** — Llama 3.3 70B for accurate legal understanding
- 💬 **Document Chat** — RAG-based contextual Q&A
- 🌍 **7 Languages** — multilingual output support
- 🔐 **Auth System** — Supabase email authentication
- 📱 **Responsive UI** — works on all devices

---

## 🏃 Run Locally

```bash
# Clone repo
git clone https://github.com/DashamiJituri/LEGALEASE-AI.git

# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

---

## 📸 Screenshots

**Live at: https://legalease-ai-two.vercel.app**

---

Built by **Dashami Jituri** | 3rd Year IT Student @ UMIT, SNDT Women's University
