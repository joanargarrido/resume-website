import { Section } from "./Section";

export function About({ bio }: { bio: string | null | undefined }) {
  if (!bio?.trim()) return null;
  return (
    <Section id="about" title="About">
      <p className="max-w-prose text-lg leading-relaxed whitespace-pre-line text-zinc-700 dark:text-zinc-300">
        {bio}
      </p>
    </Section>
  );
}
