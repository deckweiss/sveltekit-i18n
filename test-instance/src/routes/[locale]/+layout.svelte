<script lang="ts">
    import { setI18nContext } from '@deckweiss/internationalization';

    let { data, children } = $props();

    setI18nContext(data.locale);
</script>

{@render children()}
