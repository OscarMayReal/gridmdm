import { Router } from 'express'
import { createTenant } from '../lib/tenants'

const router = Router()

router.post('/create', async (req, res) => {
    const { tenantId, name, displayName, domains } = req.body
    const tenant = await createTenant(tenantId, name, displayName, domains)
    res.json(tenant)
})

export default router