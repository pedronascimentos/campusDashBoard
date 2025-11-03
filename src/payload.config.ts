// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Analytics } from './collections/Analytics'
import { Articles } from './collections/Articles'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Themes } from './collections/Themes'
import { Users } from './collections/Users'
import { getServerSideURL } from './utilities/getURL'
import { slateEditor } from '@payloadcms/richtext-slate'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { Reels } from './collections/Reels'
import { AppLayout } from './globals/AppLayout'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: 'users',
    meta: {
      titleSuffix: '- Campus Multiplataforma',
      favicon: '/favicon.png',
      ogImage: '/campus-logo.png',
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor:  slateEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  collections: [Articles, Categories, Media, Users, Themes, Analytics, Reels],
  
  plugins: [],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [
    AppLayout
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
