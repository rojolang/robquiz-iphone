// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'out',
    assetPrefix: '/',
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
    webpack: (config, { isServer, dev }) => {
        if (!isServer && !dev) {
            // Consolidate all JS into a single file
            config.optimization.splitChunks = {
                cacheGroups: {
                    default: false,
                    vendors: false,
                    commons: {
                        name: 'app',
                        chunks: 'all',
                        minChunks: 1,
                        filename: 'static/js/app.js',
                    },
                },
            };
            config.optimization.runtimeChunk = false;

            // Consolidate all CSS into a single file
            config.plugins.forEach((plugin) => {
                if (plugin.constructor.name === 'MiniCssExtractPlugin') {
                    plugin.options.filename = 'static/css/app.css';
                    plugin.options.chunkFilename = 'static/css/app.css';
                }
            });
        }
        return config;
    },
};

export default nextConfig;
