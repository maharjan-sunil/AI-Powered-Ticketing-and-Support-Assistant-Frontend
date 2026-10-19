# 🎫 AI-Powered Ticketing & Support System

A full-stack ticket management application designed to streamline support operations through a modern React dashboard, a .NET backend, and AI-assisted ticket processing.

The platform is being developed to help support teams manage ticket lifecycles, prioritize incoming requests, and retrieve relevant answers from knowledge-base documents.

## 🏗️ Architecture

The application consists of three components:

| Component | Technology | Responsibility |
|---|---|---|
| Frontend | React, TypeScript, Vite | Ticket dashboard, forms, search, filtering, and API integration |
| Backend | C#, ASP.NET Core, Entity Framework Core | REST APIs, ticket management, data access, and business logic |
| AI Service | LLMs, embeddings, vector search, RAG | Ticket classification, priority recommendations, summaries, reply drafts, and knowledge-base retrieval |

**Repository links**

- Frontend: This repository
- Backend: https://github.com/maharjan-sunil/AI-Powered-Ticketing-and-Support-Assistant-Backend
- AI service: https://github.com/maharjan-sunil/AI-Powered-Ticketing-System-AI-Extension-

## ✨ Key Features

### Ticket Management
- Create, update, assign, and track support tickets.
- View ticket status, priority, and assignment information.
- Search and filter tickets based on relevant attributes.

### AI-Assisted Support
- Classify incoming tickets using an LLM.
- Recommend ticket priorities and summarize conversations.
- Generate draft replies for support agents.
- Retrieve relevant knowledge-base information using retrieval-augmented generation (RAG).

*AI features should be described as implemented only when they are working in the current application; otherwise, label them as in development.*

## 🛠️ Technology Stack

**Frontend:** React, TypeScript, Vite, Axios, Tailwind CSS or CSS Modules

**Backend:** C#, ASP.NET Core, Entity Framework Core, REST APIs, SQL

**AI and Retrieval:** Large language models (LLMs), embeddings, vector search, retrieval-augmented generation (RAG)

**Infrastructure and DevOps:** Docker, Azure Service Bus, GitHub Actions

## 📁 Frontend Project Structure

```text
src/
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── types/        # TypeScript interfaces
├── assets/       # Static assets and styles
├── App.tsx       # Root application component
└── main.tsx      # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or later
- npm

### Installation

Clone this frontend repository:

```bash
git clone <YOUR_FRONTEND_REPOSITORY_URL>
cd <YOUR_FRONTEND_FOLDER>
npm install
```

### Run the application

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually `http://localhost:5173`.

**Note:** Configure the backend API URL and ensure the backend service is running if the dashboard requires API connectivity.

## 🧪 Testing and Deployment

Document the tests, Docker setup, CI/CD pipeline, and deployment instructions that are currently available in the project.

## 🗺️ Roadmap

- Expand AI-assisted ticket triage.
- Improve knowledge-base retrieval and response relevance.
- Integrate frontend, backend, and AI services into a complete workflow.
- Enhance automated testing and deployment.
