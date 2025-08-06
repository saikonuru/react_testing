import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";

import { QueryClient, QueryClientProvider } from "react-query";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/Server";
import { db } from "../mocks/db";
describe("ProductList", () => {
  const renderComponent = () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={client}>
        <ProductList />
      </QueryClientProvider>
    );
  };

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
    renderComponent();
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should render no products available if no product found", async () => {
    server.use(http.get("/products", () => HttpResponse.json([])));
    renderComponent();

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });

  it("should render an error message", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    renderComponent();

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
    renderComponent();

    const message = await screen.findByText(/loading/i);
    expect(message).toBeInTheDocument();
  });

  it("should remove loading indicator after featching data", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should remove loading indicator if data featching fails", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
