import { type Handle } from '@sveltejs/kit';
import { getConfig } from './config.svelte.js';
import { I18nImpl } from './i18n.svelte.js';

export const handle: Handle = function ({ event, resolve }) {
    const config = getConfig();
    const i18n = new I18nImpl(config.defaultLocale, config);
    event.locals.i18n = i18n;

    if (config.useCookie) {
        const userLocale = event.cookies.get(getConfig().cookieName);

        if (userLocale) {
            i18n.setLocale(userLocale);
        }
    }

    return resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%lang%', i18n.locale)
    });
};
