import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import CategoryList from "../../src/components/CategoryList";
import type { Category } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("CategoryList", () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.category.create({ name: "Category " + item });
      categories.push(category);
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((category) => category.id);
    db.category.delete({ where: { id: { in: categoryIds } } });
  });

  const renderComponent = () => {
    render(<CategoryList />, { wrapper: AllProviders });
  };

  it("should render a list of categories", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    categories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it("should render a loading message when fetching of categories", () => {
    simulateDelay("/categories");
    renderComponent();

    screen.getByText(/loading/i);
  });

  it("Should render an error if categories can not be fetched ", async () => {
    simulateError("/categories");
    renderComponent();
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
