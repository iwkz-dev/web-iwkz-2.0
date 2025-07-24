export interface IGlobalContent {
    data: {
        id: number;
        documentId: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        locale: string;
        navbar: {
            id: number;
            logo: {
                id: number;
                documentId: string;
                iwkz: string;
                createdAt: string;
                updatedAt: string;
                publishedAt: string;
                image: string | null;
            };
            left_navbar_items: {
                id: number;
                text: string;
                url: string;
                target: string | null;
            }[];
        };
        footer: {
            id: number;
            copyright: string;
            description: string;
            internal_links: {
                id: number;
                text: string;
                url: string;
                target: string | null;
            }[];
            social_media_links: {
                id: number;
                text: string;
                url: string;
                target: string | null;
            }[];
        };
    };
    meta: Record<string, unknown>;
};
