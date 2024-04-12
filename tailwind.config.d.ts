export let content: string[];
export namespace theme {
    let extend: {};
}
export let plugins: (import("postcss").PluginCreator<string | import("tailwindcss/types/config").Config | {
    config: string | import("tailwindcss/types/config").Config;
}> | typeof import("autoprefixer"))[];
