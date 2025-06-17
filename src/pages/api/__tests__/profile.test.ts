import handler from "../profile";
import { createMocks } from "node-mocks-http";
import { vi } from "vitest";

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(() => ({
    user: {
      id: "test-user-id",
      name: "Test User",
      email: "test@example.com",
      role: "user",
    },
  })),
}));

vi.mock("@/lib/mongodb", () => ({
  __esModule: true,
  default: Promise.resolve({
    db: () => ({
      collection: () => ({
        find: () => ({ toArray: async () => [] }),
        insertOne: async () => ({}),
      }),
    }),
    close: () => {},
  }),
}));

describe("/api/profile", () => {
  it("returns 400 if not authenticated", async () => {
    const { req, res } = createMocks({ method: "PATCH" });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });
});