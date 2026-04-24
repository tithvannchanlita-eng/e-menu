<script setup lang="ts">
const { adminCredentials, currentUser, login } = useMenuStore()

if (currentUser.value) {
  await navigateTo('/dashboard')
}

useSeoMeta({
  title: 'Admin Login | Harvest Table',
  description: 'Secure admin access for managing categories, products, images, and availability.'
})

const email = ref(adminCredentials.email)
const password = ref(adminCredentials.password)
const isSubmitting = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await login(email.value, password.value)
    await navigateTo('/dashboard')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to sign in.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
    <section class="panel dash-grid px-6 py-8 sm:px-8">
      <p class="text-sm font-bold uppercase tracking-[0.3em] text-[color:var(--color-tangerine)]">
        Admin access
      </p>
      <h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.95] tracking-[0.06em] sm:text-5xl">
        Keep the dining room updated in minutes.
      </h1>
      <p class="mt-5 max-w-2xl text-base leading-7 text-black/70">
        Sign in to manage categories, create products, upload dish images, and toggle availability without touching the customer-facing menu URL.
      </p>

      <div class="mt-8 grid gap-4 sm:grid-cols-3">
        <div class="rounded-[1.5rem] bg-white/90 p-5">
          <p class="text-xs font-bold uppercase tracking-[0.24em] text-black/45">
            Category CRUD
          </p>
          <p class="mt-3 text-sm leading-6 text-black/70">
            Add, rename, and safely remove sections.
          </p>
        </div>

        <div class="rounded-[1.5rem] bg-[var(--color-ink)] p-5 text-white">
          <p class="text-xs font-bold uppercase tracking-[0.24em] text-white/60">
            Product CRUD
          </p>
          <p class="mt-3 text-sm leading-6 text-white/75">
            Build dishes with description, price, image, and category.
          </p>
        </div>

        <div class="rounded-[1.5rem] bg-[color:var(--color-gold-soft)] p-5">
          <p class="text-xs font-bold uppercase tracking-[0.24em] text-black/45">
            Availability
          </p>
          <p class="mt-3 text-sm leading-6 text-black/70">
            Hide sold-out items without deleting them from your catalog.
          </p>
        </div>
      </div>
    </section>

    <section class="panel px-6 py-8 sm:px-8">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[0.24em] text-black/45">
          Local demo credentials
        </p>
        <h2 class="font-display mt-2 text-3xl font-black uppercase tracking-[0.08em]">
          Sign in
        </h2>
        <p class="mt-3 text-sm leading-6 text-black/65">
          This build uses a local demo account until you plug in Firebase Authentication.
        </p>
      </div>

      <div class="mb-6 rounded-[1.5rem] border border-black/10 bg-black/4 p-4 text-sm text-black/70">
        <p><span class="font-semibold text-black">Email:</span> {{ adminCredentials.email }}</p>
        <p class="mt-1">
          <span class="font-semibold text-black">Password:</span> {{ adminCredentials.password }}
        </p>
      </div>

      <form
        class="space-y-5"
        @submit.prevent="handleLogin"
      >
        <div>
          <label
            class="field-label"
            for="email"
          >Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="field-input"
            autocomplete="username"
            required
          >
        </div>

        <div>
          <label
            class="field-label"
            for="password"
          >Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="field-input"
            autocomplete="current-password"
            required
          >
        </div>

        <div
          v-if="errorMessage"
          class="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="primary-button w-full"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Signing in...' : 'Enter dashboard' }}
        </button>
      </form>
    </section>
  </div>
</template>
