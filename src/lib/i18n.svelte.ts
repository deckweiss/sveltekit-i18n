import { i18n } from 'dateformat';
import { type Config } from './config.svelte.js';
import { dayNames, monthNames, timeNames } from './included-translations/date.js';
import { translate } from './translate.js';
import { type I18n } from './types.js';
import { browser } from '$app/environment';

export class I18nImpl implements I18n {
    private currentLocale: string = $state('');
    private _t = $derived((key: string, vars = {}) =>
        translate(this.currentLocale, this.config.locales, key, vars)
    );

    constructor(
        currentLocale: string,
        private config: Config
    ) {
        this.currentLocale = currentLocale;
    }

    get locale() {
        return this.currentLocale;
    }

    get locales() {
        return Object.keys(this.config.locales);
    }

    setLocale(newLocale: string) {
        // date translations fall back to 'en'
        const newDateLocale: keyof typeof dayNames = Object.keys(dayNames).includes(newLocale)
            ? (newLocale as keyof typeof dayNames)
            : 'en';
        i18n.dayNames = dayNames[newDateLocale];
        i18n.monthNames = monthNames[newDateLocale];
        i18n.timeNames = timeNames[newDateLocale];

        this.currentLocale = newLocale;

        if (browser) {
            if (this.config.useCookie) {
                document.cookie = `${this.config.cookieName}=${newLocale};path=/`;
            } else {
                document.cookie = `${this.config.cookieName}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
            }
            document.querySelector('html')?.setAttribute('lang', newLocale);
        }
    }

    get t() {
        return this._t;
    }
}
