import { render, screen } from "@testing-library/react";
import ProductCard from "../Product/ProductCard";
import { SessionProvider } from "next-auth/react";
import Header from "../Layout/Header";

test("renders product title", () => {
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
      <ProductCard
        product={{
          title: "Test Game",
          price: 10,
          id: "1",
          description: "",
          category: "PC",
          imageUrl: "",
          stock: 1,
          createdAt: "",
          updatedAt: ""
        }}
      />
    </SessionProvider>
  );
  expect(screen.getByText(/Test Game/i)).toBeInTheDocument();
});