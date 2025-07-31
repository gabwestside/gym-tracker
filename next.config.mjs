import createNextIntlPlugin from 'next-intl/plugin'


const withNextIntl = createNextIntlPlugin('./next-intl.config.ts')

const nextConfig = {
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'ctxbakysvmnwewronovf.supabase.co',
  //       pathname: '/storage/v1/object/public/**',
  //     },
  //   ],
  // },
}

export default withNextIntl(nextConfig)
