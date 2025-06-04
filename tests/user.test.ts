import request from "supertest";
import mongoose from "mongoose";
import createApp from "@/app";
import logger from "@/loaders/logger";

let app: any;
let token: string;

describe("User API", () => {
  const userPayload = {
    name: "User Me",
    email: "me@example.com",
    password: "securePassword456",
  };

  beforeAll(async () => {
    app = await createApp();

    // Mute winston logs
    jest.spyOn(logger, "info").mockImplementation((info: any) => logger);
    jest.spyOn(logger, "warn").mockImplementation((info: any) => logger);
    jest.spyOn(logger, "error").mockImplementation((info: any) => logger);

    // Sign up the user
    await request(app).post("/api/auth/signup").send(userPayload);

    // Sign in to get token
    const res = await request(app).post("/api/auth/signin").send({
      email: userPayload.email,
      password: userPayload.password,
    });

    token = res.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should get the current user's profile", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe(userPayload.email);
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/users/me");

    expect(res.statusCode).toBe(401);
  });

  it("should return 401 for invalid token", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(401);
  });
});
