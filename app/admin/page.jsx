import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createSessionClient, createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  let daftarProduk = [];

  try {
    const supabase = await createSessionClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error || !data || data.length === 0) {
      const serverClient = createServerClient();
      const res = await serverClient
        .from("produk")
        .select("*")
        .order("id", { ascending: true });
      daftarProduk = res.data || [];
    } else {
      daftarProduk = data;
    }
  } catch {
    try {
      const serverClient = createServerClient();
      const res = await serverClient
        .from("produk")
        .select("*")
        .order("id", { ascending: true });
      daftarProduk = res.data || [];
    } catch {
      daftarProduk = [];
    }
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      {daftarProduk.length === 0 ? (
        <div className="rounded-2xl border border-garis p-8 text-center text-teks-lembut">
          Belum ada produk
        </div>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
