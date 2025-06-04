import request from "supertest";
import mongoose from "mongoose";
import createApp from "@/app";
import logger from "@/loaders/logger";

let app;

describe("Auth API", () => {
  const userPayload = {
    name: "User Me",
    email: "me@example.com",
    password: "securePassword456",
  };

  beforeAll(async () => {
    app = await createApp();
    jest.spyOn(logger, "info").mockImplementation((info: any) => logger);
    jest.spyOn(logger, "warn").mockImplementation((info: any) => logger);
    jest.spyOn(logger, "error").mockImplementation((info: any) => logger);
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should sign up a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send(userPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(userPayload.email);
  });

  it("should not allow duplicate signup", async () => {
    const res = await request(app).post("/api/auth/signup").send(userPayload);

    expect(res.statusCode).toBe(409);
  });

  it("should sign in the user", async () => {
    const res = await request(app).post("/api/auth/signin").send({
      email: userPayload.email,
      password: userPayload.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(userPayload.email);
  });

  it("should not sign in with wrong password", async () => {
    const res = await request(app).post("/api/auth/signin").send({
      email: userPayload.email,
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should fail validation with bad input", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "bad-email-only" });

    expect(res.statusCode).toBe(400);
  });
});
