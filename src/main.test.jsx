import { describe, expect, it } from "vitest";
import { entries, cells } from "./main.jsx";
describe("krzyżówka", () => {
  it("zawiera co najmniej osiem haseł", () =>
    expect(entries.length).toBeGreaterThanOrEqual(8));
  it("każde hasło ma zadaną długość", () =>
    entries.forEach((e) => expect(e.answer.length).toBe(e.length)));
  it("hasła poziome i pionowe przecinają się", () =>
    expect([...cells.values()].some((c) => c.entries.length > 1)).toBe(true));
  it("każde hasło ma definicję", () =>
    entries.forEach((e) => expect(e.clue.length).toBeGreaterThan(5)));
  it("układ zawiera wszystkie pola", () => expect(cells.size).toBe(56));
});
