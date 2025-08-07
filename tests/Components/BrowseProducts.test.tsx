import { Theme } from "@radix-ui/themes";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import delay from "delay";
import { http, HttpResponse } from "msw";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { server } from "../mocks/Server";

describe("BrowseProducts", () => {
  const renderComponent = () =>
    render(
      <Theme>
        <BrowseProducts />
      </Theme>
    );
  it("Should show a Skeleton while fetching categories ", () => {
    server.use(
      http.get("/categories", async () => {
        await delay(1000);
        return HttpResponse.json([]);
      })
    );
    renderComponent();
    expect(
      screen.getByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });

  it("Should hide a Skeleton while fetching categories ", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", { name: /categories/i })
    );
  });

  it("Should show a Skeleton while fetching products ", () => {
    server.use(
      http.get("/products", async () => {
        await delay(1000);
        return HttpResponse.json([]);
      })
    );
    renderComponent();
    expect(
      screen.getByRole("progressbar", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("Should hide a Skeleton while fetching products ", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", { name: /products/i })
    );
  });
});
