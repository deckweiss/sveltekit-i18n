import { initialize as initializeI18n } from '@deckweiss/internationalization';
import de from '$lib/translations/de.json';
import en from '$lib/translations/en.json';

initializeI18n({
    defaultLocale: 'en',
    locales: {
        de,
        en
    },
    useCookie: true
});
