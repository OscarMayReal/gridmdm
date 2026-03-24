import express from "express";
import keystoneRouter from "./routers/keystone";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use("/api/v1/keystone", keystoneRouter);

app.listen(6090, () => {
    console.log("Server running on port 6090");
})