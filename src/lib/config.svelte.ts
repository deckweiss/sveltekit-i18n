export interface Config {
    defaultLocale: string;
    locales: Record<string, Record<string, any>>;
    useCookie: boolean;
    cookieName: string;
}

export interface UserConfig {
    defaultLocale: string;
    locales: Record<string, Record<string, any>>;
    /**
     * if not set, defaults to true
     */
    useCookie?: boolean;
    cookieName?: string;
}

export let config: Config | undefined = undefined;

export function setupI18n(userConfig: UserConfig) {
    config = {
        useCookie: true,
        cookieName: 'user.locale',
        ...userConfig,
        locales: Object.keys(userConfig.locales).reduce(
            (acc, l) => {
                acc[l] = flattenObject(userConfig.locales[l]);
                return acc;
            },
            <Record<string, Record<string, string>>>{}
        )
    };
}

export function getConfig(): Config {
    if (!config) {
        throw new Error("[@deckweiss/internationalization]: Don't forget to call `setupI18n()`");
    }

    return config;
}

function flattenObject(obj: any, parentKey = '') {
    let flattened = {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const propName = parentKey ? `${parentKey}.${key}` : key;

            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                Object.assign(flattened, flattenObject(obj[key], propName));
            } else {
                // @ts-ignore
                flattened[propName] = obj[key];
            }
        }
    }

    return flattened;
}
