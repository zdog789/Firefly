<script lang="ts">
  import type { DesktopDictionary } from '../../../types/desktop';
  export let t: DesktopDictionary;
  let openIndex: number | null = 0;
</script>

<div class="faq-list">
  {#each t.faq.items as item, index}
    <div class="faq-item">
      <h3>
        <button
          type="button"
          aria-expanded={openIndex === index}
          aria-controls={`faq-answer-${index}`}
          id={`faq-question-${index}`}
          onclick={() => (openIndex = openIndex === index ? null : index)}
        >
          <span>{item.question}</span>
          <span class="faq-symbol" aria-hidden="true">{openIndex === index ? '−' : '+'}</span>
        </button>
      </h3>
      <div
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
        hidden={openIndex !== index}
      >
        <p>{item.answer}</p>
      </div>
    </div>
  {/each}
</div>
