import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { attractions } from "../src/content/attractions";
import { foods } from "../src/content/foods";

const publicImages = path.join(process.cwd(), "public", "images");

describe("local photo assets", () => {
  it("ships the homepage hero photo", () => {
    expect(existsSync(path.join(publicImages, "hero-ningxia.jpg"))).toBe(true);
  });

  it("ships a local photo for every attraction", () => {
    for (const attraction of attractions) {
      const file = path.join(publicImages, "attractions", `${attraction.slug}.jpg`);
      expect(existsSync(file), `${attraction.name}缺少本地照片`).toBe(true);
    }
  });

  it("ships a local photo for every food", () => {
    for (const food of foods) {
      const file = path.join(publicImages, "foods", `${food.slug}.jpg`);
      expect(existsSync(file), `${food.name}缺少本地照片`).toBe(true);
    }
  });
});
