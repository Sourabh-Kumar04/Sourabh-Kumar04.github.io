import React, { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { CommandPalette } from "./CommandPalette";
import { InteractiveTerminal } from "./InteractiveTerminal";
import { SpecModal } from "./SpecModal";
import { TelemetryClock } from "./TelemetryClock";
import { CyberBackgroundCanvas } from "./CyberBackgroundCanvas";
import { Toaster } from "./ui/sonner";
import { audioTelemetry } from "../lib/audio-telemetry";
import {
  Terminal as TerminalIcon,
  Volume2,
  VolumeX,
  FileText,
  Code2,
  Cpu,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  HardDrive,
  CheckCircle2,
  BookOpen,
  X,
  ArrowRight,
  Menu,
  Clock,
  Brain,
  GraduationCap,
  FolderGit2,
  Award,
  GitPullRequest,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

interface NavLink {
  index: string;
  id: string;
  label: string;
  meta: string;
}

const NAV_LINKS: NavLink[] = [
  { index: "00", id: "overview", label: "OVERVIEW", meta: "HERO" },
  { index: "01", id: "model-details", label: "MODEL_DETAILS", meta: "PROFILE" },
  { index: "02", id: "training-data", label: "TRAINING_DATA", meta: "5" },
  { index: "03", id: "evaluation", label: "EVALUATION", meta: "3" },
  { index: "04", id: "learning-repos", label: "LEARNING_REPOS", meta: "7" },
  { index: "05", id: "capabilities", label: "CAPABILITIES", meta: "STACK" },
  { index: "06", id: "external-validation", label: "EXTERNAL_VALIDATION", meta: "MERGED" },
  { index: "07", id: "limitations", label: "LIMITATIONS", meta: "ZERO-EGO" },
  { index: "08", id: "maintainer", label: "CONTACT", meta: "PING" },
];

interface Project {
  title: string;
  category: "agents" | "peft" | "ml";
  tag: string;
  tagColor: string;
  stack: string;
  description: string;
  links: { label: string; href: string }[];
  borderAccent: string;
}

const PROJECTS: Project[] = [
  {
    title: "RasoSynthTune",
    category: "peft",
    tag: "PROTOTYPE",
    tagColor: "bg-tertiary/10 text-tertiary border-tertiary/30",
    stack: "FastAPI · LangGraph · LoRA/PEFT · Docker · Redis · PostgreSQL · Qdrant",
    description:
      "A multi-agent pipeline that discovers, filters and constructs datasets for fine-tuning open-source language models, gated by a human review step, then fine-tunes Llama-3, Mistral and Phi-3 via LoRA. Started at a hackathon, still evolving.",
    links: [
      { label: "view repository ↗", href: "https://github.com/Sourabh-Kumar04/RasoSynth_CUTC" },
    ],
    borderAccent: "border-l-primary",
  },
  {
    title: "Raso Medical Chatbot",
    category: "agents",
    tag: "REDEPLOYING",
    tagColor: "bg-primary/10 text-primary border-primary/30",
    stack: "RAG · Llama 2 · Flask",
    description:
      "A retrieval-augmented chatbot answering health questions from a full medical encyclopedia rather than relying on memory. Currently being redeployed after a configuration change.",
    links: [
      {
        label: "view project ↗",
        href: "https://huggingface.co/spaces/Sourabh-Kumar04/Raso-Medical-Chat-bot",
      },
    ],
    borderAccent: "border-l-cyan-spec",
  },
  {
    title: "Movie Recommendation System",
    category: "ml",
    tag: "STABLE",
    tagColor: "bg-tertiary/10 text-tertiary border-tertiary/30",
    stack: "Python · pandas · scikit-learn",
    description:
      "A content-based recommender scoring films by genre, rating and similarity to suggest what to watch next.",
    links: [
      {
        label: "view repository ↗",
        href: "https://github.com/Sourabh-Kumar04/Raso-movie-recommendation",
      },
    ],
    borderAccent: "border-l-tertiary",
  },
];

interface LearningRepo {
  title: string;
  topic: string;
  tagColor: string;
  description: string;
  href: string;
  topics: string[];
}

const LEARNING_REPOS: LearningRepo[] = [
  {
    title: "LangChain",
    topic: "AGENTS & RETRIEVAL",
    tagColor: "bg-primary/10 text-primary border-primary/30",
    description: "Hands-on notebooks on agents, retrievers, structured output and tool calling.",
    href: "https://github.com/Sourabh-Kumar04/LangChain",
    topics: ["Agents", "Retrievers", "Structured Output", "Tool Calling"],
  },
  {
    title: "LangGraph",
    topic: "MULTI-AGENT SYSTEMS",
    tagColor: "bg-cyan-spec/10 text-cyan-spec border-cyan-spec/30",
    description:
      "Cyclic state graphs, agent coordination, human-in-the-loop validation, and memory persistence.",
    href: "https://github.com/Sourabh-Kumar04/LangGraph",
    topics: ["StateGraph", "Multi-Agent", "HITL", "Persistence"],
  },
  {
    title: "NumPy-Basic",
    topic: "FOUNDATIONAL NUMERICS",
    tagColor: "bg-tertiary/10 text-tertiary border-tertiary/30",
    description:
      "A phased, from-scratch series on NumPy fundamentals, vectorization, and matrix manipulation.",
    href: "https://github.com/Sourabh-Kumar04/Numpy-Basic",
    topics: ["Vectorization", "Broadcasting", "Linear Algebra", "Tensor Operations"],
  },
  {
    title: "FastAPI",
    topic: "BACKEND & ML SERVING",
    tagColor: "bg-primary/10 text-primary border-primary/30",
    description:
      "Asynchronous APIs, dependency injection, streaming endpoints, and production ML model serving.",
    href: "https://github.com/Sourabh-Kumar04/FastAPI",
    topics: ["Async", "ML Serving", "Dependency Injection", "Streaming"],
  },
  {
    title: "PyTorch",
    topic: "DEEP LEARNING CORE",
    tagColor: "bg-cyan-spec/10 text-cyan-spec border-cyan-spec/30",
    description:
      "Autograd computational graphs, custom nn.Modules, training loops, and tensor mechanics.",
    href: "https://github.com/Sourabh-Kumar04/Pytorch",
    topics: ["Autograd", "nn.Module", "DataLoaders", "Backpropagation"],
  },
  {
    title: "LangSmith_Masterclass",
    topic: "OBSERVABILITY & EVALS",
    tagColor: "bg-tertiary/10 text-tertiary border-tertiary/30",
    description:
      "Production LLM tracing, run debugging, latency profiling, dataset creation, and evaluation runs.",
    href: "https://github.com/Sourabh-Kumar04/LangSmith_Masterclass",
    topics: ["Tracing", "Debugging", "Evals", "Prompt Monitoring"],
  },
  {
    title: "Pydantic-Basic",
    topic: "SCHEMA & TYPE ENFORCEMENT",
    tagColor: "bg-primary/10 text-primary border-primary/30",
    description:
      "Data validation, schema enforcement, custom field validators, and type safety for LLM pipelines.",
    href: "https://github.com/Sourabh-Kumar04/Pydantic-Basic",
    topics: ["BaseModel", "Validation", "Field Validators", "Type Safety"],
  },
];

// Production code snippets for the Evaluation section
const CODE_SNIPPETS = [
  {
    id: "peft-lora",
    title: "lora_peft_config.py",
    language: "python",
    desc: "Parameter-Efficient Fine-Tuning configuration for Llama-3-8B adapter injection.",
    code: `from peft import LoraConfig, get_peft_model, TaskType
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype="bfloat16",
    bnb_4bit_use_double_quant=True,
)

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type=TaskType.CAUSAL_LM,
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Meta-Llama-3-8B-Instruct",
    quantization_config=bnb_config,
    device_map="auto"
)
model = prepare_model_for_kbit_training(model)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# trainable params: 41,943,040 (all 7 linear projections) || all params: 8,072,204,288 || trainable%: 0.519%
# (or 13,631,488 / 0.169% when targeting q, k, v, o attention projections only)`,
  },
  {
    id: "langgraph-agent",
    title: "agent_supervisor_dag.py",
    language: "python",
    desc: "Multi-agent deterministic supervisor routing DAG in LangGraph with human review checkpoint.",
    code: `from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, END

class AgentState(TypedDict):
    messages: Sequence[BaseMessage]
    next_step: str
    dataset_quality_score: float
    human_approved: bool

def supervisor_router(state: AgentState) -> str:
    """Deterministic routing function based on state metadata."""
    if state["dataset_quality_score"] < 0.85:
        return "synthetic_synthesizer"
    if not state.get("human_approved", False):
        return "human_review_gate"
    return "peft_fine_tune_worker"

workflow = StateGraph(AgentState)
workflow.add_node("dataset_miner", dataset_miner_node)
workflow.add_node("synthetic_synthesizer", synthesizer_node)
workflow.add_node("human_review_gate", human_review_node)
workflow.add_node("peft_fine_tune_worker", trainer_node)

workflow.add_conditional_edges("supervisor", supervisor_router)
app = workflow.compile(checkpointer=MemorySaver())`,
  },
  {
    id: "swarm-webgpu",
    title: "webgpu_tensor_worker.ts",
    language: "typescript",
    desc: "Decentralized inference layer partition for browser WebGPU workers (SwarmLLM PR #48).",
    code: `// SwarmLLM WebGPU Sharded Worker Subroutine
export class DistributedTensorWorker {
  private device!: GPUDevice;
  private layerStartIdx: number;
  private layerEndIdx: number;

  constructor(start: number, end: number) {
    this.layerStartIdx = start;
    this.layerEndIdx = end;
  }

  async initialize() {
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
    this.device = await adapter!.requestDevice();
  }

  async computeLayerPass(hiddenStates: Float32Array): Promise<Float32Array> {
    // Dispatch forward pass for assigned layer slice [layerStartIdx .. layerEndIdx]
    const bufferIn = this.device.createBuffer({
      size: hiddenStates.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    // Stream intermediate activations via peer-to-peer WebRTC data channels
    return await this.executePipeline(bufferIn);
  }
}`,
  },
];

// Initial default 48-cell attention matrix weights
const INITIAL_WEIGHTS = [
  0.95, 0.3, 0.6, 0.15, 0.85, 0.2, 0.45, 0.9, 0.35, 0.9, 0.1, 0.75, 0.25, 0.2, 0.95, 0.45, 0.15,
  0.4, 0.95, 0.55, 0.1, 0.8, 0.3, 0.2, 0.7, 0.15, 0.45, 0.9, 0.3, 0.65, 0.1, 0.9, 0.25, 0.75, 0.3,
  0.15, 0.95, 0.5, 0.85, 0.3, 0.95, 0.35, 0.15, 0.65, 0.2, 0.9, 0.4, 0.98,
];

function TiltProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotX = (y - 0.5) * -7;
    const rotY = (x - 0.5) * 7;
    setTilt({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setTilt(null);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt
          ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateZ(8px)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
        transition: tilt ? "transform 0.08s ease-out" : "transform 0.4s ease-out",
        transformStyle: "preserve-3d",
      }}
      className={`hud-panel p-6 rounded-[3px] flex flex-col gap-4 border-l-4 ${project.borderAccent} will-change-transform`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-headline-lg text-white font-bold text-xl">{project.title}</h3>
        <span
          className={`px-2.5 py-1 rounded-[2px] font-mono text-[11px] border ${project.tagColor}`}
        >
          {project.tag}
        </span>
      </div>
      <div className="font-code-mono-sm text-[12px] text-cyan-spec">{project.stack}</div>
      <p className="font-body-md text-on-surface-variant text-[14px]">{project.description}</p>
      <div className="flex flex-wrap gap-4 font-mono text-xs pt-1">
        {project.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1"
          >
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function Portfolio() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [specModalOpen, setSpecModalOpen] = useState(false);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [projectFilter, setProjectFilter] = useState<"all" | "agents" | "peft" | "ml">("all");
  const [evaluationTab, setEvaluationTab] = useState<"projects" | "code">("projects");
  const [activeSnippetId, setActiveSnippetId] = useState("peft-lora");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Interactive attention matrix state
  const [attentionWeights, setAttentionWeights] = useState<number[]>(INITIAL_WEIGHTS);
  const [hoveredCell, setHoveredCell] = useState<{ index: number; weight: number } | null>(null);
  const [isRecomputing, setIsRecomputing] = useState(false);

  // Click ripple pings
  const [clickPings, setClickPings] = useState<{ id: number; x: number; y: number }[]>([]);

  // Initialize audio state
  useEffect(() => {
    setAudioEnabled(audioTelemetry.isEnabled());
  }, []);

  const toggleAudio = () => {
    const nextState = audioTelemetry.toggle();
    setAudioEnabled(nextState);
    if (nextState) {
      toast.success("Cyberpunk Audio Telemetry Active", {
        description: "Web Audio procedural synthesizers enabled.",
      });
    } else {
      toast.info("Audio Telemetry Muted");
    }
  };

  // Keyboard shortcut listeners (Cmd+K for Palette, ~ or ` for Terminal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "`" || e.key === "~") && !e.metaKey && !e.ctrlKey) {
        // Do not intercept if actively typing in an input or textarea
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag === "input" || tag === "textarea") return;
        e.preventDefault();
        audioTelemetry.playBeep();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Global cursor radar ping effect on click
  const handleGlobalClick = (e: React.MouseEvent) => {
    // Only play root click if the clicked element does not have its own interactive handler
    const isInteractive = (e.target as HTMLElement)?.closest("button, a, input, textarea, select");
    if (!isInteractive) {
      audioTelemetry.playClick();
    }
    const newPing = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
    setClickPings((prev) => [...prev.slice(-3), newPing]);
    setTimeout(() => {
      setClickPings((prev) => prev.filter((p) => p.id !== newPing.id));
    }, 950);
  };

  // Track active section on scroll
  useEffect(() => {
    const ids = NAV_LINKS.map((link) => link.id);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-25% 0px -40% 0px", threshold: [0.05, 0.2, 0.5] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Re-generate attention weights (simulates new forward attention pass)
  const recomputeAttention = () => {
    audioTelemetry.playPing();
    setIsRecomputing(true);
    const newWeights = Array.from({ length: 48 }, () => {
      const val = Math.random();
      return Number(val.toFixed(2));
    });
    newWeights[47] = 0.99;
    setAttentionWeights(newWeights);
    toast.success("Attention weights recomputed", {
      description: "Forward-pass complete across 8 attention heads.",
    });
    setTimeout(() => setIsRecomputing(false), 450);
  };

  // Copy active code snippet
  const handleCopySnippet = async (code: string) => {
    audioTelemetry.playClick();
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(code);
      setCopiedSnippet(true);
      toast.success("Code Telemetry Copied", { description: "Snippet saved to clipboard." });
      window.setTimeout(() => setCopiedSnippet(false), 2000);
    } catch {
      toast.error("Copy failed", { description: "Clipboard access is unavailable." });
    }
  };

  // Filtered projects list
  const filteredProjects = useMemo(() => {
    if (projectFilter === "all") return PROJECTS;
    return PROJECTS.filter((p) => p.category === projectFilter);
  }, [projectFilter]);

  const activeSnippet = useMemo(
    () => CODE_SNIPPETS.find((s) => s.id === activeSnippetId) ?? CODE_SNIPPETS[0]!,
    [activeSnippetId],
  );

  return (
    <div
      onClick={handleGlobalClick}
      className="relative min-h-screen bg-[#07090c] text-on-surface antialiased overflow-x-hidden selection:bg-primary selection:text-black font-display-hero"
    >
      <Toaster position="bottom-right" theme="dark" richColors />

      {/* INTERACTIVE RADAR PING RIPPLE EFFECT */}
      {clickPings.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-50 rounded-full border border-primary/70 w-8 h-8 -ml-4 -mt-4 ping-pulse"
          style={{ left: `${p.x}px`, top: `${p.y}px` }}
        />
      ))}

      {/* COMMAND PALETTE MODAL */}
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        toggleScanlines={() => setScanlinesEnabled((prev) => !prev)}
        scanlinesEnabled={scanlinesEnabled}
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenSpecModal={() => setSpecModalOpen(true)}
        onToggleAudio={toggleAudio}
        audioEnabled={audioEnabled}
      />

      {/* INTERACTIVE TELEMETRY SHELL MODAL */}
      <InteractiveTerminal
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onRecomputeAttention={recomputeAttention}
      />

      {/* CURRICULUM VITAE SPEC MODAL */}
      <SpecModal open={specModalOpen} onClose={() => setSpecModalOpen(false)} />

      {/* 3D WEBGL CYBERNETIC BACKGROUND SCENE */}
      <CyberBackgroundCanvas />

      {/* CRT SCANLINES & HIGH-FREQUENCY LATTICE OVERLAYS */}
      {scanlinesEnabled && (
        <div className="fixed inset-0 scanlines opacity-30 pointer-events-none z-10" />
      )}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-15"
        style={{
          backgroundImage: "radial-gradient(rgba(236,194,70,0.5) 0.65px, transparent 0.65px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* MOBILE SIDEBAR BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* FIXED LEFT NAVIGATION CONSOLE */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-[#080b0f]/95 backdrop-blur-2xl z-50 flex flex-col justify-between py-3 border-r border-[#1e2736] overflow-y-auto transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-3">
          {/* Node Header */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-[#1b2330]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="font-code-mono-sm text-[12px] text-primary tracking-widest uppercase font-bold">
                SK-04
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-label-telemetry text-[10px] text-primary/80 border border-primary/30 px-1.5 py-0.5 rounded-[2px] bg-primary/5">
                AWS AIML Scholar'24
              </span>
              <button
                type="button"
                className="lg:hidden text-on-surface-variant hover:text-white cursor-pointer"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close navigation"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Navigation Steps */}
          <nav className="flex flex-col gap-0.5 px-2 font-code-mono-sm text-[12px]">
            {NAV_LINKS.map(({ index, id, label, meta }) => {
              const isActive = activeSection === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => {
                    audioTelemetry.playClick();
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-[2px] transition-all border-l-2 ${
                    isActive
                      ? "bg-[#161f2e] text-primary border-primary shadow-[0_0_10px_rgba(236,194,70,0.2)] font-medium"
                      : "text-on-surface-variant hover:bg-[#111722] hover:text-on-surface border-transparent hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={isActive ? "text-primary font-bold" : "text-primary/70"}>
                      [{index}]
                    </span>
                    <span>{label}</span>
                  </div>
                  {isActive ? (
                    <ArrowRight size={14} className="text-primary" />
                  ) : (
                    <span className="text-[10px] opacity-40">{meta}</span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Quick Action Badges */}
          <div className="px-3 pt-1 space-y-1.5 font-mono text-[11px]">
            <button
              onClick={() => {
                audioTelemetry.playBeep();
                setTerminalOpen(true);
              }}
              className="w-full flex items-center justify-between p-2 rounded-[2px] bg-[#0c121a] hover:bg-primary/10 border border-[#1e2736] hover:border-primary/40 text-on-surface hover:text-primary transition-all text-left cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <TerminalIcon size={12} className="text-primary" />
                <span>SHELL CONSOLE</span>
              </span>
              <kbd className="text-[9px] bg-[#1a2332] px-1 py-0.2 rounded text-primary">~</kbd>
            </button>

            <button
              onClick={() => {
                audioTelemetry.playClick();
                setSpecModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-2 rounded-[2px] bg-[#0c121a] hover:bg-cyan-spec/10 border border-[#1e2736] hover:border-cyan-spec/40 text-on-surface hover:text-cyan-spec transition-all text-left cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <FileText size={12} className="text-cyan-spec" />
                <span>CURRICULUM SPEC</span>
              </span>
              <span className="text-[9px] text-cyan-spec font-bold">PDF</span>
            </button>
          </div>
        </div>

        {/* Live Telemetry Monitor Box in Sidebar */}
        <div className="mx-3 p-3 rounded-[3px] bg-[#0d1219]/90 border border-[#222c3d] flex flex-col gap-2.5">
          <div className="flex items-center justify-between border-b border-[#1b2433] pb-1.5">
            <span className="font-label-telemetry text-[10px] text-on-surface-variant uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              SYSTEM TELEMETRY
            </span>
            <span className="font-code-mono-sm text-[10px] text-tertiary font-bold tracking-wider">
              VERIFIED
            </span>
          </div>
          <div className="font-code-mono-sm text-[11px] text-on-surface-variant flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span>PUBLIC REPOS</span>
              <span className="text-primary font-semibold">62 PUBLIC</span>
            </div>
            <div className="flex justify-between">
              <span>CERTIFICATIONS</span>
              <span className="text-cyan-spec font-medium">5 SPECIALIZATIONS</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span>UPSTREAM PR</span>
              <span className="text-tertiary font-bold">SwarmLLM #48</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span>NODE STATUS</span>
              <span className="text-primary font-bold">SK-04 // ACTIVE</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT CONTAINER */}
      <div className="pl-0 lg:pl-72 relative z-20">
        {/* TOP MISSION CONTROL HUD */}
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-14 bg-[#090d13]/85 backdrop-blur-xl z-40 border-b border-[#1d2737] flex items-center justify-between px-4 lg:px-6 shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
          <div className="flex items-center gap-3 lg:gap-4 font-code-mono-sm text-code-mono-sm">
            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden text-primary hover:text-white p-1 cursor-pointer"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2 bg-[#121822] px-2.5 lg:px-3 py-1 rounded-[2px] border border-[#232e40]">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-primary font-bold text-[10px] lg:text-[11px] tracking-wider uppercase">
                SK-04
              </span>
            </div>

            {/* Terminal Shell Trigger */}
            <button
              type="button"
              onClick={() => {
                audioTelemetry.playBeep();
                setTerminalOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#121822] hover:bg-[#192230] text-on-surface-variant hover:text-primary px-2.5 py-1 rounded-[2px] border border-[#232e40] transition-colors text-[10px] cursor-pointer"
              title="Open Terminal Shell (Press ~)"
            >
              <TerminalIcon size={12} className="text-primary" />
              <span>SHELL</span>
              <kbd className="bg-[#1e2736] px-1 py-0.2 rounded text-[9px] text-primary">~</kbd>
            </button>

            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 bg-[#121822] hover:bg-[#192230] text-on-surface-variant hover:text-primary px-2.5 py-1 rounded-[2px] border border-[#232e40] transition-colors text-[10px] cursor-pointer"
              title="Open Terminal Palette (Cmd+K)"
            >
              <TerminalIcon size={12} className="text-primary" />
              <span>CMD</span>
              <kbd className="bg-[#1e2736] px-1 py-0.2 rounded text-[9px] text-primary">⌘K</kbd>
            </button>
          </div>

          <div className="flex items-center gap-3 lg:gap-4 font-label-telemetry">
            {/* Audio Telemetry Toggle */}
            <button
              type="button"
              onClick={toggleAudio}
              className="inline-flex items-center gap-1 text-[10px] text-on-surface-variant hover:text-primary transition-colors bg-[#121822] px-2 py-1 rounded-[2px] border border-[#232e40] cursor-pointer"
              title="Toggle procedural UI audio effects"
            >
              {audioEnabled ? (
                <>
                  <Volume2 size={12} className="text-tertiary" />
                  <span className="text-tertiary font-bold hidden sm:inline">AUDIO: FX ON</span>
                </>
              ) : (
                <>
                  <VolumeX size={12} className="text-on-surface-variant" />
                  <span className="hidden sm:inline">MUTE</span>
                </>
              )}
            </button>

            {/* Scanlines Toggle Button */}
            <button
              type="button"
              onClick={() => setScanlinesEnabled((prev) => !prev)}
              className="hidden xl:inline-flex items-center gap-1 text-[10px] text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              title="Toggle CRT Scanlines"
            >
              <span className="text-outline-variant">::</span>
              <span>CRT: {scanlinesEnabled ? "ON" : "OFF"}</span>
            </button>

            {/* Precision Clock */}
            <div className="hidden sm:flex items-center gap-2 bg-[#121822] px-2.5 py-1 rounded-[2px] border border-[#232e40] text-primary">
              <Clock size={13} className="text-primary" />
              <TelemetryClock className="tracking-widest font-mono text-[11px]" />
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-[#243042]">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="w-8 h-8 rounded-[3px] bg-primary/20 border border-primary/50 flex items-center justify-center hover:bg-primary/30 transition-colors cursor-pointer"
                title="Open Command Palette (⌘K)"
              >
                <Brain size={16} className="text-primary" />
              </button>
            </div>
          </div>
        </header>

        {/* MAIN INTERACTIVE CONTENT SURFACE */}
        <main className="relative pt-20 w-full px-4 sm:px-6 lg:px-10 min-h-screen">
          <div className="flex flex-col w-full text-on-surface pb-24 max-w-7xl mx-auto space-y-12">
            {/* SECTION 00: HERO / OVERVIEW */}
            <section className="relative pt-4 flex flex-col gap-6" id="overview">
              <div className="hud-panel p-3 rounded-[3px] flex flex-wrap items-center justify-between gap-3 border-l-4 border-l-primary">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-label-telemetry text-on-surface-variant">
                  <span>
                    ID: <code className="text-cyan-spec font-code-mono-sm">sourabh-kumar04</code>
                  </span>
                  <span className="text-outline-variant">/</span>
                  <span>
                    NODE: <code className="text-primary font-code-mono-sm">SK-04</code>
                  </span>
                  <span className="text-outline-variant">/</span>
                  <span>
                    STATUS: <code className="text-tertiary font-code-mono-sm">ONLINE</code>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-[10px] bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 rounded-[2px]">
                    AVAILABLE / INFERENCE READY
                  </span>
                </div>
              </div>

              <div className="hud-panel p-4 sm:p-6 lg:p-8 rounded-[4px] relative overflow-hidden border border-[#232c3d]">
                <div className="scan-beam" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-code-mono-sm text-[9px] text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-[2px] uppercase font-bold tracking-wider">
                          AWS AI/ML SCHOLAR '24 | CS STUDENT @ UNIVERSITY OF DELHI
                        </span>
                        <span className="font-code-mono-sm text-[8.5px] text-tertiary border border-tertiary/30 px-2 py-0.5 rounded-[2px] bg-tertiary/5 font-semibold">
                          OPEN TO AI/ML INTERNSHIPS
                        </span>
                      </div>
                      <h1 className="font-display-hero text-base sm:text-lg lg:text-[19px] font-bold text-white tracking-tight pt-0.5">
                        Sourabh Kumar
                      </h1>
                      <p className="font-headline-md text-xs sm:text-[13px] text-primary font-medium tracking-wide">
                        AI/ML Enthusiast — Applied LLM Engineering
                      </p>
                      <p className="font-body-md text-on-surface-variant flex items-center gap-1.5 pt-0.5 font-mono text-[11.5px]">
                        <GraduationCap size={14} className="text-primary shrink-0" />
                        B.Sc. (Hons) Computer Science, University of Delhi (2023–2027)
                      </p>
                    </div>

                    <div className="bg-[#0e141e]/90 p-4 rounded-[3px] border-l-2 border-primary border-[#212c3d]">
                      <p className="font-body-lg text-on-surface leading-relaxed text-[15px]">
                        Computer Science student at the University of Delhi, moving from classical
                        machine learning toward agentic AI systems and applied LLM engineering —
                        most recently a multi-agent dataset-synthesis platform, and a merged
                        contribution to an open-source peer-to-peer inference engine.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                      <a
                        className="bg-primary text-black px-4 py-2 rounded-[2px] font-bold hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(236,194,70,0.3)]"
                        href="https://github.com/Sourabh-Kumar04"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>github ↗</span>
                      </a>
                      <a
                        className="bg-[#151c27] border border-[#2e3b4f] text-on-surface hover:text-primary px-4 py-2 rounded-[2px] transition-all flex items-center gap-1.5"
                        href="https://linkedin.com/in/sourabh-kumar04"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>linkedin ↗</span>
                      </a>
                      <a
                        href="#evaluation"
                        onClick={() => audioTelemetry.playClick()}
                        className="bg-[#151c27] border border-primary/40 text-primary hover:bg-primary/10 px-4 py-2 rounded-[2px] transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>view projects ↗</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          audioTelemetry.playClick();
                          setSpecModalOpen(true);
                        }}
                        className="bg-[#121924] border border-cyan-spec/40 text-cyan-spec hover:bg-cyan-spec/10 px-3.5 py-2 rounded-[2px] transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText size={13} />
                        <span>CV SPEC</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          audioTelemetry.playBeep();
                          setTerminalOpen(true);
                        }}
                        className="bg-[#121924] border border-[#2e3b4f] text-on-surface-variant hover:text-primary px-3 py-2 rounded-[2px] transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <TerminalIcon size={13} />
                        <span>SHELL (~)</span>
                      </button>
                    </div>
                  </div>

                  {/* Interactive Attention Weight Density Matrix Panel */}
                  <div className="lg:col-span-4 bg-[#0a0d14]/90 border border-[#222c3d] p-4 rounded-[3px] flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-[#1b2331] pb-2">
                      <span className="font-label-telemetry text-[11px] text-primary uppercase font-bold tracking-wider">
                        ATTENTION WEIGHT DENSITY
                      </span>
                      <button
                        type="button"
                        onClick={recomputeAttention}
                        disabled={isRecomputing}
                        className="font-code-mono-sm text-[10px] text-tertiary hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Simulate new attention forward pass"
                      >
                        <RefreshCw
                          size={11}
                          className={isRecomputing ? "animate-spin text-primary" : ""}
                        />
                        <span>{isRecomputing ? "COMPUTING..." : "RE-ATTEND"}</span>
                      </button>
                    </div>

                    {/* Interactive 48-Cell Grid */}
                    <div
                      role="grid"
                      aria-label="Transformer Attention Weight Matrix (48 simulated heads)"
                      className="grid grid-cols-8 gap-1 p-2 bg-[#06080c] rounded-[2px] border border-[#1b2331]"
                    >
                      {attentionWeights.map((w, idx) => {
                        const isHovered = hoveredCell?.index === idx;
                        const opacity = Math.max(0.12, w);
                        return (
                          <div
                            key={idx}
                            role="gridcell"
                            tabIndex={0}
                            aria-label={`Attention Head ${(idx % 8) + 1}, Weight ${w.toFixed(3)}`}
                            onFocus={() => {
                              audioTelemetry.playClick();
                              setHoveredCell({ index: idx, weight: w });
                            }}
                            onBlur={() => setHoveredCell(null)}
                            onMouseEnter={() => {
                              audioTelemetry.playClick();
                              setHoveredCell({ index: idx, weight: w });
                            }}
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`aspect-square rounded-[1px] transition-all duration-200 cursor-crosshair relative focus:outline-none focus:ring-1 focus:ring-primary ${
                              isRecomputing ? "cell-recomputing" : ""
                            }`}
                            style={{
                              backgroundColor: idx === 47 ? "var(--tertiary)" : "var(--primary)",
                              opacity: isHovered ? 1 : opacity,
                              transform: isHovered ? "scale(1.35)" : "scale(1)",
                              zIndex: isHovered ? 10 : 1,
                              boxShadow: isHovered ? "0 0 10px rgba(236,194,70,0.8)" : "none",
                              animationDelay: isRecomputing ? `${(idx % 8) * 35}ms` : undefined,
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Dynamic Readout */}
                    <div className="flex items-center justify-between font-label-telemetry text-[10px] text-on-surface-variant min-h-[16px]">
                      {hoveredCell ? (
                        <span className="text-primary font-bold">
                          HEAD [{(hoveredCell.index % 8) + 1}/8] · WEIGHT:{" "}
                          {hoveredCell.weight.toFixed(3)}
                        </span>
                      ) : (
                        <span>SPARSITY: 42.8%</span>
                      )}
                      <span className="text-tertiary">TOP-K CONVERGED</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Live Telemetry Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#0a0d13]/80 border-t border-[#20293a] mt-6 -mx-4 sm:-mx-6 lg:-mx-8 -mb-4 sm:-mb-6 lg:-mb-8 p-3 sm:p-4 font-code-mono-sm text-[12px]">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant/70 uppercase">STATUS</span>
                    <span className="text-tertiary font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
                      OPEN TO INTERNSHIPS
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant/70 uppercase">
                      PRIMARY STACK
                    </span>
                    <span className="text-white font-semibold">PyTorch • FastAPI</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant/70 uppercase">GEO</span>
                    <span className="text-primary font-semibold">28.61°N, 77.20°E</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant/70 uppercase">
                      LOCAL TIME
                    </span>
                    <TelemetryClock className="text-cyan-spec font-semibold" />
                  </div>
                </div>
              </div>

              {/* AT A GLANCE METRICS STRIP */}
              <div className="hud-panel p-4 sm:p-5 rounded-[3px] border border-[#222e40] bg-[#090d14]/90">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-[#1b2535]">
                  <span className="font-label-telemetry text-[11px] text-primary uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    AT A GLANCE
                  </span>
                  <span className="text-[10px] font-mono text-on-surface-variant">
                    PORTFOLIO SPEC // v2026.09
                  </span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded bg-[#0d121a] border border-[#1e2736] flex flex-col justify-between">
                    <span className="text-[10px] text-on-surface-variant block uppercase">
                      PUBLIC REPOSITORIES
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-primary">62</span>
                      <span className="text-[11px] text-on-surface-variant">Open-Source Repos</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded bg-[#0d121a] border border-[#1e2736] flex flex-col justify-between">
                    <span className="text-[10px] text-on-surface-variant block uppercase">
                      CERTIFICATIONS
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-cyan-spec">5</span>
                      <span className="text-[11px] text-on-surface-variant">Specializations</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded bg-[#0d121a] border border-[#1e2736] flex flex-col justify-between">
                    <span className="text-[10px] text-on-surface-variant block uppercase">
                      UPSTREAM CONTRIBUTION
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-tertiary">1</span>
                      <span className="text-[11px] text-on-surface-variant">
                        Merged PR (SwarmLLM)
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded bg-[#0d121a] border border-[#1e2736] flex flex-col justify-between">
                    <span className="text-[10px] text-on-surface-variant block uppercase">
                      FEATURED SYSTEMS
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-primary">3</span>
                      <span className="text-[11px] text-on-surface-variant">
                        PEFT, RAG &amp; ML
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 01: MODEL_DETAILS */}
            <section className="relative py-4 flex flex-col gap-6" id="model-details">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c2432]">
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-primary font-bold text-[14px]">[01]</span>
                  <h2 className="font-headline-md text-xl font-semibold text-white tracking-wider uppercase">
                    model_details
                  </h2>
                </div>
                <span className="font-label-telemetry text-on-surface-variant text-[11px]">
                  PROFILE &amp; ARCHITECTURAL SPECIFICATION
                </span>
              </div>

              {/* Core Narrative & Technical Parameter Matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Engineering Bio & Trajectory */}
                <div className="lg:col-span-7 hud-panel p-6 rounded-[3px] flex flex-col justify-between gap-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#1c2432] pb-2">
                      <span className="font-label-telemetry text-[11px] text-primary uppercase font-bold tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        SYSTEM OPERATOR // PROFILE NARRATIVE
                      </span>
                      <span className="font-code-mono-sm text-[10px] text-cyan-spec">
                        SPEC-2035 // ARCH-v4.2
                      </span>
                    </div>
                    <div className="space-y-3 font-body-md text-on-surface leading-relaxed text-[14.5px]">
                      <p>
                        The trajectory began with the classical classifiers every machine learning
                        undergraduate implements, then evolved deeper into first-principles math and
                        systems engineering.
                      </p>
                      <p>
                        Moving beyond superficial API wrappers, I built from-scratch NumPy tensor
                        operations, PyTorch autograd computational graphs, and eventually{" "}
                        <strong className="text-white font-semibold">RasoSynthTune</strong> — an
                        autonomous multi-agent pipeline that synthesizes, filters, and gates
                        domain-specific instruction datasets through human review before executing
                        LoRA fine-tuning on open-weights models (LLaMA-3, Mistral-7B, Phi-3).
                      </p>
                      <p>
                        Along the way, I contributed to upstream production open-source systems:
                        merging PR #48 into{" "}
                        <strong className="text-white font-semibold">Nehanth/swarmllm</strong> to
                        provide host output visibility controls and node-tag customization in a
                        peer-to-peer WebGPU distributed inference engine.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1c2432] flex flex-wrap items-center justify-between gap-3 text-[11px] font-code-mono-sm">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                      <span>STATUS:</span>
                      <span className="text-tertiary font-bold">
                        AVAILABLE FOR AI/ML INTERNSHIPS
                      </span>
                    </div>
                    <div className="text-on-surface-variant">
                      GEO:{" "}
                      <span className="text-white font-medium">
                        New Delhi, IN (28.61°N, 77.20°E)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Technical Specification Parameter Schema */}
                <div className="lg:col-span-5 hud-panel p-6 rounded-[3px] flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#1c2432] pb-2 mb-2">
                      <span className="font-label-telemetry text-[11px] text-primary uppercase font-bold tracking-wider">
                        MODEL CARD SPECIFICATION
                      </span>
                      <span className="font-code-mono-sm text-[10px] text-tertiary">
                        CALIBRATED // VERIFIED
                      </span>
                    </div>

                    <div className="flex flex-col divide-y divide-[#18212e] font-code-mono-sm text-[11.5px]">
                      <div className="py-2 flex justify-between items-center">
                        <span className="text-on-surface-variant">OPERATOR_ID</span>
                        <span className="text-white font-bold">Sourabh Kumar (SK-04)</span>
                      </div>
                      <div className="py-2 flex justify-between items-center">
                        <span className="text-on-surface-variant">ACADEMIC_TRACK</span>
                        <span className="text-cyan-spec font-medium text-right">
                          B.Sc. (Hons) CS @ University of Delhi
                        </span>
                      </div>
                      <div className="py-2 flex justify-between items-center">
                        <span className="text-on-surface-variant">SCHOLAR_AWARD</span>
                        <span className="text-primary font-bold">AWS AI/ML Scholar &apos;24</span>
                      </div>
                      <div className="py-2 flex justify-between items-center">
                        <span className="text-on-surface-variant">PRIMARY_FOCUS</span>
                        <span className="text-white">Agentic Workflows &amp; Fine-Tuning</span>
                      </div>
                      <div className="py-2 flex justify-between items-center">
                        <span className="text-on-surface-variant">ORCHESTRATION</span>
                        <span className="text-cyan-spec">LangGraph + FastAPI + Redis</span>
                      </div>
                      <div className="py-2 flex justify-between items-center">
                        <span className="text-on-surface-variant">ADAPTATION_METHOD</span>
                        <span className="text-primary">QLoRA / PEFT (NF4 Double-Quant)</span>
                      </div>
                      <div className="py-2 flex justify-between items-center">
                        <span className="text-on-surface-variant">VECTOR_STORAGE</span>
                        <span className="text-white">Qdrant</span>
                      </div>
                      <div className="py-2 flex justify-between items-center">
                        <span className="text-on-surface-variant">OPEN_SOURCE_PR</span>
                        <span className="text-tertiary font-bold">SwarmLLM PR #48 [MERGED]</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-[2px] bg-[#0c121b] border border-[#1e283a] flex items-center justify-between text-[11px] font-code-mono-sm">
                    <span className="text-on-surface-variant">VERIFIED CHECKPOINTS</span>
                    <span className="text-primary font-bold">5 CERTIFIED SPECIALIZATIONS</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 02: TRAINING_DATA */}
            <section className="relative py-4 flex flex-col gap-6" id="training-data">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c2432]">
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-primary font-bold text-[14px]">[02]</span>
                  <h2 className="font-headline-md text-xl font-semibold text-white tracking-wider uppercase">
                    training_data
                  </h2>
                </div>
                <span className="font-label-telemetry text-on-surface-variant text-[11px]">
                  EDUCATION + CERTIFICATIONS
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="hud-panel p-6 rounded-[3px] flex flex-col justify-between gap-6 border-l-2 border-primary">
                  <div className="flex flex-col gap-4">
                    <span className="font-label-telemetry text-[11px] text-primary uppercase font-bold tracking-wider">
                      EDUCATION // DEGREE TRACK
                    </span>

                    <div className="space-y-1.5 border-b border-[#1c2637] pb-3">
                      <h3 className="font-headline-sm text-white font-bold text-base">
                        B.Sc. (Hons) Computer Science
                      </h3>
                      <span className="font-code-mono-sm text-[12px] text-cyan-spec block">
                        University of Delhi (2023–2027)
                      </span>
                    </div>

                    <div className="space-y-1.5 border-b border-[#1c2637] pb-3">
                      <h4 className="font-headline-sm text-white font-bold text-sm">
                        AWS AI/ML Scholar &apos;24
                      </h4>
                      <span className="font-code-mono-sm text-[12px] text-primary/90 block">
                        Udacity &amp; Amazon Web Services
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-headline-sm text-white font-bold text-sm">
                        AI Programming with Python
                      </h4>
                      <span className="font-code-mono-sm text-[12px] text-tertiary block">
                        Udacity Nanodegree Program · 2024
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hud-panel p-6 rounded-[3px] flex flex-col justify-between gap-6 border-l-2 border-cyan-spec">
                  <div className="flex flex-col gap-3">
                    <span className="font-label-telemetry text-[11px] text-cyan-spec uppercase font-bold tracking-wider">
                      CERTIFICATIONS (5)
                    </span>
                    <div className="flex flex-col gap-2 font-code-mono-sm text-[12px]">
                      <div className="p-2.5 bg-[#0b0e14] border border-[#1e2635] rounded flex justify-between items-center">
                        <span>AWS ML Fundamentals</span>
                        <span className="text-tertiary text-[11px]">Udacity · Jul 2025</span>
                      </div>
                      <div className="p-2.5 bg-[#0b0e14] border border-[#1e2635] rounded flex justify-between items-center">
                        <span>AI Agents Fundamentals</span>
                        <span className="text-tertiary text-[11px]">Hugging Face · Feb 2025</span>
                      </div>
                      <div className="p-2.5 bg-[#0b0e14] border border-[#1e2635] rounded flex justify-between items-center">
                        <span>Gemini API by Google</span>
                        <span className="text-tertiary text-[11px]">Udacity · Nov 2024</span>
                      </div>
                      <div className="p-2.5 bg-[#0b0e14] border border-[#1e2635] rounded flex justify-between items-center">
                        <span>Foundations of Generative AI</span>
                        <span className="text-tertiary text-[11px]">Udacity · Nov 2024</span>
                      </div>
                      <div className="p-2.5 bg-[#0b0e14] border border-[#1e2635] rounded flex justify-between items-center">
                        <span>AI Programming with Python</span>
                        <span className="text-tertiary text-[11px]">Udacity · Sep 2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 03: EVALUATION */}
            <section className="relative py-4 flex flex-col gap-6" id="evaluation">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#1c2432]">
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-primary font-bold text-[14px]">[03]</span>
                  <h2 className="font-headline-md text-xl font-semibold text-white tracking-wider uppercase">
                    evaluation
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Mode Toggle: Projects vs Code */}
                  <div className="flex items-center p-0.5 rounded-[2px] bg-[#0c121a] border border-[#212c3d] font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        audioTelemetry.playClick();
                        setEvaluationTab("projects");
                      }}
                      className={`px-3 py-1 rounded-[1px] transition-all cursor-pointer ${
                        evaluationTab === "projects"
                          ? "bg-primary text-black font-bold"
                          : "text-on-surface-variant hover:text-white"
                      }`}
                    >
                      SYSTEM ARCHITECTURES
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        audioTelemetry.playClick();
                        setEvaluationTab("code");
                      }}
                      className={`px-3 py-1 rounded-[1px] transition-all flex items-center gap-1.5 cursor-pointer ${
                        evaluationTab === "code"
                          ? "bg-cyan-spec text-black font-bold"
                          : "text-on-surface-variant hover:text-white"
                      }`}
                    >
                      <Code2 size={12} />
                      CODE TELEMETRY
                    </button>
                  </div>

                  {/* Filter Tabs (when in projects mode) */}
                  {evaluationTab === "projects" && (
                    <div className="flex items-center gap-1 font-code-mono-sm text-[11px]">
                      {(["all", "peft", "agents", "ml"] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            audioTelemetry.playClick();
                            setProjectFilter(cat);
                          }}
                          className={`px-2 py-1 rounded-[2px] uppercase transition-all cursor-pointer ${
                            projectFilter === cat
                              ? "bg-primary text-black font-bold"
                              : "bg-[#101620] text-on-surface-variant hover:text-white border border-[#212c3d]"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {evaluationTab === "projects" ? (
                <div className="flex flex-col gap-6">
                  {filteredProjects.map((p) => (
                    <TiltProjectCard key={p.title} project={p} />
                  ))}
                </div>
              ) : (
                /* CODE TELEMETRY VIEWER */
                <div className="hud-panel p-5 rounded-[3px] border border-[#212c3d] bg-[#090d14]/90 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1c2535] pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {CODE_SNIPPETS.map((snippet) => (
                        <button
                          key={snippet.id}
                          onClick={() => {
                            audioTelemetry.playClick();
                            setActiveSnippetId(snippet.id);
                          }}
                          className={`px-3 py-1.5 rounded-[2px] font-mono text-xs border transition-all cursor-pointer ${
                            activeSnippetId === snippet.id
                              ? "border-cyan-spec bg-cyan-spec/10 text-cyan-spec font-bold"
                              : "border-[#1e2736] bg-[#0c121a] text-on-surface-variant hover:text-white"
                          }`}
                        >
                          {snippet.title}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handleCopySnippet(activeSnippet.code)}
                      className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-[2px] font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedSnippet ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedSnippet ? "COPIED" : "COPY SNIPPET"}</span>
                    </button>
                  </div>

                  <p className="text-on-surface-variant font-mono text-xs">{activeSnippet.desc}</p>

                  <div className="relative rounded-[2px] overflow-hidden border border-[#1e283b] bg-[#06080c]">
                    <div className="px-3 py-1.5 bg-[#0e141f] border-b border-[#1e283b] flex items-center justify-between font-mono text-[11px] text-on-surface-variant">
                      <span className="text-primary">{activeSnippet.title}</span>
                      <span>UTF-8 // {activeSnippet.language.toUpperCase()}</span>
                    </div>
                    <pre className="p-4 overflow-x-auto text-[12px] font-mono leading-relaxed text-[#d7e0ea] selection:bg-primary selection:text-black">
                      <code>{activeSnippet.code}</code>
                    </pre>
                  </div>
                </div>
              )}
            </section>

            {/* SECTION 04: LEARNING_REPOS */}
            <section className="relative py-4 flex flex-col gap-6" id="learning-repos">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c2432]">
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-primary font-bold text-[14px]">[04]</span>
                  <h2 className="font-headline-md text-xl font-semibold text-white tracking-wider uppercase">
                    learning_repos
                  </h2>
                </div>
                <span className="font-label-telemetry text-on-surface-variant text-[11px]">
                  PUBLIC, RUNNING RESEARCH NOTES & NOTEBOOKS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {LEARNING_REPOS.map((repo) => (
                  <div
                    key={repo.title}
                    className="hud-panel p-5 rounded-[3px] flex flex-col justify-between gap-4 border border-[#202c3e] bg-[#090d14]/90 hover:border-primary/50 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-[2px] font-mono text-[10px] border ${repo.tagColor}`}
                        >
                          {repo.topic}
                        </span>
                        <a
                          href={repo.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-mono text-xs flex items-center gap-1"
                        >
                          <span>view repo</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                      <h3 className="font-bold text-white text-base font-mono">{repo.title}</h3>
                      <p className="font-body-md text-on-surface-variant text-[13px] leading-relaxed">
                        {repo.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1b2535]">
                      {repo.topics.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 rounded-[2px] bg-[#101723] text-on-surface-variant text-[10px] font-mono border border-[#1e2a3c]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 05: CAPABILITIES */}
            <section className="relative py-4 flex flex-col gap-6" id="capabilities">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c2432]">
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-primary font-bold text-[14px]">[05]</span>
                  <h2 className="font-headline-md text-xl font-semibold text-white tracking-wider uppercase">
                    capabilities
                  </h2>
                </div>
                <span className="font-label-telemetry text-on-surface-variant text-[11px]">
                  SKILL MATRIX
                </span>
              </div>
              <div className="hud-panel p-6 rounded-[3px] font-code-mono-sm text-[12px] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 pb-2 border-b border-[#1b2331]">
                  <span className="text-primary font-bold w-32 shrink-0">languages:</span>
                  <span className="text-white">Python · C++</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 pb-2 border-b border-[#1b2331]">
                  <span className="text-cyan-spec font-bold w-32 shrink-0">ml_core:</span>
                  <span className="text-white">
                    PyTorch · TensorFlow · LangChain · LangGraph · RAG · LoRA/PEFT
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 pb-2 border-b border-[#1b2331]">
                  <span className="text-tertiary font-bold w-32 shrink-0">infra:</span>
                  <span className="text-white">Docker · FastAPI</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                  <span className="text-on-surface-variant w-32 shrink-0">data_stores:</span>
                  <span className="text-white">Redis · PostgreSQL · Qdrant</span>
                </div>
              </div>
            </section>

            {/* SECTION 06: EXTERNAL_VALIDATION */}
            <section className="relative py-4 flex flex-col gap-6" id="external-validation">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c2432]">
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-primary font-bold text-[14px]">[06]</span>
                  <h2 className="font-headline-md text-xl font-semibold text-white tracking-wider uppercase">
                    external_validation
                  </h2>
                </div>
                <span className="font-label-telemetry text-on-surface-variant text-[11px]">
                  OPEN-SOURCE CONTRIBUTION
                </span>
              </div>
              <div className="hud-panel p-6 rounded-[3px] flex flex-col gap-4 border-l-2 border-primary">
                <div className="text-primary font-mono text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-tertiary shrink-0" />
                  <span>merged: PR #48 → Nehanth/swarmllm</span>
                </div>
                <p className="font-body-md text-on-surface-variant text-[14px] leading-relaxed">
                  Contributed host output visibility controls and node-tag customization to a
                  from-scratch WebGPU and WebRTC engine that splits a 27B-parameter model across
                  browser tabs on different devices.
                </p>
                <div>
                  <a
                    href="https://github.com/Nehanth/swarmllm/commit/c6f47f70968d44e57cc848e528d2e27a118dddda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-mono text-xs hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>view commit ↗</span>
                    <ExternalLink size={13} className="shrink-0" />
                  </a>
                </div>
              </div>
            </section>

            {/* SECTION 07: LIMITATIONS */}
            <section className="relative py-4 flex flex-col gap-6" id="limitations">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c2432]">
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-primary font-bold text-[14px]">[07]</span>
                  <h2 className="font-headline-md text-xl font-semibold text-white tracking-wider uppercase">
                    limitations
                  </h2>
                </div>
                <span className="font-label-telemetry text-on-surface-variant text-[11px]">
                  ZERO-EGO CALIBRATION
                </span>
              </div>
              <div className="hud-panel p-6 rounded-[3px] border-l-4 border-l-primary flex flex-col gap-3">
                <p className="font-body-md text-on-surface text-[14px] leading-relaxed">
                  Still training on: distributed systems at scale, and a more formal footing in
                  algorithms and theory. Known gap: carrying a project past the demo stage into
                  something that keeps running reliably. Feedback welcome.
                </p>
              </div>
            </section>

            {/* SECTION 08: MAINTAINER / CONTACT */}
            <section className="relative py-4 flex flex-col gap-6" id="maintainer">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c2432]">
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-primary font-bold text-[14px]">[08]</span>
                  <h2 className="font-headline-md text-xl font-semibold text-white tracking-wider uppercase">
                    contact
                  </h2>
                </div>
                <span className="font-label-telemetry text-on-surface-variant text-[11px]">
                  GET IN TOUCH
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 hud-panel p-6 rounded-[3px] flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-[#1b2331] pb-2">
                    <span className="font-label-telemetry text-[11px] text-primary uppercase font-bold tracking-wider flex items-center gap-2">
                      <HelpCircle size={14} className="text-primary" />
                      COMMON QUERIES // DIRECT CLARITY
                    </span>
                    <span className="font-code-mono-sm text-[10px] text-tertiary">
                      VERIFIED RECIPIENT
                    </span>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div className="p-3.5 bg-[#0a0f16] rounded border border-[#1e2736] space-y-1.5">
                      <h4 className="text-white font-bold text-[13px] flex items-center gap-1.5">
                        <span className="text-primary font-bold">Q:</span> What roles are you
                        currently looking for?
                      </h4>
                      <p className="text-on-surface-variant font-sans text-[13.5px] leading-relaxed">
                        I am actively seeking AI/ML engineering or applied LLM internships. Open to
                        remote or New Delhi / NCR on-site opportunities focusing on agentic
                        workflows, fine-tuning (LoRA/PEFT), or RAG systems.
                      </p>
                    </div>

                    <div className="p-3.5 bg-[#0a0f16] rounded border border-[#1e2736] space-y-1.5">
                      <h4 className="text-white font-bold text-[13px] flex items-center gap-1.5">
                        <span className="text-cyan-spec font-bold">Q:</span> Where should I start
                        looking at your work?
                      </h4>
                      <p className="text-on-surface-variant font-sans text-[13.5px] leading-relaxed">
                        Check out <strong className="text-white">RasoSynthTune</strong> for an
                        end-to-end multi-agent dataset synthesis architecture, or review{" "}
                        <strong className="text-white">PR #48 on Nehanth/swarmllm</strong> to
                        inspect merged upstream open-source code.
                      </p>
                    </div>

                    <div className="p-3.5 bg-[#0a0f16] rounded border border-[#1e2736] space-y-1.5">
                      <h4 className="text-white font-bold text-[13px] flex items-center gap-1.5">
                        <span className="text-tertiary font-bold">Q:</span> How can I get in touch?
                      </h4>
                      <p className="text-on-surface-variant font-sans text-[13.5px] leading-relaxed">
                        The best channels are direct messages via LinkedIn or opening an
                        issue/discussion on GitHub. Both profiles are monitored daily.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-4 font-code-mono-sm text-xs">
                  <div className="hud-panel p-6 rounded-[3px] flex flex-col gap-3">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider pb-1 border-b border-[#1b2331]">
                      STATUS &amp; REACHABILITY
                    </span>
                    <p className="text-on-surface-variant text-[13px] font-sans leading-relaxed">
                      Open to AI/ML internships and interesting problems. Reach out on GitHub or
                      LinkedIn — both linked here.
                    </p>
                    <div className="space-y-1.5 pt-2 border-t border-[#1b2331]">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">FOCUS</span>
                        <span className="text-white font-semibold">Agents &amp; RAG</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">LOCATION</span>
                        <span className="text-white">New Delhi, India</span>
                      </div>
                    </div>
                    <div className="pt-2 flex flex-col gap-2">
                      <a
                        href="https://github.com/Sourabh-Kumar04/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center justify-between gap-2 p-2 rounded bg-[#0b1018] border border-[#1e2a3c]"
                      >
                        <span>github: github.com/Sourabh-Kumar04</span>
                        <ExternalLink size={12} />
                      </a>
                      <a
                        href="https://linkedin.com/in/sourabh-kumar04"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center justify-between gap-2 p-2 rounded bg-[#0b1018] border border-[#1e2a3c]"
                      >
                        <span>linkedin: linkedin.com/in/sourabh-kumar04</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* FOOTER TELEMETRY STATUS */}
        <footer className="w-full bg-[#080b0f]/90 border-t border-[#1d2737] py-4 px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 font-label-telemetry text-[11px] text-on-surface-variant">
          <div className="flex items-center gap-3">
            <span>MODEL SPECIFICATION // IMMUTABLE RUNTIME</span>
            <span className="text-outline-variant">·</span>
            <span className="text-primary font-bold">SOURABH KUMAR</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-code-mono-sm text-[10px] text-on-surface-variant/80">
              AWS AIML Scholar'24
            </span>
            <button
              type="button"
              onClick={() => {
                audioTelemetry.playClick();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-cyan-spec hover:underline cursor-pointer"
            >
              BACK TO TOP ↑
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Portfolio;
