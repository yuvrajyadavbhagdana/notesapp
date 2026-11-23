require("dotenv").config();

const app = require("./app");
const { connectToDatabase } = require("./db");

async function startServer() {
  try {
    await connectToDatabase();
    console.log("DB Connected");
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) startServer();

module.exports = app;
