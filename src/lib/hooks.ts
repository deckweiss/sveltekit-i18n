import type { Handle } from '@sveltejs/kit';
import { COOKIE_NAME } from './constants.js';
import { locale, setLocale } from './state.js';
import { get } from 'svelte/store';

export const handle: Handle = function ({ event, resolve }) {
    const userLocale = event.cookies.get(COOKIE_NAME);

    if (userLocale) {
        setLocale(userLocale);
    }

    return resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%lang%', get(locale))
    });
};
