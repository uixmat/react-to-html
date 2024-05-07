import { DecoratorFunction } from './';
export interface BaseConfig {
    content: {
        path: string;
        props: Record<string, any>;
    }[];
    pageHeight?: string;
    pageWidth?: string;
    outputDir?: string;
    outputFormat: 'minified' | 'pretty';
    decorator?: DecoratorFunction;
    globalStyles?: string;
}
export declare const renderReactToHTML: () => Promise<void>;
