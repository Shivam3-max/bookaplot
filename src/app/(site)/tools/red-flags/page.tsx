import type { Metadata } from "next";
import QuizGame from "@/components/QuizGame";
import { RED_FLAGS } from "@/lib/tools-content";

export const metadata: Metadata = {
  title: "Spot the Red Flag — Real Estate Warning Signs Game",
  description: "Six real transaction scenarios. Can you spot the warning sign before the money moves? Each answer explains what actually goes wrong.",
};

export default function RedFlagsPage() {
  return (
    <div className="container-x py-12 sm:py-16">
      <QuizGame
        items={RED_FLAGS.map((r) => ({ prompt: r.scenario, options: r.options, answer: r.answer, explain: r.explain }))}
        eyebrow="Spot the Red Flag"
        title="Can you spot what's wrong here?"
        intro="Six scenarios drawn from how deals actually go wrong. Pick the real warning sign — the explanation tells you what it costs to miss it."
        promptLabel="Scenario"
        scoreNoun="Spotted"
      />
    </div>
  );
}
