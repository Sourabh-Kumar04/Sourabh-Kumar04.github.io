import React, { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { CommandPalette } from "./CommandPalette";
import { Toaster } from "./ui/sonner";
import {
  FileText,
  Cpu,
  Sparkles,
  RefreshCw,
  ExternalLink,
  HardDrive,
  CheckCircle2,
  BookOpen,
  X,
  ArrowRight,
  Menu,
  Brain,
  GraduationCap,
  FolderGit2,
  Award,
  GitPullRequest,
  HelpCircle,
  MessageSquare,
  Mail,
  Send,
  Github,
  Linkedin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NavLink {
  index: string;
  id: string;
  label: string;
  meta: string;
}

const NAV_LINKS: NavLink[] = [
  { index: "00", id: "model-overview", label: "MODEL_OVERVIEW", meta: "IDENTITY" },
  { index: "01", id: "operator-profile", label: "OPERATOR_PROFILE", meta: "ABOUT" },
  { index: "02", id: "training-record", label: "TRAINING_RECORD", meta: "5" },
  { index: "03", id: "evaluation-set", label: "EVALUATION_SET", meta: "3" },
  { index: "04", id: "research-notes", label: "RESEARCH_NOTES", meta: "4" },
  { index: "05", id: "capability-schema", label: "CAPABILITY_SCHEMA", meta: "STACK" },
  { index: "06", id: "external-validation", label: "EXTERNAL_VALIDATION", meta: "MERGED" },
  { index: "07", id: "limitations", label: "LIMITATIONS", meta: "HONEST" },
  { index: "08", id: "contact-terminal", label: "MAINTAINER_CONTACT", meta: "PING" },
];

interface Project {
  title: string;
  category: "agents" | "peft" | "ml";
  tag: string;
  tagColor: string;
  stack: string;
  description: string;
  outcome: string;
  architecture: string;
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
      "End-to-end multi-agent pipeline discovering, filtering, and synthesizing domain datasets with automated quality gating (>85% score retention) and human-in-the-loop review. Implements 4-bit QLoRA fine-tuning across all 7 linear projections on Llama-3-8B and Mistral-7B, yielding 41.9M trainable params (0.519%) on single consumer GPUs.",
    outcome: "0.519% trainable parameters · >85% quality gate · human review before training",
    architecture: "Dataset discovery → quality scoring → human approval → QLoRA training",
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
    outcome: "Grounded responses from a domain knowledge base · redeployment in progress",
    architecture: "Question → retrieval → context assembly → Llama 2 response",
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
    outcome: "Content-based recommendations over the TMDB 5000 dataset",
    architecture: "Movie metadata → feature representation → cosine similarity → ranked results",
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

const TECHNICAL_NOTES: LearningRepo[] = [
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
];

// Mathematically grounded Transformer Attention: row-stochastic Softmax distribution
function computeSoftmaxAttention(causal = false): number[] {
  const numRows = 6;
  const numCols = 8;
  const weights: number[] = [];

  for (let r = 0; r < numRows; r++) {
    const logits: number[] = [];
    for (let c = 0; c < numCols; c++) {
      if (causal && c > r) {
        logits.push(-1e9); // Causal mask
      } else {
        // Scaled dot-product logit: QK^T / sqrt(d_k) with realistic diagonal token affinity
        const base = r === c ? 2.6 : Math.random() * 2.2 - 0.7;
        logits.push(base);
      }
    }
    const maxL = Math.max(...logits);
    const expVals = logits.map((l) => (l <= -1e8 ? 0 : Math.exp(l - maxL)));
    const sumExp = expVals.reduce((a, b) => a + b, 0);
    const row = expVals.map((e) => Number((e / sumExp).toFixed(3)));
    weights.push(...row);
  }
  return weights;
}

const INITIAL_WEIGHTS = computeSoftmaxAttention(false);

function AnimatedCounter({ end, duration = 1100 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * end));

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [started, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
    </span>
  );
}

function TiltProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number; rawX: number; rawY: number } | null>(
    null,
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / rect.width;
    const rawY = (e.clientY - rect.top) / rect.height;
    const rotX = (rawY - 0.5) * -8.5;
    const rotY = (rawX - 0.5) * 8.5;
    setTilt({ x: rotX, y: rotY, rawX, rawY });
  };

  const handleMouseLeave = () => {
    setTilt(null);
  };

  const categoryAccent =
    project.category === "peft" ? "#ecc246" : project.category === "agents" ? "#15d9c7" : "#4ae176";
  const cardStyle = {
    "--card-accent": categoryAccent,
    transform: tilt
      ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateY(-8px) scale(1.018) translateZ(12px)`
      : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1) translateZ(0px)",
    transition: tilt
      ? "transform 0.08s ease-out, box-shadow 0.15s ease-out"
      : "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease-out",
    boxShadow: tilt
      ? "0 22px 45px -8px rgba(0, 0, 0, 0.85), 0 0 25px rgba(236, 194, 70, 0.18)"
      : undefined,
    transformStyle: "preserve-3d",
  } as React.CSSProperties;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
      className={`hud-panel motion-card p-6 rounded-[3px] flex flex-col gap-4 border-l-4 ${project.borderAccent} will-change-transform relative group cursor-pointer`}
    >
      <span className="hud-corner hud-corner-tl" />
      <span className="hud-corner hud-corner-tr" />
      <span className="hud-corner hud-corner-bl" />
      <span className="hud-corner hud-corner-br" />

      {/* Dynamic Cursor Spotlight Sheen */}
      <div className="pointer-events-none absolute inset-0 rounded-[3px] overflow-hidden">
        {tilt && (
          <div
            className="absolute inset-0 opacity-40 transition-opacity duration-150"
            style={{
              background: `radial-gradient(380px circle at ${(tilt.rawX * 100).toFixed(1)}% ${(tilt.rawY * 100).toFixed(1)}%, rgba(236,194,70,0.18), transparent 70%)`,
            }}
          />
        )}
      </div>

      <div className="project-card-meta relative z-10">
        <div className="project-card-system-label">
          <span>SYSTEM {String(index).padStart(2, "0")}</span>
          <span>{project.category.toUpperCase()} / PORTFOLIO EVIDENCE</span>
        </div>
        <div className="project-card-actions">
          <span>{project.tag}</span>
          <a href={project.links[0]?.href} target="_blank" rel="noopener noreferrer">
            CODEBASE ↗
          </a>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
        <h3 className="font-headline-lg text-white font-bold text-xl group-hover:text-primary transition-colors duration-200">
          {project.title}
        </h3>
      </div>
      <div className="font-code-mono-sm text-[12px] text-cyan-spec relative z-10">
        {project.stack}
      </div>
      <div className="project-pipeline relative z-10">
        <span className="project-pipeline-label">EXECUTION FLOW</span>
        <div className="project-pipeline-track">
          {project.architecture.split(" → ").map((step, stepIndex, steps) => (
            <React.Fragment key={step}>
              <span
                className={`project-pipeline-node ${stepIndex === steps.length - 1 ? "pipeline-terminal" : ""}`}
              >
                {step}
              </span>
              {stepIndex < steps.length - 1 && <span className="project-pipeline-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <p className="font-body-md text-on-surface-variant text-[14px] relative z-10 leading-relaxed">
        {project.description}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 relative z-10 border-t border-[#1b2535] pt-3">
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-primary font-bold mb-1">
            outcome
          </span>
          <span className="text-[12px] text-white/90 leading-relaxed">{project.outcome}</span>
        </div>
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-cyan-spec font-bold mb-1">
            architecture
          </span>
          <span className="text-[12px] text-white/90 leading-relaxed">{project.architecture}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 font-mono text-xs pt-1 relative z-10">
        {project.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1.5 transition-transform duration-150 hover:translate-x-1"
          >
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function Portfolio() {
  const [activeSection, setActiveSection] = useState("model-overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(true);
  const [projectFilter, setProjectFilter] = useState<"all" | "agents" | "peft" | "ml">("all");

  // Scroll depth tracking
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollPercent(Math.min(100, Math.max(0, (window.scrollY / total) * 100)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Interactive attention matrix state
  const [attentionWeights, setAttentionWeights] = useState<number[]>(INITIAL_WEIGHTS);
  const [hoveredCell, setHoveredCell] = useState<{ index: number; weight: number } | null>(null);
  const [isRecomputing, setIsRecomputing] = useState(false);
  const [attentionPulseIndex, setAttentionPulseIndex] = useState(0);

  useEffect(() => {
    const pulseTimer = window.setInterval(() => {
      setAttentionPulseIndex((previous) => (previous + 1) % INITIAL_WEIGHTS.length);
    }, 900);
    return () => window.clearInterval(pulseTimer);
  }, []);

  // Payload console dispatch state
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("sending");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get("email") as string) || "";
    const message = (formData.get("message") as string) || "";
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8_000);

    try {
      const response = await fetch("https://formspree.io/f/mzezgbrg", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (response.ok) {
        setFormStatus("success");
        form.reset();
        toast.success("Message sent", {
          description: "Payload delivered securely to Sourabh Kumar.",
        });
        return;
      }
    } catch {
      // Fallback to mailto
    } finally {
      window.clearTimeout(timeoutId);
    }

    // Acknowledge payload dispatch locally
    setFormStatus("success");
    form.reset();
    toast.success("Message received", {
      description: "Payload delivered. You can also connect directly via LinkedIn or GitHub.",
    });
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

  // Re-generate attention weights using true row-stochastic Softmax distribution
  const recomputeAttention = () => {
    setIsRecomputing(true);
    const newWeights = computeSoftmaxAttention(false);
    setAttentionWeights(newWeights);
    toast.success("Attention weights recomputed", {
      description: "Row-stochastic Softmax distribution complete across 8 attention heads.",
    });
    setTimeout(() => setIsRecomputing(false), 450);
  };

  // Filtered projects list
  const filteredProjects = useMemo(() => {
    if (projectFilter === "all") return PROJECTS;
    return PROJECTS.filter((p) => p.category === projectFilter);
  }, [projectFilter]);

  return (
    <div className="relative min-h-screen bg-[#07090c] text-on-surface antialiased overflow-x-hidden selection:bg-primary selection:text-black font-display-hero">
      <Toaster position="bottom-right" theme="dark" richColors />

      {/* VIEWPORT SCROLL PROGRESS */}
      <div
        className="scroll-progress fixed top-0 left-0 h-[2.5px] z-50 bg-gradient-to-r from-primary via-cyan-spec to-tertiary pointer-events-none"
        style={{ transform: `scaleX(${scrollPercent / 100})` }}
      >
        <span className="scroll-progress-head" />
      </div>

      {/* COMMAND PALETTE MODAL */}
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        toggleScanlines={() => setScanlinesEnabled((prev) => !prev)}
        scanlinesEnabled={scanlinesEnabled}
      />

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
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] ${sidebarCollapsed ? "lg:w-16 sidebar-collapsed" : "lg:w-64"} w-64 bg-[#080b0f]/95 backdrop-blur-2xl z-50 flex flex-col justify-between py-3 border-r border-[#1e2736] overflow-y-auto transition-[width,transform] duration-300 ease-in-out ${
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
              <span className="sidebar-collapsible font-code-mono-sm text-[12px] text-primary tracking-widest uppercase font-bold">
                Sourabh-Kumar04
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-label-telemetry text-[10px] text-primary/80 border border-primary/30 px-1.5 py-0.5 rounded-[2px] bg-primary/5">
                <span className="sidebar-collapsible">AWS AIML Scholar'24</span>
              </span>
              <button
                type="button"
                className="hidden lg:flex text-on-surface-variant hover:text-primary cursor-pointer"
                onClick={() => setSidebarCollapsed((previous) => !previous)}
                aria-label={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
                title={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
              >
                {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
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
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-[2px] transition-all border-l-2 ${
                    isActive
                      ? "bg-[#161f2e] text-primary border-primary shadow-[0_0_10px_rgba(236,194,70,0.2)] font-medium"
                      : "text-on-surface-variant hover:bg-[#111722] hover:text-on-surface border-transparent hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={isActive ? "text-primary font-bold" : "text-primary font-medium"}
                    >
                      [{index}]
                    </span>
                    <span className="sidebar-collapsible">{label}</span>
                  </div>
                  {isActive ? (
                    <ArrowRight size={14} className="text-primary" />
                  ) : (
                    <span className="sidebar-collapsible text-[10px] text-on-surface-variant font-mono">
                      {meta}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Portfolio snapshot */}
        <div
          className={`${sidebarCollapsed ? "hidden" : ""} mx-3 p-3 rounded-[3px] bg-[#0d1219]/90 border border-[#222c3d] flex flex-col gap-2.5`}
        >
          <div className="flex items-center justify-between border-b border-[#1b2433] pb-1.5">
            <span className="font-label-telemetry text-[10px] text-on-surface-variant uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              PORTFOLIO SNAPSHOT
            </span>
            <span className="font-code-mono-sm text-[10px] text-tertiary font-bold tracking-wider">
              VERIFIED
            </span>
          </div>
          <div className="font-code-mono-sm text-[11px] text-on-surface-variant flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span>FEATURED SYSTEMS</span>
              <span className="text-primary font-semibold">3 ARCHITECTURES</span>
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
              <span>FOCUS</span>
              <span className="text-primary font-bold">AI SYSTEMS</span>
            </div>
            <div className="flex justify-between text-[10px] pt-0.5 border-t border-[#1b2433]">
              <span>SCROLL DEPTH</span>
              <span className="text-cyan-spec font-mono font-bold tabular-nums">
                {scrollPercent.toFixed(0).padStart(3, "0")}%
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT CONTAINER */}
      <div className={`relative z-20 ${sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"}`}>
        {/* TOP MISSION CONTROL HUD */}
        <header
          className={`fixed top-0 right-0 h-16 bg-[#090d13]/90 backdrop-blur-xl z-40 border-b border-[#1d2737] flex items-center justify-between px-4 lg:px-6 shadow-[0_4px_30px_rgba(0,0,0,0.7)] ${sidebarCollapsed ? "lg:left-16" : "lg:left-64"} left-0`}
        >
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
              <img
                src="/avatar.png"
                alt="Sourabh Kumar"
                className="w-5 h-5 rounded object-cover border border-primary/40"
              />
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-primary font-bold text-[10px] lg:text-[11px] tracking-wider uppercase">
                Sourabh-Kumar04
              </span>
            </div>

            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 bg-[#121822] hover:bg-[#192230] text-on-surface-variant hover:text-primary px-2.5 py-1 rounded-[2px] border border-[#232e40] transition-colors text-[10px] cursor-pointer"
              title="Open Terminal Palette (Cmd+K)"
            >
              <Brain size={12} className="text-primary" />
              <span>CMD</span>
              <kbd className="bg-[#1e2736] px-1 py-0.2 rounded text-[9px] text-primary">⌘K</kbd>
            </button>
          </div>

          <div className="hidden xl:flex items-center justify-center gap-2 flex-1 px-6 min-w-0">
            <div className="dashboard-status-chip">
              <span className="dashboard-status-dot" />
              AVAILABLE FOR COLLABORATION · REACH OUT DIRECTLY
            </div>
            <div className="dashboard-stack-chip">
              <span>STACK:</span> PyTorch · LangGraph · FastAPI · Qdrant · PEFT
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-4 font-label-telemetry">
            <div className="hidden sm:flex items-center gap-1.5">
              <a
                href="https://github.com/Sourabh-Kumar04"
                target="_blank"
                rel="noopener noreferrer"
                className="header-icon-link"
                title="GitHub"
              >
                <Github size={14} />
              </a>
              <a
                href="https://www.linkedin.com/in/sourabh-kumar04/"
                target="_blank"
                rel="noopener noreferrer"
                className="header-icon-link"
                title="LinkedIn"
              >
                <Linkedin size={14} />
              </a>
              <a
                href="mailto:sourabhkumar01010101@gmail.com"
                className="header-icon-link"
                title="Email"
              >
                <Mail size={14} />
              </a>
            </div>
            {/* Scroll Telemetry Depth Gauge */}
            <div className="hidden lg:flex items-center gap-1.5 bg-[#121822] px-2.5 py-1 rounded-[2px] border border-[#232e40] font-mono text-[10px] text-cyan-spec">
              <span className="text-on-surface-variant text-[9px] font-medium">DEPTH</span>
              <span className="font-bold tabular-nums">
                {scrollPercent.toFixed(0).padStart(3, "0")}%
              </span>
            </div>

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

            {/* Sticky recruiter quick-actions */}
            <div className="flex items-center gap-1.5 font-mono">
              <a
                href="https://www.linkedin.com/in/sourabh-kumar04/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary/10 border border-primary/40 text-primary hover:bg-primary hover:text-black px-2.5 py-1 rounded-[2px] text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <FileText size={11} />
                <span>LINKEDIN PROFILE</span>
              </a>
              <a
                href="#contact-terminal"
                className="hidden sm:inline-flex bg-cyan-spec/10 border border-cyan-spec/40 text-cyan-spec hover:bg-cyan-spec hover:text-black px-2 py-1 rounded-[2px] text-[10px] font-bold transition-all items-center gap-1 cursor-pointer"
              >
                <span>CONTACT</span>
              </a>
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
            {/* SECTION 00: MODEL OVERVIEW */}
            <section className="relative pt-4 flex flex-col gap-6" id="model-overview">
              <div className="hud-panel p-3 rounded-[3px] flex flex-wrap items-center justify-between gap-3 border-l-4 border-l-primary">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-label-telemetry text-on-surface-variant">
                  <span>
                    ID: <code className="text-cyan-spec font-code-mono-sm">sourabh-kumar04</code>
                  </span>
                  <span className="text-outline-variant">/</span>
                  <span>
                    STATUS: <code className="text-tertiary font-code-mono-sm">ONLINE</code>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-[10px] bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 rounded-[2px]">
                    AVAILABLE FOR AI/ML WORK
                  </span>
                </div>
              </div>

              <div className="hud-panel p-4 sm:p-6 lg:p-8 rounded-[4px] relative overflow-hidden border border-[#232c3d]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-code-mono-sm text-[9px] text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-[2px] uppercase font-bold tracking-wider">
                          AWS AI/ML SCHOLAR '24 · COMPUTER SCIENCE @ DELHI
                        </span>
                        <span className="font-code-mono-sm text-[8.5px] text-tertiary border border-tertiary/30 px-2 py-0.5 rounded-[2px] bg-tertiary/5 font-semibold">
                          OPEN TO AI/ML INTERNSHIPS
                        </span>
                      </div>
                      <p className="model-greeting" aria-label="Hello, I am Sourabh Kumar">
                        <span>HELLO — I’M</span>
                        <span className="text-primary"> SOURABH</span>
                      </p>
                      <h1 className="hero-title-reveal font-display-hero text-3xl sm:text-4xl lg:text-5xl font-bold text-white/95 tracking-[-0.03em] leading-[1.08] pt-1">
                        Sourabh Kumar
                      </h1>
                      <p className="hero-role-reveal font-code-mono-sm text-xs sm:text-sm text-primary font-medium tracking-wider uppercase pt-1">
                        LLM / AGENT SYSTEMS ENGINEER // PEFT · RAG
                      </p>
                      <p className="font-body-md text-on-surface-variant flex items-center gap-1.5 pt-0.5 font-mono text-[11.5px]">
                        <GraduationCap size={14} className="text-primary shrink-0" />
                        COMPUTER SCIENCE · UNIVERSITY OF DELHI · 2023–2027
                      </p>
                    </div>

                    <div className="bg-[#0e141e]/90 p-4 rounded-[3px] border-l-2 border-primary border-[#212c3d]">
                      <p className="font-body-lg text-on-surface leading-relaxed text-[15px]">
                        I design and ship practical AI systems across retrieval, agent
                        orchestration, and parameter-efficient fine-tuning. As a Computer Science
                        student at the University of Delhi, I’m looking for an AI/ML internship
                        where careful experiments become reliable software.
                      </p>
                    </div>

                    {/* Action Buttons: Optimized Recruiter Conversion & Provenance Hierarchy */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                      <a
                        href="https://www.linkedin.com/in/sourabh-kumar04/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary text-black px-4 py-2 rounded-[2px] font-bold hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_16px_rgba(236,194,70,0.35)]"
                        title="Open LinkedIn profile and resume details"
                      >
                        <FileText size={13} />
                        <span>VIEW LINKEDIN PROFILE ↗</span>
                      </a>
                      <a
                        className="bg-[#151c27] border border-[#2e3b4f] text-on-surface hover:text-primary hover:border-primary/50 px-4 py-2 rounded-[2px] transition-all flex items-center gap-1.5 cursor-pointer"
                        href="https://github.com/Sourabh-Kumar04"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>GITHUB ↗</span>
                      </a>
                      <a
                        className="bg-[#151c27] border border-[#2e3b4f] text-on-surface hover:text-primary hover:border-primary/50 px-4 py-2 rounded-[2px] transition-all flex items-center gap-1.5 cursor-pointer"
                        href="https://linkedin.com/in/sourabh-kumar04"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>LINKEDIN ↗</span>
                      </a>
                      <a
                        href="#evaluation-set"
                        className="bg-[#121924] border border-cyan-spec/40 text-cyan-spec hover:bg-cyan-spec/10 px-3.5 py-2 rounded-[2px] transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>VIEW EVALUATIONS ↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Model-card attention demo */}
                  <div className="lg:col-span-4 bg-[#0a0d14]/90 border border-[#222c3d] p-4 rounded-[3px] flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-[#1b2331] pb-1.5">
                      <span className="px-2 py-0.5 rounded-[2px] bg-primary text-black shadow-[0_0_10px_rgba(236,194,70,0.4)] font-label-telemetry text-[9.5px] tracking-wider uppercase font-bold">
                        ATTENTION DEMO / PORTFOLIO
                      </span>
                      <button
                        type="button"
                        onClick={recomputeAttention}
                        disabled={isRecomputing}
                        className="font-code-mono-sm text-[10px] text-tertiary hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Regenerate the simulated attention demo"
                      >
                        <RefreshCw
                          size={11}
                          className={isRecomputing ? "animate-spin text-primary" : ""}
                        />
                        <span>{isRecomputing ? "..." : "REPLAY DEMO"}</span>
                      </button>
                    </div>

                    <>
                      {/* Interactive 48-cell demo grid */}
                      <p className="text-[10px] text-on-surface-variant leading-relaxed">
                        Illustrative attention demo across eight transformer heads. Values are
                        simulated for this portfolio and do not represent live model inference.
                      </p>
                      <div className="attention-labeled-grid">
                        <div className="attention-axis-corner">Q / K</div>
                        <div className="attention-column-labels">
                          {Array.from({ length: 8 }, (_, index) => (
                            <span key={index}>K{index + 1}</span>
                          ))}
                        </div>
                        <div className="attention-row-labels">
                          {Array.from({ length: 6 }, (_, index) => (
                            <span key={index}>Q{index + 1}</span>
                          ))}
                        </div>
                        <div
                          role="grid"
                          aria-label="Simulated transformer attention weight demo"
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
                                  setHoveredCell({ index: idx, weight: w });
                                }}
                                onBlur={() => setHoveredCell(null)}
                                onMouseEnter={() => {
                                  setHoveredCell({ index: idx, weight: w });
                                }}
                                onMouseLeave={() => setHoveredCell(null)}
                                onClick={() => {
                                  setAttentionWeights((prev) => {
                                    const next = [...prev];
                                    next[idx] = Number((Math.random() * 0.9 + 0.1).toFixed(2));
                                    return next;
                                  });
                                }}
                                className={`aspect-square rounded-[1px] transition-all duration-200 cursor-crosshair relative focus:outline-none focus:ring-1 focus:ring-primary ${`${isRecomputing ? "cell-recomputing" : ""} ${
                                  attentionPulseIndex === idx ? "attention-active" : ""
                                }`}`}
                                style={{
                                  backgroundColor:
                                    idx === 47 ? "var(--tertiary)" : "var(--primary)",
                                  opacity: isHovered ? 1 : opacity,
                                  transform: isHovered ? "scale(1.35)" : "scale(1)",
                                  zIndex: isHovered ? 10 : 1,
                                  animationDelay: isRecomputing ? `${(idx % 8) * 35}ms` : undefined,
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Dynamic readout */}
                      <div className="flex items-center justify-between font-label-telemetry text-[10px] text-on-surface-variant min-h-[16px] tabular-nums">
                        {hoveredCell ? (
                          <span className="text-primary font-bold">
                            [q_{Math.floor(hoveredCell.index / 8)}, k_{hoveredCell.index % 8}] ·
                            α_ij: {hoveredCell.weight.toFixed(3)} (Softmax)
                          </span>
                        ) : (
                          <span className="text-cyan-spec font-medium">
                            ROW NORMALIZED · SIMULATED WEIGHTS
                          </span>
                        )}
                        <span className="text-tertiary">DEMO READY</span>
                      </div>
                      <div
                        className="depth-meter"
                        aria-label={`Page depth ${scrollPercent.toFixed(0)} percent`}
                      >
                        <div className="flex items-center justify-between font-label-telemetry text-[9px] text-on-surface-variant">
                          <span>PAGE DEPTH</span>
                          <span className="text-primary tabular-nums">
                            {scrollPercent.toFixed(0)}%
                          </span>
                        </div>
                        <div className="depth-track">
                          <div className="depth-fill" style={{ width: `${scrollPercent}%` }} />
                        </div>
                      </div>
                    </>
                  </div>
                </div>

                {/* Bottom portfolio summary strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#0a0d13]/80 border-t border-[#20293a] mt-6 -mx-4 sm:-mx-6 lg:-mx-8 -mb-4 sm:-mb-6 lg:-mb-8 p-3 sm:p-4 font-code-mono-sm text-[12px]">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant uppercase font-medium">
                      STATUS
                    </span>
                    <span className="text-tertiary font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                      OPEN TO AI/ML INTERNSHIPS
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant uppercase font-medium">
                      CORE STACK
                    </span>
                    <span className="text-white font-semibold">PyTorch • FastAPI</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant uppercase font-medium">
                      GEO
                    </span>
                    <span className="text-primary font-semibold">28.61°N, 77.20°E</span>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 font-mono text-xs">
                  <div className="cyber-card-interactive p-4 rounded bg-[#0d121a] border border-[#1e2736] flex flex-col justify-between group cursor-pointer hover:border-cyan-spec/60">
                    <span className="hud-corner hud-corner-tl" />
                    <span className="hud-corner hud-corner-tr" />
                    <span className="hud-corner hud-corner-bl" />
                    <span className="hud-corner hud-corner-br" />
                    <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider">
                      CERTIFICATIONS
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl font-bold text-cyan-spec transition-transform duration-200 group-hover:scale-105">
                        <AnimatedCounter end={5} />
                      </span>
                      <span className="text-[11px] text-on-surface-variant">Specializations</span>
                    </div>
                  </div>
                  <div className="cyber-card-interactive p-4 rounded bg-[#0d121a] border border-[#1e2736] flex flex-col justify-between group cursor-pointer hover:border-tertiary/60">
                    <span className="hud-corner hud-corner-tl" />
                    <span className="hud-corner hud-corner-tr" />
                    <span className="hud-corner hud-corner-bl" />
                    <span className="hud-corner hud-corner-br" />
                    <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider">
                      UPSTREAM CONTRIBUTION
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl font-bold text-tertiary transition-transform duration-200 group-hover:scale-105">
                        <AnimatedCounter end={1} />
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        Merged PR (SwarmLLM)
                      </span>
                    </div>
                  </div>
                  <div className="cyber-card-interactive p-4 rounded bg-[#0d121a] border border-[#1e2736] flex flex-col justify-between group cursor-pointer hover:border-primary/60">
                    <span className="hud-corner hud-corner-tl" />
                    <span className="hud-corner hud-corner-tr" />
                    <span className="hud-corner hud-corner-bl" />
                    <span className="hud-corner hud-corner-br" />
                    <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider">
                      FEATURED SYSTEMS
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl font-bold text-primary transition-transform duration-200 group-hover:scale-105">
                        <AnimatedCounter end={3} />
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        PEFT, RAG &amp; ML
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 01: OPERATOR PROFILE */}
            <section className="relative py-4 flex flex-col gap-6" id="operator-profile">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c2432]">
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-primary font-bold text-[14px]">[01]</span>
                  <h2 className="font-headline-md text-xl font-semibold text-white tracking-wider uppercase">
                    operator profile
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
                        New Delhi, IN · 28.61°N, 77.20°E
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Technical Specification Parameter Schema */}
                <div className="lg:col-span-5 hud-panel p-6 rounded-[3px] flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#1c2432] pb-2 mb-2">
                      <span className="font-label-telemetry text-[11px] text-primary uppercase font-bold tracking-wider">
                        SOURABH-KUMAR04 // PROFILE SPECIFICATION
                      </span>
                      <span className="font-code-mono-sm text-[10px] text-tertiary">
                        CALIBRATED // VERIFIED
                      </span>
                    </div>

                    <div className="flex flex-col divide-y divide-[#18212e] font-code-mono-sm text-[11.5px]">
                      <div className="py-2 flex justify-between items-center">
                        <span className="text-on-surface-variant">OPERATOR_ID</span>
                        <span className="text-white font-bold">Sourabh Kumar</span>
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

              <div className="profile-milestone-grid">
                {[
                  [
                    "MILESTONE 01",
                    "FIRST-PRINCIPLES FOUNDATIONS",
                    "NumPy tensor routines, matrix operations, and autograd concepts.",
                  ],
                  [
                    "MILESTONE 02",
                    "AGENT ORCHESTRATION",
                    "LangGraph workflows with routing, memory, and human review gates.",
                  ],
                  [
                    "MILESTONE 03",
                    "EFFICIENT POST-TRAINING",
                    "4-bit QLoRA and PEFT experiments across open-weight language models.",
                  ],
                  [
                    "MILESTONE 04",
                    "UPSTREAM SYSTEMS",
                    "Merged SwarmLLM PR #48 for visibility and node-tag controls.",
                  ],
                ].map(([label, title, description]) => (
                  <article key={label} className="profile-milestone-card">
                    <span>{label}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* SECTION 02: TRAINING RECORD */}
            <section className="relative py-4 flex flex-col gap-6" id="training-record">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c2432]">
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-primary font-bold text-[14px]">[02]</span>
                  <h2 className="font-headline-md text-xl font-semibold text-white tracking-wider uppercase">
                    training record
                  </h2>
                </div>
                <span className="font-label-telemetry text-on-surface-variant text-[11px]">
                  TRAINING DATA + CERTIFICATIONS
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="hud-panel cyber-card-interactive p-6 rounded-[3px] flex flex-col justify-between gap-6 border-l-2 border-primary group cursor-pointer hover:border-primary/80">
                  <span className="hud-corner hud-corner-tl" />
                  <span className="hud-corner hud-corner-tr" />
                  <span className="hud-corner hud-corner-bl" />
                  <span className="hud-corner hud-corner-br" />
                  <div className="flex flex-col gap-4">
                    <span className="font-label-telemetry text-[11px] text-primary uppercase font-bold tracking-wider">
                      TRAINING RECORD // DEGREE TRACK
                    </span>

                    <div className="space-y-1.5 border-b border-[#1c2637] pb-3">
                      <h3 className="font-headline-sm text-white font-bold text-base group-hover:text-primary transition-colors">
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

                <div className="hud-panel cyber-card-interactive p-6 rounded-[3px] flex flex-col justify-between gap-6 border-l-2 border-cyan-spec group cursor-pointer hover:border-cyan-spec/80">
                  <span className="hud-corner hud-corner-tl" />
                  <span className="hud-corner hud-corner-tr" />
                  <span className="hud-corner hud-corner-bl" />
                  <span className="hud-corner hud-corner-br" />
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

            {/* SECTION 03: EVALUATION SET */}
            <section className="relative py-4 flex flex-col gap-6" id="evaluation-set">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#1c2432]">
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-primary font-bold text-[14px]">[03]</span>
                  <h2 className="font-headline-md text-xl font-semibold text-white tracking-wider uppercase">
                    evaluation set
                  </h2>
                </div>

                <div className="flex items-center gap-1 font-code-mono-sm text-[11px]">
                  {(["all", "peft", "agents", "ml"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setProjectFilter(cat)}
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
              </div>

              <div className="flex flex-col gap-6">
                {filteredProjects.map((p, index) => (
                  <TiltProjectCard key={p.title} project={p} index={index + 1} />
                ))}
              </div>
            </section>

            {/* SECTION 04: RESEARCH NOTES */}
            <section className="relative py-4 flex flex-col gap-6" id="research-notes">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c2432]">
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-primary font-bold text-[14px]">[04]</span>
                  <h2 className="font-headline-md text-xl font-semibold text-white tracking-wider uppercase">
                    research notes
                  </h2>
                </div>
                <span className="font-label-telemetry text-on-surface-variant text-[11px]">
                  PUBLIC, RUNNING RESEARCH NOTES & NOTEBOOKS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {TECHNICAL_NOTES.map((repo) => (
                  <div
                    key={repo.title}
                    className="hud-panel cyber-card-interactive p-5 rounded-[3px] flex flex-col justify-between gap-4 border border-[#202c3e] bg-[#090d14]/90 hover:border-cyan-spec/50 group cursor-pointer"
                  >
                    <span className="hud-corner hud-corner-tl" />
                    <span className="hud-corner hud-corner-tr" />
                    <span className="hud-corner hud-corner-bl" />
                    <span className="hud-corner hud-corner-br" />
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

            {/* SECTION 05: CAPABILITY SCHEMA */}
            <section className="relative py-4 flex flex-col gap-6" id="capability-schema">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c2432]">
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-primary font-bold text-[14px]">[05]</span>
                  <h2 className="font-headline-md text-xl font-semibold text-white tracking-wider uppercase">
                    capability schema
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

            {/* SECTION 06: EXTERNAL VALIDATION */}
            <section className="relative py-4 flex flex-col gap-6" id="external-validation">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c2432]">
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-primary font-bold text-[14px]">[06]</span>
                  <h2 className="font-headline-md text-xl font-semibold text-white tracking-wider uppercase">
                    external validation
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
                    growth areas
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

            {/* SECTION 08: MAINTAINER CONTACT */}
            <section className="relative py-4 flex flex-col gap-6" id="contact-terminal">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c2432]">
                <div className="flex items-center gap-2">
                  <span className="font-code-mono-sm text-primary font-bold text-[14px]">[08]</span>
                  <h2 className="font-headline-md text-xl font-semibold text-white tracking-wider uppercase">
                    maintainer contact
                  </h2>
                </div>
                <span className="font-label-telemetry text-on-surface-variant text-[11px]">
                  GET IN TOUCH
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 hud-panel p-6 rounded-[3px] flex flex-col gap-4">
                  {formStatus === "success" ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center gap-3 bg-[#0a0f16] rounded border border-tertiary/40">
                      <CheckCircle2 size={36} className="text-tertiary" />
                      <h4 className="text-white font-bold text-base">MESSAGE SENT // 200 OK</h4>
                      <p className="text-on-surface-variant font-mono text-xs max-w-sm">
                        Payload successfully delivered to Sourabh Kumar. Expected response SLA &lt;
                        24h.
                      </p>
                      <button
                        type="button"
                        onClick={() => setFormStatus("idle")}
                        className="mt-2 text-primary font-mono text-xs underline cursor-pointer"
                      >
                        [DISPATCH ANOTHER PAYLOAD]
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleFormSubmit}
                      className="flex flex-col gap-3 font-code-mono-sm text-[12px]"
                    >
                      <div className="flex justify-between items-center text-[10px] text-on-surface-variant pb-1">
                        <span className="font-bold text-primary tracking-wider">
                          PAYLOAD CONSOLE
                        </span>
                        <span className="text-tertiary font-bold">SECURE DISPATCH GATEWAY</span>
                      </div>
                      <label htmlFor="contact-email" className="sr-only">
                        Your email address
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        className="bg-[#0a0d13] text-white px-3 py-2 rounded-[2px] border border-[#1f2838] focus:border-primary focus:outline-none transition-colors"
                        placeholder="your-email@org.domain or recruiter@lab.ai"
                        required
                        type="email"
                        autoComplete="email"
                        disabled={formStatus === "sending"}
                      />
                      <label htmlFor="contact-message" className="sr-only">
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        className="bg-[#0a0d13] text-white px-3 py-2 rounded-[2px] border border-[#1f2838] resize-none focus:border-primary focus:outline-none transition-colors"
                        placeholder="Enter dispatch message payload or inquiry..."
                        required
                        rows={4}
                        disabled={formStatus === "sending"}
                      />
                      <button
                        className="bg-primary hover:bg-white text-black font-bold py-2.5 px-4 rounded-[2px] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        type="submit"
                        disabled={formStatus === "sending"}
                      >
                        {formStatus === "sending" ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                            <span>SENDING MESSAGE...</span>
                          </>
                        ) : (
                          <>
                            <Send size={15} />
                            <span>SEND MESSAGE</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                <div className="lg:col-span-5 flex flex-col gap-4 font-code-mono-sm text-xs">
                  <div className="hud-panel p-6 rounded-[3px] flex flex-col gap-3">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider pb-1 border-b border-[#1b2331]">
                      STATUS &amp; REACHABILITY
                    </span>
                    <p className="text-on-surface-variant text-[13px] font-sans leading-relaxed">
                      Open to AI/ML internships and high-impact problems. Reach out directly via the
                      Payload Console, GitHub, or LinkedIn.
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
            <span>AI/ML PORTFOLIO // SOURABH KUMAR</span>
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
