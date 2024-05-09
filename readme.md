## Introduction
Convert your reusable react components from jsx/tsx directly into HTML. React to html provides you with a way of maintaining one source of truth for your applications components with some added features (avoid using tables and just use Tailwind!).

> Inspired by [react-email](https://) from [@zenorocha](https://twitter.com/zenorocha) & [@bukinoshita](https://twitter.com/bukinoshita).

## Why
Maintaining a HTML version of your components can be cumbersome and lead to unnoticed differences between two versions of the same thing. You might want to generate a PDF from a HTML version of your component and that's where react-to-html shines.

### Works with [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)
React-to-html will automatically compile your tailwindcss into your HTML version for you.

## Getting started
Install react-to-html from the command line and setup your config.

```bash
# nnpm
npm i react-to-html
# pnpm
pnpm add react-to-html
# yarn
yarn add react-to-html
```

### Basic config `tohtml.config.ts`
```ts
// tohtml.config.ts
exports.settings = {
  content: [
    {
      path: './components/Example.tsx',
      props: {
        foo: "bar",
      },
    }
  ],
  globalStyles: './app/globals.css',
  pageHeight: '297mm', // A4
  pageWidth: '210mm', // A4
  outputDir: './output',
  outputFormat: 'pretty | minified',
};
```
### Usage
To run react-to-html simply run the command or add a script in your own `packages.json`.
```bash
# npm
npm build:html
# pnpm
pnpm build:html
# yarn
yarn build:html
```

## Example component
Below is an example component using **tailwind** and imported icons from **Lucide**. 

> [!IMPORTANT]  
> You cannot use local imports for components you wish to convert to HTML. You should validate your data before passing it as props.

```tsx
import React from "react";
import { ShoppingCartIcon } from "lucide-react";

interface ExampleProps {
  foo: string;
}

const Example = ({foo}: ExampleProps) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex items-center">
        <ShoppingCartIcon size={32} /> 
        <h1>Yout items</h1>
        <p>{foo}</p>
      </div>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </div>
  )
}

export default Example;
```
In this example, `foo` will return the string `bar` when converted to HTML.

> [!TIP]  
> You can declare functions, interfaces & types and components in your component.

### Using objects

The example above shows you how to convert the prop `foo` which is of `string` valu, however you may need to work with an object suchg as `item`. To do this you can give your component an additional prop for example `isStatic` of type `boolean` and use conditional rendering

```typescript
// Example.tsx
interface Seller {
  name: string;
  website: string;
};

interface ExampleProps extends Seller {
  seller: Seller;
  isStatic: boolean;
}

const Example = ({ 
  seller, 
  isStatic = true // default
  }: ExampleProps) => {
  
  function replaceWith(key: any, actualValue: any) {
    return isStaticMode ? `${key}` : actualValue;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex items-center">
        <h1>Seller</h1>
        <p>{replaceWith("foo", seller?.name)}</p>
        <p>{replaceWith("bar", seller?.website)}</p>
      </div>
    </div>
  )
}
```

## Generate PDF from HTML
If you are converting yout components to HTML so they can be later converted to PDF, it's recommended to use a package like [Puppeteer](https://pptr.dev/).

Puppeteer can handle most modern CSS such as flex and grid which seem to be a common frustration with many packages.

## Using a decorator

Inspired by [Storybook's decorators](https://storybook.js.org/docs/writing-stories/decorators), react-to-html provides you with a decorator as a way to wrap your componment inside additional code. By default this will wrap your component in a standard HTML page and insert your styles with the styles tags. 

### Usage

```typescript
// tohtml.config.js
exports.settings = {
  decorator: (content, styles) => `
    <!DOCTYPE html>
    <html>
      <head>
      <meta charset="UTF-8">
      <style>
        @media print {
          color: red;
        }
        body, html {
          color: blue;
        }
        ${styles}
      </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `
}
```
> [!TIP]  
> You can add a print media query for PDF specific styles when using something like Puppeteer to convert your HTML to PDF.


## Author
Built by [@uixmat](https://x.com/uixmat)

## License
MIT License