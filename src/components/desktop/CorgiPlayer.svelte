<script lang="ts">
  import { onMount } from 'svelte';
  import { desktopAssets } from '../../config/desktopConfig';
  import type { DesktopDictionary } from '../../types/desktop';

  export let t: DesktopDictionary;
  export let lightsOn: boolean;
  export let isPlaying: boolean;
  export let isMuted: boolean;
  export let audioError: boolean;
  export let onToggle: () => void;

  let hovering = false;
  let keyboardFocus = false;
  let art: HTMLSpanElement;
  let allowMotion = false;
  let animation: Animation | undefined;
  let previousLightsOn = true;
  let wasListening = false;

  // Atlas rows are day greeting, day listening, night greeting, and night listening.
  const poseSequence = [0, 1, 2, 3, 2, 4, 0];

  $: listening = isPlaying && !isMuted;
  $: greeting = !listening && (hovering || keyboardFocus);
  $: if (art) updatePose(art, lightsOn, allowMotion, listening, greeting);

  onMount(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const updateMotion = () => { allowMotion = preference.matches; };
    updateMotion();
    preference.addEventListener('change', updateMotion);
    return () => {
      preference.removeEventListener('change', updateMotion);
      animation?.cancel();
    };
  });

  function playFrames(element: HTMLSpanElement, row: number, frames: number[], hold: number, loop = false) {
    // The final keyframe marks the end of the last cell's hold.
    const keyframes = [...frames, frames[frames.length - 1]].map((cell) => ({
      backgroundPosition: `${cell * 25}% ${row * 100 / 3}%`,
      easing: 'steps(1, end)',
    }));
    return element.animate(keyframes, { duration: frames.length * hold, iterations: loop ? Infinity : 1 });
  }

  function updatePose(element: HTMLSpanElement, day: boolean, motion: boolean, music: boolean, greet: boolean) {
    const themeChanged = day !== previousLightsOn;
    const musicStopped = wasListening && !music;
    previousLightsOn = day;
    wasListening = music;
    // Let a greeting finish when the pointer leaves. A theme or music change takes effect immediately.
    if (motion && !themeChanged && !music && !greet && animation?.id === 'greeting') return;

    animation?.cancel();
    animation = undefined;
    if (!motion) return;

    if (music && day) {
      animation = playFrames(element, 1, poseSequence, 135, true);
    } else if (music) {
      if (themeChanged) {
        animation = playFrames(element, 3, poseSequence, 160, true);
      } else {
        const wake = playFrames(element, 2, [0, 1, 2], 85);
        animation = wake;
        wake.onfinish = () => {
          if (animation === wake) animation = playFrames(element, 3, poseSequence, 160, true);
        };
      }
    } else if (greet && !themeChanged && !musicStopped) {
      animation = playFrames(element, day ? 0 : 2, poseSequence, day ? 105 : 125);
      animation.id = 'greeting';
    }
  }
</script>

<div class="corgi-player">
  {#if listening}
    <img class="music-note note-one" src="/assets/desktop/music-note.svg" alt="" width="30" height="30" />
    <img class="music-note note-two" src="/assets/desktop/music-note.svg" alt="" width="24" height="24" />
  {/if}
  <button
    type="button"
    class="corgi-button"
    aria-label={isPlaying ? t.musicPause : t.musicPlay}
    title={isPlaying ? t.musicPause : t.musicPlay}
    onpointerenter={(event) => { hovering = event.pointerType !== 'touch'; }}
    onpointerleave={() => { hovering = false; }}
    onfocus={(event) => { keyboardFocus = event.currentTarget.matches(':focus-visible'); }}
    onblur={() => { keyboardFocus = false; }}
    onclick={onToggle}
    data-testid="corgi-toggle"
  >
    <span
      bind:this={art}
      class="corgi-art"
      aria-hidden="true"
      style:background-image={`url(${desktopAssets.corgi})`}
    ></span>
  </button>
  <span class="sr-only" aria-live="polite">{audioError ? t.musicError : isPlaying ? t.musicPlaying : t.musicPaused}</span>
</div>

<style>
  .corgi-art {
    background-position: 0% 0%;
    filter: brightness(1.035) saturate(.96);
  }

  :global(html[data-lights='off']) .corgi-art {
    background-position: 0% calc(200% / 3);
    filter: brightness(.71) saturate(.72) contrast(.96);
  }

  :global(html[data-lights='off']) .music-note {
    filter: brightness(.88) saturate(.66);
  }
</style>
