import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect } from "vitest";
import ProductCard from "../Product/ProductCard";
import { Providers } from "../../utils/test-utils";

const mockProduct = {
  title: "Test Game",
  price: 10,
  id: "1",
  description: "A test game description",
  category: "PC" as "PC" | "Console" | "Mobile",
  imageUrl: "",
  stock: 1,
  createdAt: "",
  updatedAt: ""
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => <Providers>{children}</Providers>,
  });
};

test("renders product title and price", () => {
  renderWithProviders(
    <ProductCard product={mockProduct} />
  );
  
  expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
});

test("renders product description", () => {
  renderWithProviders(
    <ProductCard product={mockProduct} />
  );
  
  expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
});

test("displays out of stock message when stock is 0", () => {
  const outOfStockProduct = { ...mockProduct, stock: 0 };
  renderWithProviders(
    <ProductCard product={outOfStockProduct} />
  );
  
  expect(screen.getByText("Out of Stock")).toBeInTheDocument();
});