<script>
    import { locale, locales, setLocale, t } from '@deckweiss/internationalization';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<p>{$t('app.name')}</p>

<select value={$locale} on:change={(event) => setLocale(event.target.value)}>
    <option disabled>Choose language</option>
    {#each locales as l}
        <option value={l} selected={l === $locale}>{l}</option>
    {/each}
</select>
