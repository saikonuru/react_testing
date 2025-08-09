import { Theme } from "@radix-ui/themes";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import delay from "delay";
import { http, HttpResponse } from "msw";
import type { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { CartProvider } from "../../src/providers/CartProvider";
import { server } from "../mocks/Server";
import { db } from "../mocks/db";

describe("BrowseProducts", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.category.create({ name: "Category " + item });
      categories.push(category);
      products.push(db.product.create());
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((category) => category.id);
    db.category.delete({ where: { id: { in: categoryIds } } });

    const productIds = products.map((product) => product.id);
    db.product.delete({ where: { id: { in: productIds } } });
  });

  const renderComponent = () =>
    render(
      <CartProvider>
        <Theme>
          <BrowseProducts />
        </Theme>
      </CartProvider>
    );
  it("Should show a Skeleton while fetching categories ", () => {
    server.use(
      http.get("/categories", async () => {
        await delay(1000);
        return HttpResponse.json([]);
      })
    );
    renderComponent();
    expect(
      screen.getByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });

  it("Should hide a Skeleton while fetching categories ", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", { name: /categories/i })
    );
  });

  it("Should show a Skeleton while fetching products ", () => {
    server.use(
      http.get("/products", async () => {
        await delay(1000);
        return HttpResponse.json([]);
      })
    );
    renderComponent();
    expect(
      screen.getByRole("progressbar", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("Should hide a Skeleton while fetching products ", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", { name: /products/i })
    );
  });
  it("Should not render an error if categories can not be fetched ", () => {
    server.use(http.get("/categories", () => HttpResponse.error()));
    renderComponent();

    expect(screen.queryByText("/error/i")).not.toBeInTheDocument();
  });

  it("Should not render an error if categories can not be fetched ", async () => {
    server.use(http.get("/categories", () => HttpResponse.error()));
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );
    expect(screen.queryByText("/error/i")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: /category/i })
    ).not.toBeInTheDocument();
  });

  it("Should render an error if products can not be fetched ", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );
    expect(
      screen.queryByRole("alert", { name: /product-error/i })
    ).toBeInTheDocument();
  });

  it("should render categories", async () => {
    renderComponent();

    const combobox = await screen.findByRole("combobox");
    expect(combobox).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(combobox);

    const options = await screen.findAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
