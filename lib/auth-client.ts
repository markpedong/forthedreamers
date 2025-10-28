import { inferAdditionalFields, lastLoginMethodClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { auth } from "./auth"

export const { useSession, getLastUsedLoginMethod, changeEmail, changePassword, revokeSession, revokeOtherSessions, linkSocial, signIn } = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        lastLoginMethodClient(),
        inferAdditionalFields<typeof auth>(),
    ]
})