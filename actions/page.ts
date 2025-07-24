'use server';

import { IPageResponse } from "@/types/page.types";



export default async function fetchPageContent(): Promise<IPageResponse | null> {
    const response = await fetch(
        `${process.env.IWKZ_API_URL as string}/pages`,
        {
            cache: 'no-store',
        }
    );
    if (!response.ok) {
        console.error('Failed to fetch page content data');
        return null;
    }
    return response.json();
}
