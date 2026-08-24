import type { Metadata } from "next";
import QuizGame from "@/components/QuizGame";
import { QUIZ } from "@/lib/tools-content";

export const metadata: Metadata = {
  title: "Real Estate IQ Quiz — Test Your Property & RERA Knowledge",
  description: "Ten questions on RERA, title documents, carpet area and property tax. See how well you really know Indian real estate.",
};

export default function QuizPage() {
  return (
    <div className="container-x py-12 sm:py-16">
      <QuizGame
        items={QUIZ.map((q) => ({ prompt: q.q, options: q.options, answer: q.answer, explain: q.explain }))}
        eyebrow="Real Estate IQ Quiz"
        title="How well do you know Indian real estate?"
        intro="Ten questions on RERA, documentation, area terminology and tax. Every answer comes with the reasoning."
        scoreNoun="Score"
      />
    </div>
  );
}
