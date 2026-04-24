<script setup lang="ts">
import type { MenuProduct } from '~/types/menu'

const props = defineProps<{
  product: MenuProduct | null
  categoryName: string
}>()

defineEmits<{
  close: []
}>()

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

const isOpen = computed(() => Boolean(props.product))
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isOpen && product"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6"
        @click.self="$emit('close')"
      >
        <div class="panel max-h-full w-full max-w-2xl overflow-auto">
          <div class="relative bg-[linear-gradient(135deg,_rgba(230,107,60,0.96),_rgba(133,185,207,0.92))] px-6 py-8 text-white">
            <button
              type="button"
              class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg font-black transition hover:bg-white/25"
              @click="$emit('close')"
            >
              ×
            </button>

            <p class="text-xs font-bold uppercase tracking-[0.26em] text-white/75">
              {{ categoryName }}
            </p>
            <h2 class="font-display mt-3 max-w-xl text-3xl font-black leading-tight sm:text-4xl">
              {{ product.name }}
            </h2>
            <p class="mt-4 text-lg font-semibold">
              {{ currencyFormatter.format(product.price) }}
            </p>
          </div>

          <div class="space-y-6 p-6">
            <div
              v-if="product.imageUrl"
              class="overflow-hidden rounded-[1.5rem] border border-black/10"
            >
              <img
                :src="product.imageUrl"
                :alt="product.name"
                class="h-72 w-full object-cover"
              >
            </div>

            <div
              v-else
              class="flex h-48 items-center justify-center rounded-[1.5rem] border border-dashed border-black/15 bg-white/80"
            >
              <span class="font-display text-5xl font-black uppercase tracking-[0.22em] text-black/35">
                {{ product.name.slice(0, 1) }}
              </span>
            </div>

            <div class="rounded-[1.5rem] bg-black/4 p-5">
              <p class="text-xs font-bold uppercase tracking-[0.24em] text-black/50">
                Dish details
              </p>
              <p class="mt-3 text-base leading-7 text-black/75">
                {{ product.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
