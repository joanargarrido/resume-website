/* eslint-disable @next/next/no-img-element */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Education, Experience, Profile, Skill } from "@/types/domain";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

import { About } from "./About";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";
import { Hero } from "./Hero";
import { SkillsSection } from "./SkillsSection";

const profile: Profile = {
  id: 1,
  full_name: "Ada Example",
  photo_path: "photos/a.jpg",
  date_of_birth: "1992-06-15",
  dob_display: "full",
  city: "Lisbon",
  headline: "Engineer",
  bio: "Hello",
  linkedin_url: "https://linkedin.com/in/ada",
  github_url: "https://github.com/ada",
  email_public: null,
  cv_path: "cv/ada.pdf",
  updated_at: "",
};

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://proj.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
});

describe("Hero", () => {
  it("renders the profile details", () => {
    render(<Hero profile={profile} />);
    expect(
      screen.getByRole("heading", { name: "Ada Example" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();
    expect(screen.getByText(/Lisbon/)).toHaveTextContent(
      "Lisbon · 15 June 1992",
    );
    expect(screen.getByAltText("Portrait of Ada Example")).toBeInTheDocument();
  });

  it("opens social links safely in a new tab", () => {
    render(<Hero profile={profile} />);
    for (const name of ["LinkedIn", "GitHub"]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("shows the CV button only when a CV exists", () => {
    const { rerender } = render(<Hero profile={profile} />);
    expect(screen.getByRole("link", { name: "Download CV" })).toHaveAttribute(
      "href",
      "https://proj.supabase.co/storage/v1/object/public/public-assets/cv/ada.pdf",
    );
    rerender(<Hero profile={{ ...profile, cv_path: null }} />);
    expect(
      screen.queryByRole("link", { name: "Download CV" }),
    ).not.toBeInTheDocument();
  });

  it("hides the date of birth when hidden", () => {
    render(<Hero profile={{ ...profile, dob_display: "hidden" }} />);
    expect(screen.queryByText(/1992/)).not.toBeInTheDocument();
  });

  it("omits the photo and social links when missing", () => {
    render(
      <Hero
        profile={{
          ...profile,
          photo_path: null,
          linkedin_url: null,
          github_url: null,
        }}
      />,
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "LinkedIn" }),
    ).not.toBeInTheDocument();
  });
});

describe("About", () => {
  it("renders the bio", () => {
    render(<About bio="I build things" />);
    expect(screen.getByText("I build things")).toBeInTheDocument();
  });
  it("hides itself without a bio", () => {
    const { container } = render(<About bio="  " />);
    expect(container).toBeEmptyDOMElement();
  });
});

const job: Experience = {
  id: "1",
  company: "Acme",
  role: "Engineer",
  location: "Remote",
  start_date: "2022-03-01",
  end_date: null,
  description: "Did things",
  company_url: "https://acme.example",
  sort_order: 0,
};

describe("ExperienceSection", () => {
  it("renders jobs with a Present range and a safe company link", () => {
    render(<ExperienceSection items={[job]} />);
    expect(
      screen.getByRole("heading", { name: "Experience" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();
    expect(screen.getByText("Mar 2022 – Present")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Acme" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });
  it("hides itself with no items", () => {
    const { container } = render(<ExperienceSection items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("EducationSection", () => {
  const edu: Education = {
    id: "1",
    institution: "University of Lisbon",
    degree: "MSc",
    field: "Computer Science",
    start_date: "2015-09-01",
    end_date: "2017-07-15",
    description: null,
    sort_order: 0,
  };
  it("renders entries", () => {
    render(<EducationSection items={[edu]} />);
    expect(screen.getByText("MSc, Computer Science")).toBeInTheDocument();
    expect(screen.getByText("University of Lisbon")).toBeInTheDocument();
    expect(screen.getByText("Sep 2015 – Jul 2017")).toBeInTheDocument();
  });
  it("hides itself with no items", () => {
    const { container } = render(<EducationSection items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("SkillsSection", () => {
  const skill = (id: string, name: string, category: string | null): Skill => ({
    id,
    name,
    category,
    level: null,
    sort_order: 0,
  });

  it("groups skills by category with uncategorised last", () => {
    render(
      <SkillsSection
        items={[
          skill("1", "Go", null),
          skill("2", "React", "Frontend"),
          skill("3", "CSS", "Frontend"),
        ]}
      />,
    );
    const headings = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(headings).toEqual(["Frontend", "Other"]);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Go")).toBeInTheDocument();
  });

  it("hides itself with no items", () => {
    const { container } = render(<SkillsSection items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
