"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/server";

export async function login(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const email = data?.get("email")?.toString().trim();
  const password = data?.get("password")?.toString();

  if (!email || !password) {
    return "Email dan password wajib diisi.";
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (
      error.message?.includes("Invalid login credentials") ||
      error.code === "invalid_credentials"
    ) {
      return "Email atau password salah. Silakan periksa kembali.";
    }
    return `Login gagal: ${error.message}`;
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const passwordBaru = data?.get("password_baru")?.toString() || "";
  const konfirmasiPassword = data?.get("konfirmasi_password")?.toString() || "";

  if (!passwordBaru || passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak cocok dengan password baru." };
  }

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Anda harus login terlebih dahulu untuk mengganti password." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return { error: `Gagal mengganti password: ${error.message}` };
  }

  return { success: true, message: "Password berhasil diganti." };
}

export async function tambahProduk(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const supabase = await createSessionClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Aksi ditolak: Anda harus login terlebih dahulu." };
  }

  const nama = data?.get("nama")?.toString().trim();
  const hargaRaw = data?.get("harga")?.toString().trim();
  const harga = parseInt(hargaRaw, 10);
  const kategori = data?.get("kategori")?.toString().trim() || null;
  const foto_url = data?.get("foto_url")?.toString().trim() || null;
  const deskripsi = data?.get("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka valid (minimal 0)." };
  }

  const { error } = await supabase.from("produk").insert([
    {
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    },
  ]);

  if (error) {
    return { error: `Gagal menyimpan produk: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}
