## Usage

### Basic

```ts
//tailwind.config.ts
import {tailthemes, type TailthemesConfig} from "tailthemes"
export default { 
 // Tailwind config...
  plugins: [
    tailthemes({
      forest: {
        colors: {
          green: "#00ff00"
        }
      }
    } satisfies TailthemesConfig)
  ]
}

```
