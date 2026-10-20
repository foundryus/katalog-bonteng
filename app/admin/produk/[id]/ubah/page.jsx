import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { ubahProduk } from "@/app/admin/actions";
import { createSessionClient, createServerClient } from "@/lib/supabase/server";

// US-09 (bonus di jalur offline): ubah produk.
export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;
  let produk = null;

  try {
    const supabase = await createSessionClient();
    const { data } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    produk = data;

    if (!produk) {
      const serverClient = createServerClient();
      const res = await serverClient
        .from("produk")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      produk = res.data;
    }
  } catch {
    try {
      const serverClient = createServerClient();
      const res = await serverClient
        .from("produk")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      produk = res.data;
    } catch {
      produk = null;
    }
  }

  if (!produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk
        produk={produk}
        action={ubahProduk}
        labelTombol="Simpan perubahan"
      />
    </div>
  );
}
