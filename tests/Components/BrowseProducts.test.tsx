import { Theme } from "@radix-ui/themes";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { CartProvider } from "../../src/providers/CartProvider";
import { db } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

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

  const renderComponent = () => {
    render(
      <CartProvider>
        <Theme>
          <BrowseProducts />
        </Theme>
      </CartProvider>
    );
    return {
      getProductsSkeleton: () =>
        screen.queryByRole("progressbar", { name: /products/i }),
      getCategoriesSkeleton: () =>
        screen.queryByRole("progressbar", { name: /categories/i }),
      getCategoriesCombobox: () => screen.queryByRole("combobox"),
    };
  };
  it("Should show a Skeleton while fetching categories ", () => {
    simulateDelay("/categories");

    const { getCategoriesSkeleton: getcategoriesSkeleton } = renderComponent();
    expect(getcategoriesSkeleton()).toBeInTheDocument();
  });

  it("Should hide a Skeleton while fetching categories ", async () => {
    const { getCategoriesSkeleton: getcategoriesSkeleton } = renderComponent();
    await waitForElementToBeRemoved(() => getcategoriesSkeleton());
  });

  it("Should show a Skeleton while fetching products ", () => {
    simulateDelay("/products");
    const { getProductsSkeleton } = renderComponent();
    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it("Should hide a Skeleton while fetching products ", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(() => getProductsSkeleton());
  });
  it("Should not render an error if categories can not be fetched ", () => {
    simulateError("/categories");
    renderComponent();

    expect(screen.queryByText("/error/i")).not.toBeInTheDocument();
  });

  it("Should not render an error if categories can not be fetched ", async () => {
    simulateError("/categories");
    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();

    await waitForElementToBeRemoved(() => getCategoriesSkeleton());
    expect(screen.queryByText("/error/i")).not.toBeInTheDocument();
    expect(getCategoriesCombobox()).not.toBeInTheDocument();
  });

  it("Should render an error if products can not be fetched ", async () => {
    simulateError("/products");
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(() => getProductsSkeleton());
    expect(
      screen.queryByRole("alert", { name: /product-error/i })
    ).toBeInTheDocument();
  });

  it("should render categories", async () => {
    const { getCategoriesCombobox, getCategoriesSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
    const combobox = getCategoriesCombobox();
    expect(combobox).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(combobox!);

    const options = await screen.findAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductsSkeleton } = renderComponent();
    await waitForElementToBeRemoved(() => getProductsSkeleton());

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
