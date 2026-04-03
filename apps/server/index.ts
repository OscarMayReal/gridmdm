process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

import express from "express";
import keystoneRouter from "./routers/keystone";
import tenantRouter from "./routers/tenants";
import deviceRouter from "./routers/devices";
import profileRouter from "./routers/profiles";
import policyRouter from "./routers/policies";
import groupRouter from "./routers/groups";
import clientRouter from "./routers/client";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { GeneratePolicyJson } from "./lib/policies";

dotenv.config();

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use("/api/v1/keystone", keystoneRouter);

app.use("/api/internal/v1/tenant", tenantRouter);

app.use("/api/internal/v1/client", clientRouter);

app.use("/api/v1/devices", deviceRouter);

app.use("/api/v1/profiles", profileRouter);

app.use("/api/v1/policies", policyRouter);

app.use("/api/v1/groups", groupRouter);

app.listen(6090, () => {
    console.log("Server running on port 6090");
})