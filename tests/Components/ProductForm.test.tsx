import { render, screen } from "@testing-library/react";
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
      waitForFormToLoad: () => screen.findByRole("form"), // simpler way
      getInputs: () => {
        return {
          nameInput: screen.queryByPlaceholderText(/name/i),
          priceInput: screen.queryByPlaceholderText(/price/i),
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
        };
      },
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad, getInputs } = renderComponent();

    await waitForFormToLoad();
    const inputs = getInputs();

    expect(inputs.nameInput).toBeInTheDocument();
    expect(inputs.priceInput).toBeInTheDocument();
    expect(inputs.categoryInput).toBeInTheDocument();

    // ToDo: check categories are rendered
  });

  it("should populate form fields when editing a product", async () => {
    const product: Product = {
      id: 1,
      name: "Bread",
      price: 10,
      categoryId: category.id,
    };

    const { waitForFormToLoad, getInputs } = renderComponent(product);
    await waitForFormToLoad();
    const inputs = getInputs();

    expect(inputs.nameInput).toHaveValue(product.name);
    expect(inputs.priceInput).toHaveValue(product.price.toString());
    expect(inputs.categoryInput).toHaveTextContent(category.name);
  });
});
