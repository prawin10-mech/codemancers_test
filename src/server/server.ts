import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import mongoose from "mongoose";

import router from "./routes";

const app = express();

dotenv.config();

const mongodb_uri = process.env.MONGODB_URI || "";
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(router);

mongoose.connect(mongodb_uri).then(() => {
  console.log("Mongodb connected");
});

app.listen(port, () => {
  console.log("Server listening at 3001");
});
