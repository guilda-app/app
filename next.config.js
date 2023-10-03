/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    webpack: (config) => {
        config.externals.push({
            bufferutil: "commonjs bufferutil",
            "utf-8-validate": "commonjs utf-8-validate",
        });

        return config;
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
