import { Router } from "express";
import { getManifest } from "../lib/client";
import { getdevice } from "../lib/devices";

const router = Router();

router.get("/manifest", async (req, res) => {
    const device = await getdevice({ tenantId: req.sessionData?.tenant.id as string, deviceId: req.headers['x-device-id'] as string })
    if (!device) {
        res.status(404).send("Device not found");
        return;
    }
    if (device.token?.token !== req.headers.authorization?.split(' ')[1]) {
        res.status(401).send("Unauthorized");
        return;
    }
    const manifest = await getManifest(device.id);
    res.json(manifest);
});

export default router;
