/* eslint-disable @typescript-eslint/unbound-method */
import { faker } from "@faker-js/faker";
import { factory, primaryKey } from "@mswjs/data";

export const db = factory({
  category: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.department,
  },
  product: {
    id: primaryKey(faker.number.int),
    categoryId: faker.number.int,
    name: faker.commerce.productName,
    price: () => faker.number.int({ min: 0, max: 100 }),
  },
});
