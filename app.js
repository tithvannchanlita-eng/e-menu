const restaurants = {
  demo: {
    name: 'Pich Pisey Shop',
    shippingNote: 'Free សេវាដឹកជញ្ជូនលើការកម្ម៉ង់ចាប់ពី $40 ឡើងទៅ',
    phone: '071-935-0335',
    items: [
      {
        id: 'p1',
        name: '3 ពណ៌',
        category: 'ផ្កា',
        price: 27,
        originalPrice: 30,
        description: 'កាដូ handmade បែបផ្កាចម្រុះពណ៌ សម្រាប់ថ្ងៃពិសេស។',
        image: 'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 'p2',
        name: 'រំយោល',
        category: 'ផ្កា',
        price: 9,
        originalPrice: 10,
        description: 'រចនាបថស្អាត សម្រាប់តុបតែងកាបូប ឬសោ។',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 'p3',
        name: 'បណ្ដោង Coquette',
        category: 'បណ្ដោង',
        price: 2,
        originalPrice: 3,
        description: 'បណ្ដោងស្ទីល cute សម្រាប់ accessory ប្រចាំថ្ងៃ។',
        image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 'p4',
        name: 'បណ្ដោង Glitter',
        category: 'បណ្ដោង',
        price: 2,
        originalPrice: 3,
        description: 'Glitter shine មើលភ្លឺភ្លាំង ពេលពន្លឺប៉ះ។',
        image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=900&q=80',
        soldOut: true,
      },
      {
        id: 'p5',
        name: 'Lip Oil Charm',
        category: 'ថែទាំស្បែក',
        price: 4,
        originalPrice: 5,
        description: 'Charm មានទម្រង់ lip oil ទន់ភ្លន់ និងទាន់សម័យ។',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 'p6',
        name: 'Petal Keychain',
        category: 'ថែទាំស្បែក',
        price: 2,
        originalPrice: 3,
        description: 'ពណ៌ស្រទន់ សាកសមជាមួយស្ទីល minimalist។',
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
};

function parseRestaurantId() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts[0] === 'r' && parts[1]) return parts[1];
  return 'demo';
}

const formatPrice = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

const ProductCard = {
  props: {
    item: { type: Object, required: true },
  },
  emits: ['open-item', 'add-to-cart'],
  methods: { formatPrice },
  template: `
    <article class="relative flex flex-col rounded-xl border border-rosebrand-100 bg-white shadow-soft">
      <button type="button" @click="$emit('open-item', item)" class="text-left">
        <img :src="item.image" :alt="item.name" class="aspect-square w-full rounded-t-xl object-contain bg-rosebrand-50 p-2" loading="lazy" />
        <div class="px-3 pt-3">
          <h2 class="line-clamp-2 text-base font-semibold text-rosebrand-700">{{ item.name }}</h2>
          <p class="mt-1 flex items-center gap-2 text-sm font-semibold text-rosebrand-700">
            <del v-if="item.originalPrice" class="text-xs font-normal text-rose-300">{{ formatPrice(item.originalPrice) }}</del>
            {{ formatPrice(item.price) }}
          </p>
        </div>
      </button>
      <div class="mt-auto p-3">
        <button
          type="button"
          class="w-full rounded-md bg-rosebrand-600 px-2 py-2 text-sm font-semibold text-white transition hover:bg-rosebrand-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          @click="$emit('add-to-cart', item)"
          :disabled="item.soldOut"
        >
          ដាក់ចូលថង់
        </button>
      </div>
      <span v-if="item.soldOut" class="absolute right-2 top-2 rounded-full bg-slate-700/90 px-2 py-0.5 text-xs font-semibold text-white">អស់ពីស្តុក</span>
    </article>
  `,
};

const { createApp } = Vue;

createApp({
  components: { ProductCard },
  data() {
    const restaurantId = parseRestaurantId();
    return {
      restaurant: restaurants[restaurantId] ?? restaurants.demo,
      activeItem: null,
      activeCategory: 'ទាំងអស់',
      cart: {},
      showCheckout: false,
      checkoutForm: { name: '', phone: '', address: '', note: '' },
      checkoutSuccess: '',
    };
  },
  computed: {
    categories() {
      return ['ទាំងអស់', ...new Set(this.restaurant.items.map((item) => item.category))];
    },
    filteredItems() {
      if (this.activeCategory === 'ទាំងអស់') return this.restaurant.items;
      return this.restaurant.items.filter((item) => item.category === this.activeCategory);
    },
    cartItems() {
      return this.restaurant.items
        .filter((item) => this.cart[item.id])
        .map((item) => ({ ...item, quantity: this.cart[item.id], lineTotal: this.cart[item.id] * item.price }));
    },
    cartCount() {
      return Object.values(this.cart).reduce((sum, qty) => sum + qty, 0);
    },
    cartSubtotal() {
      return this.cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
    },
    shippingFee() {
      return this.cartSubtotal >= 40 || this.cartSubtotal === 0 ? 0 : 2.5;
    },
    grandTotal() {
      return this.cartSubtotal + this.shippingFee;
    },
  },
  methods: {
    formatPrice,
    openItem(item) {
      this.activeItem = item;
    },
    addToCart(item) {
      if (item.soldOut) return;
      this.cart[item.id] = (this.cart[item.id] ?? 0) + 1;
      this.checkoutSuccess = '';
      this.activeItem = null;
    },
    changeQuantity(itemId, diff) {
      const next = (this.cart[itemId] ?? 0) + diff;
      if (next <= 0) {
        delete this.cart[itemId];
        return;
      }
      this.cart[itemId] = next;
    },
    openCheckout() {
      if (this.cartCount === 0) return;
      this.showCheckout = true;
    },
    submitCheckout() {
      if (!this.checkoutForm.name || !this.checkoutForm.phone || !this.checkoutForm.address) return;
      const orderCode = `PP-${Math.floor(10000 + Math.random() * 90000)}`;
      this.checkoutSuccess = `បានបញ្ជាទិញជោគជ័យ! លេខកម្ម៉ង់ ${orderCode}`;
      this.cart = {};
      this.showCheckout = false;
      this.checkoutForm = { name: '', phone: '', address: '', note: '' };
    },
  },
  template: `
    <div class="mx-auto min-h-screen w-full max-w-[1200px] px-3 pb-28 sm:px-6">
      <header class="sticky top-0 z-40 bg-[#fdf7f4]/95 pb-3 pt-4 backdrop-blur">
        <div class="flex items-center justify-between">
          <button class="grid h-9 w-9 place-items-center rounded-md border border-rosebrand-100 text-rosebrand-700" type="button">☰</button>
          <h1 class="text-center text-3xl font-semibold tracking-wide text-rosebrand-600 sm:text-4xl">{{ restaurant.name }}</h1>
          <button @click="openCheckout" class="relative grid h-9 w-9 place-items-center rounded-md border border-rosebrand-100 text-lg text-rosebrand-700" type="button">
            🛍
            <span class="absolute -right-1 -top-1 rounded-full bg-rosebrand-500 px-1.5 text-xs font-semibold text-white">{{ cartCount }}</span>
          </button>
        </div>
        <p class="mt-3 rounded-lg bg-rosebrand-100 px-3 py-2 text-center text-sm font-medium text-rosebrand-700">{{ restaurant.shippingNote }}</p>
        <p v-if="checkoutSuccess" class="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{{ checkoutSuccess }}</p>

        <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            @click="activeCategory = cat"
            class="whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-semibold transition"
            :class="activeCategory === cat ? 'border-rosebrand-600 bg-rosebrand-600 text-white' : 'border-rosebrand-100 bg-white text-rosebrand-700'"
          >
            {{ cat }}
          </button>
        </div>
      </header>

      <main class="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <product-card
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          @open-item="openItem"
          @add-to-cart="addToCart"
        />
      </main>

      <footer class="mt-8 rounded-2xl bg-white p-4 text-center text-sm text-rosebrand-700 shadow-soft">
        <p class="font-semibold">{{ restaurant.name }}</p>
        <p>ទូរស័ព្ទ៖ {{ restaurant.phone }}</p>
        <p class="mt-2 text-xs text-rose-400">រក្សារសិទ្ធ © 2026</p>
      </footer>

      <div class="fixed bottom-0 left-0 right-0 z-30 border-t border-rosebrand-100 bg-white/95 p-3 backdrop-blur" v-if="cartCount > 0">
        <div class="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-3">
          <p class="text-sm font-semibold text-rosebrand-700">{{ cartCount }} item(s) · {{ formatPrice(grandTotal) }}</p>
          <button type="button" @click="openCheckout" class="rounded-lg bg-rosebrand-600 px-4 py-2 text-sm font-semibold text-white">Checkout</button>
        </div>
      </div>

      <div v-if="activeItem" class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-3 sm:items-center" @click.self="activeItem = null">
        <article class="w-full max-w-md overflow-hidden rounded-3xl bg-white">
          <img :src="activeItem.image" :alt="activeItem.name" class="h-60 w-full object-contain bg-rosebrand-50 p-4" />
          <div class="space-y-2 p-5 text-rosebrand-700">
            <h2 class="text-2xl font-bold">{{ activeItem.name }}</h2>
            <p class="text-lg font-semibold">
              <del v-if="activeItem.originalPrice" class="mr-2 text-sm font-normal text-rose-300">{{ formatPrice(activeItem.originalPrice) }}</del>
              {{ formatPrice(activeItem.price) }}
            </p>
            <p class="text-sm leading-6 text-rosebrand-700/80">{{ activeItem.description }}</p>
            <button type="button" @click="addToCart(activeItem)" class="mt-2 w-full rounded-xl bg-rosebrand-600 px-4 py-3 font-semibold text-white" :disabled="activeItem.soldOut">ដាក់ចូលថង់</button>
          </div>
        </article>
      </div>

      <div v-if="showCheckout" class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-3 sm:items-center" @click.self="showCheckout = false">
        <article class="w-full max-w-lg rounded-3xl bg-white p-5 text-rosebrand-700 shadow-xl">
          <h2 class="text-2xl font-bold">Checkout</h2>
          <div class="mt-4 max-h-44 space-y-2 overflow-auto">
            <div v-for="item in cartItems" :key="item.id" class="flex items-center justify-between rounded-lg border border-rosebrand-100 p-2">
              <div>
                <p class="text-sm font-semibold">{{ item.name }}</p>
                <p class="text-xs">{{ formatPrice(item.price) }} × {{ item.quantity }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" class="rounded border border-rosebrand-100 px-2" @click="changeQuantity(item.id, -1)">-</button>
                <span class="min-w-6 text-center text-sm font-semibold">{{ item.quantity }}</span>
                <button type="button" class="rounded border border-rosebrand-100 px-2" @click="changeQuantity(item.id, 1)">+</button>
              </div>
            </div>
          </div>

          <div class="mt-4 space-y-1 rounded-xl bg-rosebrand-50 p-3 text-sm">
            <div class="flex items-center justify-between"><span>Subtotal</span><span>{{ formatPrice(cartSubtotal) }}</span></div>
            <div class="flex items-center justify-between"><span>Delivery</span><span>{{ shippingFee === 0 ? 'Free' : formatPrice(shippingFee) }}</span></div>
            <div class="flex items-center justify-between border-t border-rosebrand-100 pt-1 font-bold"><span>Total</span><span>{{ formatPrice(grandTotal) }}</span></div>
          </div>

          <form class="mt-4 space-y-2" @submit.prevent="submitCheckout">
            <input v-model.trim="checkoutForm.name" required type="text" placeholder="ឈ្មោះអ្នកទទួល" class="w-full rounded-lg border border-rosebrand-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rosebrand-100" />
            <input v-model.trim="checkoutForm.phone" required type="tel" placeholder="លេខទូរស័ព្ទ" class="w-full rounded-lg border border-rosebrand-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rosebrand-100" />
            <textarea v-model.trim="checkoutForm.address" required rows="2" placeholder="អាសយដ្ឋានដឹកជញ្ជូន" class="w-full rounded-lg border border-rosebrand-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rosebrand-100"></textarea>
            <textarea v-model.trim="checkoutForm.note" rows="2" placeholder="កំណត់ចំណាំ (optional)" class="w-full rounded-lg border border-rosebrand-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rosebrand-100"></textarea>
            <div class="flex gap-2 pt-2">
              <button type="button" class="w-full rounded-lg border border-rosebrand-100 px-4 py-2 text-sm font-semibold" @click="showCheckout = false">Cancel</button>
              <button type="submit" class="w-full rounded-lg bg-rosebrand-600 px-4 py-2 text-sm font-semibold text-white">Place order</button>
            </div>
          </form>
        </article>
      </div>
    </div>
  `,
}).mount('#app');
