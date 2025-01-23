import { describe, it, expect } from 'vitest';
import { translate } from './translate.js';

describe('translate', () => {
    it('returns key when translation is not found', () => {
        expect(translate('en', {}, 'app.day', {})).toEqual('app.day');
    });

    it('returns key when locale is missing', () => {
        expect(translate('', {}, 'app.day', {})).toEqual('app.day');
    });

    it('returns key when locale is not exiting', () => {
        const translations = {
            en: {
                'app.day': 'Today is ...'
            }
        };
        expect(translate('de', translations, 'app.day', {})).toEqual('app.day');
    });

    it('basically works', () => {
        const translations = {
            en: {
                'app.day': 'Today is ...'
            }
        };
        expect(translate('en', translations, 'app.day', {})).toEqual('Today is ...');
    });

    it('can handle placeholders', () => {
        const translations = {
            en: {
                'app.day': 'Today is {{day}}'
            }
        };
        expect(translate('en', translations, 'app.day', { day: 'Friday' })).toEqual(
            'Today is Friday'
        );
    });

    it('can handle missing placeholders', () => {
        const translations = {
            en: {
                'app.day': 'Today is {{day}}'
            }
        };
        expect(translate('en', translations, 'app.day', { other: 'Friday' })).toEqual(
            'Today is {{day}}'
        );
    });

    it('can handle functions', () => {
        const translations = {
            en: {
                'app.day': 'Today is {{date, date(format: dddd)}}'
            }
        };
        expect(translate('en', translations, 'app.day', { date: new Date(1997, 4, 22) })).toEqual(
            'Today is Thursday'
        );
    });

    it('can handle mulitple functions', () => {
        const translations = {
            en: {
                'app.day':
                    'Today is {{date, date(format: dddd)}} and tomorrow {{date2, date(format: dddd)}}'
            }
        };
        expect(
            translate('en', translations, 'app.day', {
                date: new Date(1997, 4, 22),
                date2: new Date(1997, 4, 23)
            })
        ).toEqual('Today is Thursday and tomorrow Friday');
    });

    it('can handle functions and checks required parameters', () => {
        const translations = {
            en: {
                'app.day': 'Today is {{date, date}}'
            }
        };
        expect(translate('en', translations, 'app.day', { date: new Date(1997, 4, 22) })).toEqual(
            'Today is {{date, date}}'
        );
    });
    it('can handle date formatting', () => {
        const translations = {
            en: {
                'app.day': 'Today is {{date, date(format: dddd)}}',
                'app.day2': '{{date, date(format: dddd, dd.mm.yyyy HH:MM)}}'
            }
        };
        expect(translate('en', translations, 'app.day', { date: new Date(1997, 4, 22) })).toEqual(
            'Today is Thursday'
        );
        expect(translate('en', translations, 'app.day2', { date: new Date(1997, 4, 22) })).toEqual(
            'Thursday, 22.05.1997 00:00'
        );
    });

    it('can handle number formatting', () => {
        const translations = {
            en: {
                number: '{{count, number(options: {"style": "decimal", "minimumFractionDigits": 5})}}',
                currency: '{{amount, number(options: {"style": "currency", "currency": "EUR"})}}'
            }
        };
        translations.de = translations.en;
        expect(translate('en', translations, 'number', { count: Math.PI })).toEqual('3.14159');
        expect(translate('de', translations, 'number', { count: 5132.95 })).toEqual('5.132,95000');
        expect(translate('de', translations, 'currency', { amount: 5132.95 })).toEqual(
            '5.132,95\u00a0€'
        ); // spaces get formated as UTF-8 Character 160 (no-break space)
    });
});
