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
  it("Should not render an error if categories can not be fetched ", () => {
    server.use(http.get("/categories", () => HttpResponse.error()));
    renderComponent();

    expect(screen.queryByText("/error/i")).not.toBeInTheDocument();
  });

  it("Should not render an error if categories can not be fetched ", async () => {
    server.use(http.get("/categories", () => HttpResponse.error()));
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );
    expect(screen.queryByText("/error/i")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: /category/i })
    ).not.toBeInTheDocument();
  });

  it("Should render an error if products can not be fetched ", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );
    expect(
      screen.queryByRole("alert", { name: /product-error/i })
    ).toBeInTheDocument();
  });
});
