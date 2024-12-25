# tailthemes

Tailthemes is a fully typed TailwindCSS plugin making it effortless to switch between themes in TailwindCSS. Any part of the configuration can 
be themed, from colours to border radius to stroke width.

## Features

- **Typed** — Create a schema for your themes to ensure they all implement the same variables, and get full intellisense while writing them.
- **Easy** — No need to change your markup, tailthemes extends your existing configuration.
- **Flexible** — Import your theme from any part of your app, making it effortless to sync your theme switcher component and your configuration.

## Usage

### Basic

```ts
//tailwind.config.ts
import { type Config } from "tailwindcss"
import { tailthemes, type TailthemesConfig } from "tailthemes

export default {
  content: ["./src/**/*.{html,js}"],
  plugins: [tailthemes({
    forest: {
      colors: {
        primary: "#00ff00"
      },
      borderRadius: {
        DEFAULT: "0.5rem"
      }
    }
    old: {
      colors: {
        primary: "#ea6a25"
      },
      borderRadius: {
        DEFAULT: "0.25rem"
      }
    }
  } satisfies TailthemesConfig)]
} satisfies Config
```

Now, `primary` and the default value of `rounded` will switch depending on the active theme. The active theme can be set with `data-theme` or
a class. 
