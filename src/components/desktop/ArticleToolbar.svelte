<script lang="ts">
  import { onMount } from 'svelte';
  import { desktopAssets } from '../../config/desktopConfig';
  import { getDictionary } from '../../i18n/desktop';
  import type { DesktopDictionary, Language } from '../../types/desktop';
  import {
    applyLanguage,
    applyLights,
    readLanguagePreference,
    readLightsPreference,
    savePreference,
    STORAGE_KEYS,
  } from '../../utils/preferences';
  import LanguageSelect from './LanguageSelect.svelte';

  export let title: string;

  let language: Language = 'en';
  let t: DesktopDictionary = getDictionary('en');
  let closeFailed = false;

  $: t = getDictionary(language);

  onMount(() => {
    language = readLanguagePreference();
    applyLanguage(language);
    applyLights(readLightsPreference());
  });

  function setLanguage(next: Language) {
    language = next;
    savePreference(STORAGE_KEYS.language, next);
    applyLanguage(next);
  }

  function closeTab() {
    closeFailed = false;
    window.close();
    window.setTimeout(() => {
      if (!window.closed) closeFailed = true;
    }, 180);
  }
</script>

<header class="article-titlebar">
  <a class="article-home" href="/" aria-label={t.article.backHome} title={t.article.backHome}>
    <img src={desktopAssets.home} alt="" width="27" height="27" />
  </a>
  <span class="article-window-title">{title}</span>
  <div class="article-actions">
    <LanguageSelect value={language} label={t.languageLabel} onChange={setLanguage} />
    <button
      class="article-close"
      type="button"
      aria-label={t.article.closeTab}
      title={t.article.closeTab}
      onclick={closeTab}
    >
      <img src={desktopAssets.close} alt="" width="26" height="26" />
    </button>
  </div>
</header>
{#if closeFailed}
  <p class="close-tab-notice" role="alert">{t.article.closeFailed}</p>
{/if}
