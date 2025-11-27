import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          // 豆包（火山引擎）API代理
          '/api/ark': {
            target: 'https://ark.cn-beijing.volces.com/api/v3',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/ark/, ''),
            headers: {
              'Origin': 'https://ark.cn-beijing.volces.com'
            }
          },
          // 文心一言（百度）API代理
          '/api/ernie': {
            target: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/ernie/, ''),
            headers: {
              'Origin': 'https://aip.baidubce.com'
            }
          },
          // 通义千问（阿里云）API代理
          '/api/qwen': {
            target: 'https://dashscope.aliyuncs.com/api/v1/services',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/qwen/, ''),
            headers: {
              'Origin': 'https://dashscope.aliyuncs.com'
            }
          },
          // Gemini（Google）API代理
          '/api/gemini': {
            target: 'https://generativelanguage.googleapis.com/v1beta',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/gemini/, ''),
            headers: {
              'Origin': 'https://generativelanguage.googleapis.com'
            }
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
