import { Router } from 'express'
import { getdevice, listdevices } from '../lib/devices'
import { VerifySession } from '../keystone'
import { upsertKeystoneUser } from '../lib/keystone';

const router = Router()

router.use(async (req, res, next) => {
    console.log(req.cookies);
    try {
        const sessionData = await VerifySession({
            appId: process.env.APP_ID!,
            keystoneUrl: process.env.KEYSTONE_URL!,
            sessionId: req.cookies.keystone_session,
            appSecret: process.env.APP_SECRET!
        });
        req.sessionData = sessionData;
        upsertKeystoneUser(sessionData.user)
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send("Unauthorized");
    }
});

router.get('/', async (req, res) => {
    const devices = await listdevices({ tenantId: req.sessionData?.tenant.id as string })
    res.json(devices)
})

router.get('/:deviceId', async (req, res) => {
    const device = await getdevice({ tenantId: req.sessionData?.tenant.id as string, deviceId: req.params.deviceId })
    res.json(device)
})

export default router