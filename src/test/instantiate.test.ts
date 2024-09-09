import { initialize, locale, type Configuration } from '$lib/state.js';
import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';

describe('instantiation', () => {
    it('can have a default locale', async () => {
        const config: Configuration = {
            defaultLocale: 'de',
            locales: {
                de: { 'app.name': 'Deutscher Name' }
            }
        };
        initialize(config);
        expect(get(locale)).toBe('de');

        // reset locale state
        initialize({ defaultLocale: 'en', locales: {} });
    });
});
