/* Readiness quiz data (SL_BAR) — extracted verbatim from the live app.js so the dock's in-chat quiz runs on the new site */
(() => {
    const QUESTIONS = [
      {
        q: "If a key staff member left tomorrow, could someone follow written steps and do their job?",
        weight: 20,
        options: [
          { label: "No — the steps live in people's heads", lvl: 0 },
          { label: "Partly — some things are written down", lvl: 1 },
          { label: "Yes — our key processes are documented", lvl: 2 }
        ]
      },
      {
        q: "Where do your business records — sales, bookings, stock — live today?",
        weight: 20,
        options: [
          { label: "Paper, notebooks, or memory", lvl: 0 },
          { label: "Spreadsheets, WhatsApp chats, phone photos", lvl: 1 },
          { label: "Software the team actually uses", lvl: 2 }
        ]
      },
      {
        q: "How much time goes to the same repeated tasks each week — replying, recording, reporting, chasing?",
        weight: 20,
        options: [
          { label: "Very little — our work is rarely routine", lvl: 0 },
          { label: "A few hours per person, most days", lvl: 1 },
          { label: "A huge share — the same tasks, every day", lvl: 2 }
        ]
      },
      {
        q: "Does the business already run on digital channels — WhatsApp Business, POS, an accounting app?",
        weight: 15,
        options: [
          { label: "Not really — we're mostly offline", lvl: 0 },
          { label: "Some — WhatsApp yes, the rest is manual", lvl: 1 },
          { label: "Yes — several tools, used daily", lvl: 2 }
        ]
      },
      {
        q: "Is there one person who could own the agent — checking its work and reports every week?",
        weight: 10,
        options: [
          { label: "No obvious person right now", lvl: 0 },
          { label: "Maybe — someone could grow into it", lvl: 1 },
          { label: "Yes — I know exactly who", lvl: 2 }
        ]
      },
      {
        q: "Can you name the ONE process that, if automated, would most change your business?",
        weight: 10,
        options: [
          { label: "Not yet — everything feels tangled", lvl: 0 },
          { label: "I have two or three candidates", lvl: 1 },
          { label: "Instantly — I already know it", lvl: 2 }
        ]
      },
      {
        q: "How do you feel about a system drafting records and replies that a human approves before saving?",
        weight: 5,
        options: [
          { label: "Cautious — I'd need to see it working first", lvl: 0 },
          { label: "Open to it, with tight controls", lvl: 1 },
          { label: "That's exactly what I want", lvl: 2 }
        ]
      }
    ];
    const TIERS = [
      {
        min: 0,
        name: "Start With the Basics",
        summary: "Every agent-run business started exactly here — and you have the advantage of starting deliberately. Right now your operations live in people's heads and pockets, which means the fastest, most visible wins are all still ahead of you.",
        recs: [
          "Put ONE core process — daily sales, stock, or records — into a simple digital system first",
          "The task your team repeats most is your future agent's first job; note it down",
          "Our consultation maps the shortest path from where you are to agent-ready — in plain steps"
        ],
        cta: "Start My Systemization Plan"
      },
      {
        min: 30,
        name: "Building the Foundation",
        summary: "You have real strengths to build on — digital habits are forming and the repetitive work an agent thrives on is clearly there. The gaps are honest but fixable, and we design the system and the agent together so you never need a year of 'digital transformation' first.",
        recs: [
          "Centralize your scattered records — one place the whole team trusts",
          "Document your most repeated process; that becomes the agent's playbook",
          "A consultation will show which gap to close first for the fastest payoff"
        ],
        cta: "Map My Path to Agent-Ready"
      },
      {
        min: 55,
        name: "Nearly Ready",
        summary: "You're closer than you think. Solid digital habits, real structure, and plenty of routine work worth handing over — usually just one process to document or one record to centralize before an agent slots in. This is exactly the stage where an Agent-as-a-System build pays off fastest.",
        recs: [
          "Connect the tools you already use into one operating layer for the business",
          "Your team's daily channels are the agent's front door — it meets them where they are",
          "In the consultation we'll pick the first workflow the agent takes over"
        ],
        cta: "Book My Free Readiness Consultation"
      },
      {
        min: 80,
        name: "Agent-Ready",
        summary: "Documented processes, digital records, an owner in mind, and clear intent — your business has the foundations most companies spend a year building. An AI agent could be doing real, supervised work here within weeks, not months.",
        recs: [
          "Pilot an agent on your highest-volume workflow first — that's where weeks are won",
          "Preview→confirm control means you keep full authority while the agent works",
          "The consultation scopes your first agent: timeline, integrations, and cost"
        ],
        cta: "Scope My First Agent"
      }
    ];
    window.SL_BAR = {
      questions: QUESTIONS,
      tiers: TIERS,
      score: (answers) => Math.round(
        answers.reduce((sum, ai, qi) => sum + QUESTIONS[qi].weight * (QUESTIONS[qi].options[ai].lvl / 2), 0)
      ),
      tierFor: (score) => [...TIERS].reverse().find((t) => score >= t.min) || TIERS[0]
    };
})();
