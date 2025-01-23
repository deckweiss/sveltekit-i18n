<script lang="ts">
    import { useI18n } from '@deckweiss/internationalization';

    let { data } = $props();
    const i18n = useI18n();
</script>

<p>Translated on server: <strong>{data.translatedOnServer}</strong></p>
<p>Translated in page: <strong>{i18n.t('app.name')}</strong></p>

<select onchange={(event) => i18n.setLocale(event.target.value)}>
    {#each i18n.locales as locale}
        <option value={locale} selected={locale === i18n.locale}>{locale}</option>
    {/each}
</select>
