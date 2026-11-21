<script lang="ts">
  import { siteConfig } from '../../../config/desktopConfig';
  import type { DesktopDictionary } from '../../../types/desktop';
  export let t: DesktopDictionary;
</script>

<div class="about-profile">
  <img class="about-avatar" src="/assets/desktop/avatar-comic.png" alt={t.about.avatarAlt} width="160" height="160" />
  <div class="about-identity">
    <h3>{siteConfig.name}</h3>
    <p>{t.about.summary}</p>
  </div>
</div>
<section class="about-details" aria-labelledby="about-details-heading">
  <h3 id="about-details-heading">{t.about.detailsTitle}</h3>
  <p>{t.about.body}</p>
  <ul>{#each t.about.interests as interest}<li>{interest}</li>{/each}</ul>
  <p class="about-note">{t.about.note}</p>
</section>
