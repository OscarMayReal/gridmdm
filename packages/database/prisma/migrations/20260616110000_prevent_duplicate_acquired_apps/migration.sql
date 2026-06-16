-- Prevent the same app from being acquired more than once per tenant.
CREATE UNIQUE INDEX "apps_tenantId_appId_key" ON "apps"("tenantId", "appId");
