<script lang="ts">
  import { siteConfig } from '../../../config/desktopConfig';
  import type { DesktopDictionary } from '../../../types/desktop';
  export let t: DesktopDictionary;

  let status: 'copied' | 'failed' | '' = '';

  async function copyEmail() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(siteConfig.email);
      status = 'copied';
    } catch {
      const field = document.createElement('textarea');
      field.value = siteConfig.email;
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      status = copied ? 'copied' : 'failed';
    }
  }
</script>

<p class="window-intro">{t.contact.intro}</p>
<a class="email-address" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
<div class="contact-actions">
  <button class="paper-button primary" type="button" onclick={copyEmail}>{t.contact.copy}</button>
  <a class="paper-button" href={`mailto:${siteConfig.email}`}>{t.contact.email}</a>
</div>
<p class="copy-feedback" aria-live="polite">
  {status === 'copied' ? t.contact.copied : status === 'failed' ? t.contact.copyFailed : ''}
</p>
