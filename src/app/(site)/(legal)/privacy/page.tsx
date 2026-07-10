import type { Metadata } from "next";
import LegalShell from "../legal-layout";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <LegalShell title="Privacy Policy" updated="July 2026">
      <p>BookAPlot collects the information you provide through forms — name, phone, email, budget, and property preferences — to respond to your inquiries, coordinate site visits, and share relevant opportunities.</p>
      <p>We do not sell your personal data. Your details are shared only with the internal team and, where needed to serve a specific request, with the property counterparty involved in that request.</p>
      <p>Saved deals, compare lists, and recently-viewed history are stored locally on your device and are not transmitted to our servers.</p>
      <p>We use standard analytics to understand aggregate site usage. You may request deletion of your inquiry data at any time by writing to hello@bookaplot.com.</p>
    </LegalShell>
  );
}
