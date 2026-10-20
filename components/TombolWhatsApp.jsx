"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);

  const totalHarga = produk.harga * jumlah;
  const nomor = (toko.nomorWhatsApp || "").replace(/\D/g, "");
  const pesan = `Halo, saya ingin memesan ${produk.nama} sejumlah ${jumlah} item (total ${formatRupiah(totalHarga)}).`;
  const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-3">
      {/* US-12: Pilih jumlah item */}
      <div className="flex items-center gap-3">
        <label htmlFor="jumlah-produk" className="text-sm font-semibold text-teks-lembut">
          Jumlah:
        </label>
        <div className="flex items-center rounded-lg border border-garis bg-latar">
          <button
            type="button"
            onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
            className="px-3 py-1 text-base font-bold text-teks transition-colors hover:text-utama"
            aria-label="Kurangi jumlah"
          >
            -
          </button>
          <span id="jumlah-produk" className="w-10 text-center text-sm font-bold text-teks">
            {jumlah}
          </span>
          <button
            type="button"
            onClick={() => setJumlah((prev) => prev + 1)}
            className="px-3 py-1 text-base font-bold text-teks transition-colors hover:text-utama"
            aria-label="Tambah jumlah"
          >
            +
          </button>
        </div>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp ({formatRupiah(totalHarga)})
      </a>
    </div>
  );
}
