const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Vocabulary = require("../models/Vocabulary");

// @route GET api/posts
// @desc Get posts
// @access Private
router.get("/days", verifyToken, async (req, res) => {
  try {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let lastday = new Date();
    lastday.setDate(lastday.getDate() + 1);
    lastday.setHours(0, 0, 0, 0);
    const vocabulary = await Vocabulary.find({
      user: req.userId,
      lernDay: { $gte: today, $lt: lastday },
    }).populate("user", ["username"]);
    res.json({ success: true, vocabulary });
    console.log(today, lastday);
    console.log(req.userId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
// @route GET api/vocabular/days
// @desc Get vocabulary in day
// @access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const vocabulary = await Vocabulary.find({ user: req.userId }).populate(
      "user",
      ["username"]
    );
    res.json({ success: true, vocabulary });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/posts
// @desc Create post
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { keyword, means, example, url, status } = req.body;

  // Simple validation
  if (!keyword)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  let day = new Date();
  // day.setDate(day.getDate() + 1);
  try {
    const newVocabulary = new Vocabulary({
      keyword,
      means,
      example,
      url,
      status,
      lernDay: day,
      user: req.userId,
    });

    await newVocabulary.save();

    res.json({
      success: true,
      message: "Happy learning!",
      Vocabulary: newVocabulary,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/posts
// @desc Update post
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  const { keyword, means, example, url, status, lernDay } = req.body;

  // Simple validation
  if (!keyword || !means)
    return res
      .status(400)
      .json({ success: false, message: "keyword and means is required" });

  try {
    let day;
    day = new Date(lernDay);
    if (status === 1) {
      day.setDate(day.getDate() + 1);
    } else if (status === 2) {
      day.setDate(day.getDate() + 2);
    } else if (status === 3) {
      day.setDate(day.getDate() + 4);
    } else if (status === 4) {
      day.setDate(day.getDate() + 7);
    } else if (status === 5) {
      day.setDate(day.getDate() + 30);
    } else {
      day = null;
    }

    let updatedVoCabulary = {
      keyword,
      means,
      example: example || "",
      url: url || "",
      status,
      lernDay: day || lernDay,
    };

    const vocabularyUpdateCondition = { _id: req.params.id, user: req.userId };

    updatedVoCabulary = await Vocabulary.findOneAndUpdate(
      vocabularyUpdateCondition,
      updatedVoCabulary,
      { new: true }
    );

    // User not authorised to update post or post not found
    if (!updatedVoCabulary)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorised",
      });

    res.json({
      success: true,
      message: "Excellent progress!",
      vocabulary: updatedVoCabulary,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// // @route DELETE api/posts
// // @desc Delete post
// // @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const vocabularyDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedVocabulary = await Vocabulary.findOneAndDelete(
      vocabularyDeleteCondition
    );

    // User not authorised or post not found
    if (!deletedVocabulary)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorised",
      });

    res.json({ success: true, vocabulary: deletedVocabulary });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
