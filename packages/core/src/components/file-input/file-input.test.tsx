import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../vitest";
import FileInput from "./file-input";

const createFile = (name: string, type: string, size: number) =>
    new File([new Uint8Array(size)], name, { type });

describe("@refraktor/core/FileInput", () => {
    it("supports input wrapper props", async () => {
        await render(
            <FileInput
                label="Documents"
                description="Upload PDF files"
                error="At least one file is required"
            />
        );

        const input = screen.getByLabelText("Documents");

        expect(input).toHaveAttribute("type", "file");
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(screen.getByText("Upload PDF files")).toBeInTheDocument();
        expect(
            screen.getByText("At least one file is required")
        ).toBeInTheDocument();
    });

    it("handles single file selection", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        await render(<FileInput label="Upload" onChange={onChange} />);

        const input = screen.getByLabelText("Upload") as HTMLInputElement;
        const file = new File(["hello"], "hello.txt", { type: "text/plain" });

        await user.upload(input, file);

        expect(onChange).toHaveBeenLastCalledWith([file]);
        expect(screen.getByText("hello.txt")).toBeInTheDocument();
    });

    it("enforces max files in multiple mode", async () => {
        const user = userEvent.setup({ applyAccept: false });
        const onChange = vi.fn();
        const onReject = vi.fn();

        await render(
            <FileInput
                label="Attachments"
                multiple
                maxFiles={2}
                onChange={onChange}
                onReject={onReject}
            />
        );

        const input = screen.getByLabelText("Attachments") as HTMLInputElement;
        const first = createFile("first.txt", "text/plain", 2);
        const second = createFile("second.txt", "text/plain", 3);
        const third = createFile("third.txt", "text/plain", 4);

        await user.upload(input, [first, second, third]);

        expect(onChange).toHaveBeenLastCalledWith([first, second]);
        expect(onReject).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    file: third,
                    code: "too-many-files"
                })
            ])
        );
    });

    it("rejects invalid type and invalid size files", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onReject = vi.fn();

        await render(
            <FileInput
                label="Media"
                multiple
                accept="image/*,.pdf"
                minSize={2}
                maxSize={4}
                onChange={onChange}
                onReject={onReject}
            />
        );

        const input = screen.getByLabelText("Media") as HTMLInputElement;
        const valid = createFile("photo.png", "image/png", 3);
        const invalidType = createFile("script.js", "application/javascript", 3);
        const tooSmall = createFile("tiny.png", "image/png", 1);
        const tooLarge = createFile("large.pdf", "application/pdf", 6);

        await user.upload(input, [valid, invalidType, tooSmall, tooLarge]);

        expect(onChange).toHaveBeenLastCalledWith([valid]);

        const rejectionPayload =
            onReject.mock.calls[onReject.mock.calls.length - 1]?.[0] ?? [];
        const rejectionCodes = rejectionPayload.map(
            (item: { code: string }) => item.code
        );

        expect(rejectionCodes).toEqual(
            expect.arrayContaining([
                "file-too-small",
                "file-too-large"
            ])
        );
    });

    it("clears selected files", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        await render(<FileInput label="Receipt" onChange={onChange} />);

        const input = screen.getByLabelText("Receipt") as HTMLInputElement;
        const file = createFile("receipt.pdf", "application/pdf", 3);

        await user.upload(input, file);

        const clearButton = screen.getByRole("button", { name: "Clear file" });
        await user.click(clearButton);

        expect(onChange).toHaveBeenLastCalledWith([]);
        expect(screen.getByText("Select file")).toBeInTheDocument();
    });
});
