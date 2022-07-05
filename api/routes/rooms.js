import express from "express";
import Room from "./models/Room.js";
import Hotel from "./models/Hotel.js";
import { verifyAdmin } from "./utils/verifyToken.js";
const router = express.Router();

router.post("/:hotelid", async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
});

//UPDATE
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/availability/:id", async (req, res) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDate": req.body.dates,
        },
      }
    );
    res.status(200).json("Room status has been updated!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE

router.delete("/:id/:hotelid", verifyAdmin, async (req, res, next) => {
  const hotelId = req.params.hotelid;

  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted!");
  } catch (err) {
    next(err);
  }
});

//GET
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL
router.get("/", async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json(err);
  }
});
export default router;
