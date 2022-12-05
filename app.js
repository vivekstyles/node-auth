const express = require("express");
const { join } = require("path");
const { resolve } = require("path/posix");
const bodyParser = require("body-parser");
const fs = require("fs");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const swaggerUi = require("swagger-ui-express");
const session = require("express-session");
const db = require("./app/database")
db()

const openapiSpecification = require("./app/v1/swagger");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

const { resourceUsage } = require("process");

const PORT = 8080;
app.set("views", join(__dirname, "app/views"));
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`listening in ${PORT}`);
});

app.listen(() => {
  console.log(`swagger listening in http://localhost:8080/api-docs`);
});

app.use(session({ secret: "keyboard cat", cookie: { maxAge: 60000 } }));

app.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
    req.session.email = "vivek";
  }

  console.log(req.session);
  res.send(req.session);
});

app.use(session({ secret: "keyboard cat", cookie: { maxAge: 60000 } }));

const payload = {
  dub: "1234567890",
  name: "john Doe",
  admin: true,
};

fs.readdir(join(__dirname, "app", "routes/api"), async (err, file) => {
  await file.forEach((res) => {
    app.use(
      `/${res.split(".")[0]}`,
      require(join(__dirname, "app/routes/api", res))
    );
  });
});
