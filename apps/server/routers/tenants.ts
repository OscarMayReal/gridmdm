import { Router } from 'express'
import { createTenant, getTenant } from '../lib/tenants'
import { VerifySession } from '../keystone'
import { upsertKeystoneUser } from '../lib/keystone'

const router = Router()

// router.post('/create', async (req, res) => {
//     const { tenantId, name, displayName, domains } = req.body
//     const tenant = await createTenant(tenantId, name, displayName, domains)
//     res.json(tenant)
// })

router.post('/create', async (req, res) => {
    VerifySession({
        appId: process.env.APP_ID!,
        keystoneUrl: process.env.KEYSTONE_URL!,
        sessionId: req.cookies.keystone_session,
        appSecret: process.env.APP_SECRET!
    }).then(async (auth) => {
        const tenant = await createTenant(auth.tenant.id, auth.tenant.name, (auth.tenant as any).displayName || auth.tenant.name, req.body.domains)
        upsertKeystoneUser(auth.user)
        res.json(tenant)
    }).catch((item) => {
        console.error(item)
        res.status(401).send("Unauthorized")
    })
})

router.get('/get', async (req, res) => {
    VerifySession({
        appId: process.env.APP_ID!,
        keystoneUrl: process.env.KEYSTONE_URL!,
        sessionId: req.cookies.keystone_session,
        appSecret: process.env.APP_SECRET!
    }).then(async (auth) => {
        const tenant = await getTenant(auth.tenant.id)
        res.json(tenant)
    }).catch((item) => {
        console.error(item)
        res.status(401).send("Unauthorized")
    })
})

export default router
