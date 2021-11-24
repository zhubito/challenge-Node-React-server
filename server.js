const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

app.use(express.urlencoded({extended: true}));
app.use(express.json())


const db = require("./app/models");
// Producción
db.sequelize.sync();

// Desarrollo
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Borrar y sincronizar");
// });

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido al API." });
});

require("./app/routes/post.routes")(app);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = {app, server}