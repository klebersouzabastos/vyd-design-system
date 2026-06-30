/** @type {import('next').NextConfig} */
const nextConfig = {
  // @vyd/react ships as TSX source; Next must transpile it.
  // @vyd/design-system is consumed only as CSS (subpath exports).
  transpilePackages: ['@vyd/react'],
};

export default nextConfig;
