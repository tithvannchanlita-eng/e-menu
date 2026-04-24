<script setup lang="ts">
import type { MenuProduct } from '~/types/menu'

const {
  availableProducts,
  categoriesWithProducts,
  ensureLoaded
} = useMenuStore()

const selectedCategoryId = ref<string>('all')
const activeProduct = ref<MenuProduct | null>(null)

useSeoMeta({
  title: 'Menu | Harvest Table',
  description: 'Browse the QR menu by category and view only currently available dishes.'
})

onMounted(() => {
  ensureLoaded()
})

const visibleCategories = computed(() => {
  if (selectedCategoryId.value === 'all') {
    return categoriesWithProducts.value
  }

  return categoriesWithProducts.value.filter(category => category.id === selectedCategoryId.value)
})

function openProduct(product: MenuProduct) {
  activeProduct.value = product
}

function closeProduct() {
  activeProduct.value = null
}

const activeCategoryName = computed(() => {
  if (!activeProduct.value) {
    return ''
  }

  return categoriesWithProducts.value.find(category => category.id === activeProduct.value?.categoryId)?.name ?? ''
})
</script>

<template>
  <div class="space-y-8">
    <section class="panel dash-grid overflow-hidden px-5 py-8 sm:px-8 lg:px-10">
      <div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p class="text-sm font-bold uppercase tracking-[0.32em] text-[color:var(--color-tangerine)]">
            Scan. Browse. Order with confidence.
          </p>
          <h1 class="font-display mt-4 max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-[0.06em] sm:text-5xl lg:text-6xl">
            Today’s menu, always synced to the table.
          </h1>
          <p class="mt-5 max-w-2xl text-base leading-7 text-black/70 sm:text-lg">
            Explore categories, tap into each dish for details, and only see items the kitchen has marked available right now.
          </p>

          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink
              to="/admin"
              class="primary-button"
            >
              Admin login
            </NuxtLink>
            <a
              href="#menu-categories"
              class="ghost-button"
            >
              Jump to categories
            </a>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div class="rounded-[1.75rem] bg-[var(--color-ink)] p-5 text-white">
            <p class="text-xs font-bold uppercase tracking-[0.26em] text-white/65">
              Available dishes
            </p>
            <p class="font-display mt-3 text-5xl font-black">
              {{ availableProducts.length }}
            </p>
          </div>

          <div class="rounded-[1.75rem] bg-white/90 p-5">
            <p class="text-xs font-bold uppercase tracking-[0.26em] text-black/45">
              Categories live
            </p>
            <p class="font-display mt-3 text-5xl font-black text-[color:var(--color-tangerine)]">
              {{ categoriesWithProducts.length }}
            </p>
          </div>

          <div class="rounded-[1.75rem] bg-[color:var(--color-sky-soft)] p-5">
            <p class="text-xs font-bold uppercase tracking-[0.26em] text-black/45">
              Menu mode
            </p>
            <p class="mt-3 text-lg font-semibold text-black/75">
              Public guest access, no sign-in needed.
            </p>
          </div>
        </div>
      </div>
    </section>

    <ClientOnly>
      <section
        id="menu-categories"
        class="space-y-8"
      >
        <div class="panel px-5 py-5 sm:px-6">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.28em] text-black/45">
                Category filters
              </p>
              <h2 class="font-display mt-2 text-2xl font-black uppercase tracking-[0.08em]">
                Browse by section
              </h2>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="ghost-button"
                :class="selectedCategoryId === 'all' ? 'bg-[var(--color-ink)] text-white' : ''"
                @click="selectedCategoryId = 'all'"
              >
                All
              </button>

              <button
                v-for="category in categoriesWithProducts"
                :key="category.id"
                type="button"
                class="ghost-button"
                :class="selectedCategoryId === category.id ? 'bg-[var(--color-ink)] text-white' : ''"
                @click="selectedCategoryId = category.id"
              >
                {{ category.name }}
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="visibleCategories.length"
          class="space-y-10"
        >
          <section
            v-for="category in visibleCategories"
            :id="category.id"
            :key="category.id"
            class="space-y-5"
          >
            <div class="flex items-end justify-between gap-4">
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.28em] text-black/45">
                  {{ category.products.length }} item{{ category.products.length === 1 ? '' : 's' }}
                </p>
                <h2 class="font-display mt-2 text-3xl font-black uppercase tracking-[0.08em]">
                  {{ category.name }}
                </h2>
              </div>

              <a
                href="#menu-categories"
                class="text-sm font-semibold text-[color:var(--color-tangerine)]"
              >
                Back to filters
              </a>
            </div>

            <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <ProductCard
                v-for="product in category.products"
                :key="product.id"
                :product="product"
                :category-name="category.name"
                @select="openProduct"
              />
            </div>
          </section>
        </div>

        <div
          v-else
          class="panel px-6 py-10 text-center"
        >
          <p class="text-sm font-bold uppercase tracking-[0.28em] text-black/45">
            No dishes available
          </p>
          <p class="mt-3 text-base text-black/70">
            The kitchen has not published any available products yet.
          </p>
        </div>
      </section>

      <template #fallback>
        <div class="panel px-6 py-10 text-center text-black/60">
          Loading menu...
        </div>
      </template>
    </ClientOnly>

    <ProductDetailModal
      :product="activeProduct"
      :category-name="activeCategoryName"
      @close="closeProduct"
    />
  </div>
</template>
