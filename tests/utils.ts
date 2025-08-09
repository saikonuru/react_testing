import delay from "delay";
import { http, HttpResponse } from "msw";
import { server } from "./mocks/Server";

export const simulateDelay = (endpoint: string) => {
  server.use(
    http.get(endpoint, async () => {
      await delay(1000);
      return HttpResponse.json([]);
    })
  );
};

export const simulateError = (endPoint: string) => {
  server.use(http.get(endPoint, () => HttpResponse.error()));
};
