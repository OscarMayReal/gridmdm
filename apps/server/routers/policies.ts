import { Router } from 'express'
import { getdevice, listdevices } from '../lib/devices'
import { VerifySession } from '../keystone'
import { createPolicy, createPolicyBlock, createPolicyGroupAssignment, deletePolicy, deletePolicyBlock, deletePolicyGroupAssignment, getPolicy, listPolicies, updatePolicy, updatePolicyBlock } from '../lib/policies';

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
    const profiles = await listPolicies({ tenantId: req.sessionData?.tenant.id as string })
    res.json(profiles)
})

router.get('/:policyId', async (req, res) => {
    const profile = await getPolicy({ tenantId: req.sessionData?.tenant.id as string, policyId: req.params.policyId })
    res.json(profile)
})

router.post('/', async (req, res) => {
    console.log(req.body)
    var data = req.body
    data.createdBy = req.sessionData?.user.id as string
    const profile = await createPolicy({ tenantId: req.sessionData?.tenant.id as string, data: data })
    res.json(profile)
})

router.put('/:policyId', async (req, res) => {
    const profile = await updatePolicy({ tenantId: req.sessionData?.tenant.id as string, policyId: req.params.policyId, data: req.body })
    res.json(profile)
})

router.delete('/:policyId', async (req, res) => {
    const profile = await deletePolicy({ tenantId: req.sessionData?.tenant.id as string, policyId: req.params.policyId })
    res.json(profile)
})

router.post('/:policyId/blocks', async (req, res) => {
    const profileCondition = await createPolicyBlock({ policyId: req.params.policyId, data: req.body })
    res.json(profileCondition)
})

router.put('/:policyId/blocks/:blockId', async (req, res) => {
    const profileCondition = await updatePolicyBlock({ policyId: req.params.policyId, blockId: req.params.blockId, data: req.body })
    res.json(profileCondition)
})

router.delete('/:policyId/blocks/:blockId', async (req, res) => {
    const profileCondition = await deletePolicyBlock({ policyId: req.params.policyId, blockId: req.params.blockId })
    res.json(profileCondition)
})

router.post('/:policyId/assignments', async (req, res) => {
    const profileAssignment = await createPolicyGroupAssignment({ tenantId: req.sessionData?.tenant.id as string, policyId: req.params.policyId, data: req.body })
    res.json(profileAssignment)
})

router.delete('/:policyId/assignments/:assignmentId', async (req, res) => {
    const profileAssignment = await deletePolicyGroupAssignment({ policyId: req.params.policyId, assignmentId: req.params.assignmentId })
    res.json(profileAssignment)
})

export default router