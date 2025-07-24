'use server';

import { IGlobalContent } from "@/types/globalContent.types";


export default async function fetchGlobalContent(): Promise<IGlobalContent | null> {
    const response = await fetch(
        `${process.env.IWKZ_API_URL as string}/global`,
        {
            cache: 'no-store',
        }
    );
    if (!response.ok) {
        console.error('Failed to fetch global content data');
        return null;
    }
    return response.json();
}
