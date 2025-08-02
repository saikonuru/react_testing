import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpandableText from "../../src/components/ExpandableText";

describe("ExpandableText", () => {
  const limit = 255;
  const longText = "a".repeat(256);
  const truncatedText = longText.substring(0, limit) + "...";

  it("should render full text if it is less than ${limit} characters", () => {
    const text = "short text";
    render(<ExpandableText text={text} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("should truncate text if it is more than ${limit} characters", () => {
    render(<ExpandableText text={longText} />);
    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    const button = screen.getByRole("button", { name: /more/i }); //("button", { name: /submit/i }); if multiple buttons are there
    expect(button).toHaveTextContent(/more/i);
  });

  it("should expand text when Show More button is clicked", async () => {
    render(<ExpandableText text={longText} />);

    const button = screen.getByRole("button", { name: /more/i });
    expect(button).toHaveTextContent(/more/i);

    const user = userEvent.setup();

    await user.click(button);
    expect(button).toHaveTextContent(/less/i);
  });

  it("should collapse text when Show Less button is clicked", async () => {
    render(<ExpandableText text={longText} />);

    const showMoreButton = screen.getByRole("button", { name: /more/i });
    expect(showMoreButton).toHaveTextContent(/more/i);

    const user = userEvent.setup();

    await user.click(showMoreButton);

    const showLessButton = screen.getByRole("button", { name: /less/i });
    await user.click(showLessButton);

    expect(showLessButton).toHaveTextContent(/more/i);
  });
});
