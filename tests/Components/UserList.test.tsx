import { render, screen } from "@testing-library/react";
import UserList from "../../src/components/UserList";
import type { User } from "../../src/entities";

describe("USerList", () => {
  it("should render a list", () => {
    render(<UserList users={[]} />);
    expect(screen.getByText(/no users/i)).toBeInTheDocument();
  });

  it("should render a list of users", () => {
    const users: User[] = [
      { id: 1, name: "Sai" },
      { id: 2, name: "Ram" },
    ];
    render(<UserList users={users} />);

    users.forEach((user) => {
      const link = screen.getByRole("link", { name: user.name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/users/${user.id}`);
    });
  });
});
