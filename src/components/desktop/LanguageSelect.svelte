<script lang="ts">
  import { tick } from 'svelte';
  import { desktopAssets } from '../../config/desktopConfig';
  import type { Language } from '../../types/desktop';

  export let value: Language;
  export let label: string;
  export let onChange: (language: Language) => void;

  let open = false;
  let root: HTMLDivElement;
  let trigger: HTMLButtonElement;
  const options: Array<{ value: Language; label: string }> = [
    { value: 'en', label: 'English' },
    { value: 'zh-CN', label: '中文' },
  ];

  async function showMenu() {
    open = true;
    await tick();
    root.querySelector<HTMLButtonElement>(`[data-language="${value}"]`)?.focus();
  }

  function closeMenu(restoreFocus = false) {
    open = false;
    if (restoreFocus) trigger.focus();
  }

  function choose(language: Language) {
    onChange(language);
    closeMenu(true);
  }

  function outside(event: PointerEvent) {
    if (open && !root.contains(event.target as Node)) closeMenu();
  }

  function escape(event: KeyboardEvent) {
    if (!open || event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    closeMenu(true);
  }

  function navigate(event: KeyboardEvent) {
    if (event.key === 'Tab') { closeMenu(true); return; }
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'));
    const index = buttons.indexOf(event.target as HTMLButtonElement);
    const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (!step && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + step + buttons.length) % buttons.length;
    buttons[next]?.focus();
  }
</script>

<svelte:window onpointerdown={outside} onkeydown={escape} />

<div class="language-picker" bind:this={root}>
  <button bind:this={trigger} type="button" class="language-button"
    aria-label={label} title={label} aria-haspopup="menu" aria-expanded={open}
    aria-controls={open ? 'language-menu' : undefined}
    onclick={() => open ? closeMenu() : showMenu()}
    onkeydown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); showMenu(); } }}>
    <img src={desktopAssets.language} alt="" width="30" height="30" />
  </button>
  {#if open}
    <div id="language-menu" class="language-menu" role="menu" tabindex="-1" aria-label={label} onkeydown={navigate}>
      {#each options as option}
        <button type="button" role="menuitemradio" aria-checked={value === option.value}
          tabindex="-1" data-language={option.value} onclick={() => choose(option.value)}>
          <span>{option.label}</span><span class="language-check" aria-hidden="true">{value === option.value ? '✓' : ''}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>
