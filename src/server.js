import express from "express";
// import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import helmet from "helmet";
import morgan from "morgan";
import userRouter from "./apis/Users/index.js";
import authRouter from "./auth/auth.js";
import postRouter from "./apis/Post/index.js";

const server = express();

const port = process.env.PORT || 3002;

//MIDDLEWARES
server.use(express.json());
// server.use(cors);
server.use(helmet());
server.use(morgan("common"));

//ROUTERS
server.use("/users", userRouter);
server.use("/auth", authRouter);
server.use("/posts", postRouter);

//MONGO CONNECTIONS
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Server Successfully Connected to MongoDB");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
