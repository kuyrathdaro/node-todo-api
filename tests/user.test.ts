import request from "supertest";
import mongoose from "mongoose";
import app from "@/app";

describe("User API", () => {
  let token: string;

  const userPayload = {
    name: "User Me",
    email: "me@example.com",
    password: "securePassword456",
  };

  beforeAll(async () => {
    // Sign up
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

  it("should get current user profile", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe(userPayload.email);
  });

  it("should update current user profile", async () => {
    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Name" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("userRecord");
    expect(res.body.userRecord.name).toBe("Updated Name");
  });

  it("should fail without auth token", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.statusCode).toBe(401);
  });
});
