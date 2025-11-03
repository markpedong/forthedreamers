import { inferAdditionalFields, lastLoginMethodClient, passkeyClient, twoFactorClient, adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { auth } from "./auth"
import { ac, admin, user } from "./permission"
import { USER_ROLE } from "@/generated/prisma"

export const authClient = createAuthClient({
    appName: "For the Dreamers",
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        lastLoginMethodClient(),
        inferAdditionalFields<typeof auth>(),
        twoFactorClient(),
        passkeyClient(),
        adminClient({
            defaultRole: USER_ROLE.USER,
            ac,
            roles: {
                [USER_ROLE.ADMIN]: admin,
                [USER_ROLE.USER]: user
            }
        }),
    ]
})