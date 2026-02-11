import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/coin-toss-game/",
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: "コイントス予想ゲーム",
            description:
              "連続で何回当てられる？暇つぶしに最適なコイントス予想ゲーム",
            baseUrl:
              env.VITE_BASE_URL || "https://username.github.io/coin-toss-game",
          },
        },
      }),
    ],
  };
});
