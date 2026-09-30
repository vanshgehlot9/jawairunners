/**
 * runs.ts
 * -------
 * Single source of truth for the Jawai Runners 2026 Conservation Series.
 *
 * Every run carries both its content data (dates, distances, schedule…)
 * and its visual-system data (visualType, theme, status, accent) so that
 * UI components can render dynamically without any hardcoded run-ID checks.
 *
 * Adding Run 04 or 05 later requires only a new entry here.
 */

// ─── Visual System Types ───────────────────────────────────────────────────

/**
 * Drives the RunVisual component.
 *
 * "awaken"   — movement / dawn / seed-scatter motif
 * "restore"  — growth / water / rewilding motif
 * "celebrate"— milestone / collective / horizon motif
 */
export type RunVisualType = "awaken" | "restore" | "celebrate";

/**
 * Drives visual intensity / presence.
 *
 * "selected"  — active, stronger presence, full motion
 * "upcoming"  — quieter treatment, reduced opacity
 * "completed" — muted, progress/check indication
 */
export type RunStatus = "selected" | "upcoming" | "completed";

/**
 * Semantic theme tag — used for accessible labels and future filtering.
 */
export type RunTheme = "launch" | "restoration" | "milestone";

/**
 * Primary colour accent for the run — derived from the Jawai Runners palette.
 */
export type RunAccent = {
  /** Hex used for SVG strokes/fills */
  hex: string;
  /** Human-readable label */
  label: string;
};

// ─── Run Data Model ────────────────────────────────────────────────────────

export type RunDetails = {
  /** Stable identifier */
  id: string;
  /** Display label: "RUN 01" */
  number: string;
  /** Short run name: "AWAKEN" */
  name: string;
  /** "THE DAWN RUN" */
  codeName: string;
  /** "25 OCTOBER" */
  date: string;

  // ── Visual system ──
  /** Which SVG motif to render */
  visualType: RunVisualType;
  /** Semantic campaign theme */
  theme: RunTheme;
  /** Current status — drives visual weight */
  status: RunStatus;
  /** Brand accent colour for this run */
  accent: RunAccent;
  /** Short ARIA label for the decorative visual */
  visualLabel: string;

  // ── Content ──
  subtitle: string;
  missionFocus: string;
  description: string;
  terrain: string;
  elevationGain: string;
  highlight: string;
  image: string;
  distances: { label: string; tag: string }[];
  schedule: { time: string; activity: string }[];
};

// ─── Run Definitions ──────────────────────────────────────────────────────

export const RUNS: RunDetails[] = [
  {
    id: "run-1",
    number: "RUN 01",
    name: "AWAKEN",
    codeName: "THE DAWN RUN",
    date: "25 OCTOBER",

    visualType: "awaken",
    theme: "launch",
    status: "upcoming",
    accent: { hex: "#C69A3A", label: "gold" },
    visualLabel: "Dawn movement — seed scatter trail motif for Run 01 Awaken",

    subtitle: "Launch of the 100,000 Native Plants Campaign",
    missionFocus: "Planting Campaign Inauguration & Seed Pod Trail Run",
    description:
      "Awaken the ancient granite hills of Jawai. This inaugural run officially kicks off our mission to plant 100,000 native saplings. Every runner carries native seed balls into remote wildlife corridors, leaving living roots in their wake.",
    terrain: "Granite Foothills, Sandy Riverbed & Savannah Trails",
    elevationGain: "+280m Elevation",
    highlight: "First 10,000 Native Saplings Flag-Off & Nursery Dedication",
    image: "/Jawai/IMG20260305063812.jpg",
    distances: [
      { label: "21 KM", tag: "Granite Trail Half Marathon" },
      { label: "10 KM", tag: "Wilderness Challenge" },
      { label: "5 KM",  tag: "Community Eco Run" },
    ],
    schedule: [
      { time: "05:30 AM", activity: "Assembly & Zero-Plastic Hydration Station" },
      { time: "06:00 AM", activity: "100,000 Native Plants Campaign Launch & Seed Ball Distribution" },
      { time: "06:15 AM", activity: "21KM Flag Off (Granite Corridors)" },
      { time: "06:30 AM", activity: "10KM & 5KM Flag Off" },
      { time: "09:30 AM", activity: "Community Plantation Ceremony & Breakfast" },
    ],
  },
  {
    id: "run-2",
    number: "RUN 02",
    name: "RESTORE",
    codeName: "THE REWILDING RUN",
    date: "7 NOVEMBER",

    visualType: "restore",
    theme: "restoration",
    status: "upcoming",
    accent: { hex: "#4A7C59", label: "forest-green" },
    visualLabel: "Growing native plant motif — rewilding and water heritage for Run 02 Restore",

    subtitle: "Progress Update & Restoration Sites",
    missionFocus: "Inspection of Restored Sites & Stepwell Water Heritage",
    description:
      "Witness living recovery in real time. Run 2 winds directly through active rewilding enclosures and renovated heritage stepwells managed by Stepwells Renovater Foundation. Experience how native vegetation and restored water structures breathe life back into Jawai.",
    terrain: "Ancient Baori Trails, Riparian Grasslands & Hillock Passes",
    elevationGain: "+340m Elevation",
    highlight: "Field Inspection of Germination Zones & Heritage Stepwells",
    image: "/Jawai/IMG20260304174847.jpg",
    distances: [
      { label: "21 KM", tag: "Stepwell & Ridge Challenge" },
      { label: "10 KM", tag: "Water Corridor Run" },
      { label: "5 KM",  tag: "Heritage Walk & Jog" },
    ],
    schedule: [
      { time: "05:45 AM", activity: "Morning Briefing & Reusable Bottle Check" },
      { time: "06:15 AM", activity: "Mass Flag-Off from Ancient Stepwell Oasis" },
      { time: "07:30 AM", activity: "Mid-Trail Progress Inspection at Restoration Zone 03" },
      { time: "09:45 AM", activity: "Ecological Report by Conservation Botanists" },
    ],
  },
  {
    id: "run-3",
    number: "RUN 03",
    name: "CELEBRATE",
    codeName: "THE TRIUMPH RUN",
    date: "25 DECEMBER",

    visualType: "celebrate",
    theme: "milestone",
    status: "upcoming",
    accent: { hex: "#8C6A43", label: "earth-amber" },
    visualLabel: "Milestone horizon — collective achievement motif for Run 03 Celebrate",

    subtitle: "Celebrating the Campaign's First Major Restoration Milestone",
    missionFocus: "Culmination Gala & 100,000 Plant Milestone Festivity",
    description:
      "A winter festival of ecological stewardship. Run 3 is the triumphant celebration of achieving our first major restoration milestone. We honour our runners, local Rabari guardians, forest rangers, and partners who made this dream reality.",
    terrain: "Jawai Dam Reservoir Vistas, Golden Hour Escarpments",
    elevationGain: "+250m Elevation",
    highlight: "Medal Ceremony, Living Forest Dedication & Community Feast",
    image: "/Jawai/Lake_Scene_1280x720.jpg",
    distances: [
      { label: "21 KM", tag: "Victory Ridge Run" },
      { label: "10 KM", tag: "Sunset Reservoir Trail" },
      { label: "5 KM",  tag: "Family Celebration Run" },
    ],
    schedule: [
      { time: "06:00 AM", activity: "Winter Solstice Dawn Gathering" },
      { time: "06:30 AM", activity: "Grand Trilogy Flag-Off" },
      { time: "10:00 AM", activity: "Milestone Announcement & Tree Naming Honors" },
      { time: "11:30 AM", activity: "Rabari Cultural Showcase & Zero-Waste Banquet" },
    ],
  },
];
