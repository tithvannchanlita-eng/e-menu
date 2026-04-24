<script setup lang="ts">
import type { MenuCategory, MenuProduct, MenuProductDraft } from '~/types/menu'

const props = defineProps<{
  categories: MenuCategory[]
  product?: MenuProduct | null
}>()

const emit = defineEmits<{
  submit: [draft: MenuProductDraft]
  cancel: []
}>()

const form = reactive<MenuProductDraft>({
  name: '',
  price: 0,
  categoryId: '',
  imageUrl: '',
  description: '',
  isAvailable: true
})

const isEditing = computed(() => Boolean(props.product))

function syncForm() {
  form.name = props.product?.name ?? ''
  form.price = props.product?.price ?? 0
  form.categoryId = props.product?.categoryId ?? props.categories[0]?.id ?? ''
  form.imageUrl = props.product?.imageUrl ?? ''
  form.description = props.product?.description ?? ''
  form.isAvailable = props.product?.isAvailable ?? true
}

watch(
  () => [props.product?.id, props.categories.map(category => category.id).join(',')],
  () => {
    syncForm()
  },
  { immediate: true }
)

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Failed to read the selected image.'))
    reader.readAsDataURL(file)
  })
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  form.imageUrl = await fileToDataUrl(file)
}

function clearImage() {
  form.imageUrl = ''
}

function handleSubmit() {
  emit('submit', {
    ...form,
    price: Number(form.price)
  })
}
</script>

<template>
  <form
    class="space-y-5"
    @submit.prevent="handleSubmit"
  >
    <div class="grid gap-5 md:grid-cols-2">
      <div>
        <label
          class="field-label"
          for="product-name"
        >Product name</label>
        <input
          id="product-name"
          v-model="form.name"
          type="text"
          class="field-input"
          placeholder="Smoked rice bowl"
          required
        >
      </div>

      <div>
        <label
          class="field-label"
          for="product-price"
        >Price</label>
        <input
          id="product-price"
          v-model.number="form.price"
          type="number"
          min="0.01"
          step="0.01"
          class="field-input"
          placeholder="8.50"
          required
        >
      </div>
    </div>

    <div class="grid gap-5 md:grid-cols-2">
      <div>
        <label
          class="field-label"
          for="product-category"
        >Category</label>
        <select
          id="product-category"
          v-model="form.categoryId"
          class="field-select"
          :disabled="categories.length === 0"
          required
        >
          <option
            disabled
            value=""
          >
            {{ categories.length === 0 ? 'Create a category first' : 'Select category' }}
          </option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div>
        <label
          class="field-label"
          for="product-image"
        >Product image</label>
        <input
          id="product-image"
          type="file"
          accept="image/*"
          class="field-input file:mr-4 file:rounded-full file:border-0 file:bg-[var(--color-ink)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          @change="handleFileChange"
        >
      </div>
    </div>

    <div
      v-if="form.imageUrl"
      class="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white/80"
    >
      <img
        :src="form.imageUrl"
        alt="Product preview"
        class="h-56 w-full object-cover"
      >
      <div class="flex justify-end p-3">
        <button
          type="button"
          class="ghost-button"
          @click="clearImage"
        >
          Remove image
        </button>
      </div>
    </div>

    <div>
      <label
        class="field-label"
        for="product-description"
      >Description</label>
      <textarea
        id="product-description"
        v-model="form.description"
        class="field-textarea"
        placeholder="Add a short dish story, ingredients, or serving notes."
      />
    </div>

    <label class="flex items-center justify-between gap-4 rounded-[1.5rem] border border-black/10 bg-white/80 px-4 py-4">
      <div>
        <p class="text-sm font-bold uppercase tracking-[0.18em] text-black/55">
          Availability
        </p>
        <p class="mt-1 text-sm text-black/65">
          Unavailable products stay in the dashboard but disappear from the public menu.
        </p>
      </div>

      <input
        v-model="form.isAvailable"
        type="checkbox"
        class="h-5 w-5 accent-[var(--color-ink)]"
      >
    </label>

    <div class="flex flex-wrap gap-3">
      <button
        type="submit"
        class="primary-button"
        :disabled="categories.length === 0"
      >
        {{ isEditing ? 'Update product' : 'Create product' }}
      </button>

      <button
        v-if="isEditing"
        type="button"
        class="ghost-button"
        @click="$emit('cancel')"
      >
        Cancel edit
      </button>
    </div>
  </form>
</template>
