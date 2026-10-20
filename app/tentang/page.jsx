import Link from "next/link";
import { toko } from "@/lib/toko";

export const metadata = {
  title: `Tentang Kami | ${toko.nama}`,
  description: toko.tagline,
};

export default function HalamanTentang() {
  const nomorClean = (toko.nomorWhatsApp || "").replace(/\D/g, "");

  return (
    <div className="mx-auto max-w-2xl py-10 sm:py-14">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        Tentang {toko.nama}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-teks-lembut">
        {toko.tagline}
      </p>

      <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-garis bg-permukaan p-6 sm:p-8">
        <div>
          <h2 className="text-base font-bold text-teks">Alamat Toko</h2>
          <p className="mt-1 text-sm text-teks-lembut">{toko.alamat}</p>
        </div>

        <div className="border-t border-garis pt-4">
          <h2 className="text-base font-bold text-teks">Jam Operasional</h2>
          <p className="mt-1 text-sm text-teks-lembut">{toko.jamBuka}</p>
        </div>

        <div className="border-t border-garis pt-4">
          <h2 className="text-base font-bold text-teks">Kontak & Pemesanan</h2>
          <p className="mt-1 text-sm text-teks-lembut">
            Pemesanan langsung diproses melalui WhatsApp resmi kami.
          </p>
          <a
            href={`https://wa.me/${nomorClean}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-utama px-5 py-2.5 text-sm font-semibold text-white hover:bg-utama-gelap"
          >
            Hubungi via WhatsApp ({toko.nomorWhatsApp})
          </a>
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="text-sm font-semibold text-utama underline underline-offset-4"
        >
          &larr; Kembali ke Katalog Produk
        </Link>
      </div>
    </div>
  );
}

