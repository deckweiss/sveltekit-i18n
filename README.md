# Getting started
This repository contains internationalization for SvelteKit.

## Installation
### Prerequesites
You need to associate packages with `@deckweiss` scope to the Deckweiss npm registry.
```sh
pnpm config set @deckweiss:registry https://git.deckweiss.at/api/v4/packages/npm/
```

### 1. Install package
```sh
pnpm i @deckweiss/internationalization
```

### 2. Initialize i18n
```typescript
// src/i18n.ts
import { initialize as initializeI18n } from '@deckweiss/internationalization';
import de from '$lib/translations/de.json';
import en from '$lib/translations/en.json';

initializeI18n({
    defaultLocale: 'en',
    locales: {
        de,
        en
    }
});
```

```typescript
// src/hooks.server.ts
import { handle } from '@deckweiss/internationalization';
import './i18n.js';

export { handle };
```

```typescript
// hooks.client.ts
import './i18n.js';
```

### 3. Use translations
```svelte
// +page.svelte
<script>
    import { t } from '@deckweiss/internationalization';
</script>


<p>{$t('app.day', { date: Date.now() })}</p>
```

### 4. (optional) Update selected locale
```svelte
// src/lib/components/language-picker.svelte
<script>
    import { locale, locales, setLocale } from '@deckweiss/internationalization';
</script>


<select value={$locale} on:change={(event) => setLocale(event.target.value)}>
    <option disabled>Choose language</option>
    {#each locales as l}
        <option value={l} selected={l === $locale}>{l}</option>
    {/each}
</select>
```


## JSON Format
This package is compatible with [i18next JSON v4](https://www.i18next.com/misc/json-format#i18next-json-v4). Although, it currently does only support nested keys and interpolation with formatting.

### Examples
```json
// src/lib/translations/en.json
{
    "app: {
        "name": "Example app",
        "day": "Today is {{date, date(format: dddd)}}"
    }
}
```

| Usage | Output |
| ----- | ------ |
| $t('app.name') | "Example app" |
| $t('app.day', { date: new Date(1997, 4, 22) })} | "Today is Thursday" |

> Date format symbols can be found [here](https://github.com/felixge/node-dateformat?tab=readme-ov-file#mask-options)
