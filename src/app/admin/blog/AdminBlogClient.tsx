"use client";

import { Fragment, useState, useTransition } from "react";
import Link from "next/link";
import type { PostRecord } from "@/lib/content-queries";
import { createPost, updatePost, deletePost, togglePostPublished } from "@/app/actions/content";

function PostForm({ post, onCancel }: { post?: PostRecord; onCancel: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = post ? await updatePost(post.id, formData) : await createPost(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      onCancel();
    });
  };

  return (
    <form action={submit} className="card space-y-4 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label">Slug *</label><input name="slug" required defaultValue={post?.slug} className="input" /></div>
        <div><label className="label">Title *</label><input name="title" required defaultValue={post?.title} className="input" /></div>
        <div><label className="label">Category</label><input name="category" defaultValue={post?.category} className="input" placeholder="Area Guides" /></div>
        <div><label className="label">Date</label><input name="date" type="date" defaultValue={post?.date} className="input" /></div>
        <div><label className="label">Read minutes</label><input name="readMins" type="number" defaultValue={post?.readMins ?? 5} className="input" /></div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="published" defaultChecked={post?.published ?? true} /> Published
          </label>
        </div>
      </div>
      <div><label className="label">Excerpt</label><textarea name="excerpt" defaultValue={post?.excerpt} className="input min-h-16" /></div>
      <div>
        <label className="label">Body (separate paragraphs with a blank line)</label>
        <textarea name="body" defaultValue={post?.body.join("\n\n")} className="input min-h-40" />
      </div>
      {error && <p className="text-sm font-semibold text-red">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="btn-gold !py-2.5 disabled:opacity-60">
          {isPending ? "Saving…" : post ? "Save Changes" : "Create Post"}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost !py-2.5">Cancel</button>
      </div>
    </form>
  );
}

export default function AdminBlogClient({ posts }: { posts: PostRecord[] }) {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const remove = (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    startTransition(() => deletePost(id));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black">Blog / Insights CMS</h1>
          <p className="text-sm text-graphite">{posts.filter((p) => p.published).length} published · {posts.length} total</p>
        </div>
        <button onClick={() => { setCreating((v) => !v); setEditingId(null); }} className="btn-gold !py-2.5">
          {creating ? "Close" : "+ New Post"}
        </button>
      </div>

      {creating && <PostForm onCancel={() => setCreating(false)} />}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-[10px] font-bold uppercase tracking-wider text-graphite">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <Fragment key={p.id}>
                <tr className="border-b border-line last:border-0 hover:bg-paper/60">
                  <td className="max-w-72 px-5 py-3.5">
                    <p className="font-bold leading-snug">{p.title}</p>
                    <p className="text-[10px] text-graphite/70">
                      {p.updatedByName ? `Updated by ${p.updatedByName}` : p.createdByName ? `Created by ${p.createdByName}` : "—"}
                    </p>
                  </td>
                  <td className="px-5 py-3.5"><span className="chip badge-steel">{p.category}</span></td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-graphite">{p.date}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => startTransition(() => togglePostPublished(p.id, !p.published))}
                      disabled={isPending}
                      className={`chip ${p.published ? "badge-green" : ""}`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/insights/${p.slug}`} className="text-xs font-bold" style={{ color: "var(--gold)" }}>View ↗</Link>
                    <button onClick={() => { setEditingId(editingId === p.id ? null : p.id); setCreating(false); }} className="ml-3 text-xs font-bold text-graphite hover:text-ink">
                      {editingId === p.id ? "Close" : "Edit"}
                    </button>
                    <button onClick={() => remove(p.id, p.title)} className="ml-3 text-xs font-bold text-red hover:underline">Delete</button>
                  </td>
                </tr>
                {editingId === p.id && (
                  <tr>
                    <td colSpan={5} className="bg-paper/60 p-4">
                      <PostForm post={p} onCancel={() => setEditingId(null)} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
