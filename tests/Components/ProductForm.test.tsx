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
      expectErrorToBeInTheDocument: (errorMessage: RegExp) => {
        const error = screen.getByRole("alert");
        expect(error).toBeInTheDocument();
        expect(error).toHaveTextContent(errorMessage);
      },

      // waitForFormToLoad:await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
      waitForFormToLoad: async () => {
        await screen.findByRole("form");

        const nameInput = screen.queryByPlaceholderText(/name/i);
        const priceInput = screen.queryByPlaceholderText(/price/i);
        const categoryInput = screen.getByRole("combobox", {
          name: /category/i,
        });
        const submitButton = screen.getByRole("button");

        type FormData = {
          [K in keyof Product]: Product[K];
        };

        const validData: FormData = {
          id: 1,
          name: "a",
          price: 1,
          categoryId: 1,
        };

        const fill = async (product: Product) => {
          const user = userEvent.setup();

          if (product.name !== undefined) {
            // Clear the input before typing, especially for empty string
            await user.clear(nameInput!);
            if (product.name.length > 0) {
              await user.type(nameInput!, product.name);
            }
          }

          if (product.price !== undefined) {
            await user.clear(priceInput!);
            await user.type(priceInput!, product.price.toString());
          }

          await user.click(categoryInput);
          const options = screen.getAllByRole("option");
          await user.click(options[0]);
          await user.click(submitButton);
        };

        return {
          nameInput,
          priceInput,
          categoryInput,
          submitButton,
          fill: fill,
          validData,
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
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();

      const form = await waitForFormToLoad();

      await form.fill({ ...form.validData, name: name ?? "" });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it.each([
    {
      scenario: "missing",
      price: undefined as unknown as number,
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
      price: "a" as unknown as number,
      errorMessage: /required/i,
    },
  ])(
    "should display an error if price is $scenario",
    async ({ price, errorMessage }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();

      const form = await waitForFormToLoad();

      await form.fill({ ...form.validData, price });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it("should render all categories in the dropdown", async () => {
    const { waitForFormToLoad } = renderComponent();
    const form = await waitForFormToLoad();

    await userEvent.click(form.categoryInput);
    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);

    const categoryNames = db.category.getAll().map((category) => category.name);
    const optionNames = options.map((option) => option.textContent);
    categoryNames.forEach((name) => {
      expect(optionNames).toContain(name);
    });
  });
});
