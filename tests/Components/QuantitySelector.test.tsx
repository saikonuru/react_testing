import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantitySelector from "../../src/components/QuantitySelector";
import type { Product } from "../../src/entities";
import { CartProvider } from "../../src/providers/CartProvider";

describe("QuantitySelector", () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: "Milk",
      price: 9,
      categoryId: 1,
    };

    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );
    return {
      addToCartButton: () => {
        return screen.getByRole("button", { name: /add to cart/i });
      },

      getQuantityControls: () => ({
        quantity: screen.getByRole("status"),
        incrementButton: screen.getByRole("button", { name: "+" }),
        decrementButton: screen.getByRole("button", { name: "-" }),
      }),

      user: userEvent.setup(),
    };
  };
  it("should render Add to Cart button", () => {
    const { addToCartButton } = renderComponent();

    expect(addToCartButton()).toBeInTheDocument();
  });

  it("should add product to the cart", async () => {
    const { addToCartButton, user, getQuantityControls } = renderComponent();

    expect(addToCartButton()).toBeInTheDocument();
    await user.click(addToCartButton());

    const { quantity, incrementButton, decrementButton } =
      getQuantityControls();
    expect(quantity).toHaveTextContent("1");

    expect(incrementButton).toBeInTheDocument();
    expect(decrementButton).toBeInTheDocument();

    await user.click(decrementButton);

    expect(
      screen.queryByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });

  it("should increment the quantity", async () => {
    const { addToCartButton, user, getQuantityControls } = renderComponent();

    expect(addToCartButton()).toBeInTheDocument();
    await user.click(addToCartButton());

    const { quantity, incrementButton } = getQuantityControls();
    expect(incrementButton).toBeInTheDocument();
    await user.click(incrementButton);
    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the quantity", async () => {
    const { addToCartButton, user, getQuantityControls } = renderComponent();
    expect(addToCartButton()).toBeInTheDocument();
    await user.click(addToCartButton());
    const { quantity, decrementButton, incrementButton } =
      getQuantityControls();

    await user.click(incrementButton);
    await user.click(decrementButton);

    expect(quantity).toHaveTextContent("1");
  });

  it("should remove product from cart", async () => {
    const { addToCartButton, user, getQuantityControls } = renderComponent();
    expect(addToCartButton()).toBeInTheDocument();
    await user.click(addToCartButton());
    const { quantity, decrementButton, incrementButton } =
      getQuantityControls();

    await user.click(decrementButton);

    expect(quantity).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(addToCartButton()).toBeInTheDocument();
  });
});
