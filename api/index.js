import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO).then(console.log("Database connected"));

// mongoose.connection.on("disconnected", () => {
//   console.log("mongoDB disconnected!");
// });

// mongoose.connection.on("connected", () => {
//   console.log("mongoDB connected!");
// });

//middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
  });
});

app.listen(3000, () => {
  console.log("Connected to backend ");
});
