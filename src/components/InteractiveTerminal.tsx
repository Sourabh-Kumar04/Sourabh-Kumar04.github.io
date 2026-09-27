import React, { useState, useRef, useEffect } from "react";
import {
  Terminal as TerminalIcon,
  X,
  Maximize2,
  Minimize2,
  CornerDownLeft,
  Sparkles,
} from "lucide-react";
import { audioTelemetry } from "../lib/audio-telemetry";

interface InteractiveTerminalProps {
  open: boolean;
  onClose: () => void;
  onRecomputeAttention?: () => void;
}

interface CommandHistoryEntry {
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export function InteractiveTerminal({
  open,
  onClose,
  onRecomputeAttention,
}: InteractiveTerminalProps) {
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<CommandHistoryEntry[]>([
    {
      command: "init --node SK-04",
      timestamp: "00:00:01",
      output: (
        <div className="text-on-surface-variant space-y-1">
          <p className="text-primary font-bold">SK-04 KERNEL SHELL v4.1.0-TELEMETRY</p>
          <p>Autonomous ML & Quantum Inference Node initialized.</p>
          <p>
            Type <span className="text-primary font-semibold">help</span> to view available
            operations, or try <span className="text-cyan-spec font-semibold">eval</span> or{" "}
            <span className="text-tertiary font-semibold">vram</span>.
          </p>
        </div>
      ),
    },
  ]);
  const [commandIndex, setCommandIndex] = useState<number>(-1);
  const [commandList, setCommandList] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeRef.current();
      }
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, input, a[href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable?.length) {
          const first = focusable[0]!;
          const last = focusable[focusable.length - 1]!;
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocusedRef.current?.focus();
      clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  if (!open) return null;

  const getTimestamp = (): string => {
    const d = new Date();
    return d.toTimeString().split(" ")[0] ?? "00:00:00";
  };

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    audioTelemetry.playBeep();
    const parts = trimmed.split(" ");
    const cmd = (parts[0] ?? "").toLowerCase();
    const args = parts.slice(1);

    setCommandList((prev) => [...prev, trimmed]);
    setCommandIndex(-1);

    let outputNode: React.ReactNode = null;

    switch (cmd) {
      case "help":
        outputNode = (
          <div className="space-y-1 text-on-surface-variant">
            <p className="text-white font-semibold">AVAILABLE TELEMETRY COMMANDS:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs pt-1">
              <div>
                <span className="text-primary font-bold">eval</span>: Run benchmark evaluation for
                RasoSynthTune
              </div>
              <div>
                <span className="text-primary font-bold">vram</span>: Inspect VRAM allocation
                formula
              </div>
              <div>
                <span className="text-primary font-bold">skills</span>: List core AI/ML stack
                capabilities
              </div>
              <div>
                <span className="text-primary font-bold">repos</span>: Output major repositories
                with URLs
              </div>
              <div>
                <span className="text-primary font-bold">matrix</span>: Recompute neural attention
                matrix
              </div>
              <div>
                <span className="text-primary font-bold">contact</span>: Show direct maintainer
                endpoints
              </div>
              <div>
                <span className="text-primary font-bold">clear</span>: Clear terminal console buffer
              </div>
              <div>
                <span className="text-primary font-bold">exit</span>: Close this terminal instance
              </div>
            </div>
          </div>
        );
        break;

      case "eval":
        outputNode = (
          <div className="space-y-1 font-mono text-xs border border-primary/20 bg-primary/5 p-2.5 rounded-[2px]">
            <p className="text-primary font-bold">== SOTA BENCHMARK EVALUATION LOG ==</p>
            <p className="text-white">
              Target Model:{" "}
              <span className="text-cyan-spec">Llama-3-8B-Instruct + LoRA (r=16, alpha=32)</span>
            </p>
            <p className="text-on-surface-variant">
              Pipeline: RasoSynthTune Multi-Agent Filtering & Human-in-the-Loop
            </p>
            <div className="grid grid-cols-2 gap-2 my-1 text-[11px]">
              <div className="bg-[#121822] p-1.5 border border-[#232e40]">
                <span className="text-on-surface-variant">GSM8K Accuracy:</span>{" "}
                <span className="text-tertiary font-bold">81.4%</span>{" "}
                <span className="text-primary">(+13.2% vs zero-shot)</span>
              </div>
              <div className="bg-[#121822] p-1.5 border border-[#232e40]">
                <span className="text-on-surface-variant">Perplexity (PPL):</span>{" "}
                <span className="text-tertiary font-bold">4.12</span>
              </div>
              <div className="bg-[#121822] p-1.5 border border-[#232e40]">
                <span className="text-on-surface-variant">Inference Latency:</span>{" "}
                <span className="text-cyan-spec font-bold">14.8 ms/token</span>
              </div>
              <div className="bg-[#121822] p-1.5 border border-[#232e40]">
                <span className="text-on-surface-variant">Trainable Parameters:</span>{" "}
                <span className="text-primary font-bold">0.18% (13.6M / 8.03B)</span>
              </div>
            </div>
            <p className="text-tertiary flex items-center gap-1">
              <Sparkles size={12} /> Status: CONVERGED · Loss 0.428 after 3 Epochs
            </p>
          </div>
        );
        break;

      case "vram":
        outputNode = (
          <div className="space-y-1 font-mono text-xs">
            <p className="text-cyan-spec font-bold">VRAM ALLOCATION TELEMETRY FORMULA:</p>
            <p className="text-on-surface-variant">
              Memory = (Params × Precision_Bytes) + Optimizer + Activations + KV_Cache
            </p>
            <div className="bg-[#101622] p-2 rounded-[2px] border border-[#202b3c] my-1 space-y-0.5 text-[11px]">
              <p>
                • 8B Model (4-bit NF4 QLoRA): <span className="text-primary">5.2 GB Base</span> +{" "}
                <span className="text-tertiary">0.8 GB LoRA</span> ={" "}
                <span className="text-white font-bold">~6.0 GB VRAM</span>
              </p>
              <p>
                • 8B Model (FP16 full precision): <span className="text-primary">16.0 GB Base</span>{" "}
                + <span className="text-error">64.0 GB Optimizer (AdamW)</span> ={" "}
                <span className="text-white font-bold">~80 GB VRAM</span>
              </p>
              <p className="text-primary/80">
                Result: LoRA enables 8B fine-tuning on consumer RTX 3090/4090 GPUs.
              </p>
            </div>
          </div>
        );
        break;

      case "skills":
        outputNode = (
          <div className="space-y-1 font-mono text-xs text-on-surface-variant">
            <p className="text-white font-bold">SOURABH KUMAR — CORE CAPABILITY REGISTRY:</p>
            <p>
              <span className="text-primary font-semibold">[LLM / PEFT]:</span> LoRA, QLoRA,
              Axolotl, Unsloth, Hugging Face Transformers, vLLM
            </p>
            <p>
              <span className="text-cyan-spec font-semibold">[AGENTS & RAG]:</span> LangGraph,
              LangChain, Multi-Agent State-Machine DAGs, FAISS, Qdrant
            </p>
            <p>
              <span className="text-tertiary font-semibold">[ENGINEERING]:</span> Python, PyTorch,
              C++, FastAPI, Docker, Redis, PostgreSQL, Linux/Bash
            </p>
            <p>
              <span className="text-secondary font-semibold">[DISTRIBUTED]:</span> SwarmLLM WebGPU
              distributed inference, AWS SageMaker & EC2
            </p>
          </div>
        );
        break;

      case "repos":
        outputNode = (
          <div className="space-y-1.5 font-mono text-xs">
            <p className="text-primary font-bold">UPSTREAM & PRODUCTION REPOSITORIES:</p>
            <div className="space-y-1">
              <a
                href="https://github.com/Sourabh-Kumar04/RasoSynth_CUTC"
                target="_blank"
                rel="noreferrer"
                className="block text-white hover:text-primary transition-colors"
              >
                ➜ <span className="font-semibold underline">Sourabh-Kumar04/RasoSynth_CUTC</span> —
                Autonomous dataset discovery & LoRA fine-tuning
              </a>
              <a
                href="https://github.com/Sourabh-Kumar04/LangChain"
                target="_blank"
                rel="noreferrer"
                className="block text-white hover:text-primary transition-colors"
              >
                ➜ <span className="font-semibold underline">Sourabh-Kumar04/LangChain</span> —
                Production LangGraph agents & state machines
              </a>
              <a
                href="https://github.com/Nehanth/swarmllm/commit/c6f47f70968d44e57cc848e528d2e27a118dddda"
                target="_blank"
                rel="noreferrer"
                className="block text-white hover:text-primary transition-colors"
              >
                ➜ <span className="font-semibold underline">Nehanth/swarmllm (PR #48)</span> —
                Browser WebGPU distributed inference split
              </a>
              <a
                href="https://github.com/Sourabh-Kumar04/Dog_Breed_Classifier-"
                target="_blank"
                rel="noreferrer"
                className="block text-white hover:text-primary transition-colors"
              >
                ➜{" "}
                <span className="font-semibold underline">
                  Sourabh-Kumar04/Dog_Breed_Classifier-
                </span>{" "}
                — PyTorch transfer learning CNN
              </a>
            </div>
          </div>
        );
        break;

      case "matrix":
        if (onRecomputeAttention) {
          onRecomputeAttention();
          outputNode = (
            <p className="text-tertiary">
              Attention density matrix re-attended and weights synchronized across 8 heads.
            </p>
          );
        } else {
          outputNode = <p className="text-primary">Triggered attention re-pass.</p>;
        }
        break;

      case "contact":
        outputNode = (
          <div className="space-y-1 font-mono text-xs text-on-surface-variant">
            <p className="text-white font-bold">MAINTAINER TELEMETRY ENDPOINTS:</p>
            <p>
              Inference Dispatch:{" "}
              <span className="text-primary font-bold">Active via Web Console [08]</span>
            </p>
            <p>
              GitHub:{" "}
              <a
                href="https://github.com/Sourabh-Kumar04"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-spec hover:underline"
              >
                github.com/Sourabh-Kumar04
              </a>
            </p>
            <p>
              LinkedIn:{" "}
              <a
                href="https://linkedin.com/in/sourabh-kumar04"
                target="_blank"
                rel="noreferrer"
                className="text-tertiary hover:underline"
              >
                linkedin.com/in/sourabh-kumar04
              </a>
            </p>
            <p>
              Location: <span className="text-white">New Delhi, India (UTC +5:30)</span>
            </p>
          </div>
        );
        break;

      case "clear":
        setHistory([]);
        setInputVal("");
        return;

      case "exit":
      case "quit":
        onClose();
        return;

      default:
        outputNode = (
          <p className="text-error">
            Command not recognized: &quot;{trimmed}&quot;. Type{" "}
            <span className="underline font-bold text-white">help</span> for available commands.
          </p>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        command: trimmed,
        timestamp: getTimestamp(),
        output: outputNode,
      },
    ]);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandList.length === 0) return;
      const nextIdx = commandIndex === -1 ? commandList.length - 1 : Math.max(0, commandIndex - 1);
      setCommandIndex(nextIdx);
      setInputVal(commandList[nextIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandIndex === -1) return;
      const nextIdx = commandIndex + 1;
      if (nextIdx >= commandList.length) {
        setCommandIndex(-1);
        setInputVal("");
      } else {
        setCommandIndex(nextIdx);
        setInputVal(commandList[nextIdx] ?? "");
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="SK-04 Interactive Telemetry Shell"
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className={`w-full ${
          isExpanded ? "h-[90vh] max-w-5xl" : "h-[540px] max-w-3xl"
        } bg-[#080c12] border border-[#232f42] rounded-[3px] shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col font-mono text-xs overflow-hidden transition-all duration-200`}
      >
        {/* Terminal Title Bar */}
        <div className="h-9 bg-[#0e141e] border-b border-[#232f42] px-3 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="font-bold text-white tracking-wider flex items-center gap-1.5 text-[11px]">
              <TerminalIcon size={13} className="text-primary" />
              SK-04 // INTERACTIVE TELEMETRY SHELL
            </span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse terminal" : "Expand terminal"}
              className="p-1 hover:text-white hover:bg-white/5 rounded transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close telemetry shell"
              className="p-1 hover:text-error hover:bg-error/10 rounded transition-colors"
              title="Close (Esc)"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Terminal Content Buffer */}
        <div
          className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#080c12]/95 selection:bg-primary selection:text-black"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((entry, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <span className="text-[10px] text-on-surface-variant font-normal">
                  [{entry.timestamp}]
                </span>
                <span className="text-tertiary">sourabh@sk-2035</span>
                <span className="text-on-surface-variant">:~$</span>
                <span className="text-white">{entry.command}</span>
              </div>
              <div className="pl-4 border-l border-[#222c3d]">{entry.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Prompt Bar */}
        <div className="p-2.5 bg-[#0b1018] border-t border-[#1d2737] flex items-center gap-2">
          <div className="flex items-center gap-1 text-primary font-bold shrink-0">
            <span className="text-tertiary">sourabh@sk-2035</span>
            <span className="text-on-surface-variant">:~$</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help', 'eval', 'vram', 'skills', or 'clear'..."
            className="flex-1 bg-transparent text-white placeholder-on-surface-variant/40 outline-none border-none font-mono text-xs"
            autoFocus
          />
          <button
            onClick={() => handleCommand(inputVal)}
            className="px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-[2px] flex items-center gap-1 text-[11px] transition-colors"
          >
            EXEC <CornerDownLeft size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
