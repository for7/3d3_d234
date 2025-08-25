// uno.config.ts
import { defineConfig, presetWind3, presetAttributify, presetIcons, presetTypography } from 'unocss'

export default defineConfig({
  theme: {
    spacing: {
      // 1: '10px', // 改成 10px
    },
  },
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
  ],
})
