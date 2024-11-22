import { get } from 'svelte/store';
import { locale } from '@deckweiss/internationalization';

export function load(event) {
    return { userLocale: get(locale) };
}
