import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // domains: [
    //   process.env.NEXT_PUBLIC_SUPABASE_DOMAIN ||
    //     'ctxbakysvmnwewronovf.supabase.co',
    // ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ctxbakysvmnwewronovf.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
