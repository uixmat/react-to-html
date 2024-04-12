import { DecoratorFunction } from './';
export interface BaseConfig {
    content: {
        path: string;
        props: Record<string, any>;
    }[];
    pageHeight?: string;
    pageWidth?: string;
    outputFormat: 'minified' | 'pretty';
    decorator?: DecoratorFunction;
}
export declare const renderInvoiceForBackend: () => Promise<void>;
