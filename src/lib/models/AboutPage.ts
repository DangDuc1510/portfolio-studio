import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript Interfaces
export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  email?: string;
}

export interface ITeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socialLinks?: ISocialLinks;
  order: number;
}

export interface IValue {
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface IStat {
  value: string;
  label: string;
  order: number;
}

export interface IMilestone {
  year: string;
  title: string;
  description: string;
  image?: string;
  order: number;
}

export interface IPartner {
  name: string;
  logo: string;
  url?: string;
  order: number;
}

export interface IHeroSection {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  backgroundVideo?: string;
}

export interface IStorySection {
  title: string;
  content: string;
  images: string[];
}

export interface ITeamSection {
  title: string;
  subtitle?: string;
  members: ITeamMember[];
}

export interface IValuesSection {
  title: string;
  subtitle?: string;
  values: IValue[];
}

export interface IStatsSection {
  isVisible: boolean;
  stats: IStat[];
}

export interface ITimelineSection {
  isVisible: boolean;
  title: string;
  milestones: IMilestone[];
}

export interface IPartnersSection {
  isVisible: boolean;
  title: string;
  logos: IPartner[];
}

export interface ICTASection {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface ISEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface IAboutPage extends Document {
  heroSection: IHeroSection;
  storySection: IStorySection;
  teamSection: ITeamSection;
  valuesSection: IValuesSection;
  statsSection: IStatsSection;
  timelineSection: ITimelineSection;
  partnersSection: IPartnersSection;
  ctaSection: ICTASection;
  seo: ISEO;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schemas
const SocialLinksSchema = new Schema<ISocialLinks>(
  {
    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    email: { type: String },
  },
  { _id: false }
);

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, required: true },
    avatar: { type: String, required: true },
    socialLinks: { type: SocialLinksSchema },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const ValueSchema = new Schema<IValue>(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const StatSchema = new Schema<IStat>(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const MilestoneSchema = new Schema<IMilestone>(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const PartnerSchema = new Schema<IPartner>(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    url: { type: String },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const HeroSectionSchema = new Schema<IHeroSection>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    backgroundImage: { type: String },
    backgroundVideo: { type: String },
  },
  { _id: false }
);

const StorySectionSchema = new Schema<IStorySection>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: [{ type: String }],
  },
  { _id: false }
);

const TeamSectionSchema = new Schema<ITeamSection>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    members: [TeamMemberSchema],
  },
  { _id: false }
);

const ValuesSectionSchema = new Schema<IValuesSection>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    values: [ValueSchema],
  },
  { _id: false }
);

const StatsSectionSchema = new Schema<IStatsSection>(
  {
    isVisible: { type: Boolean, default: true },
    stats: [StatSchema],
  },
  { _id: false }
);

const TimelineSectionSchema = new Schema<ITimelineSection>(
  {
    isVisible: { type: Boolean, default: false },
    title: { type: String, default: "Hành trình của chúng tôi" },
    milestones: [MilestoneSchema],
  },
  { _id: false }
);

const PartnersSectionSchema = new Schema<IPartnersSection>(
  {
    isVisible: { type: Boolean, default: false },
    title: { type: String, default: "Đối tác & Khách hàng" },
    logos: [PartnerSchema],
  },
  { _id: false }
);

const CTASectionSchema = new Schema<ICTASection>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    buttonText: { type: String, required: true },
    buttonLink: { type: String, required: true },
  },
  { _id: false }
);

const SEOSchema = new Schema<ISEO>(
  {
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    keywords: [{ type: String }],
  },
  { _id: false }
);

// Main AboutPage Schema
const AboutPageSchema = new Schema<IAboutPage>(
  {
    heroSection: { type: HeroSectionSchema, required: true },
    storySection: { type: StorySectionSchema, required: true },
    teamSection: { type: TeamSectionSchema, required: true },
    valuesSection: { type: ValuesSectionSchema, required: true },
    statsSection: { type: StatsSectionSchema, required: true },
    timelineSection: { type: TimelineSectionSchema, required: true },
    partnersSection: { type: PartnersSectionSchema, required: true },
    ctaSection: { type: CTASectionSchema, required: true },
    seo: { type: SEOSchema, required: true },
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Model
const AboutPage: Model<IAboutPage> =
  mongoose.models.AboutPage ||
  mongoose.model<IAboutPage>("AboutPage", AboutPageSchema);

export default AboutPage;

