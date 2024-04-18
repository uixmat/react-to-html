import ts from 'typescript';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import path from 'path';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import PurgeCSS from '@fullhuman/postcss-purgecss';
import pkg from 'js-beautify';
import { minify } from 'html-minifier';
const { html: beautify } = pkg;
// Console colors
const colors = {
    reset: '\x1b[0m',
    blue: '\x1b[34m',
    green: '\x1b[32m',
    red: '\x1b[31m',
};
// Replace camelCase with kebab-case
function toKebabCase(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
// Transpile modules
function transpileModule(filePath) {
    const tsConfig = {
        jsx: ts.JsxEmit.React,
        esModuleInterop: true,
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ESNext,
    };
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const transpiled = ts.transpileModule(fileContents, { compilerOptions: tsConfig });
    return transpiled.outputText;
}
// Function to generate critical CSS using Tailwind and PurgeCSS
async function generateCriticalCSS(htmlContent) {
    return postcss([
        tailwindcss,
        autoprefixer,
        PurgeCSS({
            content: [{ raw: htmlContent, extension: 'html' }],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
            keyframes: true
        })
    ])
        .process('@tailwind utilities;', { from: undefined })
        .then((result) => result.css);
}
export const renderReactToHTML = async () => {
    console.log(`${colors.blue}Building...${colors.reset}`);
    /**
     * Load the user settings from the tohtml.config.js file
     * located in the root of the project
     */
    const userSettingsPath = `${process.cwd()}/tohtml.config.js`;
    let userSettings;
    try {
        const module = await import(userSettingsPath);
        userSettings = module.settings;
    }
    catch (error) {
        console.error(`Error loading the react-to-html configuration file from ${userSettingsPath}`);
        console.error(error);
        process.exit(1);
    }
    /**
     * Create the build directory if it doesn't exist
     * This is where the generated HTML files will be saved
     */
    const outputDir = userSettings.outputDir || 'build-html';
    if (!fs.existsSync(outputDir)) {
        console.log(`${colors.blue}Creating the build directory...${colors.reset}`);
        fs.mkdirSync(outputDir);
    }
    console.log(' ');
    /**
     * Loop through the content array in the user settings
     * and process each component
     */
    for (const [index, contentItem] of userSettings.content.entries()) {
        const componentBaseName = contentItem.path.split('/').pop()?.replace(/\.tsx$/, '') || `Component ${index + 1}`;
        console.log(`${colors.reset}∴ Processing ${componentBaseName}...${colors.reset}`);
        /**
         * Transpile the component file to JavaScript
         */
        const componentFullPath = path.resolve(process.cwd(), contentItem.path);
        const transpiledCode = transpileModule(componentFullPath);
        const tempFilePath = path.resolve(process.cwd(), `tempComponent${index}.mjs`);
        fs.writeFileSync(tempFilePath, transpiledCode);
        /**
         * Render the component to HTML
         * and save the output to a file
         */
        try {
            // Start timer
            const startTime = Date.now();
            // Load the component
            const Component = (await import(tempFilePath)).default;
            const componentContent = ReactDOMServer.renderToStaticMarkup(React.createElement(Component, contentItem.props));
            // Generate CSS
            // const css = await postcss([tailwindcss, autoprefixer]).process('@tailwind utilities;', { from: undefined }).then((result: any) => result.css);
            const css = await generateCriticalCSS(componentContent);
            console.log("✔ Generated critical CSS");
            // Default decorator
            const defaultDecorator = (content, styles) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body, html {
              height: ${userSettings.pageHeight ? userSettings.pageHeight : 'auto'};
              width: ${userSettings.pageWidth ? userSettings.pageWidth : '100%'};
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: system-ui, sans-serif;
            }
            ${styles}
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
      `;
            // Decorate the component
            const decorate = userSettings.decorator ? userSettings.decorator : defaultDecorator;
            let htmlOutput = decorate(componentContent, css);
            // Format the output
            if (userSettings.outputFormat === 'minified') {
                htmlOutput = minify(htmlOutput, {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    removeComments: true,
                    minifyCSS: true,
                });
            }
            else if (userSettings.outputFormat === 'pretty') {
                htmlOutput = beautify(htmlOutput, { indent_size: 2 });
            }
            // Rename the component file to kebab-case
            const kebabComponentName = toKebabCase(componentBaseName);
            const filename = `${kebabComponentName}.html`;
            // Save the output to a file
            fs.writeFileSync(`${outputDir}/${filename}`, htmlOutput);
            // End timer
            const duration = Date.now() - startTime;
            // Log success message
            console.log(`${colors.green}✔ Successfully processed ${colors.reset}${componentBaseName} ${colors.green}in ${duration}ms${colors.reset}`);
            console.log(' ');
        }
        finally {
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        }
    }
    // Log completion message
    console.log(' ');
    console.log(`${colors.green}✔ Complete!${colors.reset}`);
    console.log(`→ Your components have been built to ./${outputDir}/`);
    console.log(' ');
};
