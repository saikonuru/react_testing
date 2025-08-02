import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TermsAndConditions from "../../src/components/TermsAndConditions";

describe("TermsAndConditions", () => {
  it("should render with correct text and initial state", () => {
    render(<TermsAndConditions />);

    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Terms & Conditions");

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    const button = screen.getByRole("button"); //("button", { name: /submit/i }); if multiple buttons are there
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("should enable the button when the checkbox is checked", async () => {
    render(<TermsAndConditions />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    expect(screen.getByRole("button")).toBeEnabled(); //("button", { name: /submit/i }); if multiple buttons are there
  });
});
