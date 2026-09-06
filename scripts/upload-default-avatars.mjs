import {readdir, readFile} from 'node:fs/promises'
import {join} from 'node:path'
import {createClient} from '@supabase/supabase-js'

const bucket = 'avatars'
const avatarDirectory = join(process.cwd(), 'scripts/default-avatars')
const files = (await readdir(avatarDirectory))
  .filter(file => file.endsWith('.png'))
  .sort()

if (files.length !== 32) throw new Error(`Expected 32 default avatars, found ${files.length}`)

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase URL or service-role key')
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const {data: bucketDetails, error: bucketError} = await supabase.storage.getBucket(bucket)

if (bucketError) throw new Error(`Unable to read the ${bucket} bucket: ${bucketError.message}`)
if (!bucketDetails.public) throw new Error(`The ${bucket} bucket must be public for profile images`)

for (const file of files) {
  const contents = await readFile(join(avatarDirectory, file))
  const {error} = await supabase.storage.from(bucket).upload(`default-avatars/${file}`, contents, {
    contentType: 'image/png',
    upsert: true
  })

  if (error) throw new Error(`Unable to upload ${file}: ${error.message}`)

  console.log(`Uploaded ${file}`)
}
