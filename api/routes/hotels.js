import express from "express";
import Hotel from "./models/Hotel.js";
import { verifyAdmin } from "./utils/verifyToken.js";
import Room from "./models/Room.js";

const router = express.Router();

//CREATE
router.post("/", verifyAdmin, async (req, res) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
});

//UPDATE
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE

router.delete("/:id", verifyAdmin, async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("hotel has been deleted!!");
  } catch (err) {
    next(err);
  }
});

//GET
router.get("/find/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL
router.get("/", async (req, res, next) => {
  const { min, max, ...others } = req.query;

  try {
    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: { $gt: min || 10, $lt: max || 999 },
    }).limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/countByCity", async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/countByType", async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resort", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/room/:id", async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {}
});
export default router;
