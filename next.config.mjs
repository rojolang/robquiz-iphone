const nextConfig = {
    output: 'export',
    distDir: 'out',
    assetPrefix: '/',
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
    webpack: (config) => {
        return config; // Temporarily return the default config
    },
};

export default nextConfig;
