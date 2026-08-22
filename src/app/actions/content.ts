"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";

function revalidatePostPaths(slug?: string) {
  revalidatePath("/insights");
  revalidatePath("/admin/blog");
  if (slug) revalidatePath(`/insights/${slug}`);
}

function postDataFromForm(formData: FormData) {
  const dateStr = String(formData.get("date") ?? "").trim();
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    date: dateStr ? new Date(dateStr) : new Date(),
    readMins: Number(formData.get("readMins") ?? 5) || 5,
    body: String(formData.get("body") ?? "")
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean),
    published: formData.get("published") === "on",
  };
}

export async function createPost(formData: FormData) {
  await requireAdmin();
  const data = postDataFromForm(formData);
  if (!data.slug || !data.title) return { error: "Slug and title are required." };
  await prisma.post.create({ data });
  revalidatePostPaths(data.slug);
  return { ok: true };
}

export async function updatePost(id: string, formData: FormData) {
  await requireAdmin();
  const data = postDataFromForm(formData);
  if (!data.slug || !data.title) return { error: "Slug and title are required." };
  await prisma.post.update({ where: { id }, data });
  revalidatePostPaths(data.slug);
  return { ok: true };
}

export async function deletePost(id: string) {
  await requireAdmin();
  const post = await prisma.post.delete({ where: { id } });
  revalidatePostPaths(post.slug);
}

export async function togglePostPublished(id: string, published: boolean) {
  await requireAdmin();
  const post = await prisma.post.update({ where: { id }, data: { published } });
  revalidatePostPaths(post.slug);
}
