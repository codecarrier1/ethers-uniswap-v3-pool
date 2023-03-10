module.exports = {
  reactStrictMode: true,
  images: {
    domains: [""],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: false, // Optimization caused bugs with some of my SVGs
          },
        },
      ],
    });
    return config;
  },
};
