import { Router, type Request, type Response } from 'express'
import {
  verifyKeystoneSignature,
  validateWebhookPayload,
  handleEnroll,
  handleUnenroll,
  handleGroupsModify,
} from '../lib/keystone'

const router = Router()

// ============================================================
// POST /webhooks/keystone
//
// Receives device lifecycle events from KeyStone:
//   enroll       — device enrolled, create/update MDM record
//   unenroll     — device removed, revoke token + soft delete
//   groupsmodify — group membership changed, resync + requeue policy
//
// Mount with express.raw() to preserve the raw body for HMAC
// verification. In your main app:
//
//   app.use('/webhooks', express.raw({ type: 'application/json' }), router)
// ============================================================

router.post('/keystone', async (req: Request, res: Response) => {
  const secret = process.env.KEYSTONE_WEBHOOK_SECRET

  if (!secret) {
    console.error('[webhook] KEYSTONE_WEBHOOK_SECRET is not set')
    return res.status(500).json({ error: 'Webhook secret not configured' })
  }

  const rawBody = req.body.toString('utf-8')
  const signature = req.headers['x-keystone-signature'] as string | undefined

  const valid = await verifyKeystoneSignature(rawBody, signature, secret)
  if (!valid) {
    console.warn('[webhook] rejected request with invalid signature')
    return res.status(401).json({ error: 'Invalid signature' })
  }

  let payload
  try {
    payload = validateWebhookPayload(JSON.parse(rawBody))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid payload'
    console.error('[webhook] payload validation failed:', message)
    return res.status(400).json({ error: message })
  }

  try {
    switch (payload.event) {
      case 'enroll': await handleEnroll(payload.device); break
      case 'unenroll': await handleUnenroll(payload.device); break
      case 'groupsmodify': await handleGroupsModify(payload.device); break
    }
  } catch (err) {
    console.error(`[webhook] error handling event "${payload.event}"`, err)
    return res.status(500).json({ error: 'Internal error' })
  }

  return res.status(200).json({ ok: true })
})

export default router