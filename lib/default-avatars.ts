const DEFAULT_AVATAR_BUCKET = 'avatars'

const DEFAULT_AVATAR_PATHS = Array.from({length: 32}, (_, index) =>
  `default-avatars/avatar-${String(index + 1).padStart(2, '0')}.png`
)

export const getRandomDefaultAvatarUrl = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) throw new Error('Missing Supabase URL for default avatars')

  const path = DEFAULT_AVATAR_PATHS[Math.floor(Math.random() * DEFAULT_AVATAR_PATHS.length)]

  return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${DEFAULT_AVATAR_BUCKET}/${path}`
}
