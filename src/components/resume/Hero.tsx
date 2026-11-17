import Image from "next/image";
import { formatDob } from "@/lib/format/formatDob";
import { publicAssetUrl } from "@/lib/env";
import { buttonClasses } from "@/components/ui/Button";
import type { Profile } from "@/types/domain";

export function Hero({ profile }: { profile: Profile }) {
  const photo = publicAssetUrl(profile.photo_path);
  const cv = publicAssetUrl(profile.cv_path);
  const dob = formatDob(profile.date_of_birth, profile.dob_display);
  const facts = [profile.city, dob].filter(Boolean);

  return (
    <section id="top" aria-labelledby="hero-heading" className="py-12">
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
        {photo ? (
          <Image
            src={photo}
            alt={`Portrait of ${profile.full_name}`}
            width={176}
            height={176}
            priority
            className="size-44 rounded-full object-cover shadow-md"
          />
        ) : null}
        <div className="text-center sm:text-left">
          <h1 id="hero-heading" className="text-4xl font-bold tracking-tight">
            {profile.full_name}
          </h1>
          {profile.headline ? (
            <p className="mt-2 text-xl text-zinc-600 dark:text-zinc-400">
              {profile.headline}
            </p>
          ) : null}
          {facts.length > 0 ? (
            <p className="mt-2 text-zinc-500">{facts.join(" · ")}</p>
          ) : null}
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            {profile.linkedin_url ? (
              <li>
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("secondary")}
                >
                  LinkedIn
                </a>
              </li>
            ) : null}
            {profile.github_url ? (
              <li>
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("secondary")}
                >
                  GitHub
                </a>
              </li>
            ) : null}
            {cv ? (
              <li>
                <a href={cv} download className={buttonClasses("primary")}>
                  Download CV
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </section>
  );
}
