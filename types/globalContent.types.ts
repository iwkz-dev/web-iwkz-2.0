import { IMedia } from './media.types';

export interface IGlobalContent {
  data: {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    navbar: INavbar;
    footer: IFooter;
  };
  meta: Record<string, unknown>;
}

export interface INavbar {
  id: number;
  logo: {
    id: number;
    documentId: string;
    iwkz: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    image: IMedia | null;
  };
  left_navbar_items: INavbarItem[];
}

export interface INavbarItem {
  id: number;
  text: string;
  url: string;
  target: string | null;
}

export interface IFooter {
  id: number;
  copyright: string;
  description: string;
  internal_links: IFooterLink[];
  social_media_links: ISocialMediaLink[];
}

export interface IFooterLink {
  id: number;
  text: string;
  url: string;
  target: string | null;
}

export interface ISocialMediaLink {
  id: number;
  text: string;
  url: string;
  target: string | null;
}
