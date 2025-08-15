import { screen } from "@testing-library/react";
import { db } from "../mocks/db";
import { navigateTo } from "../utils";

describe("Router", () => {
  it("should render the home page for /", () => {
    navigateTo("/");

    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
  });

  it("should render the products page for /products", () => {
    navigateTo("/products");
    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should render the products details page for /products/:id", async () => {
    const product = db.product.create();

    navigateTo("/products/" + product.id);

    expect(
      await screen.findByRole("heading", { name: product.name })
    ).toBeInTheDocument();

    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it("should render not found page for invalid route", () => {
    navigateTo("/invalid-route/");

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it("should render the admin home page for route /admin", () => {
    navigateTo("/admin");
    expect(screen.getByRole("heading", { name: /admin/i })).toBeInTheDocument();
  });

  // waitForElementToBeRemoved not working
  //   it("should render product detail page for a given product id", async () => {
  //     const product = db.product.create();
  //     navigateTo(`/products/${product.id}`);

  //     await waitForElementToBeRemoved(() => screen.findAllByText(/loading/i));

  //     expect(
  //       screen.getByRole("heading", { name: product.name })
  //     ).toBeInTheDocument();
  //     expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
  //   });

  it("should render product detail page for a given product id", async () => {
    const product = db.product.create();
    const productId = product.id;

    navigateTo(`/products/${productId}`);

    expect(
      await screen.findByRole("heading", { name: product.name })
    ).toBeInTheDocument();

    expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();

    db.product.delete({ where: { id: { equals: productId } } });
  });
});
