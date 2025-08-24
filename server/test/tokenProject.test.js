import { before, after, describe, it } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";

let serverInstance;
let mongo;

before(async () => {
  process.env.JWT_SECRET = "testsecret";
  mongo = await MongoMemoryServer.create({ binary: { version: "6.0.6" } });
  const uri = mongo.getUri();
  await mongoose.connect(uri);
  serverInstance = app.listen(0);
});

after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
  serverInstance.close();
});

describe("token project flow", () => {
  it("rejects project creation without token", async () => {
    const res = await fetch(`http://127.0.0.1:${serverInstance.address().port}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "NoToken", projectId: "notoken" })
    });
    assert.equal(res.status, 401);
  });

  it("allows project creation with token", async () => {
    const port = serverInstance.address().port;
    let res = await fetch(`http://127.0.0.1:${port}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Alice", email: "a@example.com", password: "pass123" })
    });
    assert.equal(res.status, 200);

    res = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "a@example.com", password: "pass123" })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    const token = data.token;
    assert.ok(token);

    res = await fetch(`http://127.0.0.1:${port}/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: "Proj", projectId: "proj123" })
    });
    assert.equal(res.status, 200);
    const proj = await res.json();
    assert.equal(proj.name, "Proj");
  });
});
