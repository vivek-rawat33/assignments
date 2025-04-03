const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { Course, User } = require("../db");
const { jwt_secret } = require("../config");
// User Routes
router.post("/signup", (req, res) => {
  // Implement user signup logic
  const username = req.headers.username;
  const password = req.headers.password;
  User.create({
    username,
    password,
  });
  res.json({
    msg: "User created successfully",
  });
});

router.post("/signin", async (req, res) => {
  // Implement user signip logic
  const username = req.headers.username;
  const password = req.headers.password;
  const user = await User.findOne({
    username,
    password,
  });
  if (user) {
    const token = jwt_secret.sign(username, jwt_secret);
    res.json({
      token,
    });
  } else {
    res.status(403).json({
      msg: "Invalid credentials",
    });
  }
});

router.get("/courses", (req, res) => {
  // Implement listing all courses logic
  const response = Course.find({});
  res.json({ response });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const username = req.headers.username;
  const courseId = req.params.courseId;
  try {
    await Course.update(
      {
        username,
      },
      {
        $push: {
          purchasedCourses: courseId,
        },
      }
    );
  } catch (err) {
    res.status(404).json({
      msg: "Error while updating user's course list",
    });
  }
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const username = req.headers.username;
  const user = await User.findOne({ username });
  const course = await Course.find({
    _id: {
      $in: user.purchasedCourses,
    },
  });
  res.json({ course });
});

module.exports = router;
