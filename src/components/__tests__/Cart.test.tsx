import React from "react";
import { render, screen } from "@testing-library/react";
import { test, expect, vi, beforeEach } from "vitest";
import Cart from "../Cart/Cart";
import { Providers } from "../../utils/test-utils";
import { useRouter } from "next/router";

vi.mock("next/router", () => ({
  useRouter: vi.fn()
}));

const mockSession = {
  user: {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    role: "user" as "user" | "admin",
  },
  expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
};

beforeEach(() => {
  vi.mocked(useRouter).mockReturnValue({
    push: vi.fn(),
  } as any);
});

test("renders Shopping Cart when logged in", () => {
  render(
    <Providers session={mockSession}>
      <Cart />
    </Providers>
  );
  expect(screen.getByText(/Shopping Cart/i)).toBeInTheDocument();
});

test("shows login message when not logged in", () => {
  render(
    <Providers session={null}>
      <Cart />
    </Providers>
  );
  expect(screen.getByText(/Please log in to see your cart/i)).toBeInTheDocument();
});

test("shows empty cart message when cart has no items", () => {
  render(
    <Providers session={mockSession}>
      <Cart />
    </Providers>
  );
  expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
});

test("renders continue shopping button", () => {
  render(
    <Providers session={mockSession}>
      <Cart />
    </Providers>
  );
  expect(screen.getByText(/Continue Shopping/i)).toBeInTheDocument();
});