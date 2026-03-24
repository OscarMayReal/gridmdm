import { Router } from 'express'
import { listdevices } from '../lib/devices'
import { VerifySession } from '../keystone'

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
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send("Unauthorized");
    }
});

router.get('/', async (req, res) => {
    const devices = await listdevices({ tenantId: req.sessionData?.tenantId as string })
    res.json(devices)
})

export default router