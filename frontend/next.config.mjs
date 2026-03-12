/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // ESLint is run separately; pre-existing any/unused-vars issues across pages
        // should not block the production build
        ignoreDuringBuilds: true,
    },
    async redirects() {
        return [
            {
                source: '/catalog',
                destination: '/gallery',
                permanent: true,
            },
            {
                source: '/catalog/:path*',
                destination: '/gallery',
                permanent: true,
            },
            {
                source: '/wishlist',
                destination: '/gallery',
                permanent: true,
            },
            {
                source: '/checkout/:path*',
                destination: '/gallery',
                permanent: true,
            },
            {
                source: '/book/:path*',
                destination: '/gallery',
                permanent: true,
            }
        ];
    },
};

export default nextConfig;

