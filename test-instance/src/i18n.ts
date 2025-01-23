import { setupI18n } from '@deckweiss/internationalization';

setupI18n({
    defaultLocale: 'de',
    locales: {
        de: {
            'app.name': 'Deutscher Name'
        },
        en: {
            'app.name': 'English name'
        }
    },
    useCookie: false
});
