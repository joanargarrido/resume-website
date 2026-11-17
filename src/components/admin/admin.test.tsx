import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { validateFile, IMAGE_RULES, PDF_RULES } from "@/lib/upload";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));

const uploadPublicAsset = vi.fn();
vi.mock("@/lib/upload", async (orig) => ({
  ...(await orig<typeof import("@/lib/upload")>()),
  uploadPublicAsset: (...a: unknown[]) => uploadPublicAsset(...a),
}));

import { EducationForm } from "./EducationForm";
import { ImageUpload } from "./ImageUpload";
import { ItemList, ResourceManager } from "./ItemList";
import { PdfUpload } from "./PdfUpload";
import { ProfileForm } from "./ProfileForm";
import { SkillForm } from "./SkillForm";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("EducationForm", () => {
  it("shows validation errors without calling the action", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<EducationForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      await screen.findByText("Institution is required"),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls the action with the parsed values", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(<EducationForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("Institution"), "Uni");
    await user.type(screen.getByLabelText("Degree"), "BSc");
    await user.type(screen.getByLabelText("Start date"), "2015-09-01");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      institution: "Uni",
      degree: "BSc",
      start_date: "2015-09-01",
      end_date: "",
    });
  });

  it("shows an error returned by the action", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: false, error: "Nope" });
    const user = userEvent.setup();
    render(<EducationForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("Institution"), "Uni");
    await user.type(screen.getByLabelText("Degree"), "BSc");
    await user.type(screen.getByLabelText("Start date"), "2015-09-01");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Nope");
  });
});

describe("SkillForm", () => {
  it("submits name, category and level", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(<SkillForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("Name"), "TypeScript");
    await user.selectOptions(screen.getByLabelText("Level"), "5");
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: "TypeScript",
        category: "",
        level: "5",
      }),
    );
  });
});

describe("ProfileForm", () => {
  it("requires a name and saves valid data", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(<ProfileForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Save profile" }));
    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText("Full name"), "Ada");
    await user.click(screen.getByRole("button", { name: "Save profile" }));
    expect(await screen.findByText("Profile saved.")).toBeInTheDocument();
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      full_name: "Ada",
      dob_display: "hidden",
    });
  });
});

describe("ItemList", () => {
  const entries = [
    { id: "a", title: "First" },
    { id: "b", title: "Second" },
  ];

  it("disables the outer reorder buttons", () => {
    render(
      <ItemList
        entries={entries}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onMove={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Move First up" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Move Second down" }),
    ).toBeDisabled();
  });

  it("reports reorder clicks", async () => {
    const onMove = vi.fn();
    const user = userEvent.setup();
    render(
      <ItemList
        entries={entries}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onMove={onMove}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Move Second up" }));
    expect(onMove).toHaveBeenCalledWith("b", "up");
  });

  it("asks for confirmation before deleting", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    const confirm = vi.spyOn(window, "confirm");
    render(
      <ItemList
        entries={entries}
        onEdit={vi.fn()}
        onDelete={onDelete}
        onMove={vi.fn()}
      />,
    );

    confirm.mockReturnValueOnce(false);
    await user.click(screen.getByRole("button", { name: "Delete First" }));
    expect(onDelete).not.toHaveBeenCalled();

    confirm.mockReturnValueOnce(true);
    await user.click(screen.getByRole("button", { name: "Delete First" }));
    expect(onDelete).toHaveBeenCalledWith("a");
  });
});

describe("ResourceManager", () => {
  it("runs the move action and refreshes", async () => {
    const onMove = vi.fn().mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(
      <ResourceManager
        noun="skill"
        items={[{ id: "a" }, { id: "b" }]}
        describe={(i) => ({ id: i.id, title: `Item ${i.id}` })}
        renderForm={() => <p>form</p>}
        onDelete={vi.fn()}
        onMove={onMove}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Move Item b up" }));
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(onMove).toHaveBeenCalledWith("b", "up");
  });

  it("opens the form to add an item", async () => {
    const user = userEvent.setup();
    render(
      <ResourceManager
        noun="skill"
        items={[]}
        describe={(i: { id: string }) => ({ id: i.id, title: i.id })}
        renderForm={() => <p>the form</p>}
        onDelete={vi.fn()}
        onMove={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Add skill" }));
    expect(screen.getByText("the form")).toBeInTheDocument();
  });

  it("shows an error when an action fails", async () => {
    const onMove = vi.fn().mockResolvedValue({ ok: false, error: "Denied" });
    const user = userEvent.setup();
    render(
      <ResourceManager
        noun="skill"
        items={[{ id: "a" }, { id: "b" }]}
        describe={(i) => ({ id: i.id, title: `Item ${i.id}` })}
        renderForm={() => null}
        onDelete={vi.fn()}
        onMove={onMove}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Move Item b up" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Denied");
    expect(refresh).not.toHaveBeenCalled();
  });
});

describe("validateFile", () => {
  it("accepts allowed images and PDFs", () => {
    expect(
      validateFile({ type: "image/png", size: 1000 }, IMAGE_RULES),
    ).toBeNull();
    expect(
      validateFile({ type: "application/pdf", size: 1000 }, PDF_RULES),
    ).toBeNull();
  });
  it("rejects wrong types and oversize files", () => {
    expect(
      validateFile({ type: "image/gif", size: 1000 }, IMAGE_RULES),
    ).toMatch(/Unsupported/);
    expect(
      validateFile(
        { type: "image/png", size: 5 * 1024 * 1024 + 1 },
        IMAGE_RULES,
      ),
    ).toMatch(/too large/);
    expect(validateFile({ type: "image/png", size: 1000 }, PDF_RULES)).toMatch(
      /Unsupported/,
    );
    expect(
      validateFile(
        { type: "application/pdf", size: 11 * 1024 * 1024 },
        PDF_RULES,
      ),
    ).toMatch(/too large/);
  });
});

describe("upload components", () => {
  it("ImageUpload rejects a non-image without uploading", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup({ applyAccept: false });
    render(<ImageUpload value="" onChange={onChange} />);
    await user.upload(
      screen.getByLabelText("Photo"),
      new File(["x"], "doc.pdf", { type: "application/pdf" }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unsupported file type",
    );
    expect(uploadPublicAsset).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("PdfUpload rejects an image without uploading", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup({ applyAccept: false });
    render(<PdfUpload value="" onChange={onChange} />);
    await user.upload(
      screen.getByLabelText("CV (PDF)"),
      new File(["x"], "me.png", { type: "image/png" }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unsupported file type",
    );
    expect(uploadPublicAsset).not.toHaveBeenCalled();
  });

  it("PdfUpload uploads a valid PDF and reports the stored path", async () => {
    uploadPublicAsset.mockResolvedValue("cv/new.pdf");
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<PdfUpload value="" onChange={onChange} />);
    await user.upload(
      screen.getByLabelText("CV (PDF)"),
      new File(["%PDF"], "cv.pdf", { type: "application/pdf" }),
    );
    await waitFor(() => expect(onChange).toHaveBeenCalledWith("cv/new.pdf"));
  });
});
