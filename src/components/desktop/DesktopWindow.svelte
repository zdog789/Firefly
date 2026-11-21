<script lang="ts">
  import { onMount } from 'svelte';
  import { scale } from 'svelte/transition';
  import { desktopAssets } from '../../config/desktopConfig';
  import type { DesktopDictionary, WindowId, WindowState } from '../../types/desktop';

  export let state: WindowState;
  export let t: DesktopDictionary;
  export let onClose: (id: WindowId) => void;
  export let onFocus: (id: WindowId) => void;
  export let onMove: (id: WindowId, x: number, y: number) => void;

  let root: HTMLElement;
  let reducedMotion = false;
  let drag: { pointerId: number; startX: number; startY: number; originX: number; originY: number } | null = null;

  function clampPosition(x: number, y: number) {
    const maxX = Math.max(8, window.innerWidth - 108);
    const maxY = Math.max(82, window.innerHeight - 56);
    return {
      x: Math.min(Math.max(8, x), maxX),
      y: Math.min(Math.max(76, y), maxY),
    };
  }

  function startDrag(event: PointerEvent) {
    if (window.matchMedia('(max-width: 720px)').matches) return;
    if ((event.target as HTMLElement).closest('button, a, input, select')) return;
    onFocus(state.id);
    const titlebar = event.currentTarget as HTMLElement;
    titlebar.setPointerCapture(event.pointerId);
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: state.x,
      originY: state.y,
    };
  }

  function moveDrag(event: PointerEvent) {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const next = clampPosition(
      drag.originX + event.clientX - drag.startX,
      drag.originY + event.clientY - drag.startY,
    );
    onMove(state.id, next.x, next.y);
  }

  function stopDrag(event: PointerEvent) {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const titlebar = event.currentTarget as HTMLElement;
    if (titlebar.hasPointerCapture(event.pointerId)) titlebar.releasePointerCapture(event.pointerId);
    drag = null;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;
    if ((event.target as HTMLElement).closest('select')) return;
    event.preventDefault();
    event.stopPropagation();
    onClose(state.id);
  }

  function constrainToViewport() {
    if (!root) return;
    const next = clampPosition(state.x, state.y);
    if (next.x !== state.x || next.y !== state.y) onMove(state.id, next.x, next.y);
  }

  onMount(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.focus({ preventScroll: true });
    constrainToViewport();
  });
</script>

<svelte:window onresize={constrainToViewport} />

<div
  bind:this={root}
  id={`window-${state.id}`}
  class="desktop-window"
  class:is-dragging={drag !== null}
  role="dialog"
  aria-labelledby={`window-title-${state.id}`}
  tabindex="-1"
  style:left={`${state.x}px`}
  style:top={`${state.y}px`}
  style:width={`${state.width}px`}
  style:height={`${state.height}px`}
  style:z-index={state.z}
  onpointerdown={() => onFocus(state.id)}
  onkeydown={handleKeydown}
  in:scale={{ duration: reducedMotion ? 0 : 160, start: 0.95, opacity: 0 }}
  out:scale={{ duration: reducedMotion ? 0 : 110, start: 0.96, opacity: 0 }}
>
  <header
    class="window-titlebar"
    role="presentation"
    onpointerdown={startDrag}
    onpointermove={moveDrag}
    onpointerup={stopDrag}
    onpointercancel={stopDrag}
  >
    <h2 id={`window-title-${state.id}`}>{t.windows[state.id]}</h2>
    <button
      type="button"
      class="window-close"
      aria-label={`${t.closeWindow}: ${t.windows[state.id]}`}
      title={t.close}
      onclick={() => onClose(state.id)}
    >
      <img src={desktopAssets.close} alt="" width="24" height="24" />
    </button>
  </header>
  <div class="window-body">
    <slot />
  </div>
</div>
