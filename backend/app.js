const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const expenseRoutes = require("./routes/expense.routes");

app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);

app.use("/api/auth", authRoutes);

module.exports = app;