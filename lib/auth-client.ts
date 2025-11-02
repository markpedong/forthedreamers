import { inferAdditionalFields, lastLoginMethodClient, passkeyClient, twoFactorClient, adminClient, organizationClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { auth } from "./auth"
import { ac, admin, user } from "./permission"

export const authClient = createAuthClient({
    appName: "For the Dreamers",
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        lastLoginMethodClient(),
        inferAdditionalFields<typeof auth>(),
        twoFactorClient(),
        passkeyClient(),
        adminClient({
            defaultRole: "user",
            ac,
            roles: {
                admin,
                user
            }
        }),
        organizationClient({})
    ]
})