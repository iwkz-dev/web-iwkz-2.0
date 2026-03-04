export const fetchStrapiData = async (path: string) => {
  try {
    const response = await fetch(`${process.env.IWKZ_API_URL}${path}`, {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });
    return response.json();
  } catch (err) {
    console.error(`Failed to fetch data from ${path}:`, err);
  }
};
