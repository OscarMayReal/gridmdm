process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

import express from "express";
import keystoneRouter from "./routers/keystone";
import tenantRouter from "./routers/tenants";
import deviceRouter from "./routers/devices";
import profileRouter from "./routers/profiles";
import configurationRouter from "./routers/configurations";
import userRouter from "./routers/users";
import groupRouter from "./routers/groups";
import clientRouter from "./routers/client";
import appRouter from "./routers/apps";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use("/api/v1/keystone", keystoneRouter);

app.use("/api/internal/v1/tenant", tenantRouter);

app.use("/api/internal/v1/client", clientRouter);

app.use("/api/v1/devices", deviceRouter);

app.use("/api/v1/profiles", profileRouter);

app.use("/api/v1/configurations", configurationRouter);

app.use("/api/v1/users", userRouter);

app.use("/api/v1/apps", appRouter);

app.use("/api/v1/groups", groupRouter);

app.get("/api/v1/flathubproxy/*locpath", async (req, res) => {
    console.log("https://flathub.org/api/v2/" + req.params.locpath.join("/"));
    const response = await fetch("https://flathub.org/api/v2/" + req.params.locpath.join("/"), {
        headers: {
            "User-Agent": "chrome/120.0.0.0"
        },
    });
    res.send(await response.json());
});

app.post("/api/v1/flathubproxy/*locpath", async (req, res) => {
    console.log("https://flathub.org/api/v2/" + req.params.locpath.join("/"));
    const response = await fetch("https://flathub.org/api/v2/" + req.params.locpath.join("/"), {
        headers: {
            "User-Agent": "chrome/120.0.0.0",
            "Content-Type": "application/json",
            "accept": "application/json",
        },
        method: "POST",
        body: JSON.stringify(req.body),
    });
    res.send(await response.json());
});

app.listen(6090, () => {
    console.log("Server running on port 6090");
})
