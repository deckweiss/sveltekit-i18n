
# Getting started
This repository contains internationalization for SvelteKit.

## Installation
### 1. Install package
```sh
pnpm i @deckweiss/internationalization
```

### 2.a Setup (with cookies)

```typescript
// src/i18n.ts
import { setupI18n } from '@deckweiss/internationalization';
import de from '$lib/translations/de.json';
import en from '$lib/translations/en.json';

setupI18n({
    defaultLocale: 'en',
    locales: {
        de,
        en
    },
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

```html
<!-- app.html -->
<html lang="%lang%">
    ...
</html
```

```typescript
// +layout.server.ts
export function load(event) {
    return { locale: event.locals.i18n.locale }
}
```

```svelte
// +layout.svelte
<script lang="ts">
	import { setI18nContext, useI18n } from '@deckweiss/internationalization';

	let { data, children } = $props();

	setI18nContext(data.locale)
</script>

{@render children()}
```

### 2.b Setup (cookie-less via URL param)

Example url: `example.com/en/...` or `example.com/de/...`

```typescript
// src/i18n.ts
import { setupI18n } from '@deckweiss/internationalization';
import de from '$lib/translations/de.json';
import en from '$lib/translations/en.json';

setupI18n({
    defaultLocale: 'en',
    locales: {
        de,
        en
    },
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

```html
<!-- app.html -->
<html lang="%lang%">
    ...
</html
```

```typescript
// src/routes/[locale]/+layout.server.ts
export function load(event) {
	event.locals.i18n.setLocale(event.params.locale)
    return { locale: event.locals.i18n.locale }
}
```

```svelte
// src/routes/[locale]/+layout.svelte
<script lang="ts">
	import { setI18nContext, useI18n } from '@deckweiss/internationalization';

	let { data, children } = $props();

	setI18nContext(data.locale)
</script>

{@render children()}
```

### 3. Usage
```svelte
// +page.svelte
<script>
    import { useI18n } from '@deckweiss/internationalization';
    
	const i18n = useI18n();
</script>

<p>{i18n.t('app.day', { date: Date.now() })}</p>
```

The i18n instance is available in all server files, form actions and server hooks (+layout.server.ts, +page.server.ts, +server.ts) via: `event.locals.i18n`.

### 4. (optional) Update selected locale
*Hint: In cookie-less mode you want to to additionally link from e.g. /de to /en to be consistent across page reloads*

```svelte
// src/lib/components/language-picker.svelte
<script>
    import { useI18n } from '@deckweiss/internationalization';

	const i18n = useI18n()
</script>

<select onchange={(event) => i18n.setLocale(event.target.value)}>
    <option disabled>Choose language</option>
    {#each locales as l}
        <option value={l} selected={l === i18n.locale}>{l}</option>
    {/each}
</select>
```


## JSON Format
This package is compatible with [i18next JSON v4](https://www.i18next.com/misc/json-format#i18next-json-v4). Although, it currently does only support nested keys and interpolation with formatting.

### Examples
```json
// src/lib/translations/en.json
{
    "app": {
        "name": "Example app",
        "day": "Today is {{date, date(format: dddd)}}"
    }
}
```

| Usage | Output |
| ----- | ------ |
| $t('app.name') | "Example app" |
| $t('app.day', { date: new Date(1997, 4, 22) })} | "Today is Thursday" |

Date format symbols can be found [here](https://github.com/felixge/node-dateformat?tab=readme-ov-file#mask-options).
**Bundled date languages**  
- German
- English
- Italian
- Spanish


## Supported Interpolations
### Date and Time
```json
// src/lib/translations/en.json
{
    "day": "Today is {{date, date(format: dddd, dd.mm.yyyy)}}" // Output: "Today is Friday, 23.05.1997"
}
```

### Numbers and Currency
The `options` argument gets directly passed into the `Intl.NumberFormat` constructor. Hence, you can configure any option in JSON syntax.
```json
// src/lib/translations/en.json
{
    "number": "{{count, number(options: {\"style\": \"decimal\", \"minimumFractionDigits\": 5})}}", // Output: "5,132.95000"
    "currency": "{{amount, number(options: {\"style\": \"currency\", \"currency\": \"EUR\"})}}" // Output: "5,132.95 €"
}
```

## Known issues
### i18n instance is not available in +page.ts and +layout.ts files


## Contribution
### Create a new release
1. Update package version either by hand or with `pnpm version`.
2. The commit message onto main must begin with `chore: release`
