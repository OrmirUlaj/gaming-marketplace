import React from "react";
import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import ProfilePage from "../../pages/profile";
import { Providers } from "../../utils/test-utils";

const mockSession = {
  user: {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    role: "user" as "user" | "admin",
  },
  expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => <Providers session={mockSession}>{children}</Providers>,
  });
};

test("renders profile when user is logged in", () => {
  renderWithProviders(<ProfilePage />);
  expect(screen.getByRole("heading", { name: /Profile/i })).toBeInTheDocument();
  expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
});

test("shows edit profile button", () => {
  renderWithProviders(<ProfilePage />);
  expect(screen.getByRole("button", { name: /edit profile/i })).toBeInTheDocument();
});

test("redirects when no session", () => {
  render(
    <Providers session={null}>
      <ProfilePage />
    </Providers>
  );
  expect(screen.queryByRole("heading", { name: /Profile/i })).not.toBeInTheDocument();
});