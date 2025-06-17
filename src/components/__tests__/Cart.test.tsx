import { render, screen } from "@testing-library/react";
import Cart from "../Cart/Cart";
import { SessionProvider } from "next-auth/react";

test("renders Shopping Cart", () => {
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
      <Cart />
    </SessionProvider>
  );
  expect(screen.getByText(/Shopping Cart/i)).toBeInTheDocument();
});