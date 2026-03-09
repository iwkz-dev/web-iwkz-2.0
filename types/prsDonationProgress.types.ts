export interface IPrsDonationProgressImageProviderMetadata {
  public_id: string;
  resource_type: string;
}

export interface IPrsDonationProgressImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
  provider_metadata: IPrsDonationProgressImageProviderMetadata;
}

export interface IPrsDonationProgressImageRelated {
  __type: string;
  id: number;
  documentId: string;
  headline: string;
  subHeadline: string;
  currentDonation: number | null;
  targetDonation: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface IPrsDonationProgressImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: Record<string, IPrsDonationProgressImageFormat>;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: IPrsDonationProgressImageProviderMetadata;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  focalPoint: unknown | null;
  related: IPrsDonationProgressImageRelated[];
}

export interface IPrsDonationProgress {
  id: number;
  documentId: string;
  headline: string;
  subHeadline: string;
  currentDonation: number | null;
  targetDonation: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  link: unknown[]; // Add later if the structure of link is known
  image: IPrsDonationProgressImage | null;
  VZW?: string;
}

export interface IPrsDonationProgressResponse {
  data: IPrsDonationProgress | null;
  error?: string;
}
