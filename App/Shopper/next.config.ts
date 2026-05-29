import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // LOCAL TESTING ONLY — uncomment to test checkout locally
  // async rewrites() {
  //   return [{
  //     source: '/api/v0/checkout/:path*',
  //     destination: 'http://localhost:3014/api/v0/checkout/:path*',
  //   }]
  // },
};
 
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);