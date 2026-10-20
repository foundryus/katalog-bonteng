import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const params = await searchParams;
  const q = params?.q?.trim() || "";
  const kategoriDipilih = params?.kategori?.trim() || "";
  const urutan = params?.urutan || "default";

  let daftarProduk = [];
  let daftarKategori = ["Semua"];
  let pesanError = null;

  try {
    const supabase = createServerClient();

    // Ambil daftar kategori unik
    const { data: katData } = await supabase
      .from("produk")
      .select("kategori");
    if (katData) {
      const setKat = new Set(katData.map((k) => k.kategori).filter(Boolean));
      daftarKategori = ["Semua", ...Array.from(setKat)];
    }

    // Bangun query produk
    let query = supabase.from("produk").select("*");

    if (kategoriDipilih && kategoriDipilih !== "Semua") {
      query = query.eq("kategori", kategoriDipilih);
    }

    if (q) {
      query = query.ilike("nama", `%${q}%`);
    }

    if (urutan === "termurah") {
      query = query.order("harga", { ascending: true });
    } else if (urutan === "termahal") {
      query = query.order("harga", { ascending: false });
    } else if (urutan === "terbaru") {
      query = query.order("created_at", { ascending: false });
    } else {
      query = query.order("id", { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      pesanError = `Gagal mengambil data produk: ${error.message}`;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = `Gagal mengambil data produk: ${err.message}`;
  }

  const bangunUrl = (override = {}) => {
    const p = new URLSearchParams();
    const finalKat = override.kategori !== undefined ? override.kategori : kategoriDipilih;
    const finalQ = override.q !== undefined ? override.q : q;
    const finalUrut = override.urutan !== undefined ? override.urutan : urutan;

    if (finalKat && finalKat !== "Semua") p.set("kategori", finalKat);
    if (finalQ) p.set("q", finalQ);
    if (finalUrut && finalUrut !== "default") p.set("urutan", finalUrut);

    const s = p.toString();
    return s ? `/?${s}` : "/";
  };

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>

          {/* US-15: Pilihan Urutan Produk */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-teks-lembut">Urutkan:</span>
            <div className="flex gap-1 rounded-lg border border-garis bg-latar p-1">
              <Link
                href={bangunUrl({ urutan: "default" })}
                className={`rounded px-2.5 py-1 text-xs font-semibold ${
                  urutan === "default" ? "bg-utama text-white" : "text-teks-lembut hover:text-utama"
                }`}
              >
                Bawaan
              </Link>
              <Link
                href={bangunUrl({ urutan: "termurah" })}
                className={`rounded px-2.5 py-1 text-xs font-semibold ${
                  urutan === "termurah" ? "bg-utama text-white" : "text-teks-lembut hover:text-utama"
                }`}
              >
                Termurah
              </Link>
              <Link
                href={bangunUrl({ urutan: "termahal" })}
                className={`rounded px-2.5 py-1 text-xs font-semibold ${
                  urutan === "termahal" ? "bg-utama text-white" : "text-teks-lembut hover:text-utama"
                }`}
              >
                Termahal
              </Link>
              <Link
                href={bangunUrl({ urutan: "terbaru" })}
                className={`rounded px-2.5 py-1 text-xs font-semibold ${
                  urutan === "terbaru" ? "bg-utama text-white" : "text-teks-lembut hover:text-utama"
                }`}
              >
                Terbaru
              </Link>
            </div>
          </div>
        </div>

        {/* US-11: Kolom Pencarian */}
        <form method="GET" action="/" className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari nama produk..."
            className="flex-1 rounded-lg border border-garis bg-latar px-4 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
          {kategoriDipilih && kategoriDipilih !== "Semua" && (
            <input type="hidden" name="kategori" value={kategoriDipilih} />
          )}
          {urutan !== "default" && (
            <input type="hidden" name="urutan" value={urutan} />
          )}
          <button
            type="submit"
            className="rounded-lg bg-utama px-5 py-2 text-sm font-semibold text-white hover:bg-utama-gelap"
          >
            Cari
          </button>
          {(q || (kategoriDipilih && kategoriDipilih !== "Semua") || urutan !== "default") && (
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-4 py-2 text-sm font-semibold text-teks-lembut hover:text-utama"
            >
              Reset
            </Link>
          )}
        </form>

        {/* US-11: Filter Kategori */}
        <div className="flex flex-wrap gap-2">
          {daftarKategori.map((kat) => {
            const aktif = (kat === "Semua" && !kategoriDipilih) || kat === kategoriDipilih;
            return (
              <Link
                key={kat}
                href={bangunUrl({ kategori: kat })}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  aktif
                    ? "bg-utama text-white"
                    : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
                }`}
              >
                {kat}
              </Link>
            );
          })}
        </div>

        {pesanError ? (
          <div className="rounded-xl border border-garis bg-permukaan p-4 text-bahaya">
            {pesanError}
          </div>
        ) : daftarProduk.length === 0 ? (
          <p className="text-teks-lembut">Belum ada produk</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
