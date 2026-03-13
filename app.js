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

const { createApp } = Vue;

createApp({
  data() {
    const restaurantId = parseRestaurantId();
    return {
      restaurant: restaurants[restaurantId] ?? restaurants.demo,
      activeItem: null,
      activeCategory: 'ទាំងអស់',
      cart: {},
      showCheckout: false,
      checkoutForm: {
        name: '',
        phone: '',
        address: '',
        note: '',
      },
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
        .map((item) => ({
          ...item,
          quantity: this.cart[item.id],
          lineTotal: this.cart[item.id] * item.price,
        }));
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
    formatPrice(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    },
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
      this.checkoutForm = {
        name: '',
        phone: '',
        address: '',
        note: '',
      };
    },
  },
}).mount('#app');
