import { Router } from 'express'
import { getdevice, listdevices } from '../lib/devices'
import { VerifySession } from '../keystone'
import { createProfile, createProfileCondition, createProfileGroupAssignment, deleteProfile, deleteProfileCondition, deleteProfileGroupAssignment, getProfile, listProfiles, updateProfile } from '../lib/profiles';

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
    const profiles = await listProfiles({ tenantId: req.sessionData?.tenant.id as string })
    res.json(profiles)
})

router.get('/:profileId', async (req, res) => {
    const profile = await getProfile({ tenantId: req.sessionData?.tenant.id as string, profileId: req.params.profileId })
    res.json(profile)
})

router.post('/', async (req, res) => {
    console.log(req.body)
    const profile = await createProfile({ tenantId: req.sessionData?.tenant.id as string, data: req.body })
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

router.post('/:profileId/conditions', async (req, res) => {
    const profileCondition = await createProfileCondition({ tenantId: req.sessionData?.tenant.id as string, profileId: req.params.profileId, data: req.body })
    res.json(profileCondition)
})

router.delete('/:profileId/conditions/:conditionId', async (req, res) => {
    const profileCondition = await deleteProfileCondition({ profileId: req.params.profileId, conditionId: req.params.conditionId })
    res.json(profileCondition)
})

router.post('/:profileId/assignments', async (req, res) => {
    const profileAssignment = await createProfileGroupAssignment({ profileId: req.params.profileId, groupId: req.body.groupId })
    res.json(profileAssignment)
})

router.delete('/:profileId/assignments/:assignmentId', async (req, res) => {
    const profileAssignment = await deleteProfileGroupAssignment({ profileId: req.params.profileId, assignmentId: req.params.assignmentId })
    res.json(profileAssignment)
})

export default router