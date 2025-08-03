import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/Server";

describe("ProductList", () => {
  it("should render list of products", async () => {
    render(<ProductList />);
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should render no products available if no product found", async () => {
    server.use(http.get("/products", () => HttpResponse.json([])));
    render(<ProductList />);

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });
});
