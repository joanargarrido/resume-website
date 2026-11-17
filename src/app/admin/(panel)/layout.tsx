import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { signOut } from "@/lib/actions/auth";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/messages", label: "Messages" },
];

async function AdminShell({ children }: { children: ReactNode }) {
  // Second line of defence behind the proxy: verify the session on the server.
  let ctx;
  try {
    ctx = await requireAdmin();
  } catch {
    redirect("/admin/login");
  }

  const { count } = await ctx.supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("read", false);

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <nav
          aria-label="Admin"
          className="flex flex-wrap gap-4 text-sm font-medium"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-indigo-600"
            >
              {item.label}
              {item.href === "/admin/messages" && count ? (
                <span className="ml-1 rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">
                  {count}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="underline">
            View site
          </Link>
          <form action={signOut}>
            <button type="submit" className="underline">
              Log out
            </button>
          </form>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="p-8">Loading…</p>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
