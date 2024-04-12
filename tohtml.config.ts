/** 
 * Settings
 * @description This file contains the settings for the invoices component.
 * @file invoices.config.ts
 * @type {Object}
 * @property {Array} content - Array of components to render.
 * @property {string} path - Path to the component.
 * @property {Object} props - Props to pass to the component.
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
      path: './components/Invoice.tsx',
      props: {
        id: "{{ invoice_id }}",
        amount: "{{ invoice_amount }}",
        dueDate: "{{ invoice_date }}",
      },
    },
    {
      path: './components/InvoiceTwo.tsx',
      props: {
        id: "{{ invoice_id }}",
        amount: "{{ invoice_amount }}",
        dueDate: "{{ invoice_date }}",
      },
    }
  ],
  pageHeight: '297mm',
  pageWidth: '210mm',
  outputFormat: 'pretty',
  /**
   * Decorator function
   * @param {string} content - The content of the component.
   * @param {string} styles - The CSS styles for the component.
   * @example ...
   * decorator: (content: string, styles: string) => {
   *   // Add your code here
   * },
   */
};