const JWT_SECRET = process.env.JWT_SECRET ||
  (process.env.NODE_ENV === "production" ? "" : "coding");

if (!JWT_SECRET) {
  throw new Error("Set JWT_SECRET in the production environment");
}

module.exports = { JWT_SECRET };
