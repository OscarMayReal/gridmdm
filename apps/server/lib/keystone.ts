import { DeviceHardwareType, DeviceSoftwareType, prisma, type Device } from '@repo/database'
// import { generateDeviceToken } from '../auth/token'

function generateDeviceToken(): string {
  return crypto.randomUUID()
}

// ============================================================
// KEYSTONE PAYLOAD TYPES
// Mirrors KeyStone's Prisma models.
// ============================================================

export interface KeyStoneGroup {
  id: string
  name: string
  groupname: string
  description?: string | null
  type: string
  tenantId: string
  domainId?: string | null
  email?: string | null
  adminCreated: boolean
}

export interface KeyStoneUser {
  id: string
  name: string
  username: string
  role: string
  email: string
}

export interface KeyStoneDevice {
  id: string
  name: string
  displayName: string
  os: string
  osVersion: string
  hardwareType: string
  softwareType: string
  tenantId: string
  enrolledAt: string
  isSelfEnrolled: boolean
  lastCheckIn: string | null
  extraInfo: Record<string, unknown> | null
  groups: KeyStoneGroup[]
  user: KeyStoneUser | null
  enrolledBy: KeyStoneUser | null
  serialNumber: string | null
}

export type WebhookEvent = 'enroll' | 'unenroll' | 'groupsmodify'

export interface WebhookPayload {
  event: WebhookEvent
  tenantId: string
  device: KeyStoneDevice
}

// ============================================================
// PAYLOAD VALIDATION
// Manual type guards — no external dependencies.
// Each function throws a descriptive error on invalid input
// so the router can return a meaningful 400 response.
// ============================================================

function isString(v: unknown): v is string {
  return typeof v === 'string'
}

function isBoolean(v: unknown): v is boolean {
  return typeof v === 'boolean'
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v)
}

function validateUser(raw: unknown, field: string): KeyStoneUser {
  if (!isObject(raw)) throw new Error(`${field} must be an object`)
  if (!isString(raw.id)) throw new Error(`${field}.id must be a string`)
  if (!isString(raw.name)) throw new Error(`${field}.name must be a string`)
  if (!isString(raw.username)) throw new Error(`${field}.username must be a string`)
  if (!isString(raw.role)) throw new Error(`${field}.role must be a string`)
  if (!isString(raw.email)) throw new Error(`${field}.email must be a string`)
  return {
    id: raw.id,
    name: raw.name,
    username: raw.username,
    role: raw.role,
    email: raw.email,
  }
}

function validateGroup(raw: unknown, index: number): KeyStoneGroup {
  const field = `groups[${index}]`
  if (!isObject(raw)) throw new Error(`${field} must be an object`)
  if (!isString(raw.id)) throw new Error(`${field}.id must be a string`)
  if (!isString(raw.name)) throw new Error(`${field}.name must be a string`)
  if (!isString(raw.groupname)) throw new Error(`${field}.groupname must be a string`)
  if (!isString(raw.type)) throw new Error(`${field}.type must be a string`)
  if (!isString(raw.tenantId)) throw new Error(`${field}.tenantId must be a string`)
  if (!isBoolean(raw.adminCreated)) throw new Error(`${field}.adminCreated must be a boolean`)
  return {
    id: raw.id,
    name: raw.name,
    groupname: raw.groupname,
    description: isString(raw.description) ? raw.description : null,
    type: raw.type,
    tenantId: raw.tenantId,
    domainId: isString(raw.domainId) ? raw.domainId : null,
    email: isString(raw.email) ? raw.email : null,
    adminCreated: raw.adminCreated,
  }
}

function validateDevice(raw: unknown): KeyStoneDevice {
  if (!isObject(raw)) throw new Error('device must be an object')
  if (!isString(raw.id)) throw new Error('device.id must be a string')
  if (!isString(raw.name)) throw new Error('device.name must be a string')
  if (!isString(raw.displayName)) throw new Error('device.displayName must be a string')
  if (!isString(raw.os)) throw new Error('device.os must be a string')
  if (!isString(raw.osVersion)) throw new Error('device.osVersion must be a string')
  if (!isString(raw.hardwareType)) throw new Error('device.hardwareType must be a string')
  if (!isString(raw.softwareType)) throw new Error('device.softwareType must be a string')
  if (!isString(raw.tenantId)) throw new Error('device.tenantId must be a string')
  if (!isString(raw.enrolledAt)) throw new Error('device.enrolledAt must be a string')
  if (!isBoolean(raw.isSelfEnrolled)) throw new Error('device.isSelfEnrolled must be a boolean')
  if (!isArray(raw.groups)) throw new Error('device.groups must be an array')

  return {
    id: raw.id,
    name: raw.name,
    displayName: raw.displayName,
    os: raw.os,
    osVersion: raw.osVersion,
    hardwareType: raw.hardwareType,
    softwareType: raw.softwareType,
    tenantId: raw.tenantId,
    enrolledAt: raw.enrolledAt,
    isSelfEnrolled: raw.isSelfEnrolled,
    lastCheckIn: isString(raw.lastCheckIn) ? raw.lastCheckIn : null,
    extraInfo: isObject(raw.extraInfo) ? raw.extraInfo : null,
    groups: raw.groups.map((g, i) => validateGroup(g, i)),
    user: raw.user != null ? validateUser(raw.user, 'user') : null,
    enrolledBy: raw.enrolledBy != null ? validateUser(raw.enrolledBy, 'enrolledBy') : null,
    serialNumber: isString(raw.serialNumber) ? raw.serialNumber : null,
  }
}

export function validateWebhookPayload(raw: unknown): WebhookPayload {
  if (!isObject(raw)) throw new Error('Payload must be an object')

  const validEvents: WebhookEvent[] = ['enroll', 'unenroll', 'groupsmodify']
  if (!isString(raw.event) || !validEvents.includes(raw.event as WebhookEvent)) {
    throw new Error(`event must be one of: ${validEvents.join(', ')}`)
  }

  return {
    event: raw.event as WebhookEvent,
    tenantId: raw.tenantId,
    device: validateDevice(raw.device),
  }
}

// ============================================================
// KEYSTONE MIRROR UPSERTS
// ============================================================

export async function upsertKeystoneUser(user: KeyStoneUser) {
  return prisma.keyStoneUser.upsert({
    where: { id: user.id },
    update: { name: user.name, username: user.username, email: user.email, role: user.role },
    create: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
  })
}

export async function upsertKeystoneGroup(group: KeyStoneGroup) {
  console.log(`[upsertKeystoneGroup] upserting group ${group.id}`, group)
  return prisma.keyStoneGroup.upsert({
    where: { id: group.id },
    update: { name: group.name, groupname: group.groupname },
    create: {
      id: group.id,
      name: group.name,
      groupname: group.groupname,
      tenantId: group.tenantId,
    },
  })
}

// Replaces device group memberships wholesale.
// Called on both enrol and groupsmodify events.
export async function syncDeviceGroups(deviceId: string, groups: { group: KeyStoneGroup }[]) {
  console.log(`[syncDeviceGroups] syncing groups for device ${deviceId}`, groups)
  await Promise.all(groups.map((g) => upsertKeystoneGroup(g.group)))

  await prisma.$transaction([
    prisma.deviceGroup.deleteMany({ where: { deviceId } }),
    prisma.deviceGroup.createMany({
      data: groups.map(g => ({ deviceId, groupId: g.group.id })),
    }),
  ])
}

// ============================================================
// ENROLMENT PROFILE RESOLUTION
// ============================================================

export async function resolveEnrolmentProfile(
  tenantId: string,
  groupIds: string[]
): Promise<string | null> {
  const profiles = await prisma.enrolmentProfile.findMany({
    where: { tenantId },
    include: { conditions: true },
    orderBy: { priority: 'desc' },
  })

  for (const profile of profiles) {
    const required = profile.conditions.map(c => c.groupId)
    const allMatch = required.every(id => groupIds.includes(id))
    if (allMatch) return profile.id
  }

  return null
}

// ============================================================
// WEBHOOK EVENT HANDLERS
// ============================================================

export async function handleEnroll(device: KeyStoneDevice): Promise<void> {
  const tenantId = device.tenantId

  const tenantExists = await prisma.tenant.findUnique({ where: { id: tenantId } })
  if (!tenantExists) {
    throw new Error(
      `Tenant ${tenantId} not found — register it in MDM before enrolling devices`
    )
  }

  console.log(`[handleEnroll] upserting enrolled by ${device.id}`, device)
  if (device.enrolledBy) await upsertKeystoneUser(device.enrolledBy)
  console.log(`[handleEnroll] upserting assigned user ${device.id}`, device)
  if (device.user) await upsertKeystoneUser(device.user)
    
  const groupIds = device.groups.map(g => g.id)
  const profileId = await resolveEnrolmentProfile(tenantId, groupIds)

  console.log(`[handleEnroll] upserting device ${device.id}`, device)
  await prisma.device.upsert({
    where: { id: device.id },
    update: {
      name: device.name,
      osVersion: device.osVersion,
      status: 'MANAGED',
      assignedUserId: device.user?.id ?? null,
      updatedAt: new Date(),
    },
    create: {
      serialNumber: device.serialNumber,
      isSelfEnrolled: device.isSelfEnrolled,
      os: device.os,
      hardwareType: device.hardwareType as DeviceHardwareType,
      softwareType: device.softwareType as DeviceSoftwareType,
      id: device.id,
      tenantId,
      name: device.name,
      displayName: device.displayName,
      arch: device.extraInfo?.arch as string ?? 'unknown',
      osVersion: device.osVersion,
      enrolmentMethod: device.isSelfEnrolled ? 'KEYSTONE_ACCOUNT' : 'ADMIN_MANUAL',
      enrolledAt: new Date(device.enrolledAt),
      enrolledById: device.enrolledBy?.id ?? null,
      assignedUserId: device.user?.id ?? null,
      enrolmentProfileId: device.isSelfEnrolled ? profileId : null,
      status: 'MANAGED',
      mdmTags: [],
    },
  })

  console.log(`[handleEnroll] starting sync device groups for device ${device.id}`, groupIds)
  await syncDeviceGroups(device.id, device.groups)

  const existingToken = await prisma.deviceToken.findUnique({
    where: { deviceId: device.id },
  })
  if (!existingToken) {
    const token = generateDeviceToken()
    await prisma.deviceToken.create({
      data: { deviceId: device.id, token },
    })
  }

  if (device.isSelfEnrolled && device.enrolmentProfileId) {
    const profile = await prisma.enrolmentProfile.findUnique({
      where: { id: device.enrolmentProfileId },
      include: {
        assignments: {
          include: {
            group: true,
          },
        },
      },
    })
    for (const assignment of profile?.assignments || []) {
      await fetch(`${process.env.KEYSTONE_URL}/admin/mdmactions/group/${assignment.group.id}/device`, {
        method: 'POST',
        headers: {
          'mdmserverid': device.mdmServerId!,
          "authorization": `Bearer ${tenantExists.enrollmentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId: device.id,
        }),
      })
    }
    console.log(`[enrol] device ${device.id} (${device.name}) enrolled into org ${tenantId} with profile`, profile)
  }

  console.log(`[enrol] device ${device.id} (${device.name}) enrolled into org ${tenantId}`)
}

export async function handleUnenroll(device: KeyStoneDevice): Promise<void> {
  const existing = await prisma.device.findUnique({ where: { id: device.id } })
  if (!existing) {
    console.warn(`[unenrol] unknown device ${device.id} — ignoring`)
    return
  }

  await prisma.device.update({
    where: { id: device.id },
    data: { status: 'UNENROLLED' },
  })

  await prisma.deviceToken.deleteMany({ where: { deviceId: device.id } })

  await prisma.command.updateMany({
    where: { deviceId: device.id, status: 'QUEUED' },
    data: { status: 'CANCELLED' },
  })

  console.log(`[unenrol] device ${device.id} (${device.name}) unenrolled`)
}

export async function handleGroupsModify(device: KeyStoneDevice): Promise<void> {
  const existing = await prisma.device.findUnique({ where: { id: device.id } })

  if (!existing) {
    console.warn(`[groupsmodify] unknown device ${device.id} — treating as enrol`)
    await handleEnroll(device)
    return
  }

  if (existing.status === 'UNENROLLED') {
    console.warn(`[groupsmodify] device ${device.id} is unenrolled — ignoring`)
    return
  }

  if (device.user) await upsertKeystoneUser(device.user)

  await syncDeviceGroups(device.id, device.groups)

  await prisma.device.update({
    where: { id: device.id },
    data: { assignedUserId: device.user?.id ?? null, displayName: device.displayName },
  })

  // await prisma.command.create({
  //   data: {
  //     deviceId: device.id,
  //     action: 'REEVALUATE_POLICY',
  //     issuedBy: 'system:keystone-webhook',
  //     status: 'QUEUED',
  //   },
  // })

  console.log(`[groupsmodify] updated groups for device ${device.id} (${device.name})`)
}