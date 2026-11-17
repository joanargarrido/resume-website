import { describe, expect, it } from "vitest";
import { contactSchema } from "./contact";
import { educationSchema } from "./education";
import { experienceSchema } from "./experience";
import { profileSchema } from "./profile";
import { skillSchema } from "./skill";

const profile = {
  full_name: "Ada",
  date_of_birth: "",
  dob_display: "hidden" as const,
  city: "",
  headline: "",
  bio: "",
  linkedin_url: "",
  github_url: "",
  email_public: "",
  photo_path: "",
  cv_path: "",
};

describe("profileSchema", () => {
  it("accepts a minimal profile", () => {
    expect(profileSchema.safeParse(profile).success).toBe(true);
  });

  it("requires a name", () => {
    expect(
      profileSchema.safeParse({ ...profile, full_name: "  " }).success,
    ).toBe(false);
  });

  it("rejects non-http URLs", () => {
    expect(
      profileSchema.safeParse({ ...profile, github_url: "javascript:alert(1)" })
        .success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({
        ...profile,
        github_url: "https://github.com/a",
      }).success,
    ).toBe(true);
  });

  it("validates dates and display modes", () => {
    expect(
      profileSchema.safeParse({ ...profile, date_of_birth: "1990-02-31" })
        .success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({ ...profile, dob_display: "nope" }).success,
    ).toBe(false);
  });

  it("validates the public email", () => {
    expect(
      profileSchema.safeParse({ ...profile, email_public: "bad" }).success,
    ).toBe(false);
  });
});

describe("educationSchema", () => {
  const base = {
    institution: "Uni",
    degree: "BSc",
    field: "",
    start_date: "2015-09-01",
    end_date: "",
    description: "",
  };

  it("accepts ongoing education", () => {
    expect(educationSchema.safeParse(base).success).toBe(true);
  });

  it("rejects an end date before the start date", () => {
    const result = educationSchema.safeParse({
      ...base,
      end_date: "2014-01-01",
    });
    expect(result.success).toBe(false);
  });
});

describe("experienceSchema", () => {
  const base = {
    company: "Acme",
    role: "Dev",
    location: "",
    start_date: "2020-01-01",
    end_date: "",
    description: "",
    company_url: "",
  };

  it("accepts a current job", () => {
    expect(experienceSchema.safeParse(base).success).toBe(true);
  });

  it("rejects bad URLs and reversed dates", () => {
    expect(
      experienceSchema.safeParse({ ...base, company_url: "acme" }).success,
    ).toBe(false);
    expect(
      experienceSchema.safeParse({ ...base, end_date: "2019-01-01" }).success,
    ).toBe(false);
  });
});

describe("skillSchema", () => {
  it("accepts levels 1-5 or empty", () => {
    expect(
      skillSchema.safeParse({ name: "TS", category: "", level: "" }).success,
    ).toBe(true);
    expect(
      skillSchema.safeParse({ name: "TS", category: "", level: "5" }).success,
    ).toBe(true);
    expect(
      skillSchema.safeParse({ name: "TS", category: "", level: "6" }).success,
    ).toBe(false);
  });
});

describe("contactSchema", () => {
  const base = {
    name: "Bob",
    email: "bob@example.com",
    message: "Hello there, nice site!",
  };

  it("accepts a valid message", () => {
    expect(contactSchema.safeParse(base).success).toBe(true);
  });

  it("rejects invalid email and short messages", () => {
    expect(contactSchema.safeParse({ ...base, email: "bob" }).success).toBe(
      false,
    );
    expect(contactSchema.safeParse({ ...base, message: "hi" }).success).toBe(
      false,
    );
  });
});
