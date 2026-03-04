const restaurants = {
  demo: {
    name: 'Aurora Kitchen',
    tagline: 'Seasonal bites, signature mains, and crafted beverages.',
    items: [
      {
        id: 'm1',
        name: 'Truffle Mushroom Pizza',
        price: 16.9,
        rating: 4.8,
        description: 'Crisp crust, roasted mushrooms, truffle cream, mozzarella, and parmesan.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'm2',
        name: 'Citrus Salmon Bowl',
        price: 18.5,
        rating: 4.9,
        description: 'Grilled salmon, herbed rice, avocado, pickled onions, and citrus dressing.',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'm3',
        name: 'Smash Cheeseburger',
        price: 13.25,
        rating: 4.7,
        description: 'Double-seared beef, cheddar, lettuce, tomato, pickles, and house sauce.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'm4',
        name: 'Iced Vanilla Latte',
        price: 5.25,
        rating: 4.9,
        description: 'Fresh espresso over ice with creamy milk and Madagascar vanilla syrup.',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80',
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
    };
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
  },
}).mount('#app');
