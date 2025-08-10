import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductForm from "../../src/components/ProductForm";
import type { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";

describe("ProductForm", () => {
  let category: Category;
  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = (product?: Product) => {
    render(<ProductForm product={product} onSubmit={vi.fn()} />, {
      wrapper: AllProviders,
    });

    return {
      // waitForFormToLoad:await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
      waitForFormToLoad: async () => {
        await screen.findByRole("form");
        return {
          nameInput: screen.queryByPlaceholderText(/name/i),
          priceInput: screen.queryByPlaceholderText(/price/i),
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
          submitButton: screen.getByRole("button"),
        };
      }, // simpler way
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad } = renderComponent();

    const form = await waitForFormToLoad();

    expect(form.nameInput).toBeInTheDocument();
    expect(form.priceInput).toBeInTheDocument();
    expect(form.categoryInput).toBeInTheDocument();

    // ToDo: check categories are rendered
  });

  it("should populate form fields when editing a product", async () => {
    const product: Product = {
      id: 1,
      name: "Bread",
      price: 10,
      categoryId: category.id,
    };

    const { waitForFormToLoad } = renderComponent(product);

    const form = await waitForFormToLoad();

    expect(form.nameInput).toHaveValue(product.name);
    expect(form.priceInput).toHaveValue(product.price.toString());
    expect(form.categoryInput).toHaveTextContent(category.name);
  });

  it("should put focus on the name field", async () => {
    const { waitForFormToLoad } = renderComponent();

    const form = await waitForFormToLoad();

    expect(form.nameInput).toHaveFocus();
  });

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "longer than 255 char",
      name: "a".repeat(256),
      errorMessage: /255/i,
    },
  ])(
    "should display an error if name is $scenario",
    async ({ name, errorMessage }) => {
      const { waitForFormToLoad } = renderComponent();

      const form = await waitForFormToLoad();

      expect(form.nameInput).toHaveFocus();
      const user = userEvent.setup();
      if (name !== undefined) await userEvent.type(form.nameInput!, name);
      await user.type(form.priceInput!, "10");
      await user.click(form.categoryInput);
      const options = screen.getAllByRole("option");
      await user.click(options[0]);
      await user.click(form.submitButton);

      const error = screen.getByRole("alert");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(errorMessage);
    }
  );

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "zero",
      price: 0,
      errorMessage: /1/i,
    },
    {
      scenario: "negative",
      price: -1,
      errorMessage: /1/i,
    },
    {
      scenario: "greater than 1000",
      price: 1001,
      errorMessage: /1000/i,
    },
    {
      scenario: "not a number",
      price: "a",
      errorMessage: /required/i,
    },
  ])(
    "should display an error if price is $scenario",
    async ({ price, errorMessage }) => {
      const { waitForFormToLoad } = renderComponent();

      const form = await waitForFormToLoad();

      const user = userEvent.setup();
      await user.type(form.nameInput!, "a");

      if (price !== undefined) {
        await user.type(form.priceInput!, price.toString());
      }

      await user.click(form.categoryInput);
      const options = screen.getAllByRole("option");
      await user.click(options[0]);
      await user.click(form.submitButton);

      const error = screen.getByRole("alert");
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(errorMessage);
    }
  );
});
