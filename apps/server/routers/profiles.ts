import { Router } from 'express'
import { VerifySession } from '../keystone'
import { addConfigurationToProfile, assignProfileToDevice, assignProfileToUser, createProfile, deleteProfile, getProfile, listProfiles, removeConfigurationFromProfile, unassignProfileFromDevice, unassignProfileFromUser, updateProfile } from '../lib/profiles';
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
    const profiles = await listProfiles({ tenantId: req.sessionData?.tenant.id as string })
    res.json(profiles)
})

router.get('/:profileId', async (req, res) => {
    const profile = await getProfile({ tenantId: req.sessionData?.tenant.id as string, profileId: req.params.profileId })
    res.json(profile)
})

router.post('/', async (req, res) => {
    const profile = await createProfile({ tenantId: req.sessionData?.tenant.id as string, data: req.body, createdBy: req.sessionData?.user.id as string })
    res.json(profile)
})

router.put('/:profileId', async (req, res) => {
    const profile = await updateProfile({ tenantId: req.sessionData?.tenant.id as string, profileId: req.params.profileId, data: req.body })
    res.json(profile)
})

router.delete('/:profileId', async (req, res) => {
    const profile = await deleteProfile({ tenantId: req.sessionData?.tenant.id as string, profileId: req.params.profileId })
    res.json(profile)
})

router.post('/:profileId/configurations', async (req, res) => {
    try {
        const configuration = await addConfigurationToProfile({
            tenantId: req.sessionData?.tenant.id as string,
            profileId: req.params.profileId,
            configurationId: req.body.configurationId,
            priority: req.body.priority
        })
        res.json(configuration)
    } catch (error: any) {
        res.status(400).json({ error: error.message })
    }
})

router.delete('/:profileId/configurations/:assignmentId', async (req, res) => {
    const configuration = await removeConfigurationFromProfile({ profileId: req.params.profileId, assignmentId: req.params.assignmentId })
    res.json(configuration)
})

router.post('/:profileId/assignments/users', async (req, res) => {
    try {
        const assignment = await assignProfileToUser({
            tenantId: req.sessionData?.tenant.id as string,
            profileId: req.params.profileId,
            userId: req.body.userId
        })
        res.json(assignment)
    } catch (error: any) {
        res.status(400).json({ error: error.message })
    }
})

router.delete('/:profileId/assignments/users/:assignmentId', async (req, res) => {
    const assignment = await unassignProfileFromUser({ profileId: req.params.profileId, assignmentId: req.params.assignmentId })
    res.json(assignment)
})

router.post('/:profileId/assignments/devices', async (req, res) => {
    try {
        const device = await assignProfileToDevice({
            tenantId: req.sessionData?.tenant.id as string,
            profileId: req.params.profileId,
            deviceId: req.body.deviceId
        })
        res.json(device)
    } catch (error: any) {
        res.status(400).json({ error: error.message })
    }
})

router.delete('/:profileId/assignments/devices/:deviceId', async (req, res) => {
    try {
        const device = await unassignProfileFromDevice({
            tenantId: req.sessionData?.tenant.id as string,
            profileId: req.params.profileId,
            deviceId: req.params.deviceId
        })
        res.json(device)
    } catch (error: any) {
        res.status(400).json({ error: error.message })
    }
})

export default router
