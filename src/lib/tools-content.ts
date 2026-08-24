/** Content for the quiz, red-flag game, document checklist and quotes tools. */

/* ------------------------------------------------------------------ */
/* Real Estate IQ Quiz                                                  */
/* ------------------------------------------------------------------ */

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export const QUIZ: QuizQuestion[] = [
  {
    q: "Under RERA, which area must a developer disclose when selling a flat?",
    options: ["Super built-up area", "Built-up area", "Carpet area", "Plot area"],
    answer: 2,
    explain:
      "The Real Estate (Regulation and Development) Act, 2016 requires sale on the basis of carpet area — the net usable floor area within the walls. Quoting only super built-up area is exactly what RERA was written to stop.",
  },
  {
    q: "An Agreement to Sell transfers ownership of a property.",
    options: ["True", "False"],
    answer: 1,
    explain:
      "False. An Agreement to Sell only records an intention to transfer on agreed terms. Ownership passes solely on a registered Sale Deed under Section 54 of the Transfer of Property Act, 1882.",
  },
  {
    q: "What does an Encumbrance Certificate tell you?",
    options: [
      "The market value of the property",
      "Whether the property carries loans, mortgages or legal charges",
      "The approved building plan",
      "The property tax paid to date",
    ],
    answer: 1,
    explain:
      "An EC lists registered transactions and charges against a property for a given period. A clean EC is one of the strongest early signals that title is not encumbered.",
  },
  {
    q: "In a home loan EMI, what happens over the tenure?",
    options: [
      "The interest portion rises each month",
      "The principal portion rises each month",
      "Interest and principal stay equally split",
      "Only interest is paid until the last year",
    ],
    answer: 1,
    explain:
      "EMI stays level, but its composition shifts. Early EMIs are mostly interest; the principal share grows steadily. That is why prepaying early saves far more interest than prepaying late.",
  },
  {
    q: "Cash payments in a property transaction are restricted above what limit?",
    options: ["₹10,000", "₹20,000", "₹50,000", "₹2,00,000"],
    answer: 1,
    explain:
      "Section 269SS of the Income-tax Act bars accepting ₹20,000 or more in cash for transfer of immovable property. Section 271D penalises it with a fine equal to the amount taken.",
  },
  {
    q: "A property is quoted at ₹6,000/sq ft on super built-up with 40% loading. What is the effective rate on carpet?",
    options: ["₹6,000", "₹7,200", "₹8,400", "₹10,000"],
    answer: 2,
    explain:
      "With 40% loading, carpet = super built-up ÷ 1.40. The same money buys 1/1.4 of the area, so the effective rate is ₹6,000 × 1.40 = ₹8,400 per sq ft of carpet — 40% more than the headline number.",
  },
  {
    q: "What is a Mutation (Intkaal) entry?",
    options: [
      "The registration of the Sale Deed",
      "Updating the revenue records to show the new owner",
      "A change in the approved building plan",
      "A No Objection Certificate from the society",
    ],
    answer: 1,
    explain:
      "Mutation updates land revenue records so property tax is billed to the new owner. It follows registration and is not itself proof of title — but a missing mutation causes real problems on resale.",
  },
  {
    q: "Which document confirms a building was constructed as approved and is fit to occupy?",
    options: ["Allotment Letter", "Completion Certificate", "Occupancy Certificate", "Possession Letter"],
    answer: 2,
    explain:
      "The Occupancy Certificate is issued by the local authority confirming the building complies with approved plans and is fit for occupation. Taking possession without an OC is a genuine risk — utilities and resale can both be blocked.",
  },
  {
    q: "For how long must a registered project's promoter keep the RERA registration valid?",
    options: [
      "One year from launch",
      "Until the declared completion date, extendable in defined circumstances",
      "Five years, always",
      "Until the first flat is sold",
    ],
    answer: 1,
    explain:
      "Registration runs until the completion date declared by the promoter. Extensions are permitted only in limited circumstances such as force majeure, at the authority's discretion.",
  },
  {
    q: "What share of a buyer's collections must a RERA-registered promoter keep in a separate escrow account?",
    options: ["50%", "60%", "70%", "100%"],
    answer: 2,
    explain:
      "Section 4(2)(l)(D) requires 70% of the amounts realised from allottees to be deposited in a separate account, usable only for construction and land cost of that project. It is the provision that targets fund diversion between projects.",
  },
];

/* ------------------------------------------------------------------ */
/* Spot the Red Flag                                                    */
/* ------------------------------------------------------------------ */

export interface RedFlagCase {
  scenario: string;
  options: string[];
  answer: number;
  explain: string;
}

export const RED_FLAGS: RedFlagCase[] = [
  {
    scenario:
      "A seller offers a plot 18% below every comparable rate in the sector. He is willing to sign today, wants 40% in cash, and says the registry can happen “after two months, once a small family matter is settled”.",
    options: [
      "The price being below market",
      "Wanting to sign immediately",
      "The cash component and the deferred registry together",
      "Waiting two months for registration",
    ],
    answer: 2,
    explain:
      "Any one of these could be innocent. Together they are the classic disputed-title pattern: a discount to attract a quick buyer, cash that leaves no trail, and a delay that hides an unresolved claim. Cash of ₹20,000 or more is barred outright by Section 269SS.",
  },
  {
    scenario:
      "A developer's brochure shows a school, a clubhouse and a metro station. The RERA registration covers the towers only, and the sanctioned layout has no clubhouse on it.",
    options: [
      "Advertising a metro station that is not built yet",
      "The clubhouse appearing in the brochure but not in the sanctioned plan",
      "Showing a school in the brochure",
      "Nothing — brochures are always indicative",
    ],
    answer: 1,
    explain:
      "An amenity in a brochure but absent from the sanctioned layout has no legal basis. Under RERA an allottee is entitled to what is registered and sanctioned. Get every promised amenity into the sanctioned plan or the agreement, or treat it as not existing.",
  },
  {
    scenario:
      "The property is held by three siblings after their father's death. Two are present at the signing. The third is abroad, and the broker says a WhatsApp message confirming his consent will be enough.",
    options: [
      "That the property was inherited",
      "That two siblings signed together",
      "Relying on a WhatsApp message instead of a registered Power of Attorney",
      "That the third owner lives abroad",
    ],
    answer: 2,
    explain:
      "Every co-owner must convey their share. An absent co-owner needs a properly executed and, for immovable property, registered Power of Attorney — attested at the Indian consulate if signed abroad. A WhatsApp message conveys nothing, and the sale can be challenged for that share.",
  },
  {
    scenario:
      "A resale flat has a clean Sale Deed and a clean Encumbrance Certificate. The society says ₹4.2 lakh of maintenance dues are outstanding, and the seller insists dues do not travel with the property.",
    options: [
      "The clean Encumbrance Certificate",
      "The seller's claim that dues do not pass to the buyer",
      "Buying a resale flat at all",
      "The society issuing a dues statement",
    ],
    answer: 1,
    explain:
      "An EC lists registered charges — society dues are not registered, so they never appear there. In most states unpaid dues attach to the flat and the incoming owner is pursued. Insist on a No Dues Certificate from the society before payment.",
  },
  {
    scenario:
      "An agent shows you a project, you visit twice, and he asks you to sign a one-line note saying he introduced you. The note has no brokerage rate, no validity period and no mention of who pays.",
    options: [
      "Being asked to sign an introduction note",
      "Visiting the project twice",
      "A note with no rate, no term and no paying party",
      "The agent showing an unregistered project",
    ],
    answer: 2,
    explain:
      "An introduction record is reasonable and protects the agent. What makes this a red flag is the missing terms: an open-ended note can be used to claim brokerage at any rate, from either side, years later. Settle the rate, the payable-on event and the validity in writing first.",
  },
  {
    scenario:
      "A plot is advertised as “GMADA approved”. The seller shows a change-of-land-use letter and a receipt for an application fee, but no sanctioned layout plan and no plot-wise approval.",
    options: [
      "The change-of-land-use letter",
      "Treating an application receipt as approval",
      "The plot being sold by an individual",
      "Advertising the authority's name",
    ],
    answer: 1,
    explain:
      "Change of land use is one step; it is not layout sanction, and an application receipt proves only that a fee was paid. “Approved” requires a sanctioned layout with your plot shown on it. Verify the approval number directly with the authority, never from a seller's photocopy.",
  },
];

/* ------------------------------------------------------------------ */
/* Document Checklist                                                   */
/* ------------------------------------------------------------------ */

export interface ChecklistItem {
  doc: string;
  why: string;
  critical?: boolean;
}

export interface ChecklistGroup {
  group: string;
  items: ChecklistItem[];
}

export const CHECKLISTS: Record<string, { label: string; blurb: string; groups: ChecklistGroup[] }> = {
  buy: {
    label: "Buying a property",
    blurb: "What to verify before you pay anything beyond a refundable token.",
    groups: [
      {
        group: "Title and ownership",
        items: [
          { doc: "Mother deed / chain of title (30 years)", why: "Traces ownership back through every transfer. Breaks in the chain are the most expensive defect to discover late.", critical: true },
          { doc: "Current Sale Deed of the seller", why: "Proves how the present owner acquired the property, and that the name matches their ID exactly.", critical: true },
          { doc: "Encumbrance Certificate (13–30 years)", why: "Reveals registered mortgages, charges and litigation against the property.", critical: true },
          { doc: "Mutation / Jamabandi / revenue record", why: "Confirms the revenue department recognises the seller as owner and that tax is billed to them." },
          { doc: "Legal heir certificate or succession certificate", why: "Required where the property is inherited — every co-owner must join the conveyance.", critical: true },
        ],
      },
      {
        group: "Approvals and compliance",
        items: [
          { doc: "Sanctioned layout / building plan", why: "Confirms the plot or structure is as approved. Deviations can invite demolition or regularisation costs.", critical: true },
          { doc: "Change of Land Use (CLU) certificate", why: "For agricultural land converted to residential or commercial use — without it the sale is legally fragile.", critical: true },
          { doc: "RERA registration number of the project", why: "Verify it on your state's RERA portal, along with the declared completion date and carpet area." },
          { doc: "Occupancy Certificate / Completion Certificate", why: "Confirms the building was built as approved and is fit to occupy. Utilities and resale both depend on it.", critical: true },
          { doc: "Fire and environment clearances", why: "Applicable to high-rise and larger projects; their absence stalls the Occupancy Certificate." },
        ],
      },
      {
        group: "Dues and no-objections",
        items: [
          { doc: "Latest property tax receipt", why: "Unpaid municipal tax attaches to the property and is recovered from the new owner." },
          { doc: "No Dues Certificate from the society", why: "Society maintenance arrears do not appear on an Encumbrance Certificate but still follow the flat.", critical: true },
          { doc: "Electricity and water bill clearance", why: "Outstanding utility dues can block a new connection in your name." },
          { doc: "Bank NOC / loan closure letter", why: "Essential if the property was mortgaged — confirms the lender's charge is released.", critical: true },
        ],
      },
      {
        group: "At registration",
        items: [
          { doc: "PAN and Aadhaar of both parties", why: "Required at the Sub-Registrar, and for TDS compliance." },
          { doc: "TDS challan (Form 26QB) where price exceeds ₹50 lakh", why: "1% TDS must be deducted and deposited by the buyer under Section 194-IA. Non-compliance is the buyer's liability.", critical: true },
          { doc: "Stamp duty payment receipt", why: "Duty must be paid at the correct circle rate; under-stamping invites penalty and impounding." },
          { doc: "Two witnesses with ID", why: "Registration cannot be completed without them." },
        ],
      },
    ],
  },
  sell: {
    label: "Selling a property",
    blurb: "What a serious buyer will ask for — assemble it before you list.",
    groups: [
      {
        group: "Prove your title",
        items: [
          { doc: "Original Sale Deed and chain of title", why: "A buyer's advocate will want originals, not copies. Missing originals depress your price immediately.", critical: true },
          { doc: "Encumbrance Certificate up to date", why: "Producing a clean EC upfront shortens due diligence and builds trust." },
          { doc: "Loan closure and charge release from the bank", why: "A subsisting mortgage entry blocks registration until formally released.", critical: true },
          { doc: "Approved plan and Occupancy Certificate", why: "Their absence is the most common reason a resale deal collapses at the last stage." },
        ],
      },
      {
        group: "Clear the dues",
        items: [
          { doc: "Property tax paid to date", why: "Any arrears will be deducted from your price, usually at more than face value." },
          { doc: "Society No Dues Certificate and transfer NOC", why: "Many societies will not permit transfer until dues clear and the NOC issues.", critical: true },
          { doc: "Utility bills settled", why: "Buyers routinely make final payment conditional on this." },
        ],
      },
      {
        group: "Tax position",
        items: [
          { doc: "Capital gains computation", why: "Long-term gains attract tax; exemptions under Sections 54 / 54EC need planning before you sign, not after.", critical: true },
          { doc: "Lower TDS certificate, if an NRI seller", why: "Without it, TDS is deducted at a much higher rate on the full consideration, not just the gain.", critical: true },
        ],
      },
    ],
  },
  rent: {
    label: "Renting out a property",
    blurb: "The minimum paperwork before you hand over keys.",
    groups: [
      {
        group: "Verify the tenant",
        items: [
          { doc: "Aadhaar and PAN of every adult occupant", why: "Identifies exactly who will occupy, not just who signs." },
          { doc: "Employer letter or business proof", why: "Establishes the ability to pay rent through the term." },
          { doc: "Police verification", why: "Mandatory in several states and a genuine protection for the owner.", critical: true },
          { doc: "Previous landlord reference", why: "The cheapest due diligence available, and the most predictive." },
        ],
      },
      {
        group: "The agreement",
        items: [
          { doc: "Leave and Licence agreement on correct stamp paper", why: "An unstamped agreement is not admissible in evidence when you need it most.", critical: true },
          { doc: "Registration, if the term is 12 months or more", why: "Most states require registration at or beyond 12 months — the usual reason for an 11-month term." },
          { doc: "Signed inventory of fittings with photographs", why: "The only reliable way to settle a deposit dispute at the end of the tenancy.", critical: true },
          { doc: "Meter readings recorded on the handover date", why: "Fixes the starting point for utility liability." },
        ],
      },
      {
        group: "Ongoing",
        items: [
          { doc: "Rent received through banking channels", why: "Creates a clean record for income tax and for proving default." },
          { doc: "Society intimation of the tenancy", why: "Most societies require it, and it keeps your NOC position clean." },
        ],
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Quotes — public-domain authors only                                  */
/* ------------------------------------------------------------------ */

export interface Quote {
  text: string;
  author: string;
  context: string;
}

export const QUOTES: Quote[] = [
  { text: "Buy land, they're not making it anymore.", author: "Mark Twain", context: "1835–1910" },
  { text: "Real estate cannot be lost or stolen, nor can it be carried away. Purchased with common sense, paid for in full, and managed with reasonable care, it is about the safest investment in the world.", author: "Franklin D. Roosevelt", context: "1882–1945" },
  { text: "Ninety percent of all millionaires become so through owning real estate.", author: "Andrew Carnegie", context: "1835–1919" },
  { text: "Landlords grow rich in their sleep without working, risking or economising.", author: "John Stuart Mill", context: "1806–1873" },
  { text: "Every person who invests in well-selected real estate in a growing section of a prosperous community adopts the surest and safest method of becoming independent.", author: "Theodore Roosevelt", context: "1858–1919" },
  { text: "The best investment on earth is earth.", author: "Louis Glickman", context: "Attributed, mid-20th century" },
  { text: "Price is what you pay. Value is what you get.", author: "Benjamin Graham", context: "1894–1976" },
  { text: "A man's home is his castle.", author: "Sir Edward Coke", context: "1552–1634" },
];
