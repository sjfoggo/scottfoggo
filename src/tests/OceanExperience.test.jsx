import React from "react";
import { act, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

vi.mock("../components/OceanRenderer", () => ({
  default: () => null,
}));

import OceanExperience, {
  getHeroNameScrollStyle,
} from "../components/OceanExperience";

test("fully hides the hero name before narrative statements begin", () => {
  expect(getHeroNameScrollStyle(0)).toEqual({
    opacity: 1,
    visibility: "visible",
  });
  const midpoint = getHeroNameScrollStyle(0.065);
  expect(midpoint.opacity).toBeCloseTo(0.5);
  expect(midpoint.visibility).toBe("visible");

  [0.09, 0.12, 0.38, 0.62, 0.84, 1].forEach((progress) => {
    expect(getHeroNameScrollStyle(progress)).toEqual({
      opacity: 0,
      visibility: "hidden",
    });
  });
});

test("renders the ocean narrative and contact links", () => {
  vi.useFakeTimers();
  render(<OceanExperience />);

  const name = screen.getByRole("heading", { name: "Scott Foggo" });
  expect(name).toBeInTheDocument();
  expect(name.className).not.toContain("heroNameVisible");

  act(() => vi.advanceTimersByTime(1999));
  expect(name.className).not.toContain("heroNameVisible");

  act(() => vi.advanceTimersByTime(1));
  expect(name.className).toContain("heroNameVisible");
  expect(
    screen.getByRole("heading", {
      name: "I build software that turns data into decisions.",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: "I value simplicity, bias for action, and moving fast.",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: "I believe we’re better when working together.",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Let’s build something useful." }),
  ).toBeInTheDocument();

  expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
    "href",
    "mailto:s.foggo.7@gmail.com",
  );
  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/sjfoggo",
  );
  expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/scott-foggo/",
  );
  vi.useRealTimers();
});
