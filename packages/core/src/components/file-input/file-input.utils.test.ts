import { describe, expect, it } from "vitest";
import { matchesAccept, validateFiles } from "./file-input.utils";

const createFile = (name: string, type: string, size: number) =>
    new File([new Uint8Array(size)], name, { type });

describe("@refraktor/core/FileInput utils", () => {
    it("matches files against accept rules", () => {
        const image = createFile("avatar.png", "image/png", 3);
        const pdf = createFile("sheet.pdf", "application/pdf", 3);

        expect(matchesAccept(image, "image/*")).toBe(true);
        expect(matchesAccept(pdf, "image/*")).toBe(false);
        expect(matchesAccept(pdf, ".pdf")).toBe(true);
    });

    it("rejects invalid file types", () => {
        const image = createFile("avatar.png", "image/png", 3);
        const script = createFile("script.js", "application/javascript", 3);

        const result = validateFiles([image, script], {
            multiple: true,
            accept: "image/*"
        });

        expect(result.accepted).toEqual([image]);
        expect(result.rejections).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    file: script,
                    code: "invalid-type"
                })
            ])
        );
    });
});
