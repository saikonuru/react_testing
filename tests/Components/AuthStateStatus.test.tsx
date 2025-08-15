import { render, screen } from "@testing-library/react";
import AuthStatus from "../../src/components/AuthStatus";
import { mockAuthState } from "../utils";

describe("AuthStatus", () => {
  it("should render loading message while fetching the auth state", () => {
    mockAuthState({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render login button if the user is not authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("should render login button if the user is not authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });

    render(<AuthStatus />);
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log out/i })
    ).not.toBeInTheDocument();
  });

  it("should render user name if authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: { name: "Sairam" },
    });

    render(<AuthStatus />);
    expect(screen.getByText("Sairam")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /log in/i })
    ).not.toBeInTheDocument();
  });
});
