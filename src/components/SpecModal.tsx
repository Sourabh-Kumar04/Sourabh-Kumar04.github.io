import React from "react";
import {
  X,
  Printer,
  Download,
  ExternalLink,
  Mail,
  Github,
  Linkedin,
  Award,
  BookOpen,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";
import { audioTelemetry } from "../lib/audio-telemetry";

interface SpecModalProps {
  open: boolean;
  onClose: () => void;
}

export function SpecModal({ open, onClose }: SpecModalProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef(onClose);
  const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("button")?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocusedRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  const handlePrint = () => {
    audioTelemetry.playClick();
    window.print();
  };

  const handleCopySpec = async () => {
    audioTelemetry.playClick();
    const specText = `SOURABH KUMAR — AI/ML ENGINEER SPEC
Location: New Delhi, India
GitHub: https://github.com/Sourabh-Kumar04
LinkedIn: https://linkedin.com/in/sourabh-kumar04

EDUCATION:
- B.Sc. (Hons) Computer Science, University of Delhi (Aug 2023 – Aug 2027)
- AI Programming with Python Nanodegree, Udacity (Jun – Sep 2024)

CORE CAPABILITIES:
- Fine-Tuning & PEFT: LoRA, QLoRA, Axolotl, Unsloth, Hugging Face, vLLM
- Agentic Systems & RAG: LangGraph, LangChain, Multi-Agent State-Machine DAGs, FAISS, Qdrant
- Distributed & Cloud: SwarmLLM WebGPU, Docker, AWS SageMaker & EC2, FastAPI, PyTorch

PROJECTS:
1. RasoSynthTune: Multi-agent autonomous dataset synthesis & LoRA fine-tuning (Mistral, LLaMA-3, Phi-3).
2. SwarmLLM WebGPU (PR #48): Contributed host output controls and node-tag customization to peer-to-peer WebGPU inference.
3. Raso Medical Chatbot: Domain RAG deployed over medical encyclopedia.
4. Movie Recommendation System: Content-based recommender scoring TMDB 5000 films with cosine similarity.`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(specText);
      } else {
        const el = document.createElement("textarea");
        el.value = specText;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      toast.success("Curriculum Vitae Spec Copied", {
        description: "Full text representation copied to clipboard.",
      });
    } catch {
      toast.error("Failed to copy", {
        description: "Please copy the text manually from the modal.",
      });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="spec-modal-title"
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#090d14] border border-[#232f42] rounded-[3px] shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col font-mono text-xs overflow-hidden">
        {/* Header */}
        <div className="h-10 bg-[#0f1520] border-b border-[#232f42] px-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span id="spec-modal-title" className="font-bold text-white tracking-wider text-[11px]">
              SPEC-2035 // CURRICULUM VITAE TELEMETRY RECORD
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2 py-1 bg-white/5 hover:bg-white/10 text-on-surface hover:text-white rounded-[2px] border border-[#2b3749] flex items-center gap-1 text-[10px] transition-colors"
              title="Print or Save as PDF"
            >
              <Printer size={12} /> PRINT / PDF
            </button>
            <button
              onClick={handleCopySpec}
              className="px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-[2px] border border-primary/30 flex items-center gap-1 text-[10px] transition-colors"
              title="Copy plain-text spec"
            >
              <Download size={12} /> COPY SPEC
            </button>
            <button
              onClick={onClose}
              aria-label="Close curriculum specification"
              className="p-1 text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-[#d2d7e0] font-sans">
          {/* Identity & Header */}
          <div className="border-b border-[#1f2a3c] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight font-display-hero">
                SOURABH KUMAR
              </h1>
              <p className="text-primary font-mono text-xs tracking-wider mt-0.5">
                APPLIED LLM & DISTRIBUTED INFERENCE ENGINEER · SK-04
              </p>
              <p className="text-on-surface-variant text-xs mt-1">
                New Delhi, India · Open to High-Impact ML Internships & Distributed Systems
              </p>
            </div>
            <div className="font-mono text-xs space-y-1 text-right sm:text-right">
              <a
                href="https://github.com/Sourabh-Kumar04"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-cyan-spec hover:underline"
              >
                <Github size={12} /> github.com/Sourabh-Kumar04
              </a>
              <a
                href="https://linkedin.com/in/sourabh-kumar04"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-tertiary hover:underline"
              >
                <Linkedin size={12} /> linkedin.com/in/sourabh-kumar04
              </a>
            </div>
          </div>

          {/* Education */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold font-mono text-primary uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={14} /> 01 // ACADEMIC TRACK & FOUNDATIONS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#0d131d] border border-[#1f2b3e] rounded-[2px]">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-sm">B.Sc. (Hons) Computer Science</h3>
                  <span className="text-primary text-[11px]">2023 – 2027</span>
                </div>
                <p className="text-on-surface-variant text-[11px] mt-0.5">
                  University of Delhi, India
                </p>
                <p className="text-on-surface-variant text-[11px] mt-2">
                  Focus: Discrete Mathematics, Computer Systems Architecture, Data Structures &
                  Algorithms, Operating Systems, Database Management.
                </p>
              </div>

              <div className="p-3 bg-[#0d131d] border border-[#1f2b3e] rounded-[2px]">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-sm">AI Programming with Python</h3>
                  <span className="text-tertiary text-[11px]">Jun–Sep 2024</span>
                </div>
                <p className="text-on-surface-variant text-[11px] mt-0.5">
                  Udacity Nanodegree Program
                </p>
                <p className="text-on-surface-variant text-[11px] mt-2">
                  Completed end-to-end deep learning projects using PyTorch, convolutional networks,
                  transfer learning, and tensor manipulation.
                </p>
              </div>
            </div>
          </section>

          {/* Core Technical Stack */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold font-mono text-cyan-spec uppercase tracking-wider flex items-center gap-2">
              <Cpu size={14} /> 02 // TECHNICAL STACK & CAPABILITIES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 font-mono text-xs">
              <div className="p-2.5 bg-[#0d131d] border border-[#1e283a] rounded-[2px]">
                <p className="text-primary font-bold text-[11px] mb-1">PEFT & LLMs</p>
                <p className="text-on-surface-variant text-[11px] leading-relaxed">
                  LoRA, QLoRA, Axolotl, Unsloth, Hugging Face Transformers, vLLM, GQA, RoPE.
                </p>
              </div>
              <div className="p-2.5 bg-[#0d131d] border border-[#1e283a] rounded-[2px]">
                <p className="text-cyan-spec font-bold text-[11px] mb-1">AGENTS & RAG</p>
                <p className="text-on-surface-variant text-[11px] leading-relaxed">
                  LangGraph, LangChain, State Machine DAGs, FAISS, Qdrant, BM25 + Cross-Encoder.
                </p>
              </div>
              <div className="p-2.5 bg-[#0d131d] border border-[#1e283a] rounded-[2px]">
                <p className="text-tertiary font-bold text-[11px] mb-1">LANGUAGES & LIBS</p>
                <p className="text-on-surface-variant text-[11px] leading-relaxed">
                  Python, C++, PyTorch, NumPy, Pandas, Scikit-learn, SQL, Bash.
                </p>
              </div>
              <div className="p-2.5 bg-[#0d131d] border border-[#1e283a] rounded-[2px]">
                <p className="text-secondary font-bold text-[11px] mb-1">SYSTEMS & CLOUD</p>
                <p className="text-on-surface-variant text-[11px] leading-relaxed">
                  FastAPI, Docker, Redis, PostgreSQL, AWS SageMaker, Linux, Git.
                </p>
              </div>
            </div>
          </section>

          {/* Featured Projects */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold font-mono text-tertiary uppercase tracking-wider flex items-center gap-2">
              <Award size={14} /> 03 // PRODUCTION WORK & OPEN SOURCE
            </h2>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#0d131d] border-l-2 border-l-primary border border-[#1e283a] rounded-[2px]">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-white font-bold text-sm">
                    RasoSynthTune — Multi-Agent LoRA Synthesis Pipeline
                  </h3>
                  <a
                    href="https://github.com/Sourabh-Kumar04/RasoSynth_CUTC"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline text-[11px] flex items-center gap-1"
                  >
                    repo <ExternalLink size={11} />
                  </a>
                </div>
                <p className="text-on-surface-variant text-[11px] mt-1 font-sans">
                  Built an autonomous pipeline that gathers, filters, and generates domain-specific
                  training data. Implemented human-in-the-loop review checkpoints before triggering
                  parameter-efficient LoRA fine-tuning across LLaMA-3, Mistral-7B, and Phi-3.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    "FastAPI",
                    "LangGraph",
                    "LoRA/PEFT",
                    "Docker",
                    "Redis",
                    "PostgreSQL",
                    "Qdrant",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded-[2px] bg-[#141d2b] text-[10px] text-primary/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#0d131d] border-l-2 border-l-cyan-spec border border-[#1e283a] rounded-[2px]">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-white font-bold text-sm">
                    SwarmLLM — Browser WebGPU Distributed Inference (PR #48)
                  </h3>
                  <a
                    href="https://github.com/Nehanth/swarmllm/commit/c6f47f70968d44e57cc848e528d2e27a118dddda"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-spec hover:underline text-[11px] flex items-center gap-1"
                  >
                    commit <ExternalLink size={11} />
                  </a>
                </div>
                <p className="text-on-surface-variant text-[11px] mt-1 font-sans">
                  Contributed host output visibility controls and node-tag customization to a
                  from-scratch WebGPU and WebRTC peer-to-peer distributed inference engine.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["WebGPU", "Distributed Inference", "WebSockets", "TypeScript"].map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded-[2px] bg-[#141d2b] text-[10px] text-cyan-spec/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#0d131d] border-l-2 border-l-tertiary border border-[#1e283a] rounded-[2px]">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-white font-bold text-sm">Raso Medical Chatbot</h3>
                  <a
                    href="https://huggingface.co/spaces/Sourabh-Kumar04/Raso-Medical-Chat-bot"
                    target="_blank"
                    rel="noreferrer"
                    className="text-tertiary hover:underline text-[11px] flex items-center gap-1"
                  >
                    huggingface <ExternalLink size={11} />
                  </a>
                </div>
                <p className="text-on-surface-variant text-[11px] mt-1 font-sans">
                  A retrieval-augmented chatbot answering health questions from a full medical
                  encyclopedia rather than relying on memory. Built with LangChain, Llama 2, and
                  Flask.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["RAG", "Llama 2", "Flask", "Vector Search"].map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded-[2px] bg-[#141d2b] text-[10px] text-tertiary/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#0d131d] border-l-2 border-l-primary border border-[#1e283a] rounded-[2px]">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-white font-bold text-sm">Movie Recommendation System</h3>
                  <a
                    href="https://github.com/Sourabh-Kumar04/Raso-movie-recommendation"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline text-[11px] flex items-center gap-1"
                  >
                    repo <ExternalLink size={11} />
                  </a>
                </div>
                <p className="text-on-surface-variant text-[11px] mt-1 font-sans">
                  A content-based recommender scoring films by genre, rating, and cosine similarity
                  to compute optimal viewing suggestions.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["Python", "pandas", "scikit-learn", "Cosine Similarity"].map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded-[2px] bg-[#141d2b] text-[10px] text-primary/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Certifications */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold font-mono text-primary uppercase tracking-wider">
              04 // VERIFIED CERTIFICATION CHECKPOINTS
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <div className="p-2 bg-[#0c121a] border border-[#1b2535] rounded-[2px]">
                <span className="text-white block font-semibold">AWS ML Fundamentals</span>
                <span className="text-primary text-[10px]">Scholarship Checkpoint · Jul 2025</span>
              </div>
              <div className="p-2 bg-[#0c121a] border border-[#1b2535] rounded-[2px]">
                <span className="text-white block font-semibold">AI Agents Fundamentals</span>
                <span className="text-primary text-[10px]">Hugging Face Agents · Feb 2025</span>
              </div>
              <div className="p-2 bg-[#0c121a] border border-[#1b2535] rounded-[2px]">
                <span className="text-white block font-semibold">Gemini API by Google</span>
                <span className="text-primary text-[10px]">Google Cloud · Nov 2024</span>
              </div>
              <div className="p-2 bg-[#0c121a] border border-[#1b2535] rounded-[2px]">
                <span className="text-white block font-semibold">Foundations of GenAI</span>
                <span className="text-primary text-[10px]">AWS / Udacity · Nov 2024</span>
              </div>
              <div className="p-2 bg-[#0c121a] border border-[#1b2535] rounded-[2px]">
                <span className="text-white block font-semibold">AI Programming with Python</span>
                <span className="text-primary text-[10px]">Udacity Nanodegree · Sep 2024</span>
              </div>
              <div className="p-2 bg-[#0c121a] border border-[#1b2535] rounded-[2px]">
                <span className="text-white block font-semibold">AWS AIML Scholar &apos;24</span>
                <span className="text-tertiary text-[10px]">Udacity & AWS · 2024</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
