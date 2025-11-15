type RevealOptions = {
  rootMargin?: string
  threshold?: number
  once?: boolean
}

const observerMap = new WeakMap<HTMLElement, IntersectionObserver>()

export default {
  mounted(el: HTMLElement, binding: { value?: RevealOptions }) {
    const opts = binding.value ?? {}
    const once = opts.once ?? true
    const threshold = opts.threshold ?? 0.15
    const rootMargin = opts.rootMargin ?? '0px 0px -10% 0px'

    const prefersReduced = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.classList.add('reveal')
    if (prefersReduced) {
      el.classList.add('reveal--shown')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('reveal--shown')
            if (once) observer.unobserve(el)
          }
        }
      },
      { root: null, threshold, rootMargin },
    )

    observer.observe(el)
    observerMap.set(el, observer)
  },
  unmounted(el: HTMLElement) {
    const obs = observerMap.get(el)
    obs?.unobserve(el)
    observerMap.delete(el)
  },
}
