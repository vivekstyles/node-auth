const express = require("express");
const router = express.Router();
const UserController = require("../../modules/user/controllers/user.controller");
const middlewareForTokenValidate = require("../../modules/user/middleware/validate_token");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");

var secret;

/**
 * @swagger
 * /user/getAllUser:
 *   post:
 *     tags:
 *       - User
 *     summary: get all user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserSignUpDTO'
 *     responses:
 *       200:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPostDTOResponse'
 *       500:
 *         description: Some server error
 */

router.get(
  "/getAllUser",
  (req, res, sent) => {
    middlewareForTokenValidate(req, res, sent, secret);
  },
  async (req, res) => {
    try {
      var result = await UserController.getAllUser(req);
      res.send(result);
    } catch (error) {
      console.log(error);
    }
  }
);

router.post("/signIn", async (req, res) => {
  if (true) {
    try {
      var result = await UserController.signIn(req);

      const concateToHash = result.id + result.user_name;

      var crypto = require("crypto");
      secret = crypto
        .createHash("sha256")
        .update(concateToHash)
        .digest("base64");

      const payload = {
        id: result.id,
        name: result.user_name,
        admin: true,
      };

      const signed = jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn: "20s",
      });

      console.log(signed);

      res.append("Set-Cookie", "foo=bar; Path=/; HttpOnly");
      res.append("Content-Type", "application/json; charset=utf-8");
      res.append("WWW-Authenticate", "Bearer " + signed);

      res.set({
        "Content-Type": "multipart/json",
        "Content-Length": "1236",
        ETag: "12345",
      });

      res.json(result);
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send({
      error: {
        type: "Content-Type",
        desc: "data type",
      },
    });
  }
});

router.get(
  "/addUser",
  (req, res, next) => {
    console.log("hi");
    next();
  },
  async (req, res) => {
    try {
      var result = await UserController.addNewUser(req);
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: 500, data: [], message: error.message });
    }
    res.send(result);
  }
);

router.get("/updateUser", async (req, res) => {
  try {
    var result = UserController.updateUser(req);
  } catch (error) {
    console.log(error);
  }
  res.send(result);
});

router.get("/getUser", async (req, res) => {
  try {
    var result = await UserController.getUserData(req);
  } catch (error) {
    console.log(error);
  }
  res.send(result);
});

router.get("/deleteUser", async (req, res) => {
  try {
    var result = UserController.deleteUser(req);
  } catch (error) {
    console.log(error);
  }
  res.send(result);
});

router.get("/view", (req, res) => {
  res.render("index");
});

router.get("/tokenEx", (req, res) => {
  res.send("token expire");
});

router.get("/tokenInvalid", (req, res) => {
  res.send("token invalid");
});

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */

router.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = router;
