import handler from "../admin/users/index";
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

describe("/api/admin/users", () => {
  it("returns 403 if not admin", async () => {
    const { req, res } = createMocks({ method: "GET" });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(403);
  });
});