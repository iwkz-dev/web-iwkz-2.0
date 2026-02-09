import { IMedia } from './media.types';

export interface IPageResponse {
  data: IPage[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface IPage {
  id: number;
  documentId: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  content: IDynamicZone[];
  seo: ISEO;
}

export interface ISEO {
  id: number;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  metaRobots: string | null;
  canonicalURL: string | null;
}

// --- Dynamic Zones ---

export type IDynamicZone =
  | IHeroComponent
  | IActivityCategorySectionComponent
  | IHistoriesComponent;

export interface IHeroComponent {
  __component: 'dynamic-zone.hero';
  id: number;
  headline: string;
  subHeadline: string;
  image: IMedia;
  link: any[]; // define structure if needed
}

export interface IActivityCategorySectionComponent {
  __component: 'dynamic-zone.activity-category-section';
  id: number;
  headline: string;
  subHeadline: string | null;
  ActivityCategory: IActivityCategory[];
}

export interface IHistoriesComponent {
  __component: 'dynamic-zone.histories';
  id: number;
  headline: string;
  subHeadline: string | null;
  historyLine: IHistoryLine[];
}

// --- Nested Components ---

export interface IActivityCategory {
  id: number;
  title: string;
  url: string | null;
  content: string;
  image: IMedia[];
  Activities: IActivity[];
}

export interface IActivity {
  id: number;
  title: string;
  contactPerson: string | null;
  content: string;
}

export interface IHistoryLine {
  id: number;
  year: string;
  headline: string | null;
  content: string;
  image: IMedia | null;
}
