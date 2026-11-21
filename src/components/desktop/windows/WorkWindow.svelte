<script lang="ts">
  import { desktopAssets, workSampleLabels } from '../../../config/desktopConfig';
  import type { ArticleSummary, DesktopDictionary } from '../../../types/desktop';

  export let t: DesktopDictionary;
  export let articles: ArticleSummary[];
  export let onHover: () => void;
  export let onActivate: () => void;

  function formatDate(value: string) {
    return new Intl.DateTimeFormat(t.dateLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(value));
  }

  function openArticle(event: MouseEvent, url: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const articleWindow = window.open(url, '_blank');
    if (articleWindow) {
      articleWindow.opener = null;
      event.preventDefault();
    }
  }

  function useDefaultCover(event: Event) {
    const image = event.currentTarget as HTMLImageElement;
    if (!image.src.endsWith(desktopAssets.defaultCover)) {
      image.src = desktopAssets.defaultCover;
    }
  }
</script>

<div class="work-sections">
  <div class="work-overview">
    <section class="work-section" aria-labelledby="work-tools">
      <h3 id="work-tools">{t.work.tools}</h3>
      <ul class="tool-labels">
        {#each workSampleLabels.tools as name}
          <li><button type="button" onpointerenter={onHover} onfocus={onHover} onclick={onActivate}>{name}</button></li>
        {/each}
      </ul>
    </section>
    <section class="work-section" aria-labelledby="work-development">
      <h3 id="work-development">{t.work.development}</h3>
      <ul class="tool-labels">
        {#each workSampleLabels.development as name}
          <li><button type="button" onpointerenter={onHover} onfocus={onHover} onclick={onActivate}>{name}</button></li>
        {/each}
      </ul>
    </section>
    <p class="work-preview-note">{t.work.previewNote}</p>
  </div>
  <section class="work-section work-articles" aria-labelledby="work-articles">
    <h3 id="work-articles">{t.work.articles}</h3>
    {#if articles.length === 0}
      <p class="empty-state">{t.work.articlesEmpty}</p>
    {:else}
      <div class="article-grid">
        {#each articles as article}
          <a
            class="article-card"
            href={article.url}
            target="_blank"
            rel="noopener"
            aria-label={`${t.work.openArticle}: ${article.title}`}
            onclick={(event) => openArticle(event, article.url)}
          >
            <div class="article-cover">
              <img
                src={article.image || desktopAssets.defaultCover}
                alt={t.work.coverAlt}
                loading="lazy"
                onerror={useDefaultCover}
              />
            </div>
            <div class="article-card-copy">
              <strong lang={article.lang}>{article.title}</strong>
              <time datetime={article.pubDate}>{formatDate(article.pubDate)}</time>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </section>
</div>
