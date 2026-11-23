const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./jwt.secret");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded.userId !== "string" || !decoded.userId) {
      return res.status(401).send({ msg: "Session expired. Please sign in again." });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).send({ msg: "Login First" });
  }
};

module.exports = { auth };
