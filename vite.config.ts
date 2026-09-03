import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'react-native/Libraries/Utilities/codegenNativeComponent': path.resolve(__dirname, 'src/utils/codegenNativeComponentShim.js'),
        'react-native-web/Libraries/Utilities/codegenNativeComponent': path.resolve(__dirname, 'src/utils/codegenNativeComponentShim.js'),
        'react-native': path.resolve(__dirname, 'src/utils/reactNativeShim.js'),
        'react-native-svg': path.resolve(__dirname, 'src/utils/reactNativeSvgShim.tsx'),
        '@expo/vector-icons': path.resolve(__dirname, 'src/utils/expoVectorIconsWebShim.tsx'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
