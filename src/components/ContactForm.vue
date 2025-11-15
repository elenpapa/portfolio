<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { content, type ContactContent } from '@/services/content'

const data = ref<ContactContent | null>(null)
const name = ref('')
const email = ref('')
const message = ref('')
const touched = ref({ name: false, email: false, message: false })

onMounted(async () => {
  data.value = await content.getContact()
})

function validEmail(v: string) {
  return /.+@.+\..+/.test(v)
}
const isValid = () => name.value.trim() && validEmail(email.value) && message.value.trim()
</script>

<template>
  <section id="contact" v-reveal>
    <div class="container">
      <h2>{{ data?.title }}</h2>
      <p class="desc">{{ data?.description }}</p>
      <form class="form" :action="data?.mailto" method="get" @submit.prevent>
        <label>
          <span>{{ data?.fields.name.label }}</span>
          <input
            type="text"
            v-model="name"
            :placeholder="data?.fields.name.placeholder"
            @blur="touched.name = true"
            required
          />
        </label>
        <label>
          <span>{{ data?.fields.email.label }}</span>
          <input
            type="email"
            v-model="email"
            :placeholder="data?.fields.email.placeholder"
            @blur="touched.email = true"
            required
          />
        </label>
        <label class="full">
          <span>{{ data?.fields.message.label }}</span>
          <textarea
            v-model="message"
            :placeholder="data?.fields.message.placeholder"
            rows="5"
            @blur="touched.message = true"
            required
          />
        </label>
        <div class="actions">
          <button class="submit" type="submit" :disabled="!isValid()">
            {{ data?.submit.label }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
h2 {
  margin: 0 0 8px;
}
.desc {
  margin: 0 0 24px;
  color: var(--color-muted);
}
.form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
label {
  display: grid;
  gap: 8px;
}
label span {
  font-weight: 600;
}
input,
textarea {
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  color: inherit;
}
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--color-primary-600);
  border-color: transparent;
}
.full {
  grid-column: 1 / -1;
}
.actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
}
.submit {
  background: var(--color-primary);
  color: #1a1433;
  border: none;
  padding: 10px 16px;
  border-radius: var(--radius-md);
}
.submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.submit:not(:disabled):hover,
.submit:focus-visible {
  background: var(--color-primary-600);
  outline: none;
}
@media (max-width: 700px) {
  .form {
    grid-template-columns: 1fr;
  }
}
</style>
