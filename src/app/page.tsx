import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { About } from "@/components/resume/About";
import { ContactSection } from "@/components/resume/ContactSection";
import { EducationSection } from "@/components/resume/EducationSection";
import { ExperienceSection } from "@/components/resume/ExperienceSection";
import { Hero } from "@/components/resume/Hero";
import { NavBar, type NavLink } from "@/components/resume/NavBar";
import { SkillsSection } from "@/components/resume/SkillsSection";
import { getResume, RESUME_TAG } from "@/lib/data/getResume";
import { publicAssetUrl } from "@/lib/env";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getResume();
  if (!profile?.full_name) return {};

  const title = profile.headline
    ? `${profile.full_name} – ${profile.headline}`
    : profile.full_name;
  const description =
    profile.bio?.slice(0, 160) || `Resume of ${profile.full_name}.`;
  const photo = publicAssetUrl(profile.photo_path);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: photo ? [{ url: photo, alt: profile.full_name }] : undefined,
    },
  };
}

/**
 * Cached so that time-dependent output (age, footer year) is allowed during prerender.
 * Expires on admin saves (tag) and at least daily, which keeps the age current.
 */
async function ResumePage() {
  "use cache";
  cacheTag(RESUME_TAG);
  cacheLife("days");

  const { profile, education, experience, skills } = await getResume();

  if (!profile) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Resume coming soon</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          No profile has been set up yet. Sign in at /admin to add one.
        </p>
      </main>
    );
  }

  const links: NavLink[] = [
    profile.bio?.trim() ? { href: "#about", label: "About" } : null,
    experience.length ? { href: "#experience", label: "Experience" } : null,
    education.length ? { href: "#education", label: "Education" } : null,
    skills.length ? { href: "#skills", label: "Skills" } : null,
    { href: "#contact", label: "Contact" },
  ].filter((l): l is NavLink => l !== null);

  return (
    <>
      <NavBar name={profile.full_name} links={links} />
      <main className="mx-auto w-full max-w-4xl px-4">
        <Hero profile={profile} />
        <About bio={profile.bio} />
        <ExperienceSection items={experience} />
        <EducationSection items={education} />
        <SkillsSection items={skills} />
        <ContactSection />
      </main>
      <footer className="mx-auto w-full max-w-4xl px-4 py-8 text-sm text-zinc-500">
        © {new Date().getFullYear()} {profile.full_name}
      </footer>
    </>
  );
}

export default function Home() {
  return <ResumePage />;
}
