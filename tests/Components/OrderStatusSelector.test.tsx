import { Theme } from "@radix-ui/themes";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    render(
      <>
        <Theme>
          <OrderStatusSelector onChange={it.fn} />
        </Theme>
      </>
    );

    return {
      button: screen.getByRole("combobox"),
      user: userEvent.setup(),
      getOptions: () => screen.findAllByRole("option"),
    };
  };

  it("should render New as the default value", () => {
    const { button } = renderComponent();

    expect(button).toHaveTextContent(/new/i);
  });

  it("should rendercorrect statuses", async () => {
    const { button, user, getOptions } = renderComponent();

    await user.click(button);

    const options = await getOptions();
    expect(options).toHaveLength(3);

    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });
});
