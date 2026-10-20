import { createServerClient } from "@/lib/supabase/server";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://katalog-bonteng.vercel.app";

  let produkUrls = [];
  try {
    const supabase = createServerClient();
    const { data: daftarProduk } = await supabase
      .from("produk")
      .select("id, created_at");

    if (daftarProduk) {
      produkUrls = daftarProduk.map((item) => ({
        url: `${baseUrl}/produk/${item.id}`,
        lastModified: item.created_at ? new Date(item.created_at) : new Date(),
      }));
    }
  } catch {
    produkUrls = [];
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
    },
    ...produkUrls,
  ];
}

