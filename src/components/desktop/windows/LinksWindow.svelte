<script lang="ts">
  import { siteConfig } from '../../../config/desktopConfig';
  import type { DesktopDictionary } from '../../../types/desktop';
  export let t: DesktopDictionary;
</script>

<div class="account-links">
  <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" class="account-link">
    <img src="/assets/desktop/github.svg" alt="" width="64" height="64" />
    <span>GitHub</span><span class="sr-only"> — {t.links.github}</span>
    <span class="link-arrow" aria-hidden="true">↗</span>
  </a>
  <a href={siteConfig.bilibili} target="_blank" rel="noopener noreferrer" class="account-link">
    <img src="/assets/desktop/bilibili.svg" alt="" width="64" height="64" />
    <span>Bilibili</span><span class="sr-only"> — {t.links.bilibili}</span>
    <span class="link-arrow" aria-hidden="true">↗</span>
  </a>
</div>
