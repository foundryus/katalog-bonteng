import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import TombolBagikan from "@/components/TombolBagikan";
import KartuProduk from "@/components/KartuProduk";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase/server";

// US-26: Metadata SEO dan Open Graph
export async function generateMetadata({ params }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: produk } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!produk) {
    return {
      title: `Produk Tidak Ditemukan | ${toko.nama}`,
    };
  }

  return {
    title: `${produk.nama} | ${toko.nama}`,
    description: produk.deskripsi || `Beli ${produk.nama} seharga ${formatRupiah(produk.harga)} di ${toko.nama}.`,
    openGraph: {
      title: `${produk.nama} - ${formatRupiah(produk.harga)}`,
      description: produk.deskripsi || toko.tagline,
      images: produk.foto_url ? [{ url: produk.foto_url }] : [],
    },
  };
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !produk) {
    notFound();
  }

  // US-17: Produk terkait dari kategori yang sama
  let produkTerkait = [];
  if (produk.kategori) {
    const { data: terkait } = await supabase
      .from("produk")
      .select("*")
      .eq("kategori", produk.kategori)
      .neq("id", id)
      .limit(3);
    produkTerkait = terkait || [];
  }

  return (
    <div className="flex flex-col gap-12 py-8 md:py-12">
      <article className="grid gap-8 md:grid-cols-2">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
        />
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
            >
              Kembali ke katalog
            </Link>
            {/* US-23: Bagikan link produk */}
            <TombolBagikan nama={produk.nama} />
          </div>

          <p className="text-sm text-teks-lembut">{produk.kategori}</p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            {produk.nama}
          </h1>
          <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
          <p className="max-w-prose leading-relaxed text-teks-lembut">
            {produk.deskripsi}
          </p>
          {/* US-12: Tombol WhatsApp dengan pilihan jumlah */}
          <TombolWhatsApp produk={produk} />
        </div>
      </article>

      {/* US-17: Produk Terkait */}
      {produkTerkait.length > 0 && (
        <section aria-labelledby="judul-terkait" className="flex flex-col gap-4 border-t border-garis pt-8">
          <h2 id="judul-terkait" className="text-xl font-bold">
            Produk terkait ({produk.kategori})
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {produkTerkait.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
