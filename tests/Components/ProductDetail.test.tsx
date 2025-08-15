import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import { delay, http, HttpResponse } from "msw";
import ProductDetail from "../../src/components/ProductDetail";

import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { server } from "../mocks/Server";

describe("ProductDetail", () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("should render produce detail", async () => {
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    expect(
      await screen.findByRole("heading", { name: /detail/i })
    ).toBeInTheDocument();

    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();
  });

  it("should render a message if product is not found", async () => {
    server.use(http.get("/products/1", () => HttpResponse.json(null)));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("should render an error for invalid product", async () => {
    render(<ProductDetail productId={0} />, { wrapper: AllProviders });
    expect(await screen.findByText(/invalid/i)).toBeInTheDocument();
  });

  it("should render an error message if data fetching fails", async () => {
    server.use(http.get("/products/1", () => HttpResponse.error()));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  });

  it("should render a loading indicator when fetching data", async () => {
    server.use(
      http.get("/products/1", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    const message = await screen.findByText(/loading/i);
    expect(message).toBeInTheDocument();
  });

  it("should remove loading indicator after fetching data", async () => {
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should remove loading indicator if data fetching fails", async () => {
    server.use(http.get("/products/1", () => HttpResponse.error()));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
