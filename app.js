const express = require("express");

const { connectToDatabase } = require("./db");
const { userRouter } = require("./routes/user.route");
const { auth } = require("./middlewere/auth.middlewere");
const { noteModel } = require("./model/note.model");

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.get("origin");
  const isLocalOrigin = process.env.NODE_ENV !== "production" &&
    /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");

  if (origin && (allowedOrigins.includes(origin) || isLocalOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  }

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

app.get("/api", (req, res) => {
  res.send({ status: "ok" });
});

app.use("/api", async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(503).send({ msg: "Database unavailable" });
  }
});

app.use("/api/user", userRouter);

app.get("/api/dashboard", auth, (req, res) => {
  res.send("Private Route");
});

app.get("/api/notes", auth, async (req, res) => {
  try {
    const notes = await noteModel.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.send(notes);
  } catch (error) {
    res.status(500).send({ msg: "Could not load notes" });
  }
});

app.post("/api/notes", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).send({ msg: "Title and note content are required" });
    }

    const note = await noteModel.create({
      userId: req.userId,
      title: title.trim(),
      content: content.trim(),
    });
    res.status(201).send(note);
  } catch (error) {
    res.status(500).send({ msg: "Could not create note" });
  }
});

app.patch("/api/notes/:id", auth, async (req, res) => {
  try {
    const allowed = {};
    if (typeof req.body.title === "string") allowed.title = req.body.title.trim();
    if (typeof req.body.content === "string") allowed.content = req.body.content.trim();
    if (typeof req.body.favorite === "boolean") allowed.favorite = req.body.favorite;

    if (Object.hasOwn(allowed, "title") && !allowed.title) {
      return res.status(400).send({ msg: "Title cannot be empty" });
    }

    const note = await noteModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      allowed,
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).send({ msg: "Note not found" });
    res.send(note);
  } catch (error) {
    res.status(500).send({ msg: "Could not update note" });
  }
});

app.delete("/api/notes/:id", auth, async (req, res) => {
  try {
    const note = await noteModel.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).send({ msg: "Note not found" });
    res.send({ msg: "Note deleted" });
  } catch (error) {
    res.status(500).send({ msg: "Could not delete note" });
  }
});

module.exports = app;
