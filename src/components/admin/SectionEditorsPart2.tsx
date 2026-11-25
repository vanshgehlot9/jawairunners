"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  FaqContent,
  FooterContent,
  FoundationContent,
  InitiativesContent,
  RegistrationContent,
  RunDetailsContent,
  ThreeRunsContent,
} from "@/lib/cms/types";
import { EventDatesConfig } from "@/lib/event-dates";
import { MediaPickerField } from "./MediaPickerField";
import {
  TextField,
  TextAreaField,
  SectionGroup,
  ItemOrderControls,
  moveArrayItem,
} from "./FieldHelpers";
import type { EditorCommonProps } from "./SectionEditorsPart1";

// ─── 5. Three Runs Editor ───────────────────────────────────────────────────

export function ThreeRunsEditor({
  value,
  onChange,
  mediaAssets,
  onMediaUploaded,
  actorEmail,
  eventDates,
}: EditorCommonProps<ThreeRunsContent> & { eventDates: EventDatesConfig }) {
  const dateMap: Record<string, string> = {
    "run-1": eventDates.run1Date,
    "run-2": eventDates.run2Date,
    "run-3": eventDates.run3Date,
  };

  return (
    <div className="space-y-6">
      <SectionGroup title="Series Header & Homepage Visibility">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Section Title"
            value={value.sectionTitle}
            onChange={(sectionTitle) => onChange({ ...value, sectionTitle })}
          />
          <TextField
            label="Highlighted Title"
            value={value.sectionHighlightedTitle}
            onChange={(sectionHighlightedTitle) => onChange({ ...value, sectionHighlightedTitle })}
          />
        </div>
        <TextAreaField
          label="Series Subtitle"
          value={value.sectionSubtitle}
          rows={2}
          onChange={(sectionSubtitle) => onChange({ ...value, sectionSubtitle })}
        />
        <label className="inline-flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#304B38]/15 cursor-pointer text-xs font-bold text-[#171717]">
          <input
            type="checkbox"
            checked={value.showOnHomepage}
            onChange={(e) => onChange({ ...value, showOnHomepage: e.target.checked })}
            className="rounded text-[#294D3A]"
          />
          <span>Show Standalone Three Runs Series Showcase on Homepage (Also powers Footer &amp; Registration)</span>
        </label>
      </SectionGroup>

      <SectionGroup title="Run Cards (Awaken, Restore, Celebrate)">
        <div className="space-y-4">
          {value.runs.map((run, idx) => (
            <div key={run.id} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#304B38]/12 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#C69A3A]">{run.number}</span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white border border-[#304B38]/15 text-[#294D3A] font-bold">
                    Live Event Date: {dateMap[run.id] || "REVEALING SOON"}
                  </span>
                </div>
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={run.visible}
                    onChange={(e) => {
                      const next = [...value.runs];
                      next[idx] = { ...run, visible: e.target.checked };
                      onChange({ ...value, runs: next });
                    }}
                  />
                  Visible
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <TextField
                  label="Run Number"
                  value={run.number}
                  onChange={(number) => {
                    const next = [...value.runs];
                    next[idx] = { ...run, number };
                    onChange({ ...value, runs: next });
                  }}
                />
                <TextField
                  label="Run Title"
                  value={run.name}
                  onChange={(name) => {
                    const next = [...value.runs];
                    next[idx] = { ...run, name };
                    onChange({ ...value, runs: next });
                  }}
                />
                <TextField
                  label="Code Name"
                  value={run.codeName}
                  onChange={(codeName) => {
                    const next = [...value.runs];
                    next[idx] = { ...run, codeName };
                    onChange({ ...value, runs: next });
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField
                  label="Subtitle"
                  value={run.subtitle}
                  onChange={(subtitle) => {
                    const next = [...value.runs];
                    next[idx] = { ...run, subtitle };
                    onChange({ ...value, runs: next });
                  }}
                />
                <TextField
                  label="Run Details Link"
                  value={run.detailsUrl}
                  onChange={(detailsUrl) => {
                    const next = [...value.runs];
                    next[idx] = { ...run, detailsUrl };
                    onChange({ ...value, runs: next });
                  }}
                />
              </div>

              <TextAreaField
                label="Description"
                value={run.description}
                rows={2}
                onChange={(description) => {
                  const next = [...value.runs];
                  next[idx] = { ...run, description };
                  onChange({ ...value, runs: next });
                }}
              />

              <MediaPickerField
                label="Run Cover Image"
                value={run.coverImage}
                onChange={(coverImage) => {
                  const next = [...value.runs];
                  next[idx] = { ...run, coverImage };
                  onChange({ ...value, runs: next });
                }}
                sectionTag="threeRuns"
                mediaAssets={mediaAssets}
                onMediaUploaded={onMediaUploaded}
                actorEmail={actorEmail}
              />
            </div>
          ))}
        </div>
      </SectionGroup>
    </div>
  );
}

// ─── 6. Run Details Editor ──────────────────────────────────────────────────

export function RunDetailsEditor({
  value,
  onChange,
  mediaAssets,
  onMediaUploaded,
  actorEmail,
}: EditorCommonProps<RunDetailsContent>) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = value.items[selectedIdx] || value.items[0];
  if (!current) return null;

  const updateCurrent = (patch: Partial<typeof current>) => {
    const next = [...value.items];
    next[selectedIdx] = { ...current, ...patch };
    onChange({ items: next });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {value.items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedIdx(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              idx === selectedIdx
                ? "bg-[#294D3A] text-white"
                : "bg-[#FAF8F5] border border-[#304B38]/15 text-[#171717]"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <SectionGroup title={`Specifications for ${current.name}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Display Name"
            value={current.name}
            onChange={(name) => updateCurrent({ name })}
          />
          <TextField
            label="Code Name"
            value={current.codeName}
            onChange={(codeName) => updateCurrent({ codeName })}
          />
          <TextField
            label="Mission Focus"
            value={current.missionFocus}
            onChange={(missionFocus) => updateCurrent({ missionFocus })}
          />
          <TextField
            label="Terrain Profile"
            value={current.terrain}
            onChange={(terrain) => updateCurrent({ terrain })}
          />
          <TextField
            label="Elevation Gain"
            value={current.elevationGain}
            onChange={(elevationGain) => updateCurrent({ elevationGain })}
          />
          <TextField
            label="Signature Highlight"
            value={current.highlight}
            onChange={(highlight) => updateCurrent({ highlight })}
          />
        </div>
        <MediaPickerField
          label="Cover Image"
          value={current.coverImage}
          onChange={(coverImage) => updateCurrent({ coverImage })}
          sectionTag="threeRuns"
          mediaAssets={mediaAssets}
          onMediaUploaded={onMediaUploaded}
          actorEmail={actorEmail}
        />
      </SectionGroup>

      <SectionGroup title="Available Distances & Schedule">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#8C6A43] uppercase block">Distances</span>
          {current.distances.map((dist, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
              <input
                type="text"
                value={dist.label}
                onChange={(e) => {
                  const next = [...current.distances];
                  next[idx] = { ...dist, label: e.target.value };
                  updateCurrent({ distances: next });
                }}
                className="sm:col-span-2 h-10 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3 text-sm"
              />
              <input
                type="text"
                value={dist.tag}
                onChange={(e) => {
                  const next = [...current.distances];
                  next[idx] = { ...dist, tag: e.target.value };
                  updateCurrent({ distances: next });
                }}
                className="sm:col-span-2 h-10 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3 text-sm"
              />
              <ItemOrderControls
                index={idx}
                total={current.distances.length}
                onDelete={() =>
                  updateCurrent({ distances: current.distances.filter((_, i) => i !== idx) })
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              updateCurrent({
                distances: [...current.distances, { label: "3 KM", tag: "Nature Walk" }],
              })
            }
            className="inline-flex items-center gap-1 text-xs font-bold text-[#294D3A] uppercase"
          >
            <Plus className="w-3.5 h-3.5" /> Add Distance
          </button>
        </div>

        <div className="space-y-2 pt-4">
          <span className="text-xs font-bold text-[#8C6A43] uppercase block">Schedule Timeline</span>
          {current.schedule.map((slot, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
              <input
                type="text"
                value={slot.time}
                onChange={(e) => {
                  const next = [...current.schedule];
                  next[idx] = { ...slot, time: e.target.value };
                  updateCurrent({ schedule: next });
                }}
                className="h-10 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3 text-sm font-mono"
              />
              <input
                type="text"
                value={slot.activity}
                onChange={(e) => {
                  const next = [...current.schedule];
                  next[idx] = { ...slot, activity: e.target.value };
                  updateCurrent({ schedule: next });
                }}
                className="sm:col-span-3 h-10 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3 text-sm"
              />
              <ItemOrderControls
                index={idx}
                total={current.schedule.length}
                onDelete={() =>
                  updateCurrent({ schedule: current.schedule.filter((_, i) => i !== idx) })
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              updateCurrent({
                schedule: [...current.schedule, { time: "07:00 AM", activity: "Trail Milestone" }],
              })
            }
            className="inline-flex items-center gap-1 text-xs font-bold text-[#294D3A] uppercase"
          >
            <Plus className="w-3.5 h-3.5" /> Add Schedule Slot
          </button>
        </div>
      </SectionGroup>
    </div>
  );
}

// ─── 7. Foundation Editor ───────────────────────────────────────────────────

export function FoundationEditor({
  value,
  onChange,
  mediaAssets,
  onMediaUploaded,
  actorEmail,
}: EditorCommonProps<FoundationContent>) {
  return (
    <div className="space-y-6">
      <SectionGroup title="Foundation Heading & Introduction">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField label="Eyebrow" value={value.eyebrow} onChange={(eyebrow) => onChange({ ...value, eyebrow })} />
          <TextField label="Heading" value={value.heading} onChange={(heading) => onChange({ ...value, heading })} />
          <TextField
            label="Highlighted Heading"
            value={value.highlightedHeading}
            onChange={(highlightedHeading) => onChange({ ...value, highlightedHeading })}
          />
        </div>
        <TextAreaField
          label="Foundation Introduction"
          value={value.introduction}
          onChange={(introduction) => onChange({ ...value, introduction })}
        />
        <TextField label="Tagline Bar" value={value.tagline} onChange={(tagline) => onChange({ ...value, tagline })} />
      </SectionGroup>

      <SectionGroup title="Commitment Statement & Background Media">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Commitment Card Label"
            value={value.commitmentLabel}
            onChange={(commitmentLabel) => onChange({ ...value, commitmentLabel })}
          />
          <TextField
            label="Attribution Initials"
            value={value.attributionInitials}
            onChange={(attributionInitials) => onChange({ ...value, attributionInitials })}
          />
          <TextField
            label="Attribution Title"
            value={value.attributionTitle}
            onChange={(attributionTitle) => onChange({ ...value, attributionTitle })}
          />
          <TextField
            label="Attribution Subtitle"
            value={value.attributionSubtitle}
            onChange={(attributionSubtitle) => onChange({ ...value, attributionSubtitle })}
          />
        </div>
        <TextAreaField
          label="Commitment Pull Quote"
          value={value.commitmentQuote}
          onChange={(commitmentQuote) => onChange({ ...value, commitmentQuote })}
        />
        <MediaPickerField
          label="Commitment Card Background Photo"
          value={value.backgroundMedia}
          onChange={(backgroundMedia) => onChange({ ...value, backgroundMedia })}
          sectionTag="foundation"
          mediaAssets={mediaAssets}
          onMediaUploaded={onMediaUploaded}
          actorEmail={actorEmail}
        />
      </SectionGroup>

      <SectionGroup title="Pillars Divider Headers">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Left Sub-header"
            value={value.pillarsHeaderLeft}
            onChange={(pillarsHeaderLeft) => onChange({ ...value, pillarsHeaderLeft })}
          />
          <TextField
            label="Right Sub-header"
            value={value.pillarsHeaderRight}
            onChange={(pillarsHeaderRight) => onChange({ ...value, pillarsHeaderRight })}
          />
        </div>
      </SectionGroup>
    </div>
  );
}

// ─── 8. Foundation Initiatives Editor ───────────────────────────────────────

export function InitiativesEditor({
  value,
  onChange,
}: EditorCommonProps<InitiativesContent>) {
  return (
    <div className="space-y-4">
      {value.items.map((item, idx) => (
        <div key={item.id} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#304B38]/12 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#8C6A43]">INITIATIVE #{idx + 1}</span>
            <ItemOrderControls
              index={idx}
              total={value.items.length}
              onMoveUp={() => onChange({ items: moveArrayItem(value.items, idx, idx - 1) })}
              onMoveDown={() => onChange({ items: moveArrayItem(value.items, idx, idx + 1) })}
              onDelete={() => onChange({ items: value.items.filter((_, i) => i !== idx) })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <TextField
              label="Number"
              value={item.number}
              onChange={(number) => {
                const next = [...value.items];
                next[idx] = { ...item, number };
                onChange({ items: next });
              }}
            />
            <TextField
              label="Category"
              value={item.category}
              onChange={(category) => {
                const next = [...value.items];
                next[idx] = { ...item, category };
                onChange({ items: next });
              }}
            />
            <TextField
              label="Status Badge"
              value={item.status}
              onChange={(status) => {
                const next = [...value.items];
                next[idx] = { ...item, status };
                onChange({ items: next });
              }}
            />
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#171717] uppercase mb-1.5">
                SVG Visual Motif
              </label>
              <select
                value={item.visualType}
                onChange={(e) => {
                  const next = [...value.items];
                  next[idx] = { ...item, visualType: e.target.value as typeof item.visualType };
                  onChange({ items: next });
                }}
                className="w-full h-11 bg-white border border-[#304B38]/15 rounded-xl px-3 text-xs font-semibold"
              >
                <option value="water">Water Architecture</option>
                <option value="growth">Growth / Sapling</option>
                <option value="community">Community Network</option>
              </select>
            </div>
          </div>

          <TextField
            label="Initiative Title"
            value={item.title}
            onChange={(title) => {
              const next = [...value.items];
              next[idx] = { ...item, title };
              onChange({ items: next });
            }}
          />
          <TextAreaField
            label="Description"
            value={item.description}
            rows={3}
            onChange={(description) => {
              const next = [...value.items];
              next[idx] = { ...item, description };
              onChange({ items: next });
            }}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          onChange({
            items: [
              ...value.items,
              {
                id: `init-${Date.now()}`,
                number: String(value.items.length + 1).padStart(2, "0"),
                category: "ECOLOGICAL INITIATIVE",
                title: "New Conservation Pillar",
                description: "Describe the field initiative...",
                status: "ACTIVE IN JAWAI",
                visualType: "growth",
                visualLabel: "Conservation visual motif",
              },
            ],
          })
        }
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#294D3A]/10 text-[#294D3A] text-xs font-bold uppercase"
      >
        <Plus className="w-3.5 h-3.5" /> Add Foundation Initiative
      </button>
    </div>
  );
}

// ─── 9. Registration Content Editor ─────────────────────────────────────────

export function RegistrationContentEditor({
  value,
  onChange,
}: EditorCommonProps<RegistrationContent>) {
  return (
    <div className="space-y-6">
      <SectionGroup title="Left Panel Story & Guarantees">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Heading" value={value.heading} onChange={(heading) => onChange({ ...value, heading })} />
          <TextField
            label="Highlighted Word"
            value={value.highlightedHeading}
            onChange={(highlightedHeading) => onChange({ ...value, highlightedHeading })}
          />
        </div>
        <TextAreaField
          label="Description"
          value={value.description}
          onChange={(description) => onChange({ ...value, description })}
        />
        <TextField
          label="Location Coordinates Line"
          value={value.coordinates}
          onChange={(coordinates) => onChange({ ...value, coordinates })}
        />
        <div className="space-y-2.5">
          {value.guarantees.map((g, idx) => (
            <div key={g.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#304B38]/12">
              <TextField
                label="Guarantee Title"
                value={g.title}
                onChange={(title) => {
                  const next = [...value.guarantees];
                  next[idx] = { ...g, title };
                  onChange({ ...value, guarantees: next });
                }}
              />
              <TextField
                label="Guarantee Text"
                value={g.description}
                onChange={(description) => {
                  const next = [...value.guarantees];
                  next[idx] = { ...g, description };
                  onChange({ ...value, guarantees: next });
                }}
              />
            </div>
          ))}
        </div>
      </SectionGroup>

      <SectionGroup title="Donation & Bank Transfer Details">
        <TextField
          label="Donation Heading"
          value={value.donationHeading}
          onChange={(donationHeading) => onChange({ ...value, donationHeading })}
        />
        <TextAreaField
          label="Donation Note"
          value={value.donationDescription}
          rows={2}
          onChange={(donationDescription) => onChange({ ...value, donationDescription })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Account Name"
            value={value.bankDetails.accountName}
            onChange={(accountName) =>
              onChange({ ...value, bankDetails: { ...value.bankDetails, accountName } })
            }
          />
          <TextField
            label="Account Number"
            value={value.bankDetails.accountNumber}
            onChange={(accountNumber) =>
              onChange({ ...value, bankDetails: { ...value.bankDetails, accountNumber } })
            }
          />
          <TextField
            label="IFSC Code"
            value={value.bankDetails.ifscCode}
            onChange={(ifscCode) =>
              onChange({ ...value, bankDetails: { ...value.bankDetails, ifscCode } })
            }
          />
          <TextField
            label="Bank Branch"
            value={value.bankDetails.bankName}
            onChange={(bankName) =>
              onChange({ ...value, bankDetails: { ...value.bankDetails, bankName } })
            }
          />
        </div>
      </SectionGroup>

      <SectionGroup title="Distance Categories, Eco Apparel & Eco-Pass">
        <TextField
          label="Eco Apparel Notice"
          value={value.ecoApparelNote}
          onChange={(ecoApparelNote) => onChange({ ...value, ecoApparelNote })}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField
            label="Trilogy Pass Title"
            value={value.trilogyTitle}
            onChange={(trilogyTitle) => onChange({ ...value, trilogyTitle })}
          />
          <TextField
            label="Trilogy Subtitle"
            value={value.trilogySubtitle}
            onChange={(trilogySubtitle) => onChange({ ...value, trilogySubtitle })}
          />
          <TextField
            label="Trilogy Tag"
            value={value.trilogyTag}
            onChange={(trilogyTag) => onChange({ ...value, trilogyTag })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Eco-Pass Confirmation Title"
            value={value.ecoPassTitle}
            onChange={(ecoPassTitle) => onChange({ ...value, ecoPassTitle })}
          />
          <TextField
            label="Eco-Pass Subtitle"
            value={value.ecoPassSubtitle}
            onChange={(ecoPassSubtitle) => onChange({ ...value, ecoPassSubtitle })}
          />
        </div>
      </SectionGroup>
    </div>
  );
}

// ─── 10. FAQ Editor ─────────────────────────────────────────────────────────

export function FaqEditor({ value, onChange }: EditorCommonProps<FaqContent>) {
  return (
    <div className="space-y-6">
      <SectionGroup title="FAQ Section Header & Contact Block">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Heading" value={value.heading} onChange={(heading) => onChange({ ...value, heading })} />
          <TextField
            label="Highlighted Heading"
            value={value.highlightedHeading}
            onChange={(highlightedHeading) => onChange({ ...value, highlightedHeading })}
          />
        </div>
        <TextAreaField label="Subtitle" value={value.subtitle} rows={2} onChange={(subtitle) => onChange({ ...value, subtitle })} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField
            label="Contact Box Heading"
            value={value.contactHeading}
            onChange={(contactHeading) => onChange({ ...value, contactHeading })}
          />
          <TextField
            label="Contact Text"
            value={value.contactText}
            onChange={(contactText) => onChange({ ...value, contactText })}
          />
          <TextField
            label="Contact Email"
            value={value.contactEmail}
            onChange={(contactEmail) => onChange({ ...value, contactEmail })}
          />
        </div>
      </SectionGroup>

      <SectionGroup title="Questions & Answers (Add, Edit, Remove & Reorder)">
        <div className="space-y-3">
          {value.items.map((item, idx) => (
            <div key={item.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#304B38]/12 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#8C6A43]">FAQ #{idx + 1}</span>
                <ItemOrderControls
                  index={idx}
                  total={value.items.length}
                  onMoveUp={() =>
                    onChange({
                      ...value,
                      items: moveArrayItem(value.items, idx, idx - 1).map((f, i) => ({
                        ...f,
                        order: String(i + 1).padStart(2, "0"),
                      })),
                    })
                  }
                  onMoveDown={() =>
                    onChange({
                      ...value,
                      items: moveArrayItem(value.items, idx, idx + 1).map((f, i) => ({
                        ...f,
                        order: String(i + 1).padStart(2, "0"),
                      })),
                    })
                  }
                  onDelete={() =>
                    onChange({
                      ...value,
                      items: value.items
                        .filter((_, i) => i !== idx)
                        .map((f, i) => ({ ...f, order: String(i + 1).padStart(2, "0") })),
                    })
                  }
                />
              </div>
              <TextField
                label="Question"
                value={item.question}
                onChange={(question) => {
                  const next = [...value.items];
                  next[idx] = { ...item, question };
                  onChange({ ...value, items: next });
                }}
              />
              <TextAreaField
                label="Answer"
                value={item.answer}
                rows={3}
                onChange={(answer) => {
                  const next = [...value.items];
                  next[idx] = { ...item, answer };
                  onChange({ ...value, items: next });
                }}
              />
              <label className="inline-flex items-center gap-2 text-xs text-[#595959] font-medium">
                <input
                  type="checkbox"
                  checked={!!item.useDynamicDates}
                  onChange={(e) => {
                    const next = [...value.items];
                    next[idx] = { ...item, useDynamicDates: e.target.checked };
                    onChange({ ...value, items: next });
                  }}
                />
                <span>Auto-inject live Event Dates from Event Dates Settings when dates are announced</span>
              </label>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              onChange({
                ...value,
                items: [
                  ...value.items,
                  {
                    id: `faq-${Date.now()}`,
                    order: String(value.items.length + 1).padStart(2, "0"),
                    question: "NEW QUESTION?",
                    answer: "Write answer here...",
                  },
                ],
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#294D3A]/10 text-[#294D3A] text-xs font-bold uppercase"
          >
            <Plus className="w-3.5 h-3.5" /> Add FAQ Item
          </button>
        </div>
      </SectionGroup>
    </div>
  );
}

// ─── 11. Footer Editor ──────────────────────────────────────────────────────

export function FooterEditor({ value, onChange }: EditorCommonProps<FooterContent>) {
  return (
    <div className="space-y-6">
      <SectionGroup title="Brand & Organisation Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Brand Name" value={value.brandName} onChange={(brandName) => onChange({ ...value, brandName })} />
          <TextField label="Brand Tagline" value={value.brandTagline} onChange={(brandTagline) => onChange({ ...value, brandTagline })} />
          <TextField label="Organiser Name" value={value.organiserName} onChange={(organiserName) => onChange({ ...value, organiserName })} />
          <TextField
            label="Organiser Tagline"
            value={value.organiserTagline}
            onChange={(organiserTagline) => onChange({ ...value, organiserTagline })}
          />
        </div>
        <TextAreaField
          label="Brand Description"
          value={value.brandDescription}
          onChange={(brandDescription) => onChange({ ...value, brandDescription })}
        />
      </SectionGroup>

      <SectionGroup title="Navigation & Social Links">
        <TextField label="Navigation Heading" value={value.navHeading} onChange={(navHeading) => onChange({ ...value, navHeading })} />
        <div className="space-y-2">
          {value.navLinks.map((lnk, idx) => (
            <div key={lnk.id} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
              <input
                type="text"
                value={lnk.label}
                onChange={(e) => {
                  const next = [...value.navLinks];
                  next[idx] = { ...lnk, label: e.target.value };
                  onChange({ ...value, navLinks: next });
                }}
                className="sm:col-span-2 h-10 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3 text-sm"
              />
              <input
                type="text"
                value={lnk.href}
                onChange={(e) => {
                  const next = [...value.navLinks];
                  next[idx] = { ...lnk, href: e.target.value };
                  onChange({ ...value, navLinks: next });
                }}
                className="sm:col-span-2 h-10 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3 text-sm font-mono"
              />
              <ItemOrderControls
                index={idx}
                total={value.navLinks.length}
                onDelete={() =>
                  onChange({ ...value, navLinks: value.navLinks.filter((_, i) => i !== idx) })
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...value,
                navLinks: [...value.navLinks, { id: `nav-${Date.now()}`, label: "New Link", href: "#" }],
              })
            }
            className="inline-flex items-center gap-1 text-xs font-bold text-[#294D3A] uppercase"
          >
            <Plus className="w-3.5 h-3.5" /> Add Navigation Link
          </button>
        </div>

        <div className="space-y-2 pt-3">
          <span className="text-xs font-bold text-[#8C6A43] uppercase block">Social Links</span>
          {value.socialLinks.map((soc, idx) => (
            <div key={soc.id} className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-center">
              <input
                type="text"
                value={soc.platform}
                placeholder="Platform"
                onChange={(e) => {
                  const next = [...value.socialLinks];
                  next[idx] = { ...soc, platform: e.target.value };
                  onChange({ ...value, socialLinks: next });
                }}
                className="h-10 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3 text-sm"
              />
              <input
                type="text"
                value={soc.label}
                placeholder="Handle / Label"
                onChange={(e) => {
                  const next = [...value.socialLinks];
                  next[idx] = { ...soc, label: e.target.value };
                  onChange({ ...value, socialLinks: next });
                }}
                className="h-10 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3 text-sm"
              />
              <input
                type="text"
                value={soc.url}
                placeholder="https://..."
                onChange={(e) => {
                  const next = [...value.socialLinks];
                  next[idx] = { ...soc, url: e.target.value };
                  onChange({ ...value, socialLinks: next });
                }}
                className="sm:col-span-3 h-10 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3 text-sm font-mono"
              />
              <ItemOrderControls
                index={idx}
                total={value.socialLinks.length}
                onDelete={() =>
                  onChange({ ...value, socialLinks: value.socialLinks.filter((_, i) => i !== idx) })
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...value,
                socialLinks: [
                  ...value.socialLinks,
                  { id: `soc-${Date.now()}`, platform: "Instagram", label: "@handle", url: "https://instagram.com" },
                ],
              })
            }
            className="inline-flex items-center gap-1 text-xs font-bold text-[#294D3A] uppercase"
          >
            <Plus className="w-3.5 h-3.5" /> Add Social Link
          </button>
        </div>
      </SectionGroup>

      <SectionGroup title="Contact, Runner's Code & Copyright">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Contact Email" value={value.contactEmail} onChange={(contactEmail) => onChange({ ...value, contactEmail })} />
          <TextField label="Contact Phone" value={value.contactPhone} onChange={(contactPhone) => onChange({ ...value, contactPhone })} />
          <TextField label="Hashtag" value={value.hashtag} onChange={(hashtag) => onChange({ ...value, hashtag })} />
          <TextField
            label="Location & Coordinates"
            value={value.locationCoords}
            onChange={(locationCoords) => onChange({ ...value, locationCoords })}
          />
        </div>
        <TextAreaField
          label="Runner's Code Items (one per line)"
          value={value.runnersCode.join("\n")}
          rows={4}
          onChange={(txt) =>
            onChange({
              ...value,
              runnersCode: txt.split("\n").map((s) => s.trim()).filter(Boolean),
            })
          }
        />
        <TextAreaField
          label="Closing Statement"
          value={value.closingStatement}
          rows={2}
          onChange={(closingStatement) => onChange({ ...value, closingStatement })}
        />
        <TextField
          label="Copyright Text"
          value={value.copyrightText}
          onChange={(copyrightText) => onChange({ ...value, copyrightText })}
        />
      </SectionGroup>
    </div>
  );
}
