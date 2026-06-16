-- Convert legacy app policies into reusable Allowed Apps configurations.
INSERT INTO "configurations" ("id", "tenantId", "name", "description", "type", "content", "createdAt", "updatedAt", "createdBy")
SELECT
    ap."id",
    ap."tenantId",
    COALESCE(NULLIF(ap."name", ''), 'Allowed Apps'),
    ap."description",
    'ALLOWED_APPS'::"PolicyBlockType",
    jsonb_build_object(
        'apps',
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'appId', ape."appId",
                    'rule', ape."rule",
                    'app', to_jsonb(a)
                )
            ) FILTER (WHERE ape."appId" IS NOT NULL),
            '[]'::jsonb
        )
    ),
    ap."createdAt",
    ap."updatedAt",
    ap."createdBy"
FROM "app_policies" ap
LEFT JOIN "app_policy_entries" ape ON ape."appPolicyId" = ap."id"
LEFT JOIN "apps" a ON a."id" = ape."appId"
GROUP BY ap."id"
ON CONFLICT ("id") DO NOTHING;
