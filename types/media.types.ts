export interface IMedia {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
        large?: IImageFormat;
        medium?: IImageFormat;
        small?: IImageFormat;
        thumbnail?: IImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: {
        public_id: string;
        resource_type: string;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface IImageFormat {
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
    provider_metadata: {
        public_id: string;
        resource_type: string;
    };
}