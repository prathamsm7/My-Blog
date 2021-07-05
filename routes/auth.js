const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const passport = require("passport");

const {
  registerController,
  activeAccount,
  signinController,
  signout,
  isSignedIn,
  isAuthenticated,
  isAdmin,
  googleController,
  forgotPassword,
  resetPassword,
} = require("../controller/auth");
const { getUserById } = require("../controller/user");

//Getting user id in params
router.param("userId", getUserById);

router.post(
  "/register",
  [
    check("username", "Username should be atleast 3 characters").isLength({
      min: 3,
    }),
    check("email", "Email is required").isEmail(),
    check("password", "Password should be atleast 3 char").isLength({ min: 3 }),
  ],
  registerController
);

router.post("/activation", activeAccount);

router.post(
  "/signin",
  [
    check("email", "Email is required").isEmail(),
    check("password", "password feild is required").isLength({ min: 3 }),
  ],
  signinController
);

router.get("/signout", signout);

router.get(
  "/test/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  (req, res) => {
    res.json(req.auth);
  }
);

//Google Login
router.post("/googlelogin", googleController);

router.put("/forgot-password", forgotPassword);
router.put("/resetpassword", resetPassword);

module.exports = router;
