const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, User } = require("../db");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config");
// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;
  await Admin.create({
    username,
    password,
  });
  res.json({ msg: "Admin created successfully" });
});

router.post("/signin", async (req, res) => {
  // Implement admin signin logic
  const username = req.body.username;
  const password = req.body.password;
  const user = await Admin.findOne({
    username,
    password,
  });
  if (user) {
    const token = jwt.sign({ username }, jwt_secret);
    res.json({ token });
  } else {
    res.status(401).json({ msg: "Invalid credentials" });
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageLink = req.body.imageLink;
  const newCourse = await Course.create({
    title,
    description,
    price,
    imageLink,
  });
  res.json({
    msg: "Course created successfully",
    courseId: newCourse._id,
  });
});

router.get("/courses", adminMiddleware, (req, res) => {
  // Implement fetching all courses logic
  Course.find({}).then((response) => {
    res.json({
      courses: response,
    });
  });
});

module.exports = router;
