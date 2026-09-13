import { describe, it, expect } from "vitest";
import { env } from "./env";

describe("env", () => {
  it("exports expected keys", () => {
    expect(env).toHaveProperty("MONGODB_URI");
    expect(env).toHaveProperty("STREAM_API_KEY");
    expect(env).toHaveProperty("NODE_ENV");
  });
  it("defaults NODE_ENV", () => {
    expect(["development", "production", "test"]).toContain(env.NODE_ENV);
  });
});
