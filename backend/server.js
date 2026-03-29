const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }) // auto create/update tables
  .then(() => {
    console.log("Database connected & synced");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.log(err));