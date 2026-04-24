<script setup lang="ts">
import type { MenuProduct, MenuProductDraft } from '~/types/menu'

definePageMeta({
  middleware: 'admin-auth'
})

const {
  categories,
  dashboardProducts,
  currentUser,
  stats,
  ensureLoaded,
  createCategory,
  updateCategory,
  deleteCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
  resetDemoData,
  getCategoryName
} = useMenuStore()

useSeoMeta({
  title: 'Dashboard | Harvest Table',
  description: 'Manage menu categories, products, images, and availability from one place.'
})

const categoryName = ref('')
const editingCategoryId = ref<string | null>(null)
const editingProductId = ref<string | null>(null)
const feedback = ref<{ type: 'success' | 'error', message: string } | null>(null)

onMounted(() => {
  ensureLoaded()
})

const editingProduct = computed<MenuProduct | null>(() => {
  return dashboardProducts.value.find(product => product.id === editingProductId.value) ?? null
})

const categoryUsage = computed<Record<string, number>>(() => {
  return dashboardProducts.value.reduce<Record<string, number>>((totals, product) => {
    totals[product.categoryId] = (totals[product.categoryId] ?? 0) + 1
    return totals
  }, {})
})

function showFeedback(type: 'success' | 'error', message: string) {
  feedback.value = { type, message }
}

function resetCategoryForm() {
  categoryName.value = ''
  editingCategoryId.value = null
}

function beginCategoryEdit(id: string, name: string) {
  editingCategoryId.value = id
  categoryName.value = name
}

function handleCategorySubmit() {
  try {
    if (editingCategoryId.value) {
      updateCategory(editingCategoryId.value, { name: categoryName.value })
      showFeedback('success', 'Category updated.')
    } else {
      createCategory({ name: categoryName.value })
      showFeedback('success', 'Category created.')
    }

    resetCategoryForm()
  } catch (error) {
    showFeedback('error', error instanceof Error ? error.message : 'Unable to save category.')
  }
}

function handleCategoryDelete(id: string) {
  if (!window.confirm('Delete this category? Any linked products must be moved or removed first.')) {
    return
  }

  try {
    deleteCategory(id)
    if (editingCategoryId.value === id) {
      resetCategoryForm()
    }
    showFeedback('success', 'Category deleted.')
  } catch (error) {
    showFeedback('error', error instanceof Error ? error.message : 'Unable to delete category.')
  }
}

function beginProductEdit(product: MenuProduct) {
  editingProductId.value = product.id
}

function cancelProductEdit() {
  editingProductId.value = null
}

function handleProductSubmit(draft: MenuProductDraft) {
  try {
    if (editingProductId.value) {
      updateProduct(editingProductId.value, draft)
      showFeedback('success', 'Product updated.')
    } else {
      createProduct(draft)
      showFeedback('success', 'Product created.')
    }

    editingProductId.value = null
  } catch (error) {
    showFeedback('error', error instanceof Error ? error.message : 'Unable to save product.')
  }
}

function handleProductDelete(productId: string) {
  if (!window.confirm('Delete this product permanently?')) {
    return
  }

  deleteProduct(productId)

  if (editingProductId.value === productId) {
    editingProductId.value = null
  }

  showFeedback('success', 'Product deleted.')
}

function handleAvailabilityToggle(productId: string) {
  toggleProductAvailability(productId)
  showFeedback('success', 'Availability updated.')
}

function handleResetDemoData() {
  if (!window.confirm('Reset the menu back to the seeded demo content?')) {
    return
  }

  resetDemoData()
  resetCategoryForm()
  editingProductId.value = null
  showFeedback('success', 'Demo data restored.')
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})
</script>

<template>
  <ClientOnly>
    <div class="space-y-8">
      <section class="panel dash-grid overflow-hidden px-6 py-8 sm:px-8">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-bold uppercase tracking-[0.32em] text-[color:var(--color-tangerine)]">
              Dashboard
            </p>
            <h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.95] tracking-[0.06em] sm:text-5xl">
              Menu control room
            </h1>
            <p class="mt-5 max-w-3xl text-base leading-7 text-black/70">
              Signed in as {{ currentUser?.email }}. Add new dishes, publish images, and switch availability without changing the customer URL.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="/menu"
              class="ghost-button"
            >
              View live menu
            </NuxtLink>
            <button
              type="button"
              class="ghost-button"
              @click="handleResetDemoData"
            >
              Reset demo data
            </button>
          </div>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <div class="rounded-[1.5rem] bg-white/92 p-5">
            <p class="text-xs font-bold uppercase tracking-[0.24em] text-black/45">
              Categories
            </p>
            <p class="font-display mt-3 text-5xl font-black text-[color:var(--color-tangerine)]">
              {{ stats.categories }}
            </p>
          </div>

          <div class="rounded-[1.5rem] bg-[var(--color-ink)] p-5 text-white">
            <p class="text-xs font-bold uppercase tracking-[0.24em] text-white/60">
              Total products
            </p>
            <p class="font-display mt-3 text-5xl font-black">
              {{ stats.totalProducts }}
            </p>
          </div>

          <div class="rounded-[1.5rem] bg-[color:var(--color-gold-soft)] p-5">
            <p class="text-xs font-bold uppercase tracking-[0.24em] text-black/45">
              Available now
            </p>
            <p class="font-display mt-3 text-5xl font-black text-[color:var(--color-ink)]">
              {{ stats.availableProducts }}
            </p>
          </div>
        </div>
      </section>

      <div
        v-if="feedback"
        class="rounded-[1.5rem] border px-5 py-4 text-sm font-medium"
        :class="feedback.type === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-700'"
      >
        {{ feedback.message }}
      </div>

      <div class="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
        <section class="space-y-8">
          <div class="panel px-6 py-6">
            <div class="mb-5 flex items-center justify-between gap-4">
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.24em] text-black/45">
                  Categories
                </p>
                <h2 class="font-display mt-2 text-2xl font-black uppercase tracking-[0.08em]">
                  Category manager
                </h2>
              </div>
            </div>

            <form
              class="space-y-4"
              @submit.prevent="handleCategorySubmit"
            >
              <div>
                <label
                  class="field-label"
                  for="category-name"
                >Category name</label>
                <input
                  id="category-name"
                  v-model="categoryName"
                  type="text"
                  class="field-input"
                  placeholder="Noodle bowls"
                  required
                >
              </div>

              <div class="flex flex-wrap gap-3">
                <button
                  type="submit"
                  class="primary-button"
                >
                  {{ editingCategoryId ? 'Update category' : 'Create category' }}
                </button>
                <button
                  v-if="editingCategoryId"
                  type="button"
                  class="ghost-button"
                  @click="resetCategoryForm"
                >
                  Cancel edit
                </button>
              </div>
            </form>

            <div class="mt-6 space-y-3">
              <article
                v-for="category in categories"
                :key="category.id"
                class="rounded-[1.5rem] border border-black/10 bg-white/85 p-4"
              >
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm font-semibold text-black">
                      {{ category.name }}
                    </p>
                    <p class="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-black/45">
                      {{ categoryUsage[category.id] ?? 0 }} linked item{{ (categoryUsage[category.id] ?? 0) === 1 ? '' : 's' }}
                    </p>
                  </div>

                  <div class="flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="ghost-button"
                      @click="beginCategoryEdit(category.id, category.name)"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="ghost-button"
                      @click="handleCategoryDelete(category.id)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section class="space-y-8">
          <div class="panel px-6 py-6">
            <div class="mb-5">
              <p class="text-xs font-bold uppercase tracking-[0.24em] text-black/45">
                Products
              </p>
              <h2 class="font-display mt-2 text-2xl font-black uppercase tracking-[0.08em]">
                Product studio
              </h2>
              <p class="mt-2 text-sm leading-6 text-black/65">
                Upload a dish image, assign a category, and control visibility with the availability switch.
              </p>
            </div>

            <ProductForm
              :categories="categories"
              :product="editingProduct"
              @submit="handleProductSubmit"
              @cancel="cancelProductEdit"
            />
          </div>

          <div class="panel px-6 py-6">
            <div class="mb-5">
              <p class="text-xs font-bold uppercase tracking-[0.24em] text-black/45">
                Inventory
              </p>
              <h2 class="font-display mt-2 text-2xl font-black uppercase tracking-[0.08em]">
                Product list
              </h2>
            </div>

            <div
              v-if="dashboardProducts.length"
              class="space-y-4"
            >
              <article
                v-for="product in dashboardProducts"
                :key="product.id"
                class="rounded-[1.5rem] border border-black/10 bg-white/85 p-4"
              >
                <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div class="flex gap-4">
                    <div
                      v-if="product.imageUrl"
                      class="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-black/10"
                    >
                      <img
                        :src="product.imageUrl"
                        :alt="product.name"
                        class="h-full w-full object-cover"
                      >
                    </div>

                    <div
                      v-else
                      class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-dashed border-black/15 bg-black/4"
                    >
                      <span class="font-display text-2xl font-black uppercase text-black/35">
                        {{ product.name.slice(0, 1) }}
                      </span>
                    </div>

                    <div class="space-y-2">
                      <div class="flex flex-wrap items-center gap-2">
                        <h3 class="text-lg font-semibold text-black">
                          {{ product.name }}
                        </h3>
                        <span
                          class="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]"
                          :class="product.isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-zinc-200 text-zinc-700'"
                        >
                          {{ product.isAvailable ? 'Available' : 'Hidden' }}
                        </span>
                      </div>

                      <p class="text-xs font-bold uppercase tracking-[0.18em] text-black/45">
                        {{ getCategoryName(product.categoryId) }} • {{ currencyFormatter.format(product.price) }}
                      </p>

                      <p class="max-w-2xl text-sm leading-6 text-black/70">
                        {{ product.description || 'No description yet.' }}
                      </p>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-2 xl:max-w-xs xl:justify-end">
                    <button
                      type="button"
                      class="ghost-button"
                      @click="handleAvailabilityToggle(product.id)"
                    >
                      {{ product.isAvailable ? 'Mark unavailable' : 'Publish again' }}
                    </button>
                    <button
                      type="button"
                      class="ghost-button"
                      @click="beginProductEdit(product)"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="ghost-button"
                      @click="handleProductDelete(product.id)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            </div>

            <div
              v-else
              class="rounded-[1.5rem] border border-dashed border-black/15 bg-black/4 px-6 py-10 text-center text-black/60"
            >
              No products yet. Create the first one above.
            </div>
          </div>
        </section>
      </div>
    </div>

    <template #fallback>
      <div class="panel px-6 py-10 text-center text-black/60">
        Loading dashboard...
      </div>
    </template>
  </ClientOnly>
</template>
