export interface I18n {
    locale: string;
    locales: string[];
    setLocale: (locale: string) => void;
    t: ((key: string) => string) | ((key: string, vars: Record<string, any>) => string);
}

declare global {
    namespace App {
        interface Locals {
            i18n: I18n;
        }
    }
}
