import "@testing-library/jest-dom/vitest";

import { PropsWithChildren, type ReactNode } from "react";
import ResizeObserver from "resize-observer-polyfill";
import { server } from "./mocks/Server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock("@auth0/auth0-react", () => {
  return {
    useAuth0: vi.fn().mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    }),
    Auth0Provider: ({ children }: PropsWithChildren) => children as JSX.Element,
    withAuthenticationRequired: (component: ReactNode) => component,
  };
});

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

global.ResizeObserver = ResizeObserver;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false as boolean,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    media: query,
    onchange: null,
    // addListener: vi.fn(), // deprecated
    // removeListener: vi.fn() as () => void, // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
