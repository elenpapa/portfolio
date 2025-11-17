<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperType } from 'swiper/types'
import { A11y } from 'swiper/modules'
import { content, type PostsContent } from '@/services/content'
import 'swiper/css'

const data = ref<PostsContent | null>(null)
const heading = computed(() => data.value?.heading ?? 'Featured Posts')
const description = computed(() => data.value?.description ?? '')
const canScrollPrev = ref(false)
const canScrollNext = ref(false)
const swiperInstance = ref<SwiperType>()
const swiperModules = [A11y]

const updateButtons = (swiper?: SwiperType | null) => {
  if (!swiper) {
    canScrollPrev.value = false
    canScrollNext.value = false
    return
  }

  const locked = swiper.isLocked
  canScrollPrev.value = !locked && !swiper.isBeginning
  canScrollNext.value = !locked && !swiper.isEnd
}

const onSwiperReady = (swiper: SwiperType) => {
  swiperInstance.value = swiper
  updateButtons(swiper)
}

const handleStateChange = (swiper: SwiperType) => {
  updateButtons(swiper)
}

onMounted(async () => {
  data.value = await content.getPosts()
})

watch(
  () => data.value?.items?.length,
  async () => {
    await nextTick()
    swiperInstance.value?.update()
    updateButtons(swiperInstance.value)
  },
)

const scrollPrev = () => {
  swiperInstance.value?.slidePrev()
}

const scrollNext = () => {
  swiperInstance.value?.slideNext()
}

const getImagePriority = (idx: number): 'high' | 'low' => {
  // Prioritize first 3 images (visible on desktop)
  return idx < 3 ? 'high' : 'low'
}

const getImageLoading = (idx: number): 'eager' | 'lazy' => {
  // Eagerly load first 3 images, lazy load the rest
  return idx < 3 ? 'eager' : 'lazy'
}
</script>

<template>
  <section
    id="posts"
    v-reveal
    aria-labelledby="posts-title"
    class="posts-section diagonal--both-ltr-rtl"
  >
    <div class="container">
      <header class="posts-header" v-reveal>
        <h2 id="posts-title">{{ heading }}</h2>
        <p v-if="description">{{ description }}</p>
      </header>

      <div v-if="!data" class="loading-skeleton">
        <div class="skeleton-slide" v-for="n in 3" :key="n">
          <div class="skeleton-image"></div>
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
        </div>
      </div>

      <div v-else class="carousel-wrapper">
        <button
          class="nav nav-prev"
          @click="scrollPrev"
          :disabled="!canScrollPrev"
          aria-label="Previous posts"
          title="Previous posts"
        >
          <SvgIcon name="chevron-left" class="icon" :width="20" :height="20" ariaHidden />
          <span class="sr-only">Previous</span>
        </button>

        <Swiper
          class="carousel"
          :modules="swiperModules"
          :slides-per-view="1"
          :space-between="16"
          :loop="false"
          :watch-overflow="true"
          :breakpoints="{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }"
          @swiper="onSwiperReady"
          @slideChange="handleStateChange"
          @resize="handleStateChange"
          @breakpoint="handleStateChange"
          @toEdge="handleStateChange"
          @fromEdge="handleStateChange"
        >
          <SwiperSlide
            v-for="(post, idx) in data?.items || []"
            :key="idx"
            class="carousel__slide"
            :aria-label="`Read post ${idx + 1} of ${data?.items?.length || 0}: ${post.title}`"
          >
            <RouterLink :to="`/posts/${idx}`" class="slide-link">
              <div class="image-wrapper">
                <img
                  :src="post.image"
                  :alt="post.title"
                  :loading="getImageLoading(idx)"
                  :fetchpriority="getImagePriority(idx)"
                  decoding="async"
                  width="400"
                  height="220"
                />
              </div>
              <h3>
                {{ post.title }}
              </h3>
              <p v-if="post.summary" class="summary">{{ post.summary }}</p>
            </RouterLink>
          </SwiperSlide>
        </Swiper>

        <button
          class="nav nav-next"
          @click="scrollNext"
          :disabled="!canScrollNext"
          aria-label="Next posts"
          title="Next posts"
        >
          <SvgIcon name="chevron-right" class="icon" :width="20" :height="20" ariaHidden />
          <span class="sr-only">Next</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.posts-section {
  background: var(--color-bg);
  padding: 150px 0 150px 0;
}

.posts-header {
  max-width: 720px;
  margin: 0 auto 40px;
  text-align: center;
}

.posts-header h2 {
  font-size: clamp(2rem, 2.5vw, 2.5rem);
  margin-bottom: 12px;
}

.posts-header p {
  margin: 0;
  color: var(--color-muted);
}

/* Loading skeleton */
.loading-skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  padding: 0 60px;
}

.skeleton-slide {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 12px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-image {
  width: 100%;
  height: 220px;
  background: color-mix(in srgb, var(--color-bg-alt, #f5f5f5) 90%, transparent);
  border-radius: var(--radius-md);
  margin-bottom: 12px;
}

.skeleton-title {
  height: 24px;
  background: color-mix(in srgb, var(--color-bg-alt, #f5f5f5) 90%, transparent);
  border-radius: 4px;
  margin: 12px 6px 8px;
  width: 80%;
}

.skeleton-text {
  height: 16px;
  background: color-mix(in srgb, var(--color-bg-alt, #f5f5f5) 90%, transparent);
  border-radius: 4px;
  margin: 6px 6px 0;
  width: 95%;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.carousel-wrapper {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
}

.carousel {
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius-lg);
}

:deep(.carousel .swiper-wrapper) {
  align-items: stretch;
}

.carousel__slide {
  height: auto;
}

.slide-link {
  display: block;
  padding: 12px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--color-bg-alt, #f5f5f5);
}

.slide-link img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  box-shadow: var(--shadow-sm);
}

.slide-link h3 {
  font-family: var(--font-serif);
  font-size: var(--font-size-3xl);
  font-weight: 600;
  line-height: 1.4;
  margin: 12px 6px 0;
  transition: color 0.2s ease;
}

.slide-link:hover,
.slide-link:focus-visible {
  outline: 2px solid var(--color-primary-600);
  outline-offset: 2px;
}

.slide-link:hover h3,
.slide-link:focus-visible h3 {
  color: var(--color-primary-600);
}

.summary {
  font-size: var(--font-size-lg, 0.9rem);
  line-height: 1.45;
  margin: 6px 6px 0;
  color: var(--color-text-secondary, #555);
}

.nav {
  background: linear-gradient(
    180deg,
    var(--color-primary-600),
    color-mix(in srgb, var(--color-primary-600) 85%, black 5%)
  );
  color: var(--color-on-primary, #fff);
  font-family: var(--font-sans);
  border: none;
  border-radius: 999px;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    opacity 160ms ease;
  box-shadow: 0 6px 14px rgba(20, 24, 40, 0.06);
}

.nav .icon {
  display: block;
  width: 20px;
  height: 20px;
  line-height: 0;
}

.nav:hover:not(:disabled),
.nav:focus-visible:not(:disabled) {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 10px 22px rgba(16, 24, 40, 0.12);
  outline: none;
}

.nav:focus-visible {
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary-600) 16%, transparent);
}

.nav:disabled {
  opacity: 0.36;
  cursor: not-allowed;
  pointer-events: none;
  box-shadow: none;
}

.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

@media (max-width: 600px) {
  .loading-skeleton {
    padding: 0;
    grid-template-columns: 1fr;
  }

  .image-wrapper,
  .skeleton-image {
    height: 160px;
  }

  .nav {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-slide {
    animation: none;
  }

  .nav,
  .slide-link h3 {
    transition: none;
  }
}
</style>
