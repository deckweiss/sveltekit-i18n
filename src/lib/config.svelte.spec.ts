import { describe, expect, it } from 'vitest';
import { getConfig, setupI18n, type UserConfig } from './config.svelte.js';

describe('setup', () => {
    it('can have a default locale', async () => {
        const config: UserConfig = {
            defaultLocale: 'de',
            locales: {
                de: { 'app.name': 'Deutscher Name' }
            }
        };
        setupI18n(config);

        const appliedConfig = getConfig();
        expect(appliedConfig.defaultLocale).toBe('de');
        expect(appliedConfig.useCookie).toBe(true);
        expect(appliedConfig.cookieName).toBe('user.locale');
        expect(appliedConfig.locales.de['app.name']).toBe('Deutscher Name');
    });
});
