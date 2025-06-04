import request from "supertest";
import mongoose from "mongoose";
import createApp from "@/app";
import logger from "@/loaders/logger";

let app: any;
let token: string;
let todoId: string;

const userPayload = {
  name: "Todo Tester",
  email: "todo@example.com",
  password: "todoPassword123",
};

const todoPayload = {
  title: "Test Todo",
  description: "This is a test todo",
  status: false,
};


describe("Todo API", () => {
  beforeAll(async () => {
    app = await createApp();

    jest.spyOn(logger, "info").mockImplementation(() => logger);
    jest.spyOn(logger, "warn").mockImplementation(() => logger);
    jest.spyOn(logger, "error").mockImplementation(() => logger);

    // Register user
    await request(app).post("/api/auth/signup").send(userPayload);

    // Login and store token
    const loginRes = await request(app).post("/api/auth/signin").send({
      email: userPayload.email,
      password: userPayload.password,
    });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should create a todo", async () => {
    const res = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send(todoPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Test Todo");

    todoId = res.body._id; // Save for future tests
  });

  it("should fetch the created todo by id", async () => {
    const res = await request(app)
      .get(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.todos).toHaveProperty("_id", todoId);
  });

  it("should update the todo", async () => {
    const res = await request(app)
      .patch(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Todo",
        status: true,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Todo");
    expect(res.body.status).toBe(true);
  });

  it("should delete the todo", async () => {
    const res = await request(app)
      .delete(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true); // Adjust if different
  });

  it("should return 404 when fetching deleted todo", async () => {
    const res = await request(app)
      .get(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  it("should fail validation on create without required fields", async () => {
    const res = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });

  it("should return 401 without auth", async () => {
    const res = await request(app).get("/api/todos/123");

    expect(res.statusCode).toBe(401);
  });
});
