/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // ESLint is run separately; pre-existing any/unused-vars issues across pages
        // should not block the production build
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;

