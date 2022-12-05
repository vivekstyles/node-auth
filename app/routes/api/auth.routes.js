const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
let useragent = require("express-useragent");
require("dotenv").config();

const AuthController = require("../../modules/auth/controllers/auth.controller");
const middleware = require("../../modules/auth/middleware/authValidateMiddlewares");

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: signup api
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserSignUpDTO'
 *     responses:
 *       200:
 *         description: New user successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPostDTOResponse'
 *       500:
 *         description: Some server error
 */
router.use(useragent.express());
router.use(middleware.blockIP);

router.post(
  "/signup",
  [
    bodyParser.json({
      limit: "1mb",
    }),
    middleware.signUp,
  ],
  async (req, res) => {
    try {
      const data = await AuthController.signUp(req);

      process.env.APP_CRYPTO_SECRET = crypto
        .createHash("sha256")
        .update(process.env.APP_SECRET)
        .digest("base64");

      process.env.SIGNED_TOKEN = jwt.sign(data, process.env.APP_CRYPTO_SECRET, {
        algorithm: "HS256",
        expiresIn: "160s",
      });

      res.append("Set-Cookie", "foo=bar; Path=/; HttpOnly");
      res.append("Content-Type", "application/json; charset=utf-8");
      res.append("WWW-Authenticate", "Bearer " + process.env.SIGNED_TOKEN);

      res.set({
        "Content-Type": "multipart/json",
        "Content-Length": "1236",
        ETag: "12345",
      });
      res.status(200).send(data);
    } catch (error) {
      res.send({
        error: 500,
        data: [],
        message: `server error : ${error.message}`,
      });
    }
  }
);

/**
 * @swagger
 * /auth/otp:
 *   get:
 *     tags:
 *       - Auth
 *     summary: OTP
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserSignUpDTO'
 *     responses:
 *       200:
 *         description: OTP verfication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPostDTOResponse'
 *       500:
 *         description: Some server error
 */

router.post("/otp", middleware.TokenValidate, async (req, res) => {
  res.append("Set-Cookie", "foo=bar; Path=/; HttpOnly");
  res.append("Content-Type", "application/json; charset=utf-8");
  // res.append("WWW-Authenticate", "Bearer " + process.env.SIGNED_TOKEN);

  res.set({
    "Content-Type": "multipart/json",
    "Content-Length": "1236",
    ETag: "12345",
  });
  try {
    const data = await AuthController.validateOTP(req);
    res.status(data ? 200 : 500).send(data);
  } catch (error) {
    res.send(error);
  }
});

/**
 * @swagger
 * /auth/login:
 *   get:
 *     tags:
 *       - Auth
 *     summary: login verification
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserSignUpDTO'
 *     responses:
 *       200:
 *         description: login verification successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPostDTOResponse'
 *       500:
 *         description: Some server error
 */

router.post(
  "/login",
  [
    bodyParser.json({
      limit: "1mb",
    }),
  ],
  async (req, res) => {
    try {
      const data = await AuthController.login(req);

      process.env.APP_CRYPTO_SECRET = crypto
        .createHash("sha256")
        .update(process.env.APP_SECRET)
        .digest("base64");

      process.env.SIGNED_TOKEN = jwt.sign(data, process.env.APP_CRYPTO_SECRET, {
        algorithm: "HS256",
        expiresIn: "365d",
      });

      res.append("Set-Cookie", "foo=bar; Path=/; HttpOnly");
      res.append("Content-Type", "application/json; charset=utf-8");
      res.append("WWW-Authenticate", "Bearer " + process.env.SIGNED_TOKEN);

      res.set({
        "Content-Type": "multipart/json",
        "Content-Length": "1236",
        ETag: "12345",
      });

      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      res.send({
        error: 500,
        data: [],
        message: `server error : ${error.message}`,
      });
    }
  }
);

/**
 * @swagger
 * /auth/change-password:
 *   get:
 *     tags:
 *       - Auth
 *     summary: change password
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserSignUpDTO'
 *     responses:
 *       200:
 *         description: password changed successfull
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPostDTOResponse'
 *       500:
 *         description: Some server error
 */

router.post(
  "/change-password",
  [
    bodyParser.json({
      limit: "1mb",
    }),
    middleware.TokenValidate,
  ],
  async (req, res) => {
    const data = await AuthController.changePassword(req);

    res.set({
      "Content-Type": "multipart/json",
      "Content-Length": "1236",
      ETag: "12345",
    });
    res.send(data);
  }
);

/**
 * @swagger
 * /auth/forgot-password:
 *   get:
 *     tags:
 *       - Auth
 *     summary: forgot password
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserSignUpDTO'
 *     responses:
 *       200:
 *         description: if user forgot is password this api sent OTP to login and change is forgot password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPostDTOResponse'
 *       500:
 *         description: Some server error
 */

router.post(
  "/forgot-password",
  [
    bodyParser.json({
      limit: "1mb",
    }),
    middleware.forgotPassword,
    middleware.TokenValidate,
  ],
  async (req, res) => {
    try {
      const data = await AuthController.forgotPassword(req);

      process.env.APP_CRYPTO_SECRET = crypto
        .createHash("sha256")
        .update(process.env.APP_SECRET)
        .digest("base64");

      process.env.SIGNED_TOKEN = jwt.sign(data, process.env.APP_CRYPTO_SECRET, {
        algorithm: "HS256",
        expiresIn: "60s",
      });

      res.append("Set-Cookie", "foo=bar; Path=/; HttpOnly");
      res.append("Content-Type", "application/json; charset=utf-8");
      res.append("WWW-Authenticate", "Bearer " + process.env.SIGNED_TOKEN);

      res.set({
        "Content-Type": "multipart/json",
        "Content-Length": "1236",
        ETag: "12345",
      });
      res.status(200).send(data);
    } catch (error) {
      res.send({
        error: 500,
        data: [],
        message: `server error : ${error.message}`,
      });
    }
  }
);

/**
 * @swagger
 * /auth/forgotPassword-otp:
 *   get:
 *     tags:
 *       - Auth
 *     summary: forgot password OTP validation
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserSignUpDTO'
 *     responses:
 *       200:
 *         description: if user forgot is password this api sent OTP to login and change is forgot password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPostDTOResponse'
 *       500:
 *         description: Some server error
 */

router.post(
  "/forgotPassword-otp",
  [middleware.TokenValidate],
  async (req, res) => {
    res.append("Set-Cookie", "foo=bar; Path=/; HttpOnly");
    res.append("Content-Type", "application/json; charset=utf-8");
    // res.append("WWW-Authenticate", "Bearer " + process.env.SIGNED_TOKEN);

    res.set({
      "Content-Type": "multipart/json",
      "Content-Length": "1236",
      ETag: "12345",
    });
    try {
      const data = await AuthController.forgotPasswordOTP(req);
      res.send(data);
    } catch (error) {
      res.send(error);
    }
  }
);

module.exports = router;
