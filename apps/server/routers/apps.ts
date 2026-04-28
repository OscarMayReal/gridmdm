import { Router } from "express";
import { createApp, createAppPolicy, createAppPolicyEntry, createAppPolicyGroupAssignment, deleteAppPolicy, deleteAppPolicyEntry, deleteAppPolicyGroupAssignment, getAppPolicy, listAppPolicies, listTenantApps, updateAppPolicy } from "../lib/apps";
import { VerifySession } from "../keystone";
import { upsertKeystoneUser } from "../lib/keystone";

const router = Router();

router.use(async (req, res, next) => {
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

router.post("/acquireapp", async (req, res) => {
    const { appId } = req.body;
    const app = await createApp({ tenantId: req.sessionData?.tenant.id as string, appId, name: req.body.name, description: req.body.description, version: req.body.version, userId: req.sessionData?.user.id as string })
    res.json(app);
});

router.get('/policy/:policyId', async (req, res) => {
    const profile = await getAppPolicy({ tenantId: req.sessionData?.tenant.id as string, policyId: req.params.policyId })
    res.json(profile)
})

router.post('/policy', async (req, res) => {
    const profile = await createAppPolicy({ appId: req.body.appId, data: req.body, createdBy: req.sessionData?.user.id as string, tenantId: req.sessionData?.tenant.id as string })
    res.json(profile)
})

router.put('/policy/:policyId', async (req, res) => {
    const profile = await updateAppPolicy({ tenantId: req.sessionData?.tenant.id as string, policyId: req.params.policyId, data: req.body })
    res.json(profile)
})

router.delete('/:policyId', async (req, res) => {
    const profile = await deleteAppPolicy({ tenantId: req.sessionData?.tenant.id as string, policyId: req.params.policyId })
    res.json(profile)
})

router.get('/policies', async (req, res) => {
    const policies = await listAppPolicies({ tenantId: req.sessionData?.tenant.id as string })
    res.json(policies)
})

router.get("/", async (req, res) => {
    const apps = await listTenantApps({ tenantId: req.sessionData?.tenant.id as string })
    res.json(apps);
});

router.post('/policy/:policyId/assignments', async (req, res) => {
    const profileAssignment = await createAppPolicyGroupAssignment({ policyId: req.params.policyId, groupId: req.body.groupId })
    res.json(profileAssignment)
})

router.delete('/policy/:policyId/assignments/:assignmentId', async (req, res) => {
    const profileAssignment = await deleteAppPolicyGroupAssignment({ policyId: req.params.policyId, assignmentId: req.params.assignmentId })
    res.json(profileAssignment)
})

router.post('/policy/:policyId/appentry', async (req, res) => {
    const profileAssignment = await createAppPolicyEntry({ policyId: req.params.policyId, appId: req.body.appId, rule: req.body.rule })
    res.json(profileAssignment)
})

router.delete('/policy/:policyId/appentry/:entryId', async (req, res) => {
    const profileAssignment = await deleteAppPolicyEntry({ policyId: req.params.policyId, entryId: req.params.entryId })
    res.json(profileAssignment)
})

export default router;
