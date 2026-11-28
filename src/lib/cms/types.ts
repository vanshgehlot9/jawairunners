export type SectionId =
  | "hero"
  | "conservationMission"
  | "firstInitiative"
  | "movement"
  | "threeRuns"
  | "runDetails"
  | "foundation"
  | "initiatives"
  | "registrationContent"
  | "faq"
  | "footer";

export interface CmsSectionEnvelope<T = unknown> {
  id: SectionId;
  label: string;
  category: string;
  title: string;
  subtitle: string;
  draft: T;
  published: T | null;
  isPublished: boolean;
  isVisible: boolean;
  displayOrder: number;
  updatedAt: string;
  publishedAt?: string | null;
  updatedBy?: string;
}

// ─── Section Payloads ───────────────────────────────────────────────────────

export interface HeroContent {
  mainHeading: string;
  highlightedHeading: string;
  description: string;
  mobileDescription: string;
  backgroundVideoUrl: string;
  backgroundImageUrl: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  hashtag: string;
  organiserLine: string;
}

export interface ConservationCommitmentItem {
  id: string;
  order: string;
  title: string;
  description: string;
  iconName:
    | "Droplets"
    | "Trees"
    | "Recycle"
    | "ShieldCheck"
    | "HeartHandshake"
    | "Compass"
    | "Users"
    | "Sprout";
}

export interface ConservationMissionContent {
  label: string;
  heading: string;
  highlightedHeading: string;
  description: string;
  goalLabel: string;
  goalQuote: string;
  goalMotto: string;
  goalCtaText: string;
  goalCtaUrl: string;
  commitmentsTitle: string;
  commitmentsBadge: string;
  commitments: ConservationCommitmentItem[];
}

export interface ReelItem {
  id: string;
  reelId: string;
  title: string;
  url: string;
  thumbnail: string;
  theme: string;
  caption: string;
  visible: boolean;
}

export interface RunnerEntry {
  id: string;
  name: string;
  distance: string;
}

export interface ArchivePhotoItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  alt: string;
}

export interface ConservationActivityItem {
  id: string;
  text: string;
}

export interface FirstInitiativeContent {
  sectionLabel: string;
  mainTitle: string;
  tagline: string;
  princessHeadline: string;
  introduction: string;
  totalDistanceValue: string;
  totalDistanceUnit: string;
  totalDistanceTitle: string;
  totalDistanceSubtitle: string;
  highlightsLabel: string;
  instagramProfileUrl: string;
  instagramCtaLabel: string;
  archiveButtonLabel: string;
  reels: ReelItem[];
  runningJourneyHeading: string;
  runners: RunnerEntry[];
  princessName: string;
  princessDescription: string;
  nunBadge: string;
  nunTitle: string;
  nunDescription: string;
  archivePhotos: ArchivePhotoItem[];
  conservationActivitiesHeading: string;
  conservationActivities: ConservationActivityItem[];
  confirmedDistanceLabel: string;
  confirmedDistanceNote: string;
  continuationLabel: string;
  continuationDateHeading: string;
  continuationDescription: string;
  continuationTagline: string;
  continuationCtaText: string;
  continuationCtaUrl: string;
  continuationBgImage: string;
}

export interface VisionPrinciple {
  id: string;
  badge: string;
  title: string;
  description: string;
  footerTag: string;
  iconType: "run" | "restore" | "rewild";
}

export interface ExperiencePillarItem {
  id: string;
  order: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
}

export interface MovementContent {
  eyebrow: string;
  mainTitle: string;
  tagline: string;
  creed: string;
  paragraphs: string[];
  manifestoQuote: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  featureCard: {
    image: string;
    locationBadge: string;
    yearBadge: string;
    subtitle: string;
    title: string;
    description: string;
    tags: string[];
  };
  vision: {
    label: string;
    title: string;
    highlightedTitle: string;
    description: string;
    principles: VisionPrinciple[];
  };
  experience: {
    label: string;
    title: string;
    highlightedTitle: string;
    description: string;
    cardFooterLabel: string;
    pillars: ExperiencePillarItem[];
  };
}

export interface ThreeRunSummaryItem {
  id: string;
  number: string;
  name: string;
  codeName: string;
  tag: string;
  subtitle: string;
  description: string;
  coverImage: string;
  detailsUrl: string;
  visible: boolean;
  visualType: "awaken" | "restore" | "celebrate";
  theme: "launch" | "restoration" | "milestone";
}

export interface ThreeRunsContent {
  sectionTitle: string;
  sectionHighlightedTitle: string;
  sectionSubtitle: string;
  showOnHomepage: boolean;
  runs: ThreeRunSummaryItem[];
}

export interface RunDetailItem {
  id: string;
  name: string;
  codeName: string;
  missionFocus: string;
  terrain: string;
  elevationGain: string;
  highlight: string;
  coverImage: string;
  distances: { label: string; tag: string }[];
  schedule: { time: string; activity: string }[];
}

export interface RunDetailsContent {
  items: RunDetailItem[];
}

export interface FoundationContent {
  eyebrow: string;
  heading: string;
  highlightedHeading: string;
  introduction: string;
  tagline: string;
  commitmentLabel: string;
  commitmentQuote: string;
  attributionInitials: string;
  attributionTitle: string;
  attributionSubtitle: string;
  backgroundMedia: string;
  pillarsHeaderLeft: string;
  pillarsHeaderRight: string;
}

export interface InitiativeItem {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  status: string;
  visualType: "water" | "growth" | "community";
  visualLabel: string;
}

export interface InitiativesContent {
  items: InitiativeItem[];
}

export interface RegistrationGuaranteeItem {
  id: string;
  title: string;
  description: string;
  iconType: "tree" | "droplet" | "shield";
}

export interface RegistrationCategoryItem {
  id: string;
  distance: string;
  format: string;
  description: string;
}

export interface RegistrationContent {
  heading: string;
  highlightedHeading: string;
  description: string;
  guarantees: RegistrationGuaranteeItem[];
  coordinates: string;
  ecoApparelNote: string;
  donationHeading: string;
  donationDescription: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  categories: RegistrationCategoryItem[];
  showTrilogyPass?: boolean;
  trilogyTitle: string;
  trilogySubtitle: string;
  trilogyTag: string;
  pledgeTitle: string;
  pledge1Title: string;
  pledge1Description: string;
  pledge2Title: string;
  pledge2Description: string;
  pledgeFooterNote: string;
  ecoPassTitle: string;
  ecoPassSubtitle: string;
}

export interface FaqItem {
  id: string;
  order: string;
  question: string;
  answer: string;
  useDynamicDates?: boolean;
}

export interface FaqContent {
  heading: string;
  highlightedHeading: string;
  subtitle: string;
  contactHeading: string;
  contactText: string;
  contactEmail: string;
  items: FaqItem[];
}

export interface FooterNavLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterSocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
}

export interface FooterContent {
  brandName: string;
  brandTagline: string;
  brandDescription: string;
  organiserName: string;
  organiserTagline: string;
  navHeading: string;
  navLinks: FooterNavLink[];
  codeHeading: string;
  runnersCode: string[];
  closingStatement: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: FooterSocialLink[];
  hashtag: string;
  locationCoords: string;
  copyrightText: string;
}

// ─── Media & System Types ───────────────────────────────────────────────────

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  storagePath: string;
  type: "image" | "video";
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  section: string;
  alt: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: string;
}

export interface NavbarLinkItem {
  id: string;
  name: string;
  href: string;
}

export interface WebsiteSettingsData {
  siteTitle: string;
  siteDescription: string;
  brandName: string;
  brandSubtitle: string;
  logoUrl: string;
  navbarLinks: NavbarLinkItem[];
  navbarCtaText: string;
  navbarCtaHref: string;
  updatedAt: string;
}

export interface PermissionsSettingsData {
  adminEmails: string[];
  updatedAt: string;
  updatedBy: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  target: string;
  actorEmail: string;
  timestamp: string;
}

export interface SectionContentMap {
  hero: HeroContent;
  conservationMission: ConservationMissionContent;
  firstInitiative: FirstInitiativeContent;
  movement: MovementContent;
  threeRuns: ThreeRunsContent;
  runDetails: RunDetailsContent;
  foundation: FoundationContent;
  initiatives: InitiativesContent;
  registrationContent: RegistrationContent;
  faq: FaqContent;
  footer: FooterContent;
}
