<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { content, type TimelineContent } from '@/services/content'

const data = ref<TimelineContent | null>(null)
onMounted(async () => {
  data.value = await content.getTimeline()
})
</script>

<template>
  <section id="timeline" v-reveal>
    <div class="container timeline">
      <h2 class="section-title">Εργογραφία</h2>
      <div class="timeline-grid" aria-hidden="false">
        <div class="timeline-column timeline-column--left">
          <article
            v-for="(item, idx) in data?.items.filter((_, i) => i % 2 === 0)"
            :key="`left-${idx}`"
            class="entry"
          >
            <img
              class="cover"
              :src="item.cover"
              :alt="item.title"
              loading="lazy"
              decoding="async"
            />
            <div class="meta">
              <h3>{{ item.title }}</h3>
              <span class="year">{{ item.year }}</span>
              <p class="blurb">{{ item.blurb }}</p>
              <p class="actions">{{ item.actions }}</p>
            </div>
          </article>
        </div>
        <div class="timeline-divider" aria-hidden="true"></div>
        <div class="timeline-column timeline-column--right">
          <article
            v-for="(item, idx) in data?.items.filter((_, i) => i % 2 === 1)"
            :key="`right-${idx}`"
            class="entry entry--right"
          >
            <img
              class="cover"
              :src="item.cover"
              :alt="item.title"
              loading="lazy"
              decoding="async"
            />
            <div class="meta">
              <h3>{{ item.title }}</h3>
              <span class="year">{{ item.year }}</span>
              <p class="blurb">{{ item.blurb }}</p>
              <p class="actions">{{ item.actions }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline {
  position: relative;
}
.timeline-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 32px;
  align-items: flex-start;
}
.timeline-divider {
  width: 2px;
  background: rgba(0, 0, 0, 0.1);
  align-self: stretch;
  min-height: 100%;
}
.timeline-column {
  display: flex;
  flex-direction: column;
}
.entry {
  display: grid;
  grid-template-columns: 220px auto;
  gap: 16px;
  padding: 24px 0;
  position: relative;
  margin-bottom: 160px;
  align-items: center;
}
.entry--right {
  grid-template-columns: auto 220px;
  margin-top: 160px;
  margin-bottom: 0px;
}
.entry--right .meta {
  order: 1;
  text-align: right;
}
.entry--right .cover {
  order: 2;
}
.cover {
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
.meta h3 {
  font-family: var(--font-serif);
  font-size: var(--font-size-2xl);
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 8px;
}
.meta .year {
  font-family: var(--font-sans);
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-primary-600);
  font-weight: 700;
}
.meta .blurb {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  line-height: 1.6;
  margin: 10px 0 0;
  color: var(--color-muted);
}
.meta .actions {
  font-family: var(--font-sans);
  font-size: var(--font-size-xl);
  line-height: 1.5;
  margin: 8px 0 0;
  color: var(--color-primary-600);
  font-weight: 600;
  font-style: italic;
}
@media (max-width: 900px) {
  .timeline-grid {
    grid-template-columns: 1fr;
  }
  .timeline-divider {
    display: none;
  }
  .timeline-column {
    border-left: 2px solid rgba(0, 0, 0, 0.1);
    padding-left: 16px;
  }
  .entry,
  .entry--right {
    grid-template-columns: 240px auto;
  }
  .entry--right .meta {
    text-align: left;
  }
}

.section-title {
  font-family: var(--font-serif);
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 16px;
  text-align: center;
}
</style>
