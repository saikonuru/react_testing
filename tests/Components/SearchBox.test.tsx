import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBox from "../../src/components/SearchBox";

describe("group", () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);
    return {
      input: screen.getByPlaceholderText(/search/i),
      user: userEvent.setup(),
      onChange,
    };
  };
  it("should render input field for searching", () => {
    const { input } = renderComponent();
    expect(input).toBeInTheDocument();
  });

  it("should call onChange when Enter is pressed", async () => {
    const { input, user, onChange } = renderComponent();
    expect(input).toBeInTheDocument();

    const searchTerm = "Search Term";
    await user.type(input, searchTerm + "{enter}");
    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });

  it("should not call onChange if input field is empty", async () => {
    const { input, user, onChange } = renderComponent();
    expect(input).toBeInTheDocument();

    const searchTerm = "";
    await user.type(input, searchTerm + "{enter}");
    expect(onChange).not.toHaveBeenCalledWith(searchTerm);
  });
});
