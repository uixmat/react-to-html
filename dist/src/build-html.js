import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import path from 'path';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { minify } from 'html-minifier';
import { html as beautify } from 'js-beautify';
// Console colors
const colors = {
    reset: '\x1b[0m',
    blue: '\x1b[34m',
    green: '\x1b[32m',
    red: '\x1b[31m',
};
// Replace camelCase with kebab-case
function toKebabCase(str) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
}
export const renderInvoiceForBackend = async () => {
    console.log(`${colors.blue}Building...${colors.reset}`);
    // Load the user settings from the configuration file
    const userSettingsPath = `${process.cwd()}/tohtml.config.js`;
    let userSettings;
    try {
        userSettings = require(userSettingsPath).settings;
    }
    catch (error) {
        console.error(`${colors.red}Error loading the react-to-html configuration file from ${userSettingsPath}${colors.reset}`);
        console.error(error);
        process.exit(1);
    }
    // Ensure the build directory exists
    if (!fs.existsSync('./build')) {
        console.log(`${colors.blue}Creating the build directory...${colors.reset}`);
        fs.mkdirSync('./build');
    }
    for (const [index, contentItem] of userSettings.content.entries()) {
        console.log(`${colors.reset}Processing component ${index + 1} of ${userSettings.content.length}...${colors.reset}`);
        const startTime = Date.now();
        const componentFullPath = require.resolve(path.join(process.cwd(), contentItem.path));
        const Component = await import(componentFullPath).then(module => module.default);
        const componentContent = ReactDOMServer.renderToStaticMarkup(React.createElement(Component, contentItem.props));
        const css = await postcss([tailwindcss, autoprefixer])
            .process('@tailwind utilities;', { from: undefined })
            .then((result) => result.css);
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
        const decorate = userSettings.decorator ? userSettings.decorator : defaultDecorator;
        let htmlOutput = decorate(componentContent, css);
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
        // Generate a filename based on the component file's basename
        const baseComponentName = contentItem.path.split('/').pop()?.replace(/\.tsx$/, '') || 'output';
        const kebabComponentName = toKebabCase(baseComponentName);
        const filename = `${kebabComponentName}.html`;
        // Write the static markup to an HTML file in the build directory
        fs.writeFileSync(`./build/${filename}`, htmlOutput);
        const duration = Date.now() - startTime;
        console.log(`${colors.green}Successfully processed${colors.reset} ${filename} in ${duration}ms`);
    }
    console.log(' ');
    console.log(`${colors.green}Build complete.${colors.reset}`);
};
renderInvoiceForBackend();
