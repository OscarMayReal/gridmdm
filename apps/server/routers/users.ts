import { Router } from 'express'
import { VerifySession } from '../keystone'
import { upsertKeystoneUser } from '../lib/keystone';
import { searchUsers } from '../lib/users';

const router = Router()

router.use(async (req, res, next) => {
    try {
        const sessionData = await VerifySession({
            appId: process.env.APP_ID!,
            keystoneUrl: process.env.KEYSTONE_URL!,
            sessionId: req.cookies.keystone_session,
            appSecret: process.env.APP_SECRET!
        });
        req.sessionData = sessionData;
        await upsertKeystoneUser(sessionData.user as any)
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send("Unauthorized");
    }
});

router.get('/', async (req, res) => {
    const users = await searchUsers({
        tenantId: req.sessionData?.tenant.id as string,
        search: req.query.search as string,
        sessionId: req.cookies.keystone_session
    })
    res.json(users)
})

export default router
