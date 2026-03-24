type FetchStrapiDataOptions = {
  revalidate?: number;
};

export const fetchStrapiData = async (
  path: string,
  options?: FetchStrapiDataOptions
) => {
  try {
    const response = await fetch(`${process.env.IWKZ_API_URL}${path}`, {
      next: options?.revalidate
        ? { revalidate: options.revalidate }
        : undefined,
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });
    return response.json();
  } catch (err) {
    console.error(`Failed to fetch data from ${path}:`, err);
  }
};
