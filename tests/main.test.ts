import { faker } from "@faker-js/faker";
import { describe, it } from "vitest";
describe("MainTestgroup", () => {
  it("should", async () => {
    // const response = await fetch("/categories");
    // const data = await response.json();
    // console.log(data);
    // expect(data).toHaveLength(3);

    console.log({
      name: faker.commerce.productName(),
      price: faker.commerce.price({ min: 0, max: 100 }),
    });
  });
});
