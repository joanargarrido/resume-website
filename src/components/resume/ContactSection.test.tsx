import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const submitContact = vi.fn();
vi.mock("@/lib/actions/contact", () => ({
  submitContact: (...a: unknown[]) => submitContact(...a),
}));

import { ContactSection } from "./ContactSection";

async function fill(
  user: ReturnType<typeof userEvent.setup>,
  message = "Hello, nice website!",
) {
  await user.type(screen.getByLabelText("Name"), "Bob");
  await user.type(screen.getByLabelText("Email"), "bob@example.com");
  await user.type(screen.getByLabelText("Message"), message);
}

beforeEach(() => submitContact.mockReset());

describe("ContactSection", () => {
  it("shows validation errors and does not submit", async () => {
    const user = userEvent.setup();
    render(<ContactSection />);
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(
      await screen.findByText("Please enter your name"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please enter a valid email address"),
    ).toBeInTheDocument();
    expect(submitContact).not.toHaveBeenCalled();
  });

  it("submits valid data and shows a success message", async () => {
    submitContact.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(<ContactSection />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Thanks!");
    expect(submitContact).toHaveBeenCalledWith({
      name: "Bob",
      email: "bob@example.com",
      message: "Hello, nice website!",
      website: "",
    });
    await waitFor(() => expect(screen.getByLabelText("Name")).toHaveValue(""));
  });

  it("shows the server error and keeps the input", async () => {
    submitContact.mockResolvedValue({ ok: false, error: "Too many messages." });
    const user = userEvent.setup();
    render(<ContactSection />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Too many messages.",
    );
    expect(screen.getByLabelText("Name")).toHaveValue("Bob");
  });
});
