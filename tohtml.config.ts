/** 
 * @description This file contains the settings for react-to-html.
 * @file tohtml.config.ts
 * @property {Array} content - Array of components to render.
 *    @property {string} path - Path to the component.
 *    @property {Object} props - Props to pass to the component.
 * @property {string} pageHeight - Optional height of the page.
 * @property {string} pageWidth - Optional width of the page.
 * @property {string} outputDir - Optional output directory.
 * @property {string} outputFormat - "pretty" || "minified".
 * @property {Function} decorator - Optional decorator function to wrap the component.
 */

import { SettingsType } from './src/types';

export const settings: SettingsType = {
  content: [
    {
      path: './components/Example.tsx',
      props: {
        foo: "bar",
      },
    },
    {
      path: './components/ExampleTwo.tsx',
      props: {
        foo: "bar",
      },
    }
  ],
  pageHeight: '297mm',
  pageWidth: '210mm',
  outputDir: './output',
  outputFormat: 'pretty',
};