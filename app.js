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
      cartCount: 0,
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
      this.cartCount += 1;
      this.activeItem = null;
    },
  },
}).mount('#app');
