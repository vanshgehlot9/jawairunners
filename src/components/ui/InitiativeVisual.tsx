/**
 * InitiativeVisual.tsx
 * --------------------
 * Data-driven SVG visual system for the Foundation initiatives.
 *
 * Architecture:  initiative.visualType → InitiativeVisual → SVG motif
 *
 * Three motifs — all hand-crafted, lightweight, editorial:
 *   "water"      — stepwell geometry / contour water channels
 *   "growth"     — seed / root / branching vertical growth
 *   "community"  — interconnected path / human-network geometry
 *
 * No hardcoded initiative IDs. Add a new visualType → add a new motif function.
 */

"use client";

import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────

export type InitiativeVisualType = "water" | "growth" | "community";

interface InitiativeVisualProps {
  type: InitiativeVisualType;
  /** Whether the parent row is hovered — drives subtle animation */
  isHovered: boolean;
  /** Accessible label */
  label: string;
  className?: string;
}

// ─── Shared palette ───────────────────────────────────────────────────────

const STROKE_BASE   = "rgba(30,48,38,0.35)";   // deep forest green, muted
const STROKE_ACCENT = "#4A7C59";                // live forest green
const STROKE_GOLD   = "#C69A3A";                // restrained gold

// ─── Motif: WATER — stepwell geometry + contour channels ──────────────────

function WaterMotif({ isHovered }: { isHovered: boolean }) {
  const sw = isHovered ? 1.5 : 1.2;
  const accent = isHovered ? STROKE_ACCENT : STROKE_BASE;

  return (
    <svg viewBox="0 0 80 64" fill="none" xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true" className="w-full h-full">

      {/* Stepwell — concentric descending rectangles */}
      <rect x="4"  y="54" width="72" height="1.2" rx="0.6" fill={STROKE_BASE} opacity="0.5" />
      <rect x="10" y="48" width="60" height="1"   rx="0.5" fill={STROKE_BASE} opacity="0.45" />
      <rect x="18" y="42" width="44" height="1"   rx="0.5" fill={accent}      opacity="0.6" />
      <rect x="25" y="36" width="30" height="1"   rx="0.5" fill={accent}      opacity="0.7" />
      <rect x="31" y="30" width="18" height="1"   rx="0.5" fill={accent}      opacity="0.85" />

      {/* Vertical descent lines — stepwell walls */}
      <line x1="18" y1="42" x2="18" y2="54" stroke={STROKE_BASE} strokeWidth="0.8" opacity="0.4" />
      <line x1="62" y1="42" x2="62" y2="54" stroke={STROKE_BASE} strokeWidth="0.8" opacity="0.4" />
      <line x1="25" y1="36" x2="25" y2="42" stroke={accent}      strokeWidth="0.9" opacity="0.5" />
      <line x1="55" y1="36" x2="55" y2="42" stroke={accent}      strokeWidth="0.9" opacity="0.5" />

      {/* Water surface — horizontal ripple lines */}
      <line x1="33" y1="26" x2="47" y2="26"
        stroke={STROKE_GOLD} strokeWidth={sw * 0.8} strokeLinecap="round"
        className={isHovered ? "init-visual-ripple-1" : ""}
        style={isHovered ? { strokeDasharray: 14, strokeDashoffset: 14 } : {}}
      />
      <line x1="35" y1="22" x2="45" y2="22"
        stroke={STROKE_GOLD} strokeWidth={sw * 0.6} strokeLinecap="round" opacity="0.6"
        className={isHovered ? "init-visual-ripple-2" : ""}
        style={isHovered ? { strokeDasharray: 10, strokeDashoffset: 10 } : {}}
      />

      {/* Topographic contour — landscape above */}
      <path d="M4 18 Q20 10 40 14 Q60 18 76 10"
        stroke={STROKE_BASE} strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M4 12 Q22 4  40 8  Q58 12 76 4"
        stroke={STROKE_BASE} strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.28" />
    </svg>
  );
}

// ─── Motif: GROWTH — seed / root system / emerging plant ─────────────────

function GrowthMotif({ isHovered }: { isHovered: boolean }) {
  const sw = isHovered ? 1.5 : 1.2;
  const accent = isHovered ? STROKE_ACCENT : STROKE_BASE;

  return (
    <svg viewBox="0 0 80 64" fill="none" xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true" className="w-full h-full">

      {/* Ground line */}
      <line x1="6" y1="52" x2="74" y2="52" stroke={STROKE_BASE} strokeWidth="0.9" opacity="0.5" />

      {/* Root system — spreading below ground */}
      <path d="M40 52 Q30 56 22 60" stroke={STROKE_BASE} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M40 52 Q50 56 58 60" stroke={STROKE_BASE} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M40 52 Q36 58 32 62" stroke={STROKE_BASE} strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.3" />
      <path d="M40 52 Q44 58 48 62" stroke={STROKE_BASE} strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.3" />

      {/* Main stem — grows upward */}
      <line x1="40" y1="52" x2="40" y2="14"
        stroke={accent} strokeWidth={sw} strokeLinecap="round"
        className={isHovered ? "init-visual-grow" : ""}
        style={isHovered ? { strokeDasharray: 38, strokeDashoffset: 38 } : {}}
      />

      {/* Left branch */}
      <path d="M40 36 Q30 28 24 20"
        stroke={accent} strokeWidth={sw * 0.85} strokeLinecap="round" fill="none" opacity="0.75"
      />
      {/* Right branch */}
      <path d="M40 28 Q50 20 56 14"
        stroke={accent} strokeWidth={sw * 0.85} strokeLinecap="round" fill="none" opacity="0.75"
      />

      {/* Seed — ellipse at ground junction */}
      <ellipse cx="40" cy="52" rx="3.5" ry="2" fill={STROKE_GOLD} opacity="0.85" />

      {/* Tip buds */}
      <circle cx="40" cy="13" r="2"  fill={accent} opacity="0.9" />
      <circle cx="24" cy="19" r="1.5" fill={accent} opacity="0.7" />
      <circle cx="56" cy="13" r="1.5" fill={accent} opacity="0.7" />

      {/* Propagation dots — seeds in soil */}
      <circle cx="20" cy="56" r="1" fill={STROKE_GOLD} opacity="0.5" />
      <circle cx="60" cy="57" r="1" fill={STROKE_GOLD} opacity="0.5" />
      <circle cx="32" cy="59" r="0.8" fill={STROKE_GOLD} opacity="0.4" />
    </svg>
  );
}

// ─── Motif: COMMUNITY — path network / interconnected nodes ──────────────

function CommunityMotif({ isHovered }: { isHovered: boolean }) {
  const sw = isHovered ? 1.5 : 1.2;
  const accent = isHovered ? STROKE_ACCENT : STROKE_BASE;

  return (
    <svg viewBox="0 0 80 64" fill="none" xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true" className="w-full h-full">

      {/* Node positions: left, centre-top, right, centre-bottom */}
      {/* Connector trails */}
      <line x1="16" y1="44" x2="40" y2="20"
        stroke={accent} strokeWidth={sw * 0.8} strokeLinecap="round" opacity="0.6"
        className={isHovered ? "init-visual-connect-1" : ""}
        style={isHovered ? { strokeDasharray: 30, strokeDashoffset: 30 } : {}}
      />
      <line x1="64" y1="44" x2="40" y2="20"
        stroke={accent} strokeWidth={sw * 0.8} strokeLinecap="round" opacity="0.6"
        className={isHovered ? "init-visual-connect-2" : ""}
        style={isHovered ? { strokeDasharray: 30, strokeDashoffset: 30 } : {}}
      />
      <line x1="16" y1="44" x2="64" y2="44"
        stroke={STROKE_BASE} strokeWidth={sw * 0.7} strokeLinecap="round" opacity="0.45"
      />
      <path d="M16 44 Q28 54 40 56 Q52 54 64 44"
        stroke={STROKE_BASE} strokeWidth={sw * 0.65} strokeLinecap="round" fill="none" opacity="0.4"
      />
      <line x1="40" y1="20" x2="40" y2="56"
        stroke={STROKE_BASE} strokeWidth={sw * 0.6} strokeLinecap="round" opacity="0.3"
      />

      {/* Secondary connectors */}
      <line x1="16" y1="44" x2="40" y2="56" stroke={STROKE_BASE} strokeWidth="0.7" strokeLinecap="round" opacity="0.3" />
      <line x1="64" y1="44" x2="40" y2="56" stroke={STROKE_BASE} strokeWidth="0.7" strokeLinecap="round" opacity="0.3" />

      {/* Nodes */}
      <circle cx="40" cy="20" r="4"    fill={STROKE_GOLD}  opacity="0.9" />       {/* apex */}
      <circle cx="16" cy="44" r="3.2"  fill={accent}        opacity="0.85" />       {/* left */}
      <circle cx="64" cy="44" r="3.2"  fill={accent}        opacity="0.85" />       {/* right */}
      <circle cx="40" cy="56" r="2.5"  fill={accent}        opacity="0.7" />        {/* bottom */}

      {/* Node rings — hover pulse */}
      {isHovered && (
        <>
          <circle cx="40" cy="20" r="7" stroke={STROKE_GOLD} strokeWidth="0.8" opacity="0.35" fill="none"
            className="init-visual-pulse" />
          <circle cx="16" cy="44" r="6" stroke={accent} strokeWidth="0.7" opacity="0.3" fill="none"
            className="init-visual-pulse" style={{ animationDelay: "0.15s" }} />
          <circle cx="64" cy="44" r="6" stroke={accent} strokeWidth="0.7" opacity="0.3" fill="none"
            className="init-visual-pulse" style={{ animationDelay: "0.3s" }} />
        </>
      )}

      {/* Trail dots — movement along paths */}
      <circle cx="28" cy="32" r="1.2" fill={STROKE_BASE} opacity="0.4" />
      <circle cx="52" cy="32" r="1.2" fill={STROKE_BASE} opacity="0.4" />
    </svg>
  );
}

// ─── Keyframes injection ──────────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes init-grow     { to { stroke-dashoffset: 0; } }
  @keyframes init-ripple   { to { stroke-dashoffset: 0; } }
  @keyframes init-connect  { to { stroke-dashoffset: 0; } }
  @keyframes init-pulse    {
    0%   { opacity: 0.35; transform: scale(1); }
    50%  { opacity: 0.08; transform: scale(1.4); }
    100% { opacity: 0;    transform: scale(1.7); }
  }

  .init-visual-grow      { animation: init-grow    0.9s cubic-bezier(0.4,0,0.2,1) 0.1s forwards; }
  .init-visual-ripple-1  { animation: init-ripple  0.7s cubic-bezier(0.4,0,0.2,1) 0.2s forwards; }
  .init-visual-ripple-2  { animation: init-ripple  0.7s cubic-bezier(0.4,0,0.2,1) 0.4s forwards; }
  .init-visual-connect-1 { animation: init-connect 0.8s cubic-bezier(0.4,0,0.2,1) 0.1s forwards; }
  .init-visual-connect-2 { animation: init-connect 0.8s cubic-bezier(0.4,0,0.2,1) 0.25s forwards; }
  .init-visual-pulse     {
    transform-origin: center;
    animation: init-pulse 1.4s ease-out infinite;
  }
`;

// ─── Main component ───────────────────────────────────────────────────────

export function InitiativeVisual({ type, isHovered, label, className = "" }: InitiativeVisualProps) {
  const motifMap: Record<InitiativeVisualType, React.ReactNode> = {
    water:     <WaterMotif     isHovered={isHovered} />,
    growth:    <GrowthMotif    isHovered={isHovered} />,
    community: <CommunityMotif isHovered={isHovered} />,
  };

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        role="img"
        aria-label={label}
        className={`transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-60"} ${className}`}
      >
        {motifMap[type]}
      </div>
    </>
  );
}
