<script lang="ts">
  import { desktopAssets } from '../../config/desktopConfig';
  import type { DesktopDictionary } from '../../types/desktop';

  export let t: DesktopDictionary;
  export let lightsOn: boolean;
  export let isPlaying: boolean;
  export let onToggleLights: () => void;
  export let onToggleSound: () => void;
</script>

<div class="desktop-controls" aria-label="Desktop controls">
  <button
    class="control-button"
    type="button"
    aria-label={lightsOn ? t.lightsOn : t.lightsOff}
    title={lightsOn ? t.lightsOn : t.lightsOff}
    onclick={onToggleLights}
    data-testid="lights-toggle"
  >
    <img src={lightsOn ? desktopAssets.lightOn : desktopAssets.lightOff} alt="" width="28" height="28" />
  </button>
  <button
    class="control-button"
    type="button"
    aria-label={isPlaying ? t.soundOn : t.soundOff}
    title={isPlaying ? t.soundOn : t.soundOff}
    onclick={onToggleSound}
    data-testid="sound-toggle"
  >
    <img src={isPlaying ? desktopAssets.soundOn : desktopAssets.soundOff} alt="" width="28" height="28" />
  </button>
</div>
