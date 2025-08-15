import { useAuth0, type User } from "@auth0/auth0-react";
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

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
};

export const mockAuthState = (authState: AuthState) => {
  vi.mocked(useAuth0).mockReturnValue({
    ...authState,
    getAccessTokenSilently: vi.fn().mockResolvedValue("a"),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: vi.fn(),
    loginWithRedirect: vi.fn(),
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
    handleRedirectCallback: vi.fn(),
  });
};
