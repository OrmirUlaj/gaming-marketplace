/// <reference types="vitest" />

import React from "react";
import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import Header from "../Layout/Header";
import { SessionProvider } from "next-auth/react";

test("renders logo and navigation", () => {
  render(
    <SessionProvider
      session={{
        user: {
          id: "test-user-id",
          name: "Test User",
          email: "test@example.com",
          role: "user",
        },
        expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }}
    >
      <Header />
    </SessionProvider>
  );
  expect(screen.getByText(/Stoom/i)).toBeInTheDocument();
  expect(screen.getByText(/Home/i)).toBeInTheDocument();
});