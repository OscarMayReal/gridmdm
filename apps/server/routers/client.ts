import { Router } from "express";
import { getManifest, requestAppInstall, requestAppUninstall } from "../lib/client";
import { getDevice } from "../lib/client";
import { completeCommand } from "../lib/client";

const router = Router();

router.get("/manifest", async (req, res) => {
    const device = await getDevice(req.headers['x-device-id'] as string)
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

router.post("/app/install", async (req, res) => {
    console.log(req.body);
    const device = await getDevice(req.headers['x-device-id'] as string)
    if (!device) {
        res.status(404).send("Device not found");
        return;
    }
    if (device.token?.token !== req.headers.authorization?.split(' ')[1]) {
        res.status(401).send("Unauthorized");
        return;
    }
    const command = await requestAppInstall({
        deviceId: device.id,
        appId: req.body.appId as string,
        appPolicyId: req.body.appPolicyId as string
    });
    res.json(command);
});

router.post("/app/uninstall", async (req, res) => {
    console.log(req.body);
    const device = await getDevice(req.headers['x-device-id'] as string)
    if (!device) {
        res.status(404).send("Device not found");
        return;
    }
    if (device.token?.token !== req.headers.authorization?.split(' ')[1]) {
        res.status(401).send("Unauthorized");
        return;
    }
    const command = await requestAppUninstall({
        deviceId: device.id,
        appId: req.body.appId as string,
        appPolicyId: req.body.appPolicyId as string
    });
    res.json(command);
});


router.post("/command/complete", async (req, res) => {
    const device = await getDevice(req.headers['x-device-id'] as string)
    if (!device) {
        res.status(404).send("Device not found");
        return;
    }
    if (device.token?.token !== req.headers.authorization?.split(' ')[1]) {
        res.status(401).send("Unauthorized");
        return;
    }
    const command = await completeCommand({
        deviceId: device.id,
        commandId: req.body.commandId,
        status: req.body.status,
        result: req.body.result,
        receivedAt: req.body.receivedAt
    });
    res.json(command);
});

export default router;
