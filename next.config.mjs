/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.jsdelivr.net',
          pathname: '/joypixels/assets/**',
        },
      ],
    },
    webpack: (config) => {
      config.resolve.fallback = { ...config.resolve.fallback, process: false };
      return config;
    },
  };
  
  export default nextConfig;