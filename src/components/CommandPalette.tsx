import {
  ArrowDown,
  BookOpen,
  Briefcase,
  Check,
  Code2,
  Copy,
  ExternalLink,
  Github,
  GraduationCap,
  Layers,
  Linkedin,
  Mail,
  Sparkles,
  Terminal,
  Tv,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectSection?: (id: string) => void;
  toggleScanlines?: () => void;
  scanlinesEnabled?: boolean;
}

const SECTION_ITEMS = [
  {
    id: "overview",
    label: "[00] OVERVIEW",
    icon: Terminal,
    desc: "Introduction, featured projects, and interactive AI visual",
  },
  {
    id: "model-details",
    label: "[01] ABOUT_ME",
    icon: Layers,
    desc: "Background, focus areas, and engineering trajectory",
  },
  {
    id: "training-data",
    label: "[02] EDUCATION",
    icon: GraduationCap,
    desc: "University of Delhi and selected certifications",
  },
  {
    id: "evaluation",
    label: "[03] SELECTED_WORK",
    icon: Briefcase,
    desc: "RasoSynthTune, Raso Medical Chatbot, Movie Recommendation System",
  },
  {
    id: "learning-repos",
    label: "[04] TECHNICAL_NOTES",
    icon: BookOpen,
    desc: "Selected learning repositories and implementation notes",
  },
  {
    id: "capabilities",
    label: "[05] SKILLS",
    icon: Code2,
    desc: "Skill matrix (PyTorch, LangGraph, LoRA/PEFT)",
  },
  {
    id: "external-validation",
    label: "[06] OPEN_SOURCE",
    icon: Sparkles,
    desc: "Merged upstream PR #48 to SwarmLLM",
  },
  {
    id: "limitations",
    label: "[07] GROWTH_AREAS",
    icon: BookOpen,
    desc: "Zero-ego calibration and growth areas",
  },
  {
    id: "maintainer",
    label: "[08] CONTACT",
    icon: Mail,
    desc: "Contact form and professional links",
  },
];

export function CommandPalette({
  open,
  onOpenChange,
  onSelectSection,
  toggleScanlines,
  scanlinesEnabled = true,
}: CommandPaletteProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const handleJump = (id: string) => {
    onOpenChange(false);
    if (onSelectSection) {
      onSelectSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const copyToClipboard = async (text: string, label: string, key: string) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(`Copied ${label} to clipboard`, { description: text });
      window.setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      toast.error("Copy failed", { description: "Clipboard access is unavailable." });
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="border-b border-[#222c3d] px-3 py-2 flex items-center justify-between text-xs font-mono text-on-surface-variant bg-[#0c1017]">
        <span className="flex items-center gap-1.5 text-primary font-bold">
          <Terminal size={13} /> SK-04 // SYSTEM KERNEL PALETTE
        </span>
        <span className="text-[10px] text-primary/60">ESC TO CLOSE</span>
      </div>
      <CommandInput placeholder="Search sections, repositories, or type command..." />
      <CommandList className="max-h-[380px] overflow-y-auto font-mono text-xs bg-[#090d14]">
        <CommandEmpty>No matching sections found.</CommandEmpty>

        <CommandGroup heading="SECTIONS">
          {SECTION_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.id}
                onSelect={() => handleJump(item.id)}
                className="flex items-center justify-between py-2.5 px-3 cursor-pointer hover:bg-primary/10 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={14} className="text-primary shrink-0" />
                  <span className="font-semibold text-white">{item.label}</span>
                </div>
                <span className="text-[10px] text-on-surface-variant hidden sm:inline truncate max-w-[240px]">
                  {item.desc}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="QUICK ACTIONS">
          <CommandItem
            onSelect={() => {
              handleJump("maintainer");
            }}
            className="flex items-center justify-between py-2.5 px-3 cursor-pointer hover:bg-primary/10"
          >
            <div className="flex items-center gap-2.5">
              <Mail size={14} className="text-on-surface-variant" />
              <span>Dispatch Inference Message</span>
            </div>
            <code className="text-[10px] text-primary">#maintainer</code>
          </CommandItem>

          <CommandItem
            onSelect={() => {
              window.open("https://github.com/Sourabh-Kumar04", "_blank");
              onOpenChange(false);
            }}
            className="flex items-center justify-between py-2.5 px-3 cursor-pointer hover:bg-primary/10"
          >
            <div className="flex items-center gap-2.5">
              <Github size={14} className="text-on-surface-variant" />
              <span>Open GitHub Profile (Sourabh-Kumar04)</span>
            </div>
            <ExternalLink size={12} className="text-on-surface-variant" />
          </CommandItem>

          <CommandItem
            onSelect={() => {
              window.open("https://linkedin.com/in/sourabh-kumar04", "_blank");
              onOpenChange(false);
            }}
            className="flex items-center justify-between py-2.5 px-3 cursor-pointer hover:bg-primary/10"
          >
            <div className="flex items-center gap-2.5">
              <Linkedin size={14} className="text-on-surface-variant" />
              <span>Open LinkedIn Profile</span>
            </div>
            <ExternalLink size={12} className="text-on-surface-variant" />
          </CommandItem>

          <CommandItem
            onSelect={() => {
              window.open(
                "https://github.com/Nehanth/swarmllm/commit/c6f47f70968d44e57cc848e528d2e27a118dddda",
                "_blank",
              );
              onOpenChange(false);
            }}
            className="flex items-center justify-between py-2.5 px-3 cursor-pointer hover:bg-primary/10"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles size={14} className="text-tertiary" />
              <span>View SwarmLLM Merged Upstream PR #48</span>
            </div>
            <ExternalLink size={12} className="text-on-surface-variant" />
          </CommandItem>

          {toggleScanlines && (
            <CommandItem
              onSelect={() => {
                toggleScanlines();
                toast.info(`CRT Scanlines: ${!scanlinesEnabled ? "ACTIVE" : "DISABLED"}`);
              }}
              className="flex items-center justify-between py-2.5 px-3 cursor-pointer hover:bg-primary/10"
            >
              <div className="flex items-center gap-2.5">
                <Tv size={14} className="text-on-surface-variant" />
                <span>Toggle CRT Scanlines Effect</span>
              </div>
              <span className="text-[10px] text-primary">
                {scanlinesEnabled ? "ENABLED" : "DISABLED"}
              </span>
            </CommandItem>
          )}

          <CommandItem
            onSelect={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              onOpenChange(false);
            }}
            className="flex items-center justify-between py-2.5 px-3 cursor-pointer hover:bg-primary/10"
          >
            <div className="flex items-center gap-2.5">
              <ArrowDown size={14} className="text-on-surface-variant rotate-180" />
              <span>Scroll to Top</span>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
