const { join } = require('path'); // Importa la función join desde el módulo path

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/home',
                permanent: true,
            },
        ]
    },
    webpack: (config, { isServer, defaultLoaders }) => {
        // Agrega alias y define las rutas de alias
        config.resolve.alias['@components'] = join(__dirname, 'components');
        config.resolve.alias['@styles'] = join(__dirname, 'styles');
        config.resolve.alias['@public'] = join(__dirname, 'public');
        config.resolve.alias['@root'] = __dirname;

        // Fix for follow-redirects/debug module not found in browser
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                debug: false,
            };
        }

        return config;
    },
}

module.exports = nextConfig;
