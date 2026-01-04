import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Fix handlebars require.extensions issue
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Ignore OpenTelemetry Jaeger exporter (optional dependency that's not needed)
    config.resolve.alias = {
      ...config.resolve.alias,
      '@opentelemetry/exporter-jaeger': false,
    };

    // Suppress webpack warnings for require.extensions and missing modules
    const originalIgnoreWarnings = config.ignoreWarnings || [];
    config.ignoreWarnings = [
      ...originalIgnoreWarnings,
      { module: /node_modules\/handlebars/ },
      { module: /@opentelemetry\/exporter-jaeger/ },
      /require\.extensions/,
    ];

    return config;
  },
};

export default nextConfig;
