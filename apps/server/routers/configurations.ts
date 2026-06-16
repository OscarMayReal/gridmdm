import { Router } from 'express'
import { VerifySession } from '../keystone'
import { createConfiguration, deleteConfiguration, getConfiguration, listConfigurations, updateConfiguration } from '../lib/configurations';
import { upsertKeystoneUser } from '../lib/keystone';

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
    const configurations = await listConfigurations({ tenantId: req.sessionData?.tenant.id as string })
    res.json(configurations)
})

router.get('/:configurationId', async (req, res) => {
    const configuration = await getConfiguration({ tenantId: req.sessionData?.tenant.id as string, configurationId: req.params.configurationId })
    res.json(configuration)
})

router.post('/', async (req, res) => {
    const configuration = await createConfiguration({ tenantId: req.sessionData?.tenant.id as string, createdBy: req.sessionData?.user.id as string, data: req.body })
    res.json(configuration)
})

router.put('/:configurationId', async (req, res) => {
    const configuration = await updateConfiguration({ tenantId: req.sessionData?.tenant.id as string, configurationId: req.params.configurationId, data: req.body })
    res.json(configuration)
})

router.delete('/:configurationId', async (req, res) => {
    const configuration = await deleteConfiguration({ tenantId: req.sessionData?.tenant.id as string, configurationId: req.params.configurationId })
    res.json(configuration)
})

export default router
