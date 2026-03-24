import express from "express";
import keystoneRouter from "./routers/keystone";
import tenantRouter from "./routers/tenants";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/v1/keystone", keystoneRouter);

app.use("/api/internal/v1/tenant", tenantRouter);

app.listen(6090, () => {
    console.log("Server running on port 6090");
})