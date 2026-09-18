import { expect, test } from "vitest";
import { getNameLayout } from "../components/OceanRenderer";

test("uses the full-scale, two-line name treatment on mobile", () => {
  const layout = getNameLayout(390, 844);

  expect(layout.lines).toEqual(["SCOTT", "FOGGO"]);
  expect(layout.fontSize).toBeCloseTo(93.6);
  expect(layout.maxWidth).toBeCloseTo(327.6);
});

test("uses a single-line name treatment on larger screens", () => {
  const layout = getNameLayout(1440, 900);

  expect(layout.lines).toEqual(["SCOTT FOGGO"]);
  expect(layout.fontSize).toBe(184.5);
});
