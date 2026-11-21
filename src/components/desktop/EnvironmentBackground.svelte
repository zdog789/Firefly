<script lang="ts">
  import { desktopAssets } from '../../config/desktopConfig';
</script>

<div class="environment" aria-hidden="true">
  <svg class="meadow-filters" width="0" height="0" focusable="false">
    <defs>
      <!-- The blue channel distinguishes the original white paper from the grass tips. -->
      <filter id="meadow-day" color-interpolation-filters="sRGB">
        <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 -2.16 0 2.11" />
        <feComposite in2="SourceAlpha" operator="in" />
      </filter>
      <filter id="meadow-night" color-interpolation-filters="sRGB">
        <feColorMatrix values=".36 0 .14 0 -.135  .23 .25 .11 0 -.115  .21 .20 .30 0 -.178  0 0 -2.16 0 2.11" />
        <feComposite in2="SourceAlpha" operator="in" />
      </filter>
    </defs>
  </svg>
  <div class="scene day-scene">
    <img class="meadow day-meadow" src={desktopAssets.grass} alt="" width="3072" height="954" fetchpriority="high" />
  </div>
  <div class="scene night-scene">
    <img class="meadow night-meadow" src={desktopAssets.grass} alt="" width="3072" height="954" />
  </div>
</div>

<style>
  .meadow-filters {
    position: absolute;
  }

  .scene {
    position: absolute;
    inset: 0;
  }

  .day-scene {
    background:
      radial-gradient(ellipse at left top, #ffe2a8 0, rgb(255 237 199 / 72%) 18%, transparent 58%),
      linear-gradient(133deg, transparent 13%, rgb(255 244 215 / 76%) 27%, transparent 44%),
      linear-gradient(#fffcf4, #fff 64%, #fbfff2);
  }

  .night-scene {
    opacity: 0;
    background:
      radial-gradient(circle at 6% 17%, #e5efff 0 1px, transparent 2px),
      radial-gradient(circle at 11% 35%, #b5c9e5 0 0.6px, transparent 1.6px),
      radial-gradient(circle at 13% 10%, #a2c0e4 0 0.7px, transparent 1.7px),
      radial-gradient(circle at 14% 57%, #a7bfdc 0 0.7px, transparent 1.7px),
      radial-gradient(circle at 17% 26%, #e1ecff 0 1px, transparent 2px),
      radial-gradient(circle at 21% 6%, #95aed2 0 0.6px, transparent 1.6px),
      radial-gradient(circle at 26% 12%, #a3b9e1 0 0.8px, transparent 1.8px),
      radial-gradient(circle at 34% 8%, #e5efff 0 1px, transparent 2px),
      radial-gradient(circle at 45% 15%, #9fbde1 0 0.7px, transparent 1.7px),
      radial-gradient(circle at 51% 5%, #a7bfdc 0 0.6px, transparent 1.6px),
      radial-gradient(circle at 57% 12%, #d5e6ff 0 0.9px, transparent 2px),
      radial-gradient(circle at 64% 8%, #a3b9db 0 0.7px, transparent 1.7px),
      radial-gradient(circle at 74% 11%, #edf4ff 0 1.1px, transparent 2.4px),
      radial-gradient(circle at 79% 6%, #9ab4da 0 0.6px, transparent 1.6px),
      radial-gradient(circle at 83% 18%, #bdcfe9 0 0.7px, transparent 1.8px),
      radial-gradient(circle at 85% 31%, #a2bedf 0 0.6px, transparent 1.6px),
      radial-gradient(circle at 90% 13%, #d9e8ff 0 0.8px, transparent 2px),
      radial-gradient(circle at 91% 46%, #aec8e7 0 0.7px, transparent 1.7px),
      radial-gradient(circle at 92% 25%, #e5efff 0 1.1px, transparent 2.4px),
      radial-gradient(circle at 95% 36%, #aac1e0 0 0.7px, transparent 1.7px),
      radial-gradient(circle at 97% 54%, #cee2ff 0 0.9px, transparent 2px),
      radial-gradient(ellipse at 65% 77%, rgb(73 109 153 / 66%), transparent 65%),
      linear-gradient(180deg, #0b1225, #182b47 48%, #304c60 77%, #354e56);
  }

  .meadow {
    position: absolute;
    inset: auto 0 0;
    display: block;
    width: 100%;
    height: 34vh;
    height: 34dvh;
    min-height: 230px;
    object-fit: cover;
    object-position: center top;
  }

  .day-meadow { filter: url(#meadow-day); }
  .night-meadow { filter: url(#meadow-night); }

  :global(html[data-lights='off']) .night-scene { opacity: 1; }

  @media (max-width: 720px) {
    .meadow {
      height: 30vh;
      height: 30dvh;
    }
  }
</style>
