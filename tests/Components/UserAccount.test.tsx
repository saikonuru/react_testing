import { render, screen } from "@testing-library/react";

import UserAccount from "../../src/components/UserAccount";
import type { User } from "../../src/entities";

describe("User Account", () => {
  const user: User = {
    id: 1,
    name: "Sairam",
    isAdmin: true,
  };

  it("shoud render user name", () => {
    render(<UserAccount user={user} />);

    expect(screen.getByText(user.name)).toBeInTheDocument();
  });
  it("should display enable edit button if user is admin", () => {
    render(<UserAccount user={user} />);

    const button = screen.getByRole("button"); // getByRole
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });

  it("should not display edit button if user is not admin", () => {
    user.isAdmin = false;
    render(<UserAccount user={user} />);
    const button = screen.queryByRole("button"); //queryByRole
    expect(button).not.toBeInTheDocument();
  });
});
