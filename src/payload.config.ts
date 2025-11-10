// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
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


const storage = s3Storage({
  collections: {
    'media': {
      disableLocalStorage: true,
      prefix: "media",
      // generateFileURL deve estar AQUI, dentro da configuração da collection
      generateFileURL: ({ filename, prefix }) => {
        return `${process.env.R2_PUBLIC_URL}/${prefix}/${filename}`
      },
    },
  },
  bucket: process.env.R2_BUCKET || "campus",
  config: {
    endpoint: `https://${process.env.R2_ENDPOINT}` || "", 
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
    region: "auto",
    forcePathStyle: true,
  },
});



export default buildConfig({
  admin: {
    // importMap: {
    //   baseDir: path.resolve(dirname),
    // },
    user: 'users',
    meta: {
      titleSuffix: '- Campus Multiplataforma',
    },
    components: {
      graphics: {
        Logo: '../../../components/Logo/PayloadLogo#PayloadLogo',
        Icon: '../../../components/Logo/PayloadIcon#PayloadIcon',
      },
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
  
  plugins: [storage],
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
