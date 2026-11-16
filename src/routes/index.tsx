import { createFileRoute } from "@tanstack/react-router";
import { AILabPortfolio } from "../components/AILabPortfolio";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sourabh Kumar",
  jobTitle: "Applied AI/ML Engineer",
  url: "https://sourabh-kumar04.github.io",
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
    "Retrieval-Augmented Generation",
    "LoRA / PEFT",
    "FastAPI",
    "PyTorch",
  ],
};

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sourabh Kumar | Applied AI/ML & LLM Systems" },
      {
        name: "description",
        content:
          "Sourabh Kumar is a Computer Science student at the University of Delhi building practical AI systems across LLM applications, RAG, agent workflows, and efficient model fine-tuning. Explore selected projects and open-source work.",
      },
      {
        property: "og:title",
        content: "Sourabh Kumar | Applied AI/ML & LLM Systems",
      },
      {
        property: "og:description",
        content:
          "Practical AI systems, LLM applications, retrieval-augmented generation, agent workflows, and open-source projects.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sourabh-kumar04.github.io" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      },
    ],
  }),
  component: AILabPortfolio,
});
