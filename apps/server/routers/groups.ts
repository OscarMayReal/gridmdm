import { Router } from 'express'
import { VerifySession } from '../keystone'
import { createGroup, deleteGroup, getGroup, listGroups, updateGroup } from '../lib/groups';
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
    const profiles = await listGroups({ tenantId: req.sessionData?.tenant.id as string })
    res.json(profiles)
})

router.get('/:groupId', async (req, res) => {
    const profile = await getGroup({ tenantId: req.sessionData?.tenant.id as string, groupId: req.params.groupId })
    res.json(profile)
})

router.post('/', async (req, res) => {
    console.log(req.body)
    const group = await createGroup({ tenantId: req.sessionData?.tenant.id as string, data: req.body })
    res.json(group)
})

router.put('/:groupId', async (req, res) => {
    const group = await updateGroup({ tenantId: req.sessionData?.tenant.id as string, groupId: req.params.groupId, data: req.body })
    res.json(group)
})

router.delete('/:groupId', async (req, res) => {
    const group = await deleteGroup({ tenantId: req.sessionData?.tenant.id as string, groupId: req.params.groupId })
    res.json(group)
})

export default router
