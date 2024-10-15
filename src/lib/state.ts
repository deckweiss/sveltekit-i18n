import { derived, writable } from 'svelte/store';
import { dayNames, monthNames, timeNames } from './included-translations/date.js';
import { i18n } from 'dateformat';
import { parse } from 'cookie';
import { browser } from '$app/environment';
import { COOKIE_NAME } from './constants.js';

let config: Required<Configuration> = { defaultLocale: '', locales: {}, useCookie: false };
const _locale = writable('');
export const locale = derived(_locale, ($locale) => $locale);
export const locales: string[] = [];
export const translations: Record<string, Record<string, string>> = {};

export function setLocale(newLocale: string) {
    // date translations fall back to 'en'
    const newDateLocale: keyof typeof dayNames = Object.keys(dayNames).includes(newLocale)
        ? (newLocale as keyof typeof dayNames)
        : 'en';
    i18n.dayNames = dayNames[newDateLocale];
    i18n.monthNames = monthNames[newDateLocale];
    i18n.timeNames = timeNames[newDateLocale];

    _locale.set(newLocale);

    if (browser) {
        if (config.useCookie) {
            document.cookie = `${COOKIE_NAME}=${newLocale};path=/`;
        } else {
            document.cookie = `${COOKIE_NAME}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
        }
    }
}

export interface Configuration {
    defaultLocale: string;
    locales: Record<string, Record<string, any>>;
    /**
     * if not set defaults to true
     */
    useCookie?: boolean;
}

export function initialize(configuration: Configuration) {
    Object.assign(config, configuration);
    Object.entries(configuration.locales).forEach(([locale, values]) => {
        translations[locale] = flattenObject(values);
    });
    Object.keys(translations).forEach((key) => locales.push(key));

    setLocale(configuration.defaultLocale);

    // if on client, read cookie instantly
    if (browser && config.useCookie) {
        const cookies = parse(document.cookie);
        const userSelectedLocale = cookies.hasOwnProperty(COOKIE_NAME)
            ? cookies[COOKIE_NAME]
            : configuration.defaultLocale;
        if (userSelectedLocale) {
            setLocale(userSelectedLocale);
        }
    }
}

function flattenObject(obj: any, parentKey = '') {
    let flattened = {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const propName = parentKey ? `${parentKey}.${key}` : key;

            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                Object.assign(flattened, flattenObject(obj[key], propName));
            } else {
                flattened[propName] = obj[key];
            }
        }
    }

    return flattened;
}
