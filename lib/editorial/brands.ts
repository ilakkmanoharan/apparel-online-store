/** Brand listing for editorial. In production, use Firestore collection "brands". */
export interface Brand {
  id: string;
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
}

const MOCK_BRANDS: Brand[] = [
  { id: "1", slug: "acme", name: "Acme", productCount: 42 },
  { id: "2", slug: "beta", name: "Beta", productCount: 28 },
];

export async function getBrands(): Promise<Brand[]> {
  return Promise.resolve(MOCK_BRANDS);
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const list = await getBrands();
  return list.find((b) => b.slug === slug) ?? null;
}
