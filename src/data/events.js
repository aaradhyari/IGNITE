// ============================================================
// IGNITE — Vismaya · Event data architecture (single source of truth)
// No event data is duplicated across components.
// ============================================================

// Club definitions — accents only. The dark IGNITE foundation is shared.
export const clubs = [
  {
    id: 'innovation',
    number: '01',
    name: 'INNOVATION',
    color: '#FFB800',
    secondary: '#FFD166',
    tagline: 'Ideas are only the beginning.',
    focus: [
      'Imagination',
      'Problem-solving',
      'Prototyping',
      'Narrative',
    ],
    blurb:
      'Where a single question becomes a venture. Innovation is the discipline of turning curiosity into something the world has never seen.',
  },
  {
    id: 'it',
    number: '02',
    name: 'IT',
    color: '#5B8CFF',
    secondary: '#38D9FF',
    tagline: 'Logic made visible.',
    focus: ['Logic', 'Code', 'Computation', 'Systems'],
    blurb:
      'The quiet engine room of the future. IT is about thinking precisely, building resiliently, and making machines do the impossible.',
  },
  {
    id: 'photography',
    number: '03',
    name: 'PHOTOGRAPHY',
    color: '#E8E8E8',
    secondary: '#A7B0BC',
    tagline: 'The world, observed.',
    focus: ['Observation', 'Perspective', 'Storytelling'],
    blurb:
      'A lens is an argument about what matters. Photography trains the eye to notice what everyone else walks past.',
  },
  {
    id: 'robotics',
    number: '04',
    name: 'ROBOTICS',
    color: '#FF5C5C',
    secondary: '#FFB800',
    tagline: 'Engineering in motion.',
    focus: ['Engineering', 'Control', 'Autonomy', 'Competition'],
    blurb:
      'Where theory meets torque. Robotics is the art of giving intelligence a body and sending it into the arena.',
  },
]

export const events = [
  // ---------------- INNOVATION ----------------
  {
    id: 'ideaforge',
    slug: 'ideaforge',
    path: '/events/innovation/ideaforge',
    club: 'INNOVATION',
    clubId: 'innovation',
    clubColor: '#FFB800',
    number: '01',
    title: 'IDEAFORGE',
    tagline: 'Imagine it. Shape it. Ignite it.',
    format: 'Team',
    teamSize: '2–4',
    duration: '90 minutes',
    date: '23 November 2026',
    venue: 'TO BE ANNOUNCED',
    description:
      'IDEAFORGE is a high-velocity innovation sprint. Teams take an open problem and drive it from raw curiosity to a pitched, defensible concept — no code required, only clear thinking and the courage to build something new.',
    overview:
      'You will not be handed a brief. You will be handed a question. IDEAFORGE rewards the teams that understand the problem deepest before they ever reach for a solution, and that can communicate a vision others want to join.',
    flow: [
      { stage: 'Problem', detail: 'Receive the open challenge and frame the real question.' },
      { stage: 'Understand', detail: 'Map the people, constraints and stakes behind it.' },
      { stage: 'Ideate', detail: 'Generate, diverge and converge on a sharp concept.' },
      { stage: 'Build', detail: 'Prototype the idea into something tangible and testable.' },
      { stage: 'Pitch', detail: 'Present a confident, evidence-led case to the panel.' },
    ],
    deliverables: [
      'A one-page problem brief',
      'A visual concept / low-fidelity prototype',
      'A 3-minute final pitch',
    ],
    judging: [
      { criterion: 'Innovation', percent: 25 },
      { criterion: 'Problem Understanding', percent: 20 },
      { criterion: 'Feasibility', percent: 20 },
      { criterion: 'Social / Environmental Impact', percent: 20 },
      { criterion: 'Presentation', percent: 15 },
    ],
    rules: [
      'Teams of 2–4 participants from the same institution.',
      'All ideation and building must happen within the 90-minute window.',
      'External pre-built solutions or prior submissions are not permitted.',
      'Judges’ decisions on scoring and eligibility are final.',
    ],
    prizes: [
      { title: 'Winner', type: 'winner' },
      { title: 'Runner-up', type: 'runnerup' },
      { title: 'Most Innovative Idea', type: 'special' },
      { title: 'Best Presentation', type: 'special' },
    ],
    specialRule:
      'Bring a device for notes; the strongest teams document their reasoning, not just their result.',
  },
  {
    id: 'venturex',
    slug: 'venturex',
    path: '/events/innovation/venturex',
    club: 'INNOVATION',
    clubId: 'innovation',
    clubColor: '#FFB800',
    number: '02',
    title: 'VENTUREX',
    tagline: 'From idea to impact.',
    format: 'Team',
    teamSize: '2–4',
    duration: '75 minutes',
    date: '23 November 2026',
    venue: 'TO BE ANNOUNCED',
    description:
      'VENTUREX is a live business-building race. Teams craft a venture around a market scenario, then survive a mid-event disruption that forces them to pivot and re-pitch in real time.',
    overview:
      'Strategy under pressure is the point. VENTUREX tests whether a team can hold a compelling vision while the ground shifts beneath it — and still land the pitch.',
    flow: [
      { stage: 'Market Scenario', detail: 'Receive the sector, the players and the constraints.' },
      { stage: 'Problem', detail: 'Identify the unmet need worth solving.' },
      { stage: 'Business Idea', detail: 'Shape the product, model and wedge.' },
      { stage: 'Business Model', detail: 'Define revenue, unit economics and scale.' },
      { stage: 'Pitch', detail: 'Deliver the venture — then adapt after the twist.' },
    ],
    deliverables: [
      'A business model canvas',
      'A 10-minute adaptation response to the disruption',
      'A final 3-minute investor pitch',
    ],
    judging: [
      { criterion: 'Originality', percent: 20 },
      { criterion: 'Business Model', percent: 20 },
      { criterion: 'Feasibility', percent: 20 },
      { criterion: 'Adaptability', percent: 20 },
      { criterion: 'Pitch', percent: 20 },
    ],
    rules: [
      'Teams of 2–4 participants from the same institution.',
      'A market-disruption twist is introduced at the 40-minute mark.',
      'Teams receive a 10-minute adaptation period to rework their model.',
      'Pivots must be clearly justified in the final pitch.',
    ],
    prizes: [
      { title: 'Winner', type: 'winner' },
      { title: 'Runner-up', type: 'runnerup' },
      { title: 'Best Startup Concept', type: 'special' },
      { title: 'Best Pivot', type: 'special' },
    ],
    specialRule:
      'The disruption twist is revealed only on stage — adaptability is scored as heavily as the original idea.',
  },

  // ---------------- IT ----------------
  {
    id: 'coderush',
    slug: 'coderush',
    path: '/events/it/coderush',
    club: 'IT',
    clubId: 'it',
    clubColor: '#5B8CFF',
    number: '03',
    title: 'CODERUSH',
    tagline: 'Think fast. Code faster.',
    format: 'Individual',
    teamSize: 'Individual',
    duration: '90 minutes',
    date: '23 November 2026',
    venue: 'TO BE ANNOUNCED',
    description:
      'CODERUSH is a solo coding gauntlet across three escalating stages. Logic first, then speed, then the debugging trench — where only the calm survive.',
    overview:
      'This is a test of mind, not memory. CODERUSH rewards participants who reason cleanly under a clock and keep their composure when the code fights back.',
    flow: [
      { stage: 'Quick Logic', detail: 'Warm-up reasoning and algorithmic puzzles.' },
      { stage: 'Code Arena', detail: 'Build working solutions against the clock.' },
      { stage: 'Debug the Impossible', detail: 'Repair broken code under pressure.' },
    ],
    deliverables: [
      'Submitted solutions for each stage',
      'A cleaned debug log for the final trench',
    ],
    judging: [
      { criterion: 'Stage 1 — Quick Logic', percent: 20 },
      { criterion: 'Stage 2 — Code Arena', percent: 50 },
      { criterion: 'Stage 3 — Debug the Impossible', percent: 30 },
    ],
    rules: [
      'Open to individual participants only.',
      'AI coding assistants and pre-written snippets are prohibited.',
      'All submissions must be authored live during the event.',
      'Scoring totals 100 across the three stages.',
    ],
    prizes: [
      { title: 'Coding Champion', type: 'winner' },
      { title: 'Runner-up', type: 'runnerup' },
      { title: 'Best Debugger', type: 'special' },
    ],
    specialRule:
      'AI coding assistants are strictly prohibited — this challenge is about your own reasoning, under your own timer.',
  },

  // ---------------- PHOTOGRAPHY ----------------
  {
    id: 'frame-the-unseen',
    slug: 'frame-the-unseen',
    path: '/events/photography/frame-the-unseen',
    club: 'PHOTOGRAPHY',
    clubId: 'photography',
    clubColor: '#E8E8E8',
    number: '04',
    title: 'FRAME THE UNSEEN',
    tagline: 'Look closer. See differently.',
    format: 'Individual',
    teamSize: 'Individual',
    duration: '2 hours',
    date: '23 November 2026',
    venue: 'TO BE ANNOUNCED',
    description:
      'FRAME THE UNSEEN asks you to photograph what others walk past. A single theme, a sharp eye, and the discipline to say something true in a frame.',
    overview:
      'Theme: WHAT OTHERS DON’T NOTICE. The challenge is not technical perfection — it is perception. Show us the detail the world keeps hidden.',
    flow: [
      { stage: 'Observe', detail: 'Read the theme and scout your environment.' },
      { stage: 'Capture', detail: 'Photograph the unseen across the venue.' },
      { stage: 'Curate', detail: 'Select your strongest frames and one hero.' },
      { stage: 'Present', detail: 'Submit images with captions and a statement.' },
    ],
    deliverables: [
      '3 photographs on the theme',
      '1 hero image',
      'Short captions for each frame',
      'A 100-word artist statement',
    ],
    judging: [
      { criterion: 'Creativity', percent: 30 },
      { criterion: 'Composition', percent: 25 },
      { criterion: 'Storytelling', percent: 25 },
      { criterion: 'Technical Execution', percent: 10 },
      { criterion: 'Interpretation', percent: 10 },
    ],
    rules: [
      'Open to individual participants only.',
      'AI-generated or heavily AI-modified imagery is prohibited.',
      'All photographs must be captured during the event window.',
      'Basic colour and tone adjustment is permitted; composites are not.',
    ],
    prizes: [
      { title: 'Photographer of IGNITE', type: 'winner' },
      { title: 'Runner-up', type: 'runnerup' },
      { title: 'Best Composition', type: 'special' },
      { title: 'Best Story', type: 'special' },
      { title: "People's Choice", type: 'special' },
    ],
    specialRule:
      'AI-generated imagery is prohibited — every frame must be light you actually captured.',
  },

  // ---------------- ROBOTICS ----------------
  {
    id: 'robowars',
    slug: 'robowars',
    path: '/events/robotics/robowars',
    club: 'ROBOTICS',
    clubId: 'robotics',
    clubColor: '#FF5C5C',
    number: '05',
    title: 'ROBOWARS',
    tagline: 'Build. Battle. Conquer.',
    format: 'Team',
    teamSize: '2–4',
    duration: '2 hours',
    date: '23 November 2026',
    venue: 'TO BE ANNOUNCED',
    description:
      'ROBOWARS is engineering under fire. Build a machine, pass inspection, survive the trials, then take it into the arena where only one bot walks away.',
    overview:
      'Strategy is as decisive as steel. ROBOWARS rewards teams that engineer for reliability first and aggression second — because the arena punishes fragility.',
    flow: [
      { stage: 'Technical Inspection', detail: 'Pass safety and build compliance.' },
      { stage: 'Arena Trials', detail: 'Prove control across the obstacle course.' },
      { stage: 'Robo Battle', detail: 'Enter the arena and outlast the opposition.' },
    ],
    deliverables: [
      'A competition-ready robot',
      'A short engineering summary',
    ],
    judging: [
      { criterion: 'Technical Trial', percent: 20 },
      { criterion: 'Obstacle Run', percent: 20 },
      { criterion: 'Precision Challenge', percent: 20 },
      { criterion: 'Robo Battle', percent: 40 },
    ],
    rules: [
      'Teams of 2–4 participants from the same institution.',
      'Robots must pass technical inspection before competing.',
      'Weight, power and weapon limits are announced at the briefing.',
      'Sportsmanship and safe conduct are mandatory at all times.',
    ],
    prizes: [
      { title: 'RoboWars Champion', type: 'winner' },
      { title: 'Runner-up', type: 'runnerup' },
      { title: 'Best Engineering', type: 'special' },
      { title: 'Best Strategy', type: 'special' },
    ],
    specialRule:
      'Reliability beats raw power — the bot still running at the final bell is the one that wins.',
  },
  {
    id: 'autonomous-arena',
    slug: 'autonomous-arena',
    path: '/events/robotics/autonomous-arena',
    club: 'ROBOTICS',
    clubId: 'robotics',
    clubColor: '#FF5C5C',
    number: '06',
    title: 'AUTONOMOUS ARENA',
    tagline: 'No remote. No second chances.',
    format: 'Team',
    teamSize: '2–4',
    duration: '2 hours',
    date: '23 November 2026',
    venue: 'TO BE ANNOUNCED',
    description:
      'AUTONOMOUS ARENA is pure machine intelligence. No human control, no remote — your robot must perceive, decide and complete the course on its own.',
    overview:
      'From start to finish, the system is on its own. AUTONOMOUS ARENA rewards robust sensing, sound decision-making and engineering that holds up when no one is at the sticks.',
    flow: [
      { stage: 'Start', detail: 'Initialize and self-check at the launch point.' },
      { stage: 'Navigate', detail: 'Plan a path through the arena.' },
      { stage: 'Identify', detail: 'Detect and classify the target markers.' },
      { stage: 'Avoid Obstacles', detail: 'React safely to dynamic hazards.' },
      { stage: 'Complete Task', detail: 'Execute the objective precisely.' },
      { stage: 'Reach Finish', detail: 'Cross the line under autonomous control.' },
    ],
    deliverables: [
      'A fully autonomous robot',
      'A brief system design note',
    ],
    judging: [
      { criterion: 'Task Completion', percent: 35 },
      { criterion: 'Accuracy', percent: 20 },
      { criterion: 'Time', percent: 20 },
      { criterion: 'Autonomous Decision-Making', percent: 15 },
      { criterion: 'Engineering Design', percent: 10 },
    ],
    rules: [
      'Teams of 2–4 participants from the same institution.',
      'No remote control or human intervention during a run.',
      'Each team receives two official attempts; the better score counts.',
      'Manual recovery ends the current attempt.',
    ],
    prizes: [
      { title: 'Autonomous Champion', type: 'winner' },
      { title: 'Runner-up', type: 'runnerup' },
      { title: 'Best Autonomous System', type: 'special' },
      { title: 'Most Innovative Robot', type: 'special' },
    ],
    specialRule:
      'Two official attempts are allowed — only the better score counts, so engineer for consistency, not just a single lucky run.',
  },
]

// ---- Lookups ----
export function getEventBySlug(slug) {
  return events.find((e) => e.slug === slug)
}

export function getEventsByClub(clubId) {
  return events.filter((e) => e.clubId === clubId)
}

export function getClubById(clubId) {
  return clubs.find((c) => c.id === clubId)
}
