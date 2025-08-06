import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";

import ProductList from "../../src/components/ProductList";
import AllProviders from "../AllProviders";
import { server } from "../mocks/Server";
import { db } from "../mocks/db";
describe("ProductList", () => {
  const productIds: number[] = [];
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it("should render list of products", async () => {
    render(<ProductList />, { wrapper: AllProviders });
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should render no products available if no product found", async () => {
    server.use(http.get("/products", () => HttpResponse.json([])));
    render(<ProductList />, { wrapper: AllProviders });

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });

  it("should render an error message", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    render(<ProductList />, { wrapper: AllProviders });

    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  });

  it("should render a loading indicator when featching data", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    render(<ProductList />, { wrapper: AllProviders });

    const message = await screen.findByText(/loading/i);
    expect(message).toBeInTheDocument();
  });

  it("should remove loading indicator after featching data", async () => {
    render(<ProductList />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should remove loading indicator if data featching fails", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    render(<ProductList />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
