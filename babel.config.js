module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // React Native reanimated plugin (if you use reanimated)
            'react-native-reanimated/plugin',

            // Optional - Plugin transform for optimization
            [
                'module-resolver',
                {
                    root: ['./src'],
                    extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
                    alias: {
                        '@components': './src/components',
                        '@screens': './src/screens',
                        '@utils': './src/utils',
                        '@hooks': './src/hooks',
                        '@assets': './assets',
                    },
                },
            ],

            // Optional - For using decorators
            ['@babel/plugin-proposal-decorators', { legacy: true }],
        ],
    };
  };
