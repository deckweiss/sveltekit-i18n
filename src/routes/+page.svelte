<script>
    import { locale, locales, setLocale, t } from '$lib';
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<p>{$t('app.day', { date: Date.now() })}</p>

<select value={$locale} on:change={(event) => setLocale(event.target.value)}>
    <option disabled>Choose language</option>
    {#each locales as l}
        <option value={l} selected={l === $locale}>{l}</option>
    {/each}
</select>
