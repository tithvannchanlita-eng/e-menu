<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const year = new Date().getFullYear()
const route = useRoute()
const { currentUser, logout } = useMenuStore()

const title = 'Harvest Table E-Menu'
const description = 'A mobile-first QR menu with an admin dashboard for categories, products, image uploads, and availability management.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '/favicon.ico',
  twitterCard: 'summary_large_image'
})

async function handleLogout() {
  logout()
  await navigateTo('/admin')
}

function linkClasses(path: string) {
  const isActive = route.path === path || route.path.startsWith(`${path}/`)

  return [
    'rounded-full px-4 py-2 text-sm font-semibold transition',
    isActive
      ? 'bg-[var(--color-ink)] text-white'
      : 'text-[color:var(--color-ink)] hover:bg-white/70'
  ]
}
</script>

<template>
  <UApp>
    <div class="page-shell min-h-screen">
      <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div class="absolute left-[-8rem] top-[-10rem] h-64 w-64 rounded-full bg-[color:var(--color-tangerine-soft)] blur-3xl" />
        <div class="absolute right-[-5rem] top-24 h-72 w-72 rounded-full bg-[color:var(--color-sky-soft)] blur-3xl" />
        <div class="absolute bottom-[-10rem] left-1/3 h-80 w-80 rounded-full bg-[color:var(--color-gold-soft)] blur-3xl" />
      </div>

      <header class="sticky top-0 z-40 border-b border-black/10 bg-[color:var(--color-cream)]/85 backdrop-blur-xl">
        <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center justify-between gap-4">
            <NuxtLink
              to="/menu"
              class="flex items-center gap-3"
            >
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-ink)] text-sm font-black uppercase tracking-[0.28em] text-white">
                HT
              </div>

              <div>
                <p class="font-display text-lg font-black uppercase tracking-[0.18em] text-[color:var(--color-ink)]">
                  Harvest Table
                </p>
                <p class="text-xs uppercase tracking-[0.22em] text-black/55">
                  QR Menu + Admin Studio
                </p>
              </div>
            </NuxtLink>

            <div
              v-if="currentUser"
              class="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-black/65 lg:hidden"
            >
              {{ currentUser.email }}
            </div>
          </div>

          <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
            <nav class="flex flex-wrap items-center gap-2">
              <NuxtLink
                :class="linkClasses('/menu')"
                to="/menu"
              >
                Menu
              </NuxtLink>
              <NuxtLink
                :class="linkClasses('/admin')"
                to="/admin"
              >
                Admin
              </NuxtLink>
              <NuxtLink
                :class="linkClasses('/dashboard')"
                to="/dashboard"
              >
                Dashboard
              </NuxtLink>
            </nav>

            <div class="flex items-center gap-2 lg:justify-end">
              <div
                v-if="currentUser"
                class="hidden rounded-full border border-black/10 bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/65 sm:block"
              >
                {{ currentUser.email }}
              </div>

              <button
                v-if="currentUser"
                type="button"
                class="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
                @click="handleLogout"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <NuxtPage />
      </main>

      <footer class="mx-auto max-w-7xl px-4 pb-10 pt-2 sm:px-6">
        <div class="panel flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="font-display text-lg font-black uppercase tracking-[0.18em] text-[color:var(--color-ink)]">
              Harvest Table
            </p>
            <p class="text-sm text-black/65">
              Built for QR browsing on the customer side and fast menu editing on the admin side.
            </p>
          </div>

          <p class="text-sm text-black/60">
            Local MVP ready for Firebase handoff • © {{ year }}
          </p>
        </div>
      </footer>
    </div>
  </UApp>
</template>
