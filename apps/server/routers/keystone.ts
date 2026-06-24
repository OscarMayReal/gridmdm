import { Router, type Request, type Response } from 'express'
import express from 'express'
import {
  validateWebhookPayload,
  handleEnroll,
  handleUnenroll,
  handleGroupsModify,
} from '../lib/keystone'
import { prisma } from '@repo/database'

const router = Router()

// ============================================================
// POST /api/v1/keystone/webhook
//
// Receives device lifecycle events from KeyStone:
//   enroll       — device enrolled, create/update MDM record
//   unenroll     — device removed, revoke token + soft delete
//   groupsmodify — group membership changed, resync + requeue policy
// ============================================================

router.post('/webhook/device', express.json(), async (req: Request, res: Response) => {
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: req.body.tenantId,
    }
  })

  if (!tenant || !req.body.tenantId) {
    console.error('[webhook] tenant not found', req.body.tenantId)
    return res.status(404).json({ error: 'Tenant not found' })
  }

  const secret = tenant.enrollmentToken

  if (!secret) {
    console.error('[webhook] enrollment secret not set for tenant', tenant.id)
    return res.status(500).json({ error: 'Enrollment secret not configured' })
  }

  if (req.headers.authorization?.split(' ')[1] !== secret) {
    return res.status(401).json({ error: 'Invalid enrollment secret' })
  }

  try {
    switch (req.body.event) {
      case 'enroll': await handleEnroll(req.body.device); break
      case 'unenroll': await handleUnenroll(req.body.device); break
      case 'groupsmodify': await handleGroupsModify(req.body.device); break
    }
  } catch (err) {
    console.error(`[webhook] error handling event "${req.body.event}"`, err)
    return res.status(500).json({ error: 'Internal error' })
  }

  var response: any = { ok: true }
  if (req.body.event === 'enroll') {
    response.token = await prisma.deviceToken.findUnique({ where: { deviceId: req.body.device.id } })
  }

  console.log(response)

  return res.status(200).json(response)
})

export default router
