// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 1) Locate & patch the source-map-loader rule:
      webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
        if (
          rule.enforce === 'pre' &&
          Array.isArray(rule.use) &&
          rule.use.some((u) => u.loader && u.loader.includes('source-map-loader'))
        ) {
          // add face-api.js to its exclude
          const excludes = Array.isArray(rule.exclude) ? rule.exclude : [rule.exclude].filter(Boolean);
          rule.exclude = [
            ...excludes,
            /node_modules\/face-api\.js/
          ];
        }
        return rule;
      });

      // 2) Globally ignore any warnings matching face-api.js source-map errors:
      webpackConfig.ignoreWarnings = [
        // preserve any existing ignores
        ...(webpackConfig.ignoreWarnings || []),
        {
          module: /face-api\.js/,
          message: /Failed to parse source map/,
        }
      ];
       if (!webpackConfig.resolve) webpackConfig.resolve = {};
      webpackConfig.resolve.fallback = {
        ...(webpackConfig.resolve.fallback || {}),
        fs: false,          // ← tell Webpack “fs” is an empty stub
      };

      return webpackConfig;
    },
  },
};
