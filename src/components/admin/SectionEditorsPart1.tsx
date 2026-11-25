"use client";

import React from "react";
import { Plus } from "lucide-react";
import {
  ConservationMissionContent,
  FirstInitiativeContent,
  HeroContent,
  MediaAsset,
  MovementContent,
} from "@/lib/cms/types";
import { MediaPickerField } from "./MediaPickerField";
import {
  TextField,
  TextAreaField,
  SectionGroup,
  ItemOrderControls,
  moveArrayItem,
} from "./FieldHelpers";

export interface EditorCommonProps<T> {
  value: T;
  onChange: (next: T) => void;
  mediaAssets: MediaAsset[];
  onMediaUploaded: (asset: MediaAsset) => void;
  actorEmail?: string;
}

export function extractInstagramReelId(url: string): string {
  const match = url.match(/instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/i);
  return match ? match[1] : url;
}

// ─── 1. Hero Section Editor ─────────────────────────────────────────────────

export function HeroEditor({
  value,
  onChange,
  mediaAssets,
  onMediaUploaded,
  actorEmail,
}: EditorCommonProps<HeroContent>) {
  return (
    <div className="space-y-6">
      <SectionGroup title="Hero Typography & Copy">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Main Heading"
            value={value.mainHeading}
            onChange={(mainHeading) => onChange({ ...value, mainHeading })}
          />
          <TextField
            label="Highlighted Heading (Italic Green)"
            value={value.highlightedHeading}
            onChange={(highlightedHeading) => onChange({ ...value, highlightedHeading })}
          />
        </div>
        <TextAreaField
          label="Desktop Description"
          value={value.description}
          onChange={(description) => onChange({ ...value, description })}
        />
        <TextAreaField
          label="Mobile Description"
          value={value.mobileDescription}
          onChange={(mobileDescription) => onChange({ ...value, mobileDescription })}
        />
      </SectionGroup>

      <SectionGroup title="Background Video & Fallback Image">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MediaPickerField
            label="Background Video (MP4/WebM)"
            value={value.backgroundVideoUrl}
            onChange={(backgroundVideoUrl) => onChange({ ...value, backgroundVideoUrl })}
            sectionTag="hero"
            mediaAssets={mediaAssets}
            onMediaUploaded={onMediaUploaded}
            actorEmail={actorEmail}
            accept="video"
          />
          <MediaPickerField
            label="Poster / Fallback Image"
            value={value.backgroundImageUrl}
            onChange={(backgroundImageUrl) => onChange({ ...value, backgroundImageUrl })}
            sectionTag="hero"
            mediaAssets={mediaAssets}
            onMediaUploaded={onMediaUploaded}
            actorEmail={actorEmail}
            accept="image"
          />
        </div>
      </SectionGroup>

      <SectionGroup title="Calls to Action & Meta">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Primary CTA Text"
            value={value.primaryCtaText}
            onChange={(primaryCtaText) => onChange({ ...value, primaryCtaText })}
          />
          <TextField
            label="Primary CTA URL"
            value={value.primaryCtaUrl}
            onChange={(primaryCtaUrl) => onChange({ ...value, primaryCtaUrl })}
          />
          <TextField
            label="Secondary CTA Text"
            value={value.secondaryCtaText}
            onChange={(secondaryCtaText) => onChange({ ...value, secondaryCtaText })}
          />
          <TextField
            label="Secondary CTA URL"
            value={value.secondaryCtaUrl}
            onChange={(secondaryCtaUrl) => onChange({ ...value, secondaryCtaUrl })}
          />
          <TextField
            label="Hashtag Tag"
            value={value.hashtag}
            onChange={(hashtag) => onChange({ ...value, hashtag })}
          />
          <TextField
            label="Organiser Line"
            value={value.organiserLine}
            onChange={(organiserLine) => onChange({ ...value, organiserLine })}
          />
        </div>
      </SectionGroup>
    </div>
  );
}

// ─── 2. Conservation Mission Editor ─────────────────────────────────────────

export function ConservationMissionEditor({
  value,
  onChange,
}: EditorCommonProps<ConservationMissionContent>) {
  const iconOptions = [
    "Droplets",
    "Trees",
    "Recycle",
    "ShieldCheck",
    "HeartHandshake",
    "Compass",
    "Users",
    "Sprout",
  ] as const;

  return (
    <div className="space-y-6">
      <SectionGroup title="Section Heading & Intro">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField label="Eyebrow Label" value={value.label} onChange={(label) => onChange({ ...value, label })} />
          <TextField label="Heading" value={value.heading} onChange={(heading) => onChange({ ...value, heading })} />
          <TextField
            label="Highlighted Heading"
            value={value.highlightedHeading}
            onChange={(highlightedHeading) => onChange({ ...value, highlightedHeading })}
          />
        </div>
        <TextAreaField
          label="Introduction Copy"
          value={value.description}
          onChange={(description) => onChange({ ...value, description })}
        />
      </SectionGroup>

      <SectionGroup title="Core Goal Card (Forest Green Feature)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Card Label" value={value.goalLabel} onChange={(goalLabel) => onChange({ ...value, goalLabel })} />
          <TextField label="Motto Line" value={value.goalMotto} onChange={(goalMotto) => onChange({ ...value, goalMotto })} />
          <TextField label="Button Label" value={value.goalCtaText} onChange={(goalCtaText) => onChange({ ...value, goalCtaText })} />
          <TextField label="Button URL" value={value.goalCtaUrl} onChange={(goalCtaUrl) => onChange({ ...value, goalCtaUrl })} />
        </div>
        <TextAreaField label="Goal Quote" value={value.goalQuote} onChange={(goalQuote) => onChange({ ...value, goalQuote })} rows={2} />
      </SectionGroup>

      <SectionGroup title="On-Ground Commitments Grid">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Grid Header Title"
            value={value.commitmentsTitle}
            onChange={(commitmentsTitle) => onChange({ ...value, commitmentsTitle })}
          />
          <TextField
            label="Badge Text"
            value={value.commitmentsBadge}
            onChange={(commitmentsBadge) => onChange({ ...value, commitmentsBadge })}
          />
        </div>

        <div className="space-y-3">
          {value.commitments.map((item, idx) => (
            <div key={item.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#304B38]/12 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#8C6A43]">COMMITMENT #{idx + 1}</span>
                <ItemOrderControls
                  index={idx}
                  total={value.commitments.length}
                  onMoveUp={() =>
                    onChange({ ...value, commitments: moveArrayItem(value.commitments, idx, idx - 1) })
                  }
                  onMoveDown={() =>
                    onChange({ ...value, commitments: moveArrayItem(value.commitments, idx, idx + 1) })
                  }
                  onDelete={() =>
                    onChange({ ...value, commitments: value.commitments.filter((_, i) => i !== idx) })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <TextField
                  label="Order"
                  value={item.order}
                  onChange={(order) => {
                    const next = [...value.commitments];
                    next[idx] = { ...item, order };
                    onChange({ ...value, commitments: next });
                  }}
                />
                <div className="md:col-span-2">
                  <TextField
                    label="Title"
                    value={item.title}
                    onChange={(title) => {
                      const next = [...value.commitments];
                      next[idx] = { ...item, title };
                      onChange({ ...value, commitments: next });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#171717] uppercase mb-1.5">
                    Icon
                  </label>
                  <select
                    value={item.iconName}
                    onChange={(e) => {
                      const next = [...value.commitments];
                      next[idx] = { ...item, iconName: e.target.value as typeof item.iconName };
                      onChange({ ...value, commitments: next });
                    }}
                    className="w-full h-11 bg-white border border-[#304B38]/15 rounded-xl px-3 text-xs font-semibold"
                  >
                    {iconOptions.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <TextField
                label="Description"
                value={item.description}
                onChange={(description) => {
                  const next = [...value.commitments];
                  next[idx] = { ...item, description };
                  onChange({ ...value, commitments: next });
                }}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              onChange({
                ...value,
                commitments: [
                  ...value.commitments,
                  {
                    id: `commit-${Date.now()}`,
                    order: String(value.commitments.length + 1).padStart(2, "0"),
                    title: "New Commitment",
                    description: "Describe ecological action...",
                    iconName: "Sprout",
                  },
                ],
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#294D3A]/10 hover:bg-[#294D3A]/20 text-[#294D3A] text-xs font-bold uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Commitment
          </button>
        </div>
      </SectionGroup>
    </div>
  );
}

// ─── 3. Jawai Runner Initiative Editor (First Initiative / The Running Nun) ─

export function FirstInitiativeEditor({
  value,
  onChange,
  mediaAssets,
  onMediaUploaded,
  actorEmail,
}: EditorCommonProps<FirstInitiativeContent>) {
  return (
    <div className="space-y-6">
      <SectionGroup title="Heading Hierarchy & Distance Callout">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Section Label"
            value={value.sectionLabel}
            onChange={(sectionLabel) => onChange({ ...value, sectionLabel })}
          />
          <TextField
            label="Main Title"
            value={value.mainTitle}
            onChange={(mainTitle) => onChange({ ...value, mainTitle })}
          />
          <TextField
            label="Italic Serif Tagline"
            value={value.tagline}
            onChange={(tagline) => onChange({ ...value, tagline })}
          />
          <TextField
            label="Princess Headline"
            value={value.princessHeadline}
            onChange={(princessHeadline) => onChange({ ...value, princessHeadline })}
          />
        </div>
        <TextAreaField
          label="Introduction Paragraph"
          value={value.introduction}
          onChange={(introduction) => onChange({ ...value, introduction })}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <TextField
            label="Distance Value"
            value={value.totalDistanceValue}
            onChange={(totalDistanceValue) => onChange({ ...value, totalDistanceValue })}
          />
          <TextField
            label="Unit"
            value={value.totalDistanceUnit}
            onChange={(totalDistanceUnit) => onChange({ ...value, totalDistanceUnit })}
          />
          <TextField
            label="Stat Title"
            value={value.totalDistanceTitle}
            onChange={(totalDistanceTitle) => onChange({ ...value, totalDistanceTitle })}
          />
          <TextField
            label="Stat Subtitle"
            value={value.totalDistanceSubtitle}
            onChange={(totalDistanceSubtitle) => onChange({ ...value, totalDistanceSubtitle })}
          />
        </div>
      </SectionGroup>

      <SectionGroup title="Instagram Reels & On-Ground Highlights">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField
            label="Highlights Header"
            value={value.highlightsLabel}
            onChange={(highlightsLabel) => onChange({ ...value, highlightsLabel })}
          />
          <TextField
            label="Instagram Profile CTA"
            value={value.instagramCtaLabel}
            onChange={(instagramCtaLabel) => onChange({ ...value, instagramCtaLabel })}
          />
          <TextField
            label="Instagram Profile URL"
            value={value.instagramProfileUrl}
            onChange={(instagramProfileUrl) => onChange({ ...value, instagramProfileUrl })}
          />
        </div>

        <div className="space-y-4">
          {value.reels.map((reel, idx) => (
            <div key={reel.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#304B38]/12 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#8C6A43]">REEL CARD #{idx + 1}</span>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={reel.visible}
                      onChange={(e) => {
                        const next = [...value.reels];
                        next[idx] = { ...reel, visible: e.target.checked };
                        onChange({ ...value, reels: next });
                      }}
                    />
                    Visible
                  </label>
                  <ItemOrderControls
                    index={idx}
                    total={value.reels.length}
                    onDelete={() =>
                      onChange({ ...value, reels: value.reels.filter((_, i) => i !== idx) })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <TextField
                  label="Card Title"
                  value={reel.title}
                  onChange={(title) => {
                    const next = [...value.reels];
                    next[idx] = { ...reel, title };
                    onChange({ ...value, reels: next });
                  }}
                />
                <TextField
                  label="Instagram Reel URL"
                  value={reel.url}
                  onChange={(url) => {
                    const next = [...value.reels];
                    next[idx] = { ...reel, url, reelId: extractInstagramReelId(url) };
                    onChange({ ...value, reels: next });
                  }}
                />
                <TextField
                  label="Theme"
                  value={reel.theme}
                  onChange={(theme) => {
                    const next = [...value.reels];
                    next[idx] = { ...reel, theme };
                    onChange({ ...value, reels: next });
                  }}
                />
              </div>
              <TextField
                label="Modal Caption"
                value={reel.caption}
                onChange={(caption) => {
                  const next = [...value.reels];
                  next[idx] = { ...reel, caption };
                  onChange({ ...value, reels: next });
                }}
              />
              <MediaPickerField
                label="Portrait Thumbnail (9:16)"
                value={reel.thumbnail}
                onChange={(thumbnail) => {
                  const next = [...value.reels];
                  next[idx] = { ...reel, thumbnail };
                  onChange({ ...value, reels: next });
                }}
                sectionTag="firstInitiative"
                mediaAssets={mediaAssets}
                onMediaUploaded={onMediaUploaded}
                actorEmail={actorEmail}
              />
            </div>
          ))}
        </div>
      </SectionGroup>

      <SectionGroup title="Running Journey, Princess & Theravada Buddhist Nun">
        <TextField
          label="Running Journey Heading"
          value={value.runningJourneyHeading}
          onChange={(runningJourneyHeading) => onChange({ ...value, runningJourneyHeading })}
        />

        <div className="space-y-2.5">
          {value.runners.map((r, idx) => (
            <div key={r.id} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end p-3 rounded-xl bg-[#FAF8F5] border border-[#304B38]/12">
              <div className="sm:col-span-2">
                <TextField
                  label="Participant Name"
                  value={r.name}
                  onChange={(name) => {
                    const next = [...value.runners];
                    next[idx] = { ...r, name };
                    onChange({ ...value, runners: next });
                  }}
                />
              </div>
              <div className="sm:col-span-2">
                <TextField
                  label="Distance"
                  value={r.distance}
                  onChange={(distance) => {
                    const next = [...value.runners];
                    next[idx] = { ...r, distance };
                    onChange({ ...value, runners: next });
                  }}
                />
              </div>
              <div className="flex justify-end pb-1">
                <ItemOrderControls
                  index={idx}
                  total={value.runners.length}
                  onDelete={() =>
                    onChange({ ...value, runners: value.runners.filter((_, i) => i !== idx) })
                  }
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...value,
                runners: [...value.runners, { id: `run-${Date.now()}`, name: "New Runner", distance: "2 KM" }],
              })
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#294D3A]/10 text-[#294D3A] text-xs font-bold uppercase"
          >
            <Plus className="w-3.5 h-3.5" /> Add Runner Entry
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <TextField
            label="Princess Name"
            value={value.princessName}
            onChange={(princessName) => onChange({ ...value, princessName })}
          />
          <TextField
            label="Princess Route Note"
            value={value.princessDescription}
            onChange={(princessDescription) => onChange({ ...value, princessDescription })}
          />
          <TextField
            label="Nun Spotlight Badge"
            value={value.nunBadge}
            onChange={(nunBadge) => onChange({ ...value, nunBadge })}
          />
          <TextField
            label="Nun Spotlight Title"
            value={value.nunTitle}
            onChange={(nunTitle) => onChange({ ...value, nunTitle })}
          />
        </div>
        <TextAreaField
          label="Nun Story Description"
          value={value.nunDescription}
          onChange={(nunDescription) => onChange({ ...value, nunDescription })}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {value.archivePhotos.map((photo, idx) => (
            <div key={photo.id} className="p-4 rounded-xl bg-white border border-[#304B38]/15 space-y-3">
              <TextField
                label={`Archive Photo ${idx + 1} Title`}
                value={photo.title}
                onChange={(title) => {
                  const next = [...value.archivePhotos];
                  next[idx] = { ...photo, title };
                  onChange({ ...value, archivePhotos: next });
                }}
              />
              <TextField
                label="Subtitle"
                value={photo.subtitle}
                onChange={(subtitle) => {
                  const next = [...value.archivePhotos];
                  next[idx] = { ...photo, subtitle };
                  onChange({ ...value, archivePhotos: next });
                }}
              />
              <MediaPickerField
                label="Archive Photo Asset"
                value={photo.url}
                onChange={(url) => {
                  const next = [...value.archivePhotos];
                  next[idx] = { ...photo, url };
                  onChange({ ...value, archivePhotos: next });
                }}
                sectionTag="firstInitiative"
                mediaAssets={mediaAssets}
                onMediaUploaded={onMediaUploaded}
                actorEmail={actorEmail}
              />
            </div>
          ))}
        </div>
      </SectionGroup>

      <SectionGroup title="Conservation Activities & Confirmed Distance">
        <TextField
          label="Conservation Activities Heading"
          value={value.conservationActivitiesHeading}
          onChange={(conservationActivitiesHeading) =>
            onChange({ ...value, conservationActivitiesHeading })
          }
        />
        <div className="space-y-2">
          {value.conservationActivities.map((act, idx) => (
            <div key={act.id} className="flex items-center gap-2">
              <input
                type="text"
                value={act.text}
                onChange={(e) => {
                  const next = [...value.conservationActivities];
                  next[idx] = { ...act, text: e.target.value };
                  onChange({ ...value, conservationActivities: next });
                }}
                className="flex-1 h-10 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3.5 text-sm"
              />
              <ItemOrderControls
                index={idx}
                total={value.conservationActivities.length}
                onDelete={() =>
                  onChange({
                    ...value,
                    conservationActivities: value.conservationActivities.filter((_, i) => i !== idx),
                  })
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...value,
                conservationActivities: [
                  ...value.conservationActivities,
                  { id: `act-${Date.now()}`, text: "New conservation activity..." },
                ],
              })
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#294D3A]/10 text-[#294D3A] text-xs font-bold uppercase"
          >
            <Plus className="w-3.5 h-3.5" /> Add Activity Bullet
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <TextField
            label="Confirmed Running Distance Label"
            value={value.confirmedDistanceLabel}
            onChange={(confirmedDistanceLabel) => onChange({ ...value, confirmedDistanceLabel })}
          />
          <TextField
            label="Confirmed Distance Note"
            value={value.confirmedDistanceNote}
            onChange={(confirmedDistanceNote) => onChange({ ...value, confirmedDistanceNote })}
          />
        </div>
      </SectionGroup>

      <SectionGroup title="December Continuation Banner">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Banner Eyebrow"
            value={value.continuationLabel}
            onChange={(continuationLabel) => onChange({ ...value, continuationLabel })}
          />
          <TextField
            label="Continuation Date Heading"
            value={value.continuationDateHeading}
            onChange={(continuationDateHeading) => onChange({ ...value, continuationDateHeading })}
          />
          <TextField
            label="Tagline"
            value={value.continuationTagline}
            onChange={(continuationTagline) => onChange({ ...value, continuationTagline })}
          />
          <TextField
            label="CTA Button Text"
            value={value.continuationCtaText}
            onChange={(continuationCtaText) => onChange({ ...value, continuationCtaText })}
          />
        </div>
        <TextAreaField
          label="Continuation Description"
          value={value.continuationDescription}
          onChange={(continuationDescription) => onChange({ ...value, continuationDescription })}
        />
        <MediaPickerField
          label="Banner Background Texture Image"
          value={value.continuationBgImage}
          onChange={(continuationBgImage) => onChange({ ...value, continuationBgImage })}
          sectionTag="firstInitiative"
          mediaAssets={mediaAssets}
          onMediaUploaded={onMediaUploaded}
          actorEmail={actorEmail}
        />
      </SectionGroup>
    </div>
  );
}

// ─── 4. Movement, Vision & Experience Editor ────────────────────────────────

export function MovementEditor({
  value,
  onChange,
  mediaAssets,
  onMediaUploaded,
  actorEmail,
}: EditorCommonProps<MovementContent>) {
  return (
    <div className="space-y-6">
      <SectionGroup title="Movement Manifesto Header">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Eyebrow" value={value.eyebrow} onChange={(eyebrow) => onChange({ ...value, eyebrow })} />
          <TextField label="Main Title" value={value.mainTitle} onChange={(mainTitle) => onChange({ ...value, mainTitle })} />
          <TextField label="Tagline" value={value.tagline} onChange={(tagline) => onChange({ ...value, tagline })} />
          <TextField label="Creed Line" value={value.creed} onChange={(creed) => onChange({ ...value, creed })} />
        </div>
        <TextAreaField
          label="Paragraphs (one per line)"
          value={value.paragraphs.join("\n\n")}
          rows={4}
          onChange={(txt) =>
            onChange({
              ...value,
              paragraphs: txt.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
            })
          }
        />
        <TextField
          label="Manifesto Quote"
          value={value.manifestoQuote}
          onChange={(manifestoQuote) => onChange({ ...value, manifestoQuote })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Primary CTA Text"
            value={value.primaryCtaText}
            onChange={(primaryCtaText) => onChange({ ...value, primaryCtaText })}
          />
          <TextField
            label="Primary CTA URL"
            value={value.primaryCtaUrl}
            onChange={(primaryCtaUrl) => onChange({ ...value, primaryCtaUrl })}
          />
          <TextField
            label="Secondary CTA Text"
            value={value.secondaryCtaText}
            onChange={(secondaryCtaText) => onChange({ ...value, secondaryCtaText })}
          />
          <TextField
            label="Secondary CTA URL"
            value={value.secondaryCtaUrl}
            onChange={(secondaryCtaUrl) => onChange({ ...value, secondaryCtaUrl })}
          />
        </div>
      </SectionGroup>

      <SectionGroup title="Landscape Anchor Card (Right Column)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Location Badge"
            value={value.featureCard.locationBadge}
            onChange={(locationBadge) =>
              onChange({ ...value, featureCard: { ...value.featureCard, locationBadge } })
            }
          />
          <TextField
            label="Year Badge"
            value={value.featureCard.yearBadge}
            onChange={(yearBadge) =>
              onChange({ ...value, featureCard: { ...value.featureCard, yearBadge } })
            }
          />
          <TextField
            label="Subtitle"
            value={value.featureCard.subtitle}
            onChange={(subtitle) =>
              onChange({ ...value, featureCard: { ...value.featureCard, subtitle } })
            }
          />
          <TextField
            label="Card Title"
            value={value.featureCard.title}
            onChange={(title) =>
              onChange({ ...value, featureCard: { ...value.featureCard, title } })
            }
          />
        </div>
        <TextAreaField
          label="Card Description"
          value={value.featureCard.description}
          onChange={(description) =>
            onChange({ ...value, featureCard: { ...value.featureCard, description } })
          }
        />
        <MediaPickerField
          label="Feature Card Landscape Photo"
          value={value.featureCard.image}
          onChange={(image) =>
            onChange({ ...value, featureCard: { ...value.featureCard, image } })
          }
          sectionTag="movement"
          mediaAssets={mediaAssets}
          onMediaUploaded={onMediaUploaded}
          actorEmail={actorEmail}
        />
      </SectionGroup>

      <SectionGroup title="01. Our Vision & 3 Principles">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField
            label="Vision Label"
            value={value.vision.label}
            onChange={(label) => onChange({ ...value, vision: { ...value.vision, label } })}
          />
          <TextField
            label="Vision Title"
            value={value.vision.title}
            onChange={(title) => onChange({ ...value, vision: { ...value.vision, title } })}
          />
          <TextField
            label="Highlighted Title"
            value={value.vision.highlightedTitle}
            onChange={(highlightedTitle) =>
              onChange({ ...value, vision: { ...value.vision, highlightedTitle } })
            }
          />
        </div>
        <TextAreaField
          label="Vision Narrative"
          value={value.vision.description}
          onChange={(description) =>
            onChange({ ...value, vision: { ...value.vision, description } })
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {value.vision.principles.map((pr, idx) => (
            <div key={pr.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#304B38]/12 space-y-2.5">
              <TextField
                label="Badge"
                value={pr.badge}
                onChange={(badge) => {
                  const next = [...value.vision.principles];
                  next[idx] = { ...pr, badge };
                  onChange({ ...value, vision: { ...value.vision, principles: next } });
                }}
              />
              <TextField
                label="Title"
                value={pr.title}
                onChange={(title) => {
                  const next = [...value.vision.principles];
                  next[idx] = { ...pr, title };
                  onChange({ ...value, vision: { ...value.vision, principles: next } });
                }}
              />
              <TextAreaField
                label="Description"
                value={pr.description}
                rows={2}
                onChange={(description) => {
                  const next = [...value.vision.principles];
                  next[idx] = { ...pr, description };
                  onChange({ ...value, vision: { ...value.vision, principles: next } });
                }}
              />
              <TextField
                label="Footer Tag"
                value={pr.footerTag}
                onChange={(footerTag) => {
                  const next = [...value.vision.principles];
                  next[idx] = { ...pr, footerTag };
                  onChange({ ...value, vision: { ...value.vision, principles: next } });
                }}
              />
            </div>
          ))}
        </div>
      </SectionGroup>

      <SectionGroup title="02. The Experience (6 Pillars)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField
            label="Experience Label"
            value={value.experience.label}
            onChange={(label) =>
              onChange({ ...value, experience: { ...value.experience, label } })
            }
          />
          <TextField
            label="Title"
            value={value.experience.title}
            onChange={(title) =>
              onChange({ ...value, experience: { ...value.experience, title } })
            }
          />
          <TextField
            label="Highlighted Title"
            value={value.experience.highlightedTitle}
            onChange={(highlightedTitle) =>
              onChange({ ...value, experience: { ...value.experience, highlightedTitle } })
            }
          />
        </div>
        <TextAreaField
          label="Experience Intro"
          value={value.experience.description}
          rows={2}
          onChange={(description) =>
            onChange({ ...value, experience: { ...value.experience, description } })
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {value.experience.pillars.map((pil, idx) => (
            <div key={pil.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#304B38]/12 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <TextField
                  label="Title"
                  value={pil.title}
                  onChange={(title) => {
                    const next = [...value.experience.pillars];
                    next[idx] = { ...pil, title };
                    onChange({ ...value, experience: { ...value.experience, pillars: next } });
                  }}
                />
                <TextField
                  label="Badge"
                  value={pil.badge}
                  onChange={(badge) => {
                    const next = [...value.experience.pillars];
                    next[idx] = { ...pil, badge };
                    onChange({ ...value, experience: { ...value.experience, pillars: next } });
                  }}
                />
              </div>
              <TextField
                label="Subtitle"
                value={pil.subtitle}
                onChange={(subtitle) => {
                  const next = [...value.experience.pillars];
                  next[idx] = { ...pil, subtitle };
                  onChange({ ...value, experience: { ...value.experience, pillars: next } });
                }}
              />
              <TextAreaField
                label="Description"
                value={pil.description}
                rows={2}
                onChange={(description) => {
                  const next = [...value.experience.pillars];
                  next[idx] = { ...pil, description };
                  onChange({ ...value, experience: { ...value.experience, pillars: next } });
                }}
              />
              <MediaPickerField
                label="Card Image"
                value={pil.image}
                onChange={(image) => {
                  const next = [...value.experience.pillars];
                  next[idx] = { ...pil, image };
                  onChange({ ...value, experience: { ...value.experience, pillars: next } });
                }}
                sectionTag="movement"
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
