export interface ComponentSettings {
    path: string;
    props: Record<string, any>;
}
export interface SettingsType {
    content: ComponentSettings[];
    pageHeight?: string;
    pageWidth?: string;
    outputDir?: string;
    outputFormat: "minified" | "pretty";
    decorator?: DecoratorFunction;
}
export type DecoratorFunction = (content: string, styles: string) => string;
