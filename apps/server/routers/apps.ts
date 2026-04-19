import { Router } from "express";
import { getManifest } from "../lib/client";
import { getdevice } from "../lib/devices";
import { createApp, listTenantApps } from "../lib/apps";
import { VerifySession } from "../keystone";

const router = Router();

router.use(async (req, res, next) => {
    try {
        const sessionData = await VerifySession({
            appId: process.env.APP_ID!,
            keystoneUrl: process.env.KEYSTONE_URL!,
            sessionId: req.cookies.keystone_session,
            appSecret: process.env.APP_SECRET!
        });
        req.sessionData = sessionData;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send("Unauthorized");
    }
});

router.post("/acquireapp", async (req, res) => {
    const { appId } = req.body;
    const app = await createApp({ tenantId: req.sessionData?.tenant.id as string, appId, name: req.body.name, description: req.body.description, version: req.body.version, userId: req.sessionData?.user.id as string })
    res.json(app);
});

router.get("/", async (req, res) => {
    const apps = await listTenantApps({ tenantId: req.sessionData?.tenant.id as string })
    res.json(apps);
});

export default router;
