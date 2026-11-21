<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { desktopAssets, siteConfig, windowDefinitions } from '../../config/desktopConfig';
  import { getDictionary } from '../../i18n/desktop';
  import type { ArticleSummary, DesktopDictionary, Language, WindowId, WindowState } from '../../types/desktop';
  import {
    applyLanguage,
    applyLights,
    readLanguagePreference,
    readLightsPreference,
    readMutedPreference,
    savePreference,
    STORAGE_KEYS,
  } from '../../utils/preferences';
  import CorgiPlayer from './CorgiPlayer.svelte';
  import DesktopControls from './DesktopControls.svelte';
  import DesktopWindow from './DesktopWindow.svelte';
  import LanguageSelect from './LanguageSelect.svelte';
  import AboutWindow from './windows/AboutWindow.svelte';
  import ContactWindow from './windows/ContactWindow.svelte';
  import FaqWindow from './windows/FaqWindow.svelte';
  import LinksWindow from './windows/LinksWindow.svelte';
  import WorkWindow from './windows/WorkWindow.svelte';
  import EnvironmentBackground from './EnvironmentBackground.svelte';

  export let articles: ArticleSummary[] = [];

  let language: Language = 'en';
  let t: DesktopDictionary = getDictionary('en');
  let lightsOn = true;
  let isMuted = true;
  let isPlaying = false;
  let audioError = false;
  let windows: WindowState[] = [];
  let zCounter = 20;
  let backgroundAudio: HTMLAudioElement;
  let popAudio: HTMLAudioElement;
  let hoverAudio: HTMLAudioElement;
  let lastHoverSound = 0;

  $: t = getDictionary(language);
  $: if (backgroundAudio) backgroundAudio.muted = isMuted;
  $: if (popAudio) popAudio.muted = isMuted;
  $: if (hoverAudio) hoverAudio.muted = isMuted;

  onMount(() => {
    language = readLanguagePreference();
    lightsOn = readLightsPreference();
    isMuted = readMutedPreference();
    applyLanguage(language);
    applyLights(lightsOn);
  });

  function setLanguage(next: Language) {
    language = next;
    savePreference(STORAGE_KEYS.language, next);
    applyLanguage(next);
  }

  function toggleLights() {
    lightsOn = !lightsOn;
    savePreference(STORAGE_KEYS.lights, String(lightsOn));
    applyLights(lightsOn);
    playPop();
  }

  function toggleSound() {
    if (!backgroundAudio.paused) setMuted(true);
    void toggleMusic();
  }

  function setMuted(muted: boolean) {
    isMuted = muted;
    savePreference(STORAGE_KEYS.muted, String(muted));
    backgroundAudio.muted = muted;
  }

  function playPop() {
    if (isMuted || !popAudio) return;
    popAudio.currentTime = 0;
    popAudio.volume = 0.28;
    popAudio.play().catch(() => {
      // Interaction sounds are optional; a rejected effect never blocks the UI.
    });
  }

  function playHover() {
    if (isMuted || !hoverAudio) return;
    const now = performance.now();
    if (now - lastHoverSound < 90) return;
    lastHoverSound = now;
    hoverAudio.currentTime = 0;
    hoverAudio.volume = 0.12;
    hoverAudio.play().catch(() => {});
  }

  async function toggleMusic() {
    if (!backgroundAudio) return;
    audioError = false;

    if (!backgroundAudio.paused) {
      backgroundAudio.pause();
      return;
    }

    if (isMuted) setMuted(false);

    backgroundAudio.volume = 0.38;
    try {
      await backgroundAudio.play();
    } catch (error) {
      // Pausing while the track loads cancels play without a playback error.
      if (error instanceof DOMException && error.name === 'AbortError') return;
      handleAudioError();
    }
  }

  function handleAudioError() {
    isPlaying = false;
    audioError = true;
  }

  function normalizeWindowLayers() {
    windows = [...windows]
      .sort((a, b) => a.z - b.z)
      .map((item, index) => ({ ...item, z: 21 + index }));
    zCounter = 20 + windows.length;
  }

  function openWindow(id: WindowId) {
    playPop();
    const existing = windows.find((item) => item.id === id);
    if (existing) {
      focusWindow(id);
      return;
    }

    const definition = windowDefinitions.find((item) => item.id === id);
    if (!definition) return;
    if (zCounter >= 55) normalizeWindowLayers();

    const width = Math.min(definition.width, Math.max(320, window.innerWidth - 32));
    const height = Math.min(definition.height, Math.max(320, window.innerHeight - 132));
    const count = windows.length;
    const centeredX = (window.innerWidth - width) / 2;
    const x = Math.max(12, Math.min(window.innerWidth - width - 16, centeredX + 36 + count * 26));
    const centeredY = (window.innerHeight - height) / 2;
    const y = Math.max(82, Math.min(window.innerHeight - height - 16, centeredY + 42 + count * 22));
    zCounter += 1;
    windows = [...windows, { id, x, y, width, height, z: zCounter }];
  }

  function focusWindow(id: WindowId) {
    if (zCounter >= 55) normalizeWindowLayers();
    const highest = Math.max(...windows.map((item) => item.z));
    const current = windows.find((item) => item.id === id);
    if (current && current.z !== highest) {
      zCounter += 1;
      windows = windows.map((item) => (item.id === id ? { ...item, z: zCounter } : item));
    }
    tick().then(() => document.getElementById(`window-${id}`)?.focus({ preventScroll: true }));
  }

  function closeWindow(id: WindowId) {
    playPop();
    windows = windows.filter((item) => item.id !== id);
    tick().then(() => {
      const trigger = document.querySelector<HTMLElement>(`[data-window-trigger="${id}"]`);
      trigger?.focus({ preventScroll: true });
    });
  }

  function moveWindow(id: WindowId, x: number, y: number) {
    windows = windows.map((item) => (item.id === id ? { ...item, x, y } : item));
  }
</script>

<main class="desktop" class:has-open-windows={windows.length > 0} aria-label={siteConfig.title}>
  <EnvironmentBackground />

  <header class="desktop-topbar">
    <DesktopControls
      {t}
      {lightsOn}
      {isPlaying}
      onToggleLights={toggleLights}
      onToggleSound={toggleSound}
    />
    <LanguageSelect value={language} label={t.languageLabel} onChange={setLanguage} />
  </header>

  <section class="home-window" aria-labelledby="home-title">
    <header class="home-titlebar">
      <span id="home-title">{t.home}</span>
    </header>
    <div class="home-content">
      <div class="home-copy">
        <h1><span class="home-hello">{language === 'en' ? "Hello, I'm" : '你好，我是'}</span> <span class="home-name">{siteConfig.name}</span></h1>
        <p class="home-subtitle">{t.hero.subtitle}</p>
      </div>
      <nav class="desktop-icons" aria-label="Blog sections">
        {#each windowDefinitions as definition}
          <button
            type="button"
            class="desktop-icon"
            data-window-trigger={definition.id}
            data-testid={`open-${definition.id}`}
            aria-haspopup="dialog"
            aria-expanded={windows.some((item) => item.id === definition.id)}
            onclick={() => openWindow(definition.id)}
          >
            <img src={definition.icon} alt="" width="82" height="82" />
            <span>{t.nav[definition.id]}</span>
          </button>
        {/each}
      </nav>
    </div>
  </section>

  {#each windows as windowState (windowState.id)}
    <DesktopWindow
      state={windowState}
      {t}
      onClose={closeWindow}
      onFocus={focusWindow}
      onMove={moveWindow}
    >
      {#if windowState.id === 'about'}
        <AboutWindow {t} />
      {:else if windowState.id === 'links'}
        <LinksWindow {t} />
      {:else if windowState.id === 'work'}
        <WorkWindow {t} {articles} onHover={playHover} onActivate={playPop} />
      {:else if windowState.id === 'faq'}
        <FaqWindow {t} />
      {:else if windowState.id === 'contact'}
        <ContactWindow {t} />
      {/if}
    </DesktopWindow>
  {/each}

  <CorgiPlayer
    {t}
    {lightsOn}
    {isPlaying}
    {isMuted}
    {audioError}
    onToggle={toggleMusic}
  />


  <audio
    bind:this={backgroundAudio}
    src={desktopAssets.music}
    loop
    preload="none"
    onplaying={() => { isPlaying = true; audioError = false; }}
    onpause={() => { isPlaying = false; }}
    onerror={handleAudioError}
  ></audio>
  <audio bind:this={popAudio} src={desktopAssets.pop} preload="auto"></audio>
  <audio bind:this={hoverAudio} src={desktopAssets.pop} preload="auto"></audio>
</main>
