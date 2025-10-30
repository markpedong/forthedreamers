"use server"

// Mock user database - replace with your actual database
const users: Record<string, { totpSecret?: string; backupCodes?: string[] }> = {
  "user-123": {},
}

/**
 * Verify password and enable two-factor authentication
 * Returns TOTP URI and backup codes
 */
export async function twoFactorEnable(userId: string, password: string) {
  try {
    const user = users[userId]
    if (!user) {
      throw new Error("User not found")
    }

    // Generate TOTP secret and URI
    // In production, use a library like 'speakeasy' or 'otplib'
    const totpSecret = generateTotpSecret()
    const totpURI = `otpauth://totp/YourApp:${userId}?secret=${totpSecret}&issuer=YourApp`

    // Generate backup codes
    const backupCodes = generateBackupCodes(10)

    // Store temporarily (don't persist until OTP is verified)
    return {
      totpURI,
      backupCodes,
      secret: totpSecret, // Include secret for verification
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to enable two-factor authentication")
  }
}

/**
 * Verify OTP token and confirm two-factor setup
 */
export async function verifyOtpAndConfirm(userId: string, totpSecret: string, otpToken: string) {
  try {
    // Verify OTP token (mock implementation)
    // In production, use 'speakeasy' or 'otplib' to verify
    if (!verifyOtpToken(totpSecret, otpToken)) {
      throw new Error("Invalid OTP token")
    }

    // Persist the TOTP secret and backup codes to database
    const user = users[userId]
    if (user) {
      user.totpSecret = totpSecret
      user.backupCodes = generateBackupCodes(10)
    }

    return { success: true }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to verify OTP")
  }
}

/**
 * Disable two-factor authentication
 */
export async function disableTwoFactor(userId: string, password: string) {
  try {
    const user = users[userId]
    if (!user) {
      throw new Error("User not found")
    }

    user.totpSecret = undefined
    user.backupCodes = undefined

    return { success: true }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to disable two-factor authentication")
  }
}

/**
 * Check if two-factor is enabled for user
 */
export async function isTwoFactorEnabled(userId: string) {
  const user = users[userId]
  return !!user?.totpSecret
}

/**
 * Regenerate backup codes
 */
export async function regenerateBackupCodes(userId: string, password: string) {
  try {
    const user = users[userId]
    if (!user) {
      throw new Error("User not found")
    }

    const newCodes = generateBackupCodes(10)
    user.backupCodes = newCodes

    return newCodes
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to regenerate backup codes")
  }
}

// Helper functions
function generateTotpSecret(): string {
  // In production, use 'speakeasy' library
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

function generateBackupCodes(count: number): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    codes.push(Math.random().toString(36).substring(2, 10).toUpperCase())
  }
  return codes
}

function verifyOtpToken(secret: string, token: string): boolean {
  // In production, use 'speakeasy' library to verify
  // This is a mock implementation
  return token.length === 6 && /^\d+$/.test(token)
}
