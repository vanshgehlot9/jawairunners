/**
 * RunVisual.tsx
 * -------------
 * Reusable visual identity component for the Jawai Runners Run cards.
 *
 * DATA → STATE/TYPE → COMPONENT → VISUAL OUTPUT
 *
 * Receives `type`, `status`, and `accent` from run data.
 * Renders one of three custom SVG motifs, styled by status intensity.
 * No hardcoded run IDs. No emojis. No generic icons.
 *
 * Motifs are inspired by the Jawai landscape:
 *   awaken   — Granite horizon + a runner's forward stride + scattered seeds
 *   restore  — Stepwell rings + rising native plant + water-line
 *   celebrate— Concentric milestone arcs + collective summit line
 *
 * Animations are CSS @keyframes injected once via a style tag.
 * Framer-motion is not used here — pure SVG + CSS for portability.
 */

"use client";

import React from "react";
import type { RunVisualType, RunStatus } from "@/lib/runs";

// ─── Props ────────────────────────────────────────────────────────────────

interface RunVisualProps {
  type: RunVisualType;
  status: RunStatus;
  accentHex: string;
  /** Accessible label for screen readers */
  label: string;
  /** Container size in px — defaults to 48 */
  size?: number;
}

// ─── Status multipliers ───────────────────────────────────────────────────

const INTENSITY: Record<RunStatus, { opacity: number; motionScale: string; strokeW: number }> = {
  selected:  { opacity: 1,    motionScale: "1",    strokeW: 1.6 },
  upcoming:  { opacity: 0.72, motionScale: "0.92", strokeW: 1.4 },
  completed: { opacity: 0.45, motionScale: "0.88", strokeW: 1.2 },
};

// ─── Motif: AWAKEN ────────────────────────────────────────────────────────
// Granite horizon silhouette + forward momentum path + seed dots

function AwakenMotif({
  accent,
  sw,
  isSelected,
}: {
  accent: string;
  sw: number;
  isSelected: boolean;
}) {
  // Neutral dark for non-accent strokes
  const neutral = isSelected ? "rgba(255,255,255,0.55)" : "rgba(30,48,38,0.45)";

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      {/* Horizon — granite ridge silhouette */}
      <path
        d="M2 34 L8 26 L14 30 L20 20 L28 28 L35 18 L42 24 L46 22"
        stroke={neutral}
        strokeWidth={sw * 0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Forward momentum arc — runner's stride path */}
      <path
        d="M6 38 Q18 28 32 36"
        stroke={accent}
        strokeWidth={sw}
        strokeLinecap="round"
        fill="none"
        className={isSelected ? "run-visual-stride" : ""}
        style={isSelected ? { strokeDasharray: 36, strokeDashoffset: 36 } : {}}
      />

      {/* Seed dots — scattered along the trail */}
      <circle cx="12" cy="40" r="1.2" fill={accent} opacity="0.7" />
      <circle cx="19" cy="38" r="0.9" fill={accent} opacity="0.55" />
      <circle cx="26" cy="39" r="1.1" fill={accent} opacity="0.65" />
      <circle cx="33" cy="37" r="0.8" fill={accent} opacity="0.5" />

      {/* Dawn arc — horizon glow */}
      <path
        d="M14 20 A10 10 0 0 1 34 20"
        stroke={accent}
        strokeWidth={sw * 0.7}
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      {/* Single upward tick — forward direction */}
      <line
        x1="36"
        y1="34"
        x2="42"
        y2="26"
        stroke={accent}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <line
        x1="38"
        y1="26"
        x2="42"
        y2="26"
        stroke={accent}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <line
        x1="42"
        y1="26"
        x2="42"
        y2="30"
        stroke={accent}
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Motif: RESTORE ───────────────────────────────────────────────────────
// Concentric stepwell rings + rising native plant stem + water ripple

function RestoreMotif({
  accent,
  sw,
  isSelected,
}: {
  accent: string;
  sw: number;
  isSelected: boolean;
}) {
  const neutral = isSelected ? "rgba(255,255,255,0.45)" : "rgba(30,48,38,0.40)";

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      {/* Stepwell rings — heritage water architecture */}
      <circle cx="24" cy="36" r="10" stroke={neutral} strokeWidth={sw * 0.8} />
      <circle cx="24" cy="36" r="6.5" stroke={neutral} strokeWidth={sw * 0.7} opacity="0.7" />
      <circle cx="24" cy="36" r="3" stroke={neutral} strokeWidth={sw * 0.6} opacity="0.5" />

      {/* Water ripple — horizontal line through stepwell centre */}
      <line
        x1="10"
        y1="36"
        x2="38"
        y2="36"
        stroke={accent}
        strokeWidth={sw * 0.6}
        strokeDasharray="2 3"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Native plant stem — growing upward from water */}
      <line
        x1="24"
        y1="35"
        x2="24"
        y2="14"
        stroke={accent}
        strokeWidth={sw}
        strokeLinecap="round"
        className={isSelected ? "run-visual-grow" : ""}
        style={isSelected ? { strokeDasharray: 22, strokeDashoffset: 22 } : {}}
      />

      {/* Left branch */}
      <path
        d="M24 22 Q18 18 16 12"
        stroke={accent}
        strokeWidth={sw * 0.85}
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />

      {/* Right branch */}
      <path
        d="M24 18 Q30 14 32 9"
        stroke={accent}
        strokeWidth={sw * 0.85}
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />

      {/* Bud tip */}
      <circle cx="24" cy="13" r="1.6" fill={accent} opacity="0.9" />
    </svg>
  );
}

// ─── Motif: CELEBRATE ────────────────────────────────────────────────────
// Milestone arcs radiating outward + collective summit silhouette

function CelebrateMotif({
  accent,
  sw,
  isSelected,
}: {
  accent: string;
  sw: number;
  isSelected: boolean;
}) {
  const neutral = isSelected ? "rgba(255,255,255,0.50)" : "rgba(30,48,38,0.40)";

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      {/* Milestone arcs — concentric outward rings from summit point */}
      <path
        d="M10 38 A18 18 0 0 1 38 38"
        stroke={neutral}
        strokeWidth={sw * 0.8}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M15 34 A12 12 0 0 1 33 34"
        stroke={neutral}
        strokeWidth={sw * 0.75}
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
      <path
        d="M19 30 A7 7 0 0 1 29 30"
        stroke={accent}
        strokeWidth={sw * 0.9}
        strokeLinecap="round"
        fill="none"
        className={isSelected ? "run-visual-arc" : ""}
        style={isSelected ? { strokeDasharray: 18, strokeDashoffset: 18 } : {}}
      />

      {/* Summit triangle — collective peak */}
      <path
        d="M24 10 L16 26 L32 26 Z"
        stroke={accent}
        strokeWidth={sw}
        strokeLinejoin="round"
        fill="none"
      />

      {/* Summit mark dot */}
      <circle cx="24" cy="10" r="1.8" fill={accent} />

      {/* Rays — emanating from summit */}
      <line x1="24" y1="7" x2="24" y2="4" stroke={accent} strokeWidth={sw * 0.7} strokeLinecap="round" opacity="0.6" />
      <line x1="27.5" y1="8" x2="30" y2="6" stroke={accent} strokeWidth={sw * 0.7} strokeLinecap="round" opacity="0.5" />
      <line x1="20.5" y1="8" x2="18" y2="6" stroke={accent} strokeWidth={sw * 0.7} strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────

export function RunVisual({ type, status, accentHex, label, size = 48 }: RunVisualProps) {
  const isSelected = status === "selected";
  const { opacity, motionScale, strokeW } = INTENSITY[status];

  const motifProps = { accent: accentHex, sw: strokeW, isSelected };

  const motifMap: Record<RunVisualType, React.ReactNode> = {
    awaken:    <AwakenMotif    {...motifProps} />,
    restore:   <RestoreMotif   {...motifProps} />,
    celebrate: <CelebrateMotif {...motifProps} />,
  };

  return (
    <>
      {/* Inject CSS animations once globally */}
      <style>{`
        @keyframes run-stride {
          to { stroke-dashoffset: 0; }
        }
        @keyframes run-grow {
          to { stroke-dashoffset: 0; }
        }
        @keyframes run-arc {
          to { stroke-dashoffset: 0; }
        }
        .run-visual-stride {
          animation: run-stride 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
        }
        .run-visual-grow {
          animation: run-grow 1.0s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
        }
        .run-visual-arc {
          animation: run-arc 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;
        }
      `}</style>

      <div
        role="img"
        aria-label={label}
        style={{
          width: size,
          height: size,
          opacity,
          transform: `scale(${motionScale})`,
          transition: "opacity 0.35s ease, transform 0.35s ease",
          flexShrink: 0,
        }}
      >
        {motifMap[type]}
      </div>
    </>
  );
}
