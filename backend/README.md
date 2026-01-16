# 📚 Smart Book Management System — Agentic RAG (Production Grade)

A **production-ready intelligent book management platform** built with **FastAPI**, **Async SQLAlchemy**, and a **Retrieval-Augmented Generation (RAG)** pipeline.  
It supports semantic search, AI-generated summaries, role-based access control, document ingestion, and scalable architecture patterns.

---

## 🚀 Key Capabilities

### 📘 Book Management
- Full **CRUD** for books
- Genre & author management
- User reviews with ratings
- AI-generated summaries (LLaMA-3 / OpenRouter)
- Genre-based recommendations

### 🔍 Retrieval-Augmented Generation (RAG)
- Semantic search using natural language queries
- Sentence-Transformer embeddings (`all-MiniLM-L6-v2`)
- Automatic indexing on book create/update
- Cosine similarity ranking
- Cleanly separated RAG pipeline (`app/rag/`)

### 👤 Authentication & Authorization
- JWT-based authentication
- Secure password hashing (bcrypt)
- Role-based access control (RBAC)
- Admin-only user & role management
- Token revocation support

### 📄 Document Management
- Document upload & metadata tracking
- Background ingestion jobs
- Optional AWS S3 integration (production)
- Local file handling for development

### 🧱 Production Architecture
- Async SQLAlchemy 2.x
- Layered architecture (core / db / api / rag)
- Middleware for request tracing, metrics, error handling
- Clean dependency injection
- Vector-DB ready RAG design

---

## 🧩 Project Structure

app/
├── main.py
├── api/
│ └── v1/
│ ├── routes/
│ └── schemas/
├── core/
│ ├── auth.py
│ ├── config.py
│ ├── security.py
│ └── middleware/
├── db/
│ ├── base.py
│ ├── session.py
│ ├── lifecycle.py
│ ├── health.py
│ └── models/
├── rag/
│ ├── embeddings.py
│ ├── indexer.py
│ └── retriever.py
├── crud.py
└── tests/

markdown
Copy code

---

## 🔗 API Overview

### 🔐 Authentication
| Method | Endpoint |
|------|---------|
| POST | `/auth/signup` |
| POST | `/auth/login` |
| POST | `/auth/logout` |
| POST | `/auth/create-admin` |

### 📚 Books
| Method | Endpoint |
|------|---------|
| POST | `/books` |
| GET | `/books` |
| GET | `/books/{id}` |
| PUT | `/books/{id}` |
| DELETE | `/books/{id}` |
| POST | `/books/{id}/generate-summary` |

### ⭐ Reviews
| Method | Endpoint |
|------|---------|
| POST | `/books/{id}/reviews` |
| GET | `/books/{id}/reviews` |

### 🔍 Search (RAG)
| Method | Endpoint |
|------|---------|
| GET / POST | `/search` |
| POST | `/reindex-all` |
| GET | `/debug/embeddings` |

### 👥 Admin (RBAC)
| Method | Endpoint |
|------|---------|
| GET | `/admin/users` |
| POST | `/admin/users` |
| PUT | `/admin/users/{id}` |
| DELETE | `/admin/users/{id}` |
| GET | `/admin/roles` |

### 📄 Documents
| Method | Endpoint |
|------|---------|
| POST | `/documents/upload` |
| GET | `/documents` |
| GET | `/documents/{id}/download` |
| DELETE | `/documents/{id}` |

---

## 🧠 RAG Pipeline Design

- **Embedding Model**: Sentence-Transformers (`all-MiniLM-L6-v2`)
- **Indexing**: Automatic on book create/update
- **Vector Store**: In-memory (pluggable)
- **Similarity**: Cosine similarity

> ⚠️ In-memory vector store is for development/demo.  
> Production should use Qdrant, Milvus, Pinecone, or Weaviate.

---

## ⚙️ Setup & Installation

### Prerequisites
- Python **3.10+**
- PostgreSQL
- OpenRouter API key
- (Optional) AWS S3 credentials

---

### 1️⃣ Clone Repository
```bash
git clone <repository-url>
cd backend
2️⃣ Create Virtual Environment
bash
Copy code
python -m venv .venv
source .venv/bin/activate
3️⃣ Install Dependencies
bash
Copy code
pip install -r requirements.txt
4️⃣ Environment Configuration
Create .env:

env
Copy code
# App
APP_NAME=Smart Book Agent
APP_ENV=development
DEBUG=true

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/books

# Security
SECRET_KEY=super-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# AI
OPENROUTER_API_KEY=your_openrouter_key

# AWS (optional)
USE_S3=false
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=
AWS_REGION=us-east-1
5️⃣ Run Application
bash
Copy code
uvicorn app.main:app --reload
🧪 Testing
bash
Copy code
pytest tests/ -v
Fully async test suite

No production dependencies required

📊 Observability
Request-ID tracking

Structured logging

Centralized error handling

Metrics middleware (Prometheus-ready)

🔐 Security Highlights
bcrypt password hashing

JWT authentication

Role-based access control

Trusted host middleware (prod)

Token revocation support

🚀 Deployment Notes
Development
Local file storage

In-memory embeddings

Single worker

Production
PostgreSQL

AWS S3 for documents

Vector DB for embeddings

Multiple workers

Reverse proxy (NGINX)

🛣️ Roadmap
Vector DB integration

Reranking (cross-encoder)

Background ingestion workers

LangGraph agent workflows

OpenTelemetry tracing

🤝 Contributing
Fork the repository

Create a feature branch

Add tests

Run test suite

Submit PR

📄 License
MIT License