# Sourabh Kumar — Applied LLM Engineer

> **Applied LLM Engineer // Agentic Systems & PEFT Fine-Tuning**  
> _New Delhi, India (28.61°N, 77.20°E) • Status: Open to AI/ML Internships_  
> [GitHub](https://github.com/Sourabh-Kumar04) • [LinkedIn](https://www.linkedin.com/in/sourabh-kumar04/) • [Email](mailto:sourabhkumar01010101@gmail.com)

---

## [00] MODEL OVERVIEW

```text
OPERATOR_ID        : Sourabh Kumar
PRIMARY_FOCUS      : Applied LLM Engineering, Multi-Agent Systems & PEFT
CORE_STACK         : PyTorch • LangGraph • FastAPI • Qdrant • LoRA/PEFT • Docker
STATUS             : Open to AI/ML Internships
ACADEMIC_TRACK     : B.Sc. (Hons) Computer Science, University of Delhi (2023–2027)
HONORS             : AWS AI/ML Scholar '24 (Udacity & Amazon Web Services)
OPEN_SOURCE        : Merged Upstream PR #48 to SwarmLLM (Distributed WebGPU Inference)
```

I design and ship practical AI systems across retrieval, agent orchestration, and parameter-efficient fine-tuning. As a Computer Science student at the University of Delhi, I build systems where careful mathematical experiments become reliable, reproducible software.

### At a Glance

| Metric                    | Value | Detail                                                                   |
| :------------------------ | :---- | :----------------------------------------------------------------------- |
| **Certifications**        | `5`   | Accredited specializations (AWS, Hugging Face, Google Gemini, Udacity)   |
| **Upstream Contribution** | `1`   | Merged PR #48 in `Nehanth/swarmllm` (WebGPU / WebRTC distributed engine) |
| **Featured Systems**      | `3`   | Production & prototype systems across PEFT, Agentic RAG, and ML          |

---

## [01] OPERATOR PROFILE

### Narrative & Trajectory

The trajectory began with classical statistical classifiers implemented from scratch, quickly progressing into first-principles mathematics and systems engineering:

1. **First-Principles Foundations**: Built raw tensor routines, custom NumPy forward/backward computations, and PyTorch autograd graph pipelines.
2. **Autonomous Multi-Agent Orchestration**: Engineered **RasoSynthTune**, an end-to-end multi-agent pipeline discovering, filtering, and gating domain datasets with automated quality scoring (>85% score threshold) and human-in-the-loop review.
3. **Parameter-Efficient Post-Training**: Executed 4-bit QLoRA fine-tuning across all 7 linear projections (`q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`) on LLaMA-3-8B and Mistral-7B, training 41.9M parameters (0.519% of base model weights) on single consumer GPUs.
4. **Upstream Systems Engineering**: Contributed to distributed browser inference engines by authoring PR #48 in `Nehanth/swarmllm` to introduce host visibility controls and dynamic node-tag customization over WebGPU/WebRTC channels.

### Profile Specification Schema

- **Operator ID**: Sourabh Kumar
- **Academic Track**: B.Sc. (Hons) Computer Science @ University of Delhi
- **Scholar Award**: AWS AI/ML Scholar '24
- **Primary Focus**: Agentic Workflows & PEFT Fine-Tuning
- **Orchestration**: LangGraph + FastAPI + Redis
- **Adaptation Method**: QLoRA / PEFT (NF4 Double-Quantization)
- **Vector Storage**: Qdrant
- **Open-Source Record**: SwarmLLM PR #48 `[MERGED]`

---

## [02] TRAINING RECORD & EDUCATION

### Degree Track

- **B.Sc. (Hons) Computer Science**  
  _University of Delhi_ — `2023–2027`
- **AWS AI/ML Scholar '24**  
  _Udacity & Amazon Web Services_ — `2024`
- **AI Programming with Python**  
  _Udacity Nanodegree Program_ — `2024`

### Verified Checkpoints & Certifications

1. **AWS ML Fundamentals** — _Udacity_ (Jul 2025)
2. **AI Agents Fundamentals** — _Hugging Face_ (Feb 2025)
3. **Gemini API by Google** — _Udacity_ (Nov 2024)
4. **Foundations of Generative AI** — _Udacity_ (Nov 2024)
5. **AI Programming with Python** — _Udacity_ (Sep 2024)

---

## [03] EVALUATION SET (SELECTED WORK)

### 1. RasoSynthTune

_Autonomous Synthetic Data Generation & PEFT Fine-Tuning Engine_

- **Category**: `PEFT / Post-Training` | **Status**: `PROTOTYPE`
- **Stack**: `FastAPI` • `LangGraph` • `LoRA/PEFT` • `Docker` • `Redis` • `PostgreSQL` • `Qdrant`
- **Architecture**:
  ```text
  Dataset Discovery → Synthetic Synthesis → Automated Quality Gate (>85%) → Human-in-the-Loop Gate → 4-Bit QLoRA Fine-Tuning
  ```
- **Technical Details**:
  - Implements 4-bit NormalFloat (NF4) double quantization with bfloat16 computation.
  - Injects Rank-16 LoRA adapters targeting all 7 linear projections across LLaMA-3-8B and Mistral-7B.
  - Achieves parameter efficiency with **41.9M trainable parameters (0.519%)** out of 8.07B base parameters.
- **Repository**: [github.com/Sourabh-Kumar04/RasoSynth_CUTC](https://github.com/Sourabh-Kumar04/RasoSynth_CUTC)

### 2. Raso Medical Chatbot

_Clinical Decision Support & RAG Knowledge Retrieval System_

- **Category**: `Agents & RAG` | **Status**: `REDEPLOYING`
- **Stack**: `RAG` • `Llama 2` • `Flask` • `Vector Store`
- **Architecture**:
  ```text
  User Inquiry → Semantic Dense Retrieval → Medical Knowledge Base Context Assembly → Grounded LLaMA-2 Generation
  ```
- **Technical Details**:
  - Eliminates hallucinations by strictly grounding clinical explanations against verified medical encyclopedias.
  - Sub-second vector retrieval with dense embedding indexes.
- **Live Space**: [huggingface.co/spaces/Sourabh-Kumar04/Raso-Medical-Chat-bot](https://huggingface.co/spaces/Sourabh-Kumar04/Raso-Medical-Chat-bot)

### 3. Movie Recommendation System

_Multi-Modal Content Filtering Engine & Inference API_

- **Category**: `Classical ML` | **Status**: `STABLE`
- **Stack**: `Python` • `pandas` • `scikit-learn` • `NumPy`
- **Architecture**:
  ```text
  Movie Metadata → Feature Engineering & Bag-of-Words → Cosine Similarity Metric → Ranked Recommendations
  ```
- **Technical Details**:
  - Content-based filtering engine trained and evaluated on the TMDB 5000 dataset.
  - Vectorizes metadata tags, cast hierarchies, and director attributes into high-dimensional similarity space.
- **Repository**: [github.com/Sourabh-Kumar04/Raso-movie-recommendation](https://github.com/Sourabh-Kumar04/Raso-movie-recommendation)

---

## [04] RESEARCH NOTES & NOTEBOOKS

Public repositories capturing research experiments, mathematical implementations, and deep-dive notebooks:

| Repository                                                                            | Focus Area            | Key Concepts                                                                            |
| :------------------------------------------------------------------------------------ | :-------------------- | :-------------------------------------------------------------------------------------- |
| **[LangChain](https://github.com/Sourabh-Kumar04/LangChain)**                         | Agents & Retrieval    | Autonomous Agents, Dense Retrievers, Structured Output, Tool Calling                    |
| **[LangGraph](https://github.com/Sourabh-Kumar04/LangGraph)**                         | Multi-Agent Systems   | Cyclic `StateGraph`, Multi-Agent Coordination, HITL Checkpoints, State Persistence      |
| **[PyTorch](https://github.com/Sourabh-Kumar04/Pytorch)**                             | Deep Learning Core    | Autograd Graphs, Custom `nn.Module`, Manual Training Loops, Backpropagation Mechanics   |
| **[LangSmith Masterclass](https://github.com/Sourabh-Kumar04/LangSmith_Masterclass)** | Observability & Evals | Production Run Tracing, Latency Profiling, Automated Dataset Synthesis, Evaluation Runs |

---

## [05] CAPABILITY SCHEMA (SKILLS MATRIX)

```yaml
languages:
  - Python
  - C++

ml_core:
  - PyTorch
  - TensorFlow
  - LangChain
  - LangGraph
  - RAG Architectures
  - LoRA / QLoRA / PEFT
  - Hugging Face Transformers
  - BitsAndBytes

systems_and_infra:
  - Docker
  - FastAPI
  - Flask
  - Git / GitHub Actions CI/CD

data_stores_and_vectors:
  - Qdrant
  - Redis
  - PostgreSQL
  - FAISS
```

---

## [06] EXTERNAL VALIDATION (OPEN-SOURCE)

### Merged Upstream PR: `Nehanth/swarmllm`

- **PR Reference**: [PR #48 in Nehanth/swarmllm](https://github.com/Nehanth/swarmllm/commit/c6f47f70968d44e57cc848e528d2e27a118dddda)
- **Project Scope**: A distributed, decentralized browser inference engine utilizing WebGPU compute shaders and WebRTC peer-to-peer data channels to split a 27B-parameter LLM across consumer browser tabs.
- **Contribution**: Engineered granular host output visibility controls, real-time node-tag telemetry customization, and peer state reporting across network topologies.

---

## [07] LIMITATIONS & GROWTH AREAS (ZERO-EGO CALIBRATION)

- **Distributed Systems at Scale**: Continuously deepening knowledge in multi-node distributed training (FSDP, DeepSpeed ZeRO-3, tensor-parallel inference via vLLM/TGI).
- **Theoretical Foundations**: Actively expanding formal study in advanced algorithm design, asymptotic analysis, and computational complexity.
- **Production Longevity**: Dedicated to moving beyond prototype proofs-of-concept to building hardened, self-healing production software with comprehensive telemetry, regression testing, and observability.

---

## [08] MAINTAINER CONTACT

- **Operator**: Sourabh Kumar
- **Email**: [sourabhkumar01010101@gmail.com](mailto:sourabhkumar01010101@gmail.com)
- **GitHub**: [github.com/Sourabh-Kumar04](https://github.com/Sourabh-Kumar04)
- **LinkedIn**: [linkedin.com/in/sourabh-kumar04](https://www.linkedin.com/in/sourabh-kumar04/)
- **Location**: New Delhi, India
- **Availability**: Open for AI/ML Engineering internships, research fellowships, and collaborative projects.
