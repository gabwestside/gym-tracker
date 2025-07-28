import withNextIntl from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withIntl = withNextIntl('./next-intl.config.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ctxbakysvmnwewronovf.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default withIntl(nextConfig)
