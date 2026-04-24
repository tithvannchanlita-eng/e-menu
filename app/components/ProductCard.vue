<script setup lang="ts">
import type { MenuProduct } from '~/types/menu'

defineProps<{
  product: MenuProduct
  categoryName: string
}>()

defineEmits<{
  select: [product: MenuProduct]
}>()

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})
</script>

<template>
  <article
    class="panel flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1"
  >
    <div
      class="flex h-44 items-end justify-between bg-[linear-gradient(135deg,_rgba(230,107,60,0.92),_rgba(242,178,75,0.88))] p-5 text-white"
    >
      <div class="max-w-[75%]">
        <p class="text-xs font-bold uppercase tracking-[0.26em] text-white/70">
          {{ categoryName }}
        </p>
        <h3 class="font-display mt-2 text-2xl font-black leading-tight">
          {{ product.name }}
        </h3>
      </div>

      <div class="rounded-full bg-white/18 px-3 py-2 text-sm font-semibold backdrop-blur">
        {{ currencyFormatter.format(product.price) }}
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-4 p-5">
      <div
        v-if="product.imageUrl"
        class="overflow-hidden rounded-2xl border border-black/10 bg-black/5"
      >
        <img
          :src="product.imageUrl"
          :alt="product.name"
          class="h-48 w-full object-cover"
        >
      </div>

      <div
        v-else
        class="flex h-32 items-center justify-center rounded-2xl border border-dashed border-black/15 bg-white/70"
      >
        <span class="font-display text-4xl font-black uppercase tracking-[0.24em] text-black/35">
          {{ product.name.slice(0, 1) }}
        </span>
      </div>

      <p class="line-clamp-3 text-sm leading-6 text-black/70">
        {{ product.description }}
      </p>

      <button
        type="button"
        class="primary-button mt-auto w-full"
        @click="$emit('select', product)"
      >
        View details
      </button>
    </div>
  </article>
</template>
