/**
 * Agreement Drafting Assistant — question sets and fixed clause templates.
 *
 * The interview collects answers; the clause wording below is fixed template
 * text with placeholders substituted in. Nothing here generates legal language
 * dynamically, and the Sale Deed is deliberately excluded: the final registered
 * transfer always needs advocate-supervised drafting at the Sub-Registrar.
 */

export type FieldKind = "text" | "textarea" | "number" | "date" | "select";

export interface Question {
  /** answer key, used as {{placeholder}} in clause bodies */
  id: string;
  label: string;
  /** the short "why this matters" note shown under every question */
  why: string;
  kind: FieldKind;
  placeholder?: string;
  options?: string[];
  /** prefix shown inside the input, e.g. ₹ */
  prefix?: string;
  suffix?: string;
  optional?: boolean;
}

export interface Clause {
  heading: string;
  /** paragraphs; {{id}} is replaced by the matching answer */
  body: string[];
}

export interface AgreementType {
  slug: string;
  name: string;
  short: string;
  blurb: string;
  icon: string;
  /** heading printed at the top of the generated draft */
  documentTitle: string;
  stampNote: string;
  questions: Question[];
  clauses: Clause[];
}

const CITY: Question = {
  id: "city",
  label: "City where the agreement will be executed",
  why: "Determines the jurisdiction whose courts hear any dispute, and which state's stamp duty applies.",
  kind: "text",
  placeholder: "Chandigarh",
};

const AGREEMENT_DATE: Question = {
  id: "agreementDate",
  label: "Date of the agreement",
  why: "Fixes when obligations start running. Stamp paper must be dated on or before this date, never after.",
  kind: "date",
};

/* ------------------------------------------------------------------ */
/* 1. Leave & Licence / Rent Agreement                                  */
/* ------------------------------------------------------------------ */

const RENT: AgreementType = {
  slug: "rent",
  name: "Leave & Licence / Rent Agreement",
  short: "Rent Agreement",
  blurb: "For renting out a residential or commercial property to a tenant.",
  icon: "⌂",
  documentTitle: "LEAVE AND LICENCE AGREEMENT",
  stampNote:
    "Typically executed on stamp paper of the value prescribed by your state. In most states an agreement of 12 months or longer must be registered with the Sub-Registrar — an 11-month term is common precisely to stay under that threshold.",
  questions: [
    CITY,
    AGREEMENT_DATE,
    { id: "licensorName", label: "Owner / Licensor full name", why: "The person granting the licence must be the lawful owner, or hold a valid power of attorney. A mismatch here is the single most common cause of a disputed tenancy.", kind: "text", placeholder: "Full name as per Aadhaar / PAN" },
    { id: "licensorAddress", label: "Owner / Licensor address", why: "Used for serving legal notices. An address the owner no longer occupies makes notice service arguable later.", kind: "textarea", placeholder: "Permanent address" },
    { id: "licenseeName", label: "Tenant / Licensee full name", why: "Identifies who is legally bound to pay and to vacate. Only named parties can be proceeded against.", kind: "text", placeholder: "Full name as per Aadhaar / PAN" },
    { id: "licenseeAddress", label: "Tenant / Licensee permanent address", why: "A permanent address separate from the rented premises gives you somewhere to serve notice if the tenant leaves abruptly.", kind: "textarea", placeholder: "Permanent address" },
    { id: "propertyAddress", label: "Full address of the property being let", why: "The premises must be described precisely enough to be identified without ambiguity — floor, unit number and locality all matter.", kind: "textarea", placeholder: "Unit / floor / plot no., sector, city" },
    { id: "propertyType", label: "Property type", why: "Residential and commercial tenancies carry different GST, notice and usage consequences.", kind: "select", options: ["Residential", "Commercial", "Industrial"] },
    { id: "area", label: "Area of the premises", why: "Records what is actually being let, so a later dispute about usable space has a written reference.", kind: "text", placeholder: "e.g. 1,250 sq ft carpet" },
    { id: "furnishing", label: "Furnishing", why: "Fixes whether fittings are included. A signed inventory of furnishings prevents deposit disputes on exit.", kind: "select", options: ["Unfurnished", "Semi-furnished", "Fully furnished"] },
    { id: "rent", label: "Monthly rent / licence fee", why: "The core commercial term. It should be stated in figures and words in the final signed copy.", kind: "number", prefix: "₹" },
    { id: "deposit", label: "Interest-free security deposit", why: "Sets what must be refunded on vacation. State clearly that it is interest-free and refundable, or it can be read as advance rent.", kind: "number", prefix: "₹" },
    { id: "termMonths", label: "Term of the licence", why: "Terms of 12 months or more usually trigger compulsory registration. 11 months is the common Indian practice.", kind: "number", suffix: "months" },
    { id: "startDate", label: "Licence start date", why: "Determines when rent becomes payable and when the term expires.", kind: "date" },
    { id: "lockInMonths", label: "Lock-in period", why: "Neither side can exit during lock-in without paying out the balance. Protects the owner against a very short tenancy.", kind: "number", suffix: "months", optional: true },
    { id: "noticeMonths", label: "Notice period to terminate", why: "Gives both sides time to find a replacement tenant or premises.", kind: "number", suffix: "months" },
    { id: "escalation", label: "Annual rent escalation", why: "Without an escalation clause the rent stays flat on renewal, which erodes yield in real terms.", kind: "number", suffix: "%", optional: true },
    { id: "maintenance", label: "Who pays society maintenance", why: "Unallocated maintenance is a frequent source of friction, particularly in gated societies with heavy monthly charges.", kind: "select", options: ["Tenant / Licensee", "Owner / Licensor", "Shared equally"] },
    { id: "purpose", label: "Permitted use of the premises", why: "Limits the tenant to an agreed use. Without it, a residential let can quietly become a commercial one.", kind: "text", placeholder: "e.g. residential dwelling only" },
  ],
  clauses: [
    {
      heading: "Parties",
      body: [
        "This Leave and Licence Agreement is made at {{city}} on {{agreementDate}}.",
        "BETWEEN {{licensorName}}, residing at {{licensorAddress}}, hereinafter called the \"LICENSOR\" (which expression shall, unless repugnant to the context, include their heirs, executors, administrators and permitted assigns) of the ONE PART;",
        "AND {{licenseeName}}, residing at {{licenseeAddress}}, hereinafter called the \"LICENSEE\" (which expression shall, unless repugnant to the context, include their heirs, executors, administrators and permitted assigns) of the OTHER PART.",
      ],
    },
    {
      heading: "Recitals",
      body: [
        "WHEREAS the Licensor is the lawful owner of and is well and sufficiently entitled to the {{propertyType}} premises situated at {{propertyAddress}}, admeasuring {{area}} and being {{furnishing}} (hereinafter the \"Licensed Premises\").",
        "AND WHEREAS the Licensee has approached the Licensor to grant a licence to use and occupy the Licensed Premises, and the Licensor has agreed to do so on the terms recorded below.",
      ],
    },
    {
      heading: "1. Grant of Licence and Term",
      body: [
        "The Licensor hereby grants to the Licensee a licence to use and occupy the Licensed Premises for a period of {{termMonths}} months commencing from {{startDate}}.",
        "This Agreement creates only a licence to occupy. It does not create any tenancy, sub-tenancy, lease, or any right, title or interest of any nature in the Licensed Premises in favour of the Licensee. Possession in law remains with the Licensor at all times.",
      ],
    },
    {
      heading: "2. Licence Fee",
      body: [
        "The Licensee shall pay to the Licensor a monthly licence fee of ₹{{rent}}, payable in advance on or before the fifth day of each calendar month, without deduction or set-off.",
        "On each completed year of occupation, the monthly licence fee shall stand increased by {{escalation}}% over the fee then payable.",
      ],
    },
    {
      heading: "3. Security Deposit",
      body: [
        "The Licensee has paid to the Licensor an interest-free refundable security deposit of ₹{{deposit}}, the receipt of which the Licensor acknowledges.",
        "The deposit shall be refunded to the Licensee simultaneously with the Licensee handing over vacant and peaceful possession of the Licensed Premises, after adjusting any arrears of licence fee, unpaid utility charges, and the cost of making good any damage beyond normal wear and tear.",
      ],
    },
    {
      heading: "4. Use of the Licensed Premises",
      body: [
        "The Licensee shall use the Licensed Premises solely for {{purpose}} and for no other purpose whatsoever.",
        "The Licensee shall not sub-let, assign, part with possession of, or permit any third party to occupy the Licensed Premises or any part of it, without the prior written consent of the Licensor.",
        "The Licensee shall not carry out any structural alteration or addition to the Licensed Premises without the prior written consent of the Licensor.",
      ],
    },
    {
      heading: "5. Outgoings and Maintenance",
      body: [
        "Society maintenance charges in respect of the Licensed Premises shall be borne by: {{maintenance}}.",
        "All charges for electricity, water, gas, internet and other utilities consumed at the Licensed Premises during the licence period shall be borne and paid by the Licensee as per actual meter readings or actual bills.",
        "Municipal taxes, property tax and any other statutory levy on ownership of the Licensed Premises shall be borne by the Licensor.",
      ],
    },
    {
      heading: "6. Lock-in Period",
      body: [
        "Neither party shall terminate this Agreement during the first {{lockInMonths}} months from the commencement date. Should the Licensee vacate before expiry of the lock-in period, the licence fee for the unexpired portion of the lock-in period shall become immediately payable to the Licensor.",
      ],
    },
    {
      heading: "7. Termination",
      body: [
        "After expiry of the lock-in period, either party may terminate this Agreement by serving {{noticeMonths}} months' prior written notice on the other, or by paying licence fee in lieu of such notice.",
        "The Licensor may terminate this Agreement forthwith if the licence fee remains unpaid for two consecutive months, or if the Licensee commits a breach of any material term and fails to remedy it within fifteen days of written notice.",
        "On termination or expiry, the Licensee shall hand over vacant and peaceful possession of the Licensed Premises in the same condition in which it was received, normal wear and tear excepted.",
      ],
    },
    {
      heading: "8. Inspection",
      body: [
        "The Licensor or their authorised representative may enter and inspect the Licensed Premises at reasonable hours after giving the Licensee at least twenty-four hours' prior notice.",
      ],
    },
    {
      heading: "9. Stamp Duty and Registration",
      body: [
        "The cost of stamp duty and registration charges, if any, payable on this Agreement shall be borne by the parties in equal shares unless otherwise agreed in writing.",
      ],
    },
    {
      heading: "10. Governing Law and Jurisdiction",
      body: [
        "This Agreement shall be governed by and construed in accordance with the laws of India. The courts at {{city}} shall have exclusive jurisdiction over any dispute arising out of or in connection with this Agreement.",
      ],
    },
    {
      heading: "Execution",
      body: [
        "IN WITNESS WHEREOF the parties have set their respective hands to this Agreement on the day, month and year first written above.",
        "LICENSOR: ______________________     LICENSEE: ______________________",
        "{{licensorName}}                                    {{licenseeName}}",
        "WITNESS 1: ______________________     WITNESS 2: ______________________",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 2. Agreement to Sell                                                 */
/* ------------------------------------------------------------------ */

const SELL: AgreementType = {
  slug: "agreement-to-sell",
  name: "Agreement to Sell",
  short: "Agreement to Sell",
  blurb: "The pre-registration agreement between a seller and a buyer, before the final Sale Deed.",
  icon: "⇌",
  documentTitle: "AGREEMENT TO SELL",
  stampNote:
    "An Agreement to Sell records the intention to transfer; it does not itself transfer title. Title passes only on the registered Sale Deed. Several states levy stamp duty on this agreement and adjust it against the Sale Deed later — confirm locally.",
  questions: [
    CITY,
    AGREEMENT_DATE,
    { id: "sellerName", label: "Seller's full name", why: "The seller must hold clear, marketable title. Verify the name matches the title deed exactly — even a spelling variation needs an affidavit later.", kind: "text", placeholder: "Full name as per title deed" },
    { id: "sellerAddress", label: "Seller's address", why: "Needed for notices and to identify the seller unambiguously in the eventual Sale Deed.", kind: "textarea" },
    { id: "buyerName", label: "Buyer's full name", why: "Whoever is named here should be the person in whose name the property will ultimately be registered — changing it later attracts fresh stamp duty.", kind: "text", placeholder: "Full name as per Aadhaar / PAN" },
    { id: "buyerAddress", label: "Buyer's address", why: "Used for service of notices and for the eventual registration record.", kind: "textarea" },
    { id: "propertyDescription", label: "Full description of the property", why: "The schedule of property must identify it beyond doubt — plot number, sector, boundaries and measurements. A vague schedule is the leading cause of failed registration.", kind: "textarea", placeholder: "Plot no., sector, khasra no., boundaries" },
    { id: "area", label: "Area of the property", why: "The measured extent being sold. Any variation found on survey later must be dealt with under this clause.", kind: "text", placeholder: "e.g. 300 sq yd" },
    { id: "consideration", label: "Total sale consideration", why: "The agreed price. It must not be below the state's circle rate, or stamp duty will be levied on the circle rate anyway and the difference may be taxed as income.", kind: "number", prefix: "₹" },
    { id: "advance", label: "Advance / token amount paid", why: "Records what has already changed hands, and what is forfeitable if the buyer defaults.", kind: "number", prefix: "₹" },
    { id: "paymentMode", label: "How the advance was paid", why: "Cash above ₹20,000 in a property transaction is barred under Section 269SS of the Income-tax Act. Banking channels protect both sides.", kind: "select", options: ["Bank transfer / NEFT / RTGS", "Cheque", "Demand draft", "UPI"] },
    { id: "balanceDate", label: "Date by which the balance is payable", why: "Sets the deadline for completion. Without a date the agreement is open-ended and difficult to enforce.", kind: "date" },
    { id: "possessionDate", label: "Date of handover of possession", why: "Possession and title can pass at different times. Stating both prevents the classic dispute where a buyer occupies but never registers.", kind: "date" },
    { id: "dutyBorneBy", label: "Who bears stamp duty and registration charges", why: "Customarily the buyer, but it is negotiable — and on a large transaction the amount is significant.", kind: "select", options: ["Buyer", "Seller", "Shared equally"] },
    { id: "forfeitPercent", label: "Forfeiture on buyer's default", why: "Caps what the seller may retain if the buyer walks away. Courts look unfavourably on forfeiture that operates as a penalty.", kind: "number", suffix: "% of advance" },
  ],
  clauses: [
    {
      heading: "Parties",
      body: [
        "This Agreement to Sell is made at {{city}} on {{agreementDate}}.",
        "BETWEEN {{sellerName}}, residing at {{sellerAddress}}, hereinafter called the \"SELLER\" of the ONE PART;",
        "AND {{buyerName}}, residing at {{buyerAddress}}, hereinafter called the \"BUYER\" of the OTHER PART.",
      ],
    },
    {
      heading: "Recitals",
      body: [
        "WHEREAS the Seller is the absolute and lawful owner of the property described in the Schedule below, admeasuring {{area}} (hereinafter the \"Said Property\").",
        "AND WHEREAS the Seller has agreed to sell and the Buyer has agreed to purchase the Said Property, free from all encumbrances, on the terms recorded below.",
      ],
    },
    {
      heading: "1. Sale Consideration",
      body: [
        "The total sale consideration for the Said Property is agreed at ₹{{consideration}}.",
        "The Buyer has paid to the Seller an advance of ₹{{advance}} by {{paymentMode}}, the receipt of which the Seller hereby acknowledges.",
        "The balance consideration shall be paid by the Buyer to the Seller on or before {{balanceDate}}, simultaneously with the execution and registration of the Sale Deed.",
      ],
    },
    {
      heading: "2. Title and Encumbrances",
      body: [
        "The Seller represents and warrants that the Seller has clear, absolute and marketable title to the Said Property, and full authority to sell it.",
        "The Seller represents that the Said Property is free from all encumbrances, mortgages, charges, liens, litigation, attachment, acquisition or requisition proceedings, and that no notice of acquisition has been received.",
        "The Seller shall indemnify and keep the Buyer indemnified against any loss arising from any defect in title or any encumbrance discovered subsequently.",
      ],
    },
    {
      heading: "3. Completion and Registration",
      body: [
        "The Seller shall execute and register the Sale Deed in favour of the Buyer, or the Buyer's nominee, on or before {{balanceDate}}, and shall appear before the Sub-Registrar for that purpose.",
        "All stamp duty, registration charges and incidental expenses on the Sale Deed shall be borne by: {{dutyBorneBy}}.",
        "The Seller shall hand over all original title documents, tax receipts and approvals relating to the Said Property to the Buyer at the time of registration.",
      ],
    },
    {
      heading: "4. Possession",
      body: [
        "Vacant, peaceful and physical possession of the Said Property shall be delivered by the Seller to the Buyer on {{possessionDate}}, against payment of the full consideration.",
        "Until possession is handed over, the Seller shall maintain the Said Property in its present condition and shall not create any third-party right in it.",
      ],
    },
    {
      heading: "5. Outgoings",
      body: [
        "All property tax, electricity, water and other outgoings in respect of the Said Property up to the date of handover of possession shall be borne by the Seller, and thereafter by the Buyer.",
      ],
    },
    {
      heading: "6. Default",
      body: [
        "If the Buyer fails to complete the purchase within the agreed time without lawful cause, the Seller may forfeit {{forfeitPercent}}% of the advance paid, and the balance shall be refunded to the Buyer.",
        "If the Seller fails to complete the sale within the agreed time without lawful cause, the Buyer may demand refund of the entire advance together with an equivalent amount as liquidated damages, or may seek specific performance of this Agreement, at the Buyer's option.",
      ],
    },
    {
      heading: "7. Time of the Essence",
      body: [
        "Time shall be of the essence in respect of all payments and of completion under this Agreement.",
      ],
    },
    {
      heading: "8. Governing Law and Jurisdiction",
      body: [
        "This Agreement shall be governed by the laws of India, and the courts at {{city}} shall have exclusive jurisdiction over any dispute arising under it.",
      ],
    },
    {
      heading: "Schedule of Property",
      body: ["{{propertyDescription}}", "Admeasuring {{area}}."],
    },
    {
      heading: "Execution",
      body: [
        "IN WITNESS WHEREOF the parties have set their hands to this Agreement on the day, month and year first written above.",
        "SELLER: ______________________     BUYER: ______________________",
        "{{sellerName}}                                    {{buyerName}}",
        "WITNESS 1: ______________________     WITNESS 2: ______________________",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 3. Brokerage / Channel Partner Agreement                             */
/* ------------------------------------------------------------------ */

const BROKERAGE: AgreementType = {
  slug: "brokerage",
  name: "Brokerage / Channel Partner Agreement",
  short: "Brokerage Agreement",
  blurb: "Between a broker or channel partner and a client, defining brokerage terms.",
  icon: "◈",
  documentTitle: "BROKERAGE / CHANNEL PARTNER AGREEMENT",
  stampNote:
    "Under RERA, an agent dealing in a registered project must hold a valid agent registration for that state. Quote the registration number in the agreement — a client can decline to pay brokerage to an unregistered agent in several states.",
  questions: [
    CITY,
    AGREEMENT_DATE,
    { id: "agentName", label: "Broker / Channel Partner name", why: "The party earning the brokerage. If you operate through a firm, name the firm and the signatory's capacity.", kind: "text", placeholder: "Name or firm name" },
    { id: "agentAddress", label: "Broker / Channel Partner address", why: "Establishes the agent's place of business and where notices are served.", kind: "textarea" },
    { id: "reraNumber", label: "RERA agent registration number", why: "Mandatory for dealing in RERA-registered projects. Its absence can make brokerage difficult to recover.", kind: "text", placeholder: "e.g. PBRERA-AG-XXXX", optional: true },
    { id: "clientName", label: "Client's full name", why: "The party liable to pay brokerage — usually the seller or developer, sometimes the buyer.", kind: "text" },
    { id: "clientAddress", label: "Client's address", why: "For notices and to identify the client unambiguously.", kind: "textarea" },
    { id: "clientRole", label: "The client is the", why: "Determines who pays. Charging both sides without disclosure is a conflict of interest and is unenforceable if hidden.", kind: "select", options: ["Seller / Owner", "Buyer / Investor", "Developer"] },
    { id: "projectScope", label: "Property or project covered", why: "Limits the agreement to defined inventory, so brokerage cannot be claimed on unrelated deals.", kind: "textarea", placeholder: "Project name, tower, plot numbers or inventory covered" },
    { id: "territory", label: "Territory or market covered", why: "For channel partner arrangements, defines the exclusive area. This is what makes a territory grant meaningful.", kind: "text", placeholder: "e.g. Zirakpur — VIP Road", optional: true },
    { id: "exclusivity", label: "Basis of appointment", why: "An exclusive mandate entitles the agent to brokerage even on a deal the client sources directly, if so agreed. Non-exclusive does not.", kind: "select", options: ["Exclusive mandate", "Non-exclusive"] },
    { id: "brokerageRate", label: "Brokerage payable", why: "The commercial core. State whether it is a percentage of consideration or a fixed amount, and whether GST is extra.", kind: "text", placeholder: "e.g. 2% of sale consideration, plus GST" },
    { id: "payableOn", label: "Brokerage becomes payable on", why: "The single most disputed term in brokerage. Tie it to a clear, verifiable event.", kind: "select", options: ["Execution of the Agreement to Sell", "Registration of the Sale Deed", "Receipt of full consideration by the client", "Booking confirmation and receipt of token"] },
    { id: "termMonths", label: "Validity of this appointment", why: "Without an end date, an agent can claim brokerage on a deal closed years later.", kind: "number", suffix: "months" },
    { id: "tailMonths", label: "Protection period after expiry", why: "Protects the agent: if a client transacts with an introduced party shortly after expiry, brokerage is still payable.", kind: "number", suffix: "months", optional: true },
    { id: "noticeDays", label: "Notice period to terminate", why: "Lets either side exit in an orderly way without stranding live negotiations.", kind: "number", suffix: "days" },
  ],
  clauses: [
    {
      heading: "Parties",
      body: [
        "This Brokerage / Channel Partner Agreement is made at {{city}} on {{agreementDate}}.",
        "BETWEEN {{agentName}}, having its place of business at {{agentAddress}}, RERA agent registration number {{reraNumber}}, hereinafter called the \"AGENT\" of the ONE PART;",
        "AND {{clientName}}, residing at / having its office at {{clientAddress}}, being the {{clientRole}}, hereinafter called the \"CLIENT\" of the OTHER PART.",
      ],
    },
    {
      heading: "1. Appointment and Scope",
      body: [
        "The Client hereby appoints the Agent to market, introduce prospective counterparties for, and assist in negotiating the sale or transfer of the following: {{projectScope}}. This appointment is made on the following basis: {{exclusivity}}.",
        "The territory covered by this appointment is: {{territory}}.",
        "The Agent shall act solely as an intermediary. The Agent is not authorised to accept money on the Client's behalf, to execute any document for the Client, or to make any representation or warranty binding on the Client.",
      ],
    },
    {
      heading: "2. Brokerage",
      body: [
        "In consideration of the services rendered, the Client shall pay the Agent brokerage of {{brokerageRate}}.",
        "Brokerage shall become due and payable on: {{payableOn}}.",
        "Goods and Services Tax, where applicable, shall be payable by the Client in addition to the brokerage, against a valid tax invoice raised by the Agent.",
      ],
    },
    {
      heading: "3. Term and Protection Period",
      body: [
        "This appointment shall remain in force for {{termMonths}} months from the date of this Agreement, unless terminated earlier in accordance with Clause 6.",
        "If, within {{tailMonths}} months after expiry or termination of this Agreement, the Client concludes a transaction with any party first introduced in writing by the Agent during the term, the Client shall pay the Agent the brokerage set out in Clause 2 as though this Agreement were still in force.",
      ],
    },
    {
      heading: "4. Obligations of the Agent",
      body: [
        "The Agent shall market the said inventory diligently and shall not make any false or misleading representation about it.",
        "The Agent shall maintain a written record of every prospective counterparty introduced, and shall share that record with the Client on request. Only introductions recorded in writing shall qualify for brokerage.",
        "The Agent shall not disclose any confidential information of the Client to any third party, during the term or after it ends.",
        "Where the said inventory forms part of a project registered under the Real Estate (Regulation and Development) Act, 2016, the Agent shall at all times hold a valid agent registration for the relevant state.",
      ],
    },
    {
      heading: "5. Obligations of the Client",
      body: [
        "The Client shall furnish the Agent with accurate particulars, pricing and title information for the said inventory, and shall promptly notify the Agent of any change.",
        "The Client shall notify the Agent in writing on conclusion of any transaction with a party introduced by the Agent, within seven days of such conclusion.",
        "The Client shall not, during the term of an exclusive appointment, appoint any other agent for the same inventory within the same territory.",
      ],
    },
    {
      heading: "6. Termination",
      body: [
        "Either party may terminate this Agreement by giving {{noticeDays}} days' prior written notice to the other.",
        "Termination shall not affect brokerage already earned, nor the protection period under Clause 3.",
      ],
    },
    {
      heading: "7. Dispute Resolution",
      body: [
        "The parties shall first attempt to resolve any dispute amicably. Failing resolution within thirty days, the dispute shall be referred to a sole arbitrator appointed by mutual consent under the Arbitration and Conciliation Act, 1996, with the seat of arbitration at {{city}}.",
        "Subject to the above, the courts at {{city}} shall have exclusive jurisdiction.",
      ],
    },
    {
      heading: "Execution",
      body: [
        "IN WITNESS WHEREOF the parties have set their hands to this Agreement on the day, month and year first written above.",
        "AGENT: ______________________     CLIENT: ______________________",
        "{{agentName}}                                    {{clientName}}",
        "WITNESS 1: ______________________     WITNESS 2: ______________________",
      ],
    },
  ],
};

export const AGREEMENT_TYPES: AgreementType[] = [RENT, SELL, BROKERAGE];

export function getAgreementType(slug: string) {
  return AGREEMENT_TYPES.find((a) => a.slug === slug);
}

/** Format a raw answer for insertion into clause text. */
function formatAnswer(q: Question | undefined, raw: string) {
  if (!raw) return "";
  if (q?.kind === "number" && q.prefix === "₹") {
    const n = Number(raw);
    return Number.isFinite(n) ? n.toLocaleString("en-IN") : raw;
  }
  if (q?.kind === "date") {
    const d = new Date(raw);
    return Number.isNaN(d.getTime())
      ? raw
      : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  }
  return raw;
}

/**
 * Substitute answers into the clause templates. Clauses whose only substantive
 * content depends on a skipped optional answer are dropped, so an unanswered
 * lock-in or escalation does not leave a dangling sentence in the draft.
 */
export function buildDraft(type: AgreementType, answers: Record<string, string>) {
  const byId = new Map(type.questions.map((q) => [q.id, q]));

  const fill = (text: string) =>
    text.replace(/\{\{(\w+)\}\}/g, (_, id: string) => {
      const val = formatAnswer(byId.get(id), (answers[id] ?? "").trim());
      return val || "__________";
    });

  const optionalIds = new Set(type.questions.filter((q) => q.optional).map((q) => q.id));

  const kept = type.clauses
    .map((c) => {
      const body = c.body.filter((p) => {
        const refs = [...p.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
        // drop a paragraph only when every placeholder in it is an unanswered optional
        if (refs.length === 0) return true;
        const allOptionalAndEmpty = refs.every(
          (id) => optionalIds.has(id) && !(answers[id] ?? "").trim()
        );
        return !allOptionalAndEmpty;
      });
      return { heading: c.heading, body: body.map(fill) };
    })
    .filter((c) => c.body.length > 0);

  // Renumber the numbered clauses. Dropping an optional clause (say lock-in)
  // would otherwise leave a gap — "5." followed by "7." — which reads as a
  // missing page in a legal document.
  let n = 0;
  return kept.map((c) => {
    const m = c.heading.match(/^\d+\.\s*(.*)$/);
    if (!m) return c;
    n += 1;
    return { ...c, heading: `${n}. ${m[1]}` };
  });
}
