<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { content, type HomeContent } from '@/services/content'

const home = ref<HomeContent | null>(null)
const heroEl = ref<HTMLElement | null>(null)
const innerEl = ref<HTMLElement | null>(null)
const imageRatio = ref<number | null>(null)
const computedHeight = ref<number | null>(null)

const setHeroHeight = async () => {
  if (!home.value || !heroEl.value) return
  const width = heroEl.value.clientWidth

  // Load image once and cache the ratio
  if (!imageRatio.value) {
    try {
      const img = new Image()
      img.src = home.value.hero.backgroundImage
      await new Promise((resolve) => {
        img.onload = resolve
        img.onerror = resolve
      })
      if (img.naturalWidth && img.naturalHeight)
        imageRatio.value = img.naturalHeight / img.naturalWidth
      else imageRatio.value = null
    } catch {
      imageRatio.value = null
    }
  }

  // If ratio is unknown, keep a sensible minimum
  const scaledHeight = imageRatio.value ? Math.round(width * imageRatio.value) : 450
  await nextTick()
  const contentHeight = innerEl.value?.scrollHeight ?? 0
  // Ensure the hero section is at least tall enough for content
  computedHeight.value = Math.max(scaledHeight, contentHeight)
}

// Recompute on resize
let resizeTimer: number | undefined
const onResize = () => {
  clearTimeout(resizeTimer)
  // throttle the recalculation
  resizeTimer = globalThis.setTimeout(setHeroHeight, 120)
}

onMounted(async () => {
  home.value = await content.getHome()
  // Compute height when content arrives
  await nextTick()
  setHeroHeight()
  globalThis.addEventListener('resize', onResize)
})

onUnmounted(() => globalThis.removeEventListener('resize', onResize))
</script>

<template>
  <section
    id="home"
    class="hero"
    v-reveal
    ref="heroEl"
    :style="
      home
        ? {
            backgroundImage: `url(${home.hero.backgroundImage})`,
            height: computedHeight ? `${computedHeight}px` : undefined,
          }
        : {}
    "
  >
    <div class="overlay">
      <div class="container inner" ref="innerEl">
        <h1>{{ home?.hero.title }}</h1>
        <p class="subtitle">{{ home?.hero.subtitle }}</p>
        <a v-if="home" class="cta" :href="home.hero.cta.href">{{ home.hero.cta.label }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 200px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  padding-top: 0;
  overflow: hidden;
}
.overlay {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.25));
  /* Make the overlay cover the entire hero so the background image stays behind content */
  position: absolute;
  inset: 0;
}
.inner {
  display: grid;
  place-items: center;
  text-align: center;
  padding: 96px 0;
}
h1 {
  color: white;
  font-size: clamp(2rem, 5vw, 3.25rem);
  margin: 0 0 12px;
}
.subtitle {
  color: #f1f1f8;
  margin: 0 0 24px;
  font-size: 1.1rem;
}
.cta {
  display: inline-block;
  background: var(--color-primary);
  color: #1a1433;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
.cta:hover,
.cta:focus-visible {
  background: var(--color-primary-600);
  outline: none;
}
</style>
