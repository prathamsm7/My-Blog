const User = require("../models/user");
const expressJwt = require("express-jwt");
const { validationResult } = require("express-validator");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const {
  CLIENT_URL,
  MAIL_KEY,
  EMAIL_FROM,
  ACC_ACT_KEY,
  JWT_SECRET,
  RESET_PASSWORD_KEY,
  GOOGLE_CLIENT_ID,
} = require("../config/keys");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(MAIL_KEY);

//User Registration
exports.registerController = (req, res) => {
  const { username, email, role, password } = req.body;

  // error handling
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          error: "User with this email already exist",
        });
      }
    });

    //Generating Token
    const token = jwt.sign({ username, email, password, role }, ACC_ACT_KEY, {
      expiresIn: "20m",
    });

    const data = {
      from: EMAIL_FROM,
      to: email,
      subject: "Account Activation Link",
      html: `<h1>Please use the following to activate your account</h1>
                <p>${CLIENT_URL}/users/activate/${token}</p>
                <hr />
                <p>This email may containe sensetive information</p>
                <p>${CLIENT_URL}</p>`,
    };

    sgMail
      .send(data)
      .then((sent) => {
        return res.json({
          message: `Email has been sent to ${email}`,
        });
      })
      .catch((err) => {
        // console.log(err);
      });
  }
};

//Account Activation
exports.activeAccount = (req, res) => {
  const errors = validationResult(req);

  const { token } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  if (token) {
    jwt.verify(token, ACC_ACT_KEY, (err, decodedData) => {
      // console.log(decodedData);
      if (err) {
        return res.status(400).json({
          error: "Incorrect or Expired Token",
        });
      } else {
        const { username, email, role, password } = decodedData;

        const user = new User({
          username,
          email,
          role,
          password,
        });

        user.save((err, user) => {
          if (err) {
            // console.log(err);
            return res.status(401).json({
              error: "something went wrong, Please register once again",
            });
          } else {
            return res.json({
              success: true,
              message: user,
              message: "User registered successfully , please login",
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: "Something went wrong",
    });
  }
};

// User Signin
exports.signinController = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  await User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with this email does not exist. Please Signup",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and Password do not match",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token, { expire: "1h" });

    const { _id, username, email, role } = user;

    return res.json({
      token,
      user: {
        _id,
        username,
        email,
        role,
      },
    });
  });
};

//Singout
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "user signout successfully",
  });
};

//Checking whether user signed in or not
exports.isSignedIn = expressJwt({
  secret: JWT_SECRET,
  algorithms: ["sha1", "RS256", "HS256"],
  userProperty: "auth",
});

// Google Login
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
// console.log();
exports.googleController = (req, res) => {
  try {
    const { idToken } = req.body;
    // console.log("IDToken", idToken);

    client
      .verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      })
      .then((response) => {
        const { email_verified, name, email } = response.payload;

        if (email_verified) {
          User.findOne({ email }).exec((err, user) => {
            if (user) {
              const token = jwt.sign(
                {
                  _id: user._id,
                },
                JWT_SECRET,
                {
                  expiresIn: "7d",
                }
              );

              const { _id, email, username, role } = user;
              return res.json({
                token,
                user: { _id, email, username, role },
              });
            } else {
              let password = email + JWT_SECRET;

              let username = name;
              user = new User({ username, email, password });
              user.save((err, data) => {
                if (err) {
                  // console.log("google error", err);
                  return res.status(400).json({
                    error: "User signup failed with google",
                  });
                }

                const token = jwt.sign({ _id: data._id }, JWT_SECRET, {
                  expiresIn: "7d",
                });

                const { _id, email, username, role } = data;
                return res.json({
                  token,
                  user: { _id, email, username, role },
                });
              });
            }
          });
        } else {
          return res.status(400).json({
            error: "Google login failed. Try again",
          });
        }
      });
  } catch (error) {
    console.log("Something Went Wrong", error);
  }
};

exports.forgotPassword = (req, res) => {
  const errors = validationResult(req);
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
      });
    }

    if (err || !user) {
      return res.status(400).json({
        error: "User with this email not found in DB",
      });
    }
    const token = jwt.sign({ _id: user._id }, RESET_PASSWORD_KEY, {
      expiresIn: "15m",
    });

    let currentDate = new Date();
    const data = {
      from: EMAIL_FROM,
      to: email,
      subject: "Password Reset Link",
      html: `
                <p>Hey we have received request for reset your account password on ${currentDate}</p> 
                <h1>Please use the following Link to reset your account password</h1>
                <p>${CLIENT_URL}/resetpassword/${token}</p>
                <hr />
                <p>This email may containe sensetive information</p>
                <p>${CLIENT_URL}</p>`,
    };

    return user.updateOne({ resetLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: "Reset password link error",
        });
      } else {
        sgMail
          .send(data)
          .then((sent) => {
            return res.json({
              message: `Reset Password link has been sent to ${email}`,
            });
          })
          .catch((err) => {
            return res.status(400).json({
              error: err.message,
            });
          });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { newPass, resetLink } = req.body;

  const errors = validationResult(req);

  User.findOne({ resetLink }, (err, user) => {
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
      });
    }

    if (err || !user) {
      return res.status(400).json({
        error: "User not found with this token",
      });
    }

    const obj = {
      password: newPass,
      resetLink: "",
    };

    user = _.extend(user, obj);
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        message: "Your password has been changed",
        // decodedData: decodedData,
        // obj: obj,
      });
    });
  });
};

// custom middlewere
//Checking whether user Authenticated or not

exports.isAuthenticated = (req, res, next) => {
  let checker = req.user && req.auth && req.user._id == req.auth._id;

  if (!checker) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }
  next();
};

//cheking user role
exports.isAdmin = (req, res, next) => {
  if (req.user.role === "User") {
    return res.status(403).json({
      error: "you are not admin",
    });
  }
  next();
};
