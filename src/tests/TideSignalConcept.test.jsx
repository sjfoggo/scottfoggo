import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

vi.mock("motion/react", async (importOriginal) => {
  const motion = await importOriginal();

  return {
    ...motion,
    useReducedMotion: () => true,
  };
});

import TideSignalConcept from "../components/TideSignalConcept";

test("renders the ocean narrative and contact links", () => {
  render(<TideSignalConcept />);

  expect(screen.getByRole("heading", { name: "Scott Foggo" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "I build software that turns data into decisions." })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "I value simplicity, bias for action, and moving fast." })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "I believe we’re better when working together." })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Let’s build something useful." })).toBeInTheDocument();

  expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:s.foggo.7@gmail.com");
  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/sjfoggo");
  expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/scott-foggo/");
  expect(screen.queryByRole("link", { name: "Résumé" })).not.toBeInTheDocument();
});
