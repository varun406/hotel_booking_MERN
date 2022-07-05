import express from "express";
import User from "./models/User.js";
import { verifyAdmin, verifyToken, verifyUser } from "./utils/verifyToken.js";

const router = express.Router();

// router.get("/checkauthenctication", verifyToken, (req, res, next) => {
//   res.send("hello varun, you are logged in");
// });

// router.get("/checkuser/:id", verifyUser, (req, res, next) => {
//   res.send("hello user, you are logged in and you can delete your account");
// });

// router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
//   res.send("hello admin, you are logged in and you can delete all accounts");
// });

//UPDATE
router.put("/:id", verifyUser, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE

router.delete("/:id", verifyUser, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted!!");
  } catch (err) {
    next(err);
  }
});

//GET
router.get("/:id", verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL
router.get("/", verifyAdmin, async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});
export default router;
