<script lang="ts">
  import { onMount } from 'svelte';
  import { getDictionary } from '../../i18n/desktop';
  import type { Language } from '../../types/desktop';
  import { readLanguagePreference } from '../../utils/preferences';

  export let pubDate: string;
  let language: Language = 'en';

  $: dictionary = getDictionary(language);
  $: formattedDate = new Intl.DateTimeFormat(dictionary.dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(pubDate));

  function syncLanguage(event: Event) {
    language = (event as CustomEvent<Language>).detail;
  }

  onMount(() => {
    language = readLanguagePreference();
    window.addEventListener('firefly:language', syncLanguage);
    return () => window.removeEventListener('firefly:language', syncLanguage);
  });
</script>

<p class="article-date">{dictionary.article.published} <time datetime={pubDate}>{formattedDate}</time></p>
