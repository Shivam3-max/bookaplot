import { requireAdmin } from "@/lib/dal";
import { listPosts } from "@/lib/content-queries";
import AdminBlogClient from "./AdminBlogClient";

export default async function AdminBlog() {
  await requireAdmin();
  const posts = await listPosts({ includeUnpublished: true });
  return (
    <div className="space-y-5">
      <AdminBlogClient posts={posts} />

      <div className="card p-6">
        <h2 className="font-display text-lg font-black">Homepage Content Blocks</h2>
        <p className="mt-1 text-sm text-graphite">Control what the homepage shows without touching code.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["Hero headline & CTAs", "Featured deals selection", "Trust stats bar", "Testimonials", "Featured locations", "Map section highlights", "Calculators ordering", "CTA band copy"].map((b) => (
            <div key={b} className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
              <span className="text-[13px] font-semibold">{b}</span>
              <span className="text-xs font-bold text-graphite" title="Not yet editable from the admin - requires code changes">Code-only</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
