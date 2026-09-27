# SK-04 // Sourabh Kumar — Autonomous ML & Applied LLM Systems Portfolio

Cybernetic telemetry terminal and developer portfolio showcasing applied LLM engineering, agentic AI systems, RAG architectures, and parameter-efficient fine-tuning (PEFT/LoRA).

## 🚀 Key Focus Areas

- **Agentic Workflows**: Multi-agent state machines, deterministic supervisor routing, and human-in-the-loop (HITL) DAGs built with LangGraph & FastAPI.
- **PEFT & Post-Training**: 4-bit NormalFloat (NF4) double quantization, rank-16 LoRA adapter training across open-weights models (LLaMA-3, Mistral-7B, Phi-3).
- **Retrieval-Augmented Generation (RAG)**: Dense semantic search over specialized clinical and knowledge bases using Qdrant and FAISS.
- **Distributed Inference**: Upstream contributions to WebGPU and WebRTC peer-to-peer execution engines (`Nehanth/swarmllm` PR #48).

## 🛠️ Stack & Architecture

- **Framework**: TanStack Start (Full-stack React 19 + SSR + Cloudflare Nitro Engine)
- **Styling**: Tailwind CSS + Custom HUD Cybernetic Design Tokens
- **Telemetry & Audio**: Procedural Web Audio API synthesizers (zero external audio assets)
- **State & UI**: Lucide Icons, cmdk, Sonner, Radix UI primitives

## 💻 Local Development

Requires Node.js (v20+ recommended) and npm:

````sh
# Clone repository
git clone https://github.com/Sourabh-Kumar04/Portfolio.git
cd Portfolio

# Install dependencies
npm install

# Start development server
npm run dev

## 🌐 Deployment to GitHub Pages

This portfolio includes static prerendering and an automated GitHub Actions deployment workflow:

1. **Push this repository to GitHub**:
   ```sh
   git push origin main
````

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub → **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. **Automated Deployment**:
   - The workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) will automatically run on every push to `main`.
   - It prerenders the static site into `.output/public` (generating `index.html`, `404.html`, `.nojekyll`, and bundle assets) and deploys directly to GitHub Pages.

```sh
# Manual Local Static Build
npm run build
# Outputs full static site ready for any static host in .output/public
```

## 📜 Operator Details

- **Maintainer**: Sourabh Kumar (`SK-04`)
- **Academic Track**: B.Sc. (Hons) Computer Science, University of Delhi (2023–2027)
- **Credential**: AWS AI/ML Scholar '24
- **Profiles**: [GitHub](https://github.com/Sourabh-Kumar04) · [LinkedIn](https://www.linkedin.com/in/sourabh-kumar04/)
