import { getContext, setContext } from 'svelte';
import { getConfig } from './config.svelte.js';
import { I18nImpl } from './i18n.svelte.js';
import { type I18n } from './types.js';

const contextKey = '$$_i18n';

export function setI18nContext(locale: string) {
    setContext(contextKey, new I18nImpl(locale, getConfig()));
}

export function useI18n(): I18n {
    const i18nFromContext = getContext<I18n>(contextKey);
    if (!i18nFromContext) {
        throw new Error(
            '@deckweiss/internationalization: initialise i18n via calling `setI18nContext()` in +layout.svelte'
        );
    }
    return i18nFromContext;
}
