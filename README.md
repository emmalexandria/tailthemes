# tailthemes

Tailthemes is a fully typed TailwindCSS plugin making it effortless to switch between themes in TailwindCSS. Any part of the configuration can 
be themed, from colours to border radius to stroke width.

*Note: Some of this project is shamelessly stolen from the similar [tw-colors](https://github.com/L-Blondy/tw-colors)*

## Usage

Start by installing tailthemes:
```
npm install tailthemes
```

*tailwind.config.ts*
```diff

import { type Config } from "tailwindcss"
+ import { tailthemes, type TailthemesConfig } from "tailthemes

export default {
  content: ["./src/**/*.{html,js}"],
-  theme: {
-   extend: {
-      colors: {
-        primary: "#ea6a25"
-      }
-    }
-  }

+  plugins: [tailthemes({
+    light: {
+      colors: {
+        primary: "#ea6a25"
+      },
+      borderRadius: {
+        DEFAULT: "0.25rem"
+      }
+    }
+  } satisfies TailthemesConfig )]
+} satisfies Config
```

Now, `primary` and the default value of `rounded` will switch depending on the active theme. The active theme can be set with `data-theme` or
a class. 

```html
<html data-theme="light>
```

### Schemas

Schemas allow you to define the variables which each theme *must* include.

Define a schema type as follows:

```typescript
import { type TailthemesSchema } from "tailschemes";

interface Schema extends TailthemesSchema {
  colors: {
    mono: {
      base: string,
      text: string
    },
    borderRadius: {
      DEFAULT: string
    }
  }
}
```

and call `tailthemes` with a generic argument:

```typescript
tailthemes<Schema>({
  light: {

  }
})
```

The above code will give you an error, as light is now expected to implement the mono base and text colors, as well as a default border radius.

### Light, dark, and high-contrast themes

To add a light or dark theme, simply append `colorScheme` to the theme:
```diff
 light: {
   colors: {
     primary: "#ea6a25"
   },
   borderRadius: {
     DEFAULT: "0.25rem"
   },
+  colorScheme: "dark"
 }
```

Valid values are `"dark"`, `"light"`, and `"high-contrast"` and `"default"`. The first three will generate styles based on media queries. `"default"` generates `:root` variables.

### CSS variables and classnames

The second (optional) argument of the `tailthemes` plugin function is an object containing `cssGenerator` and `classGenerator`, which are functions responsible for generating the CSS variables and classnames used by the plugin. 

The following are default:
```typescript
//Here, key is the theme key (e.g. borderRadius) and name is the name of the value (e.g. red-500)
const defaultCssGenerator = (name: string, key: string | undefined) => {
  if(key) {
    return `--tailthemes-${key}-${name}`;
  }

  return `--tailthemes-${name}`;
}

//Here, name is the name of the theme as defined in your tailthemes config
const defaultClassGenerator = (name: string) => name
```
