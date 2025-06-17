import { render, screen } from "@testing-library/react";
import ProfilePage from "../../pages/profile";
import { SessionProvider } from "next-auth/react";

test("renders Profile", () => {
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
      <ProfilePage />
    </SessionProvider>
  );
  // Only check for the heading
  expect(screen.getByRole("heading", { name: /Profile/i })).toBeInTheDocument();
  // Or check for the user's name
  expect(screen.getByText(/Test User/i)).toBeInTheDocument();
});