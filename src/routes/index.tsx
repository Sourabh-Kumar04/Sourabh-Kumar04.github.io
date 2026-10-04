import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "../components/Portfolio";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sourabh Kumar",
  jobTitle: "AI/ML Engineer",
  url: "https://github.com/Sourabh-Kumar04",
  sameAs: ["https://github.com/Sourabh-Kumar04", "https://www.linkedin.com/in/sourabh-kumar04/"],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Delhi",
  },
  knowsAbout: [
    "Machine Learning",
    "Artificial Intelligence",
    "Large Language Models",
    "Agentic AI",
    "RAG",
    "LoRA / PEFT",
    "FastAPI",
    "PyTorch",
  ],
};

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sourabh-Kumar04" },
      {
        name: "description",
        content:
          "Sourabh Kumar's portfolio: applied LLM engineering, agentic AI systems, RAG, LoRA fine-tuning, and open-source contributions.",
      },
      {
        property: "og:title",
        content: "Sourabh-Kumar04",
      },
      {
        property: "og:description",
        content: "Applied LLM engineering, agentic AI systems, RAG, and open-source work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      },
    ],
  }),
  component: Portfolio,
});
