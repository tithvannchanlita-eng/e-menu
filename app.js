const restaurants = {
  demo: {
    name: 'Sunset Bistro',
    tagline: 'Fresh plates, quick bites, and handcrafted drinks.',
    items: [
      {
        id: 'm1',
        name: 'Margherita Pizza',
        price: 12.99,
        rating: 4.7,
        description: 'Wood-fired pizza topped with fresh mozzarella, basil, and house tomato sauce.',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 'm2',
        name: 'Grilled Salmon Bowl',
        price: 15.49,
        rating: 4.8,
        description: 'Flaky grilled salmon with lemon rice, avocado, and seasonal greens.',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 'm3',
        name: 'Classic Cheeseburger',
        price: 11.5,
        rating: 4.6,
        description: 'Beef patty, cheddar, lettuce, tomato, onion, and signature burger sauce.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: 'm4',
        name: 'Iced Caramel Latte',
        price: 4.75,
        rating: 4.9,
        description: 'Double espresso over ice with milk and caramel syrup.',
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
};

function parseRestaurantId() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts[0] === 'r' && parts[1]) return parts[1];
  return 'demo';
}

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function stars(value) {
  return `★ ${value.toFixed(1)}`;
}

function showDialog(item) {
  const dialog = document.getElementById('item-dialog');
  document.getElementById('dialog-image').src = item.image;
  document.getElementById('dialog-image').alt = item.name;
  document.getElementById('dialog-name').textContent = item.name;
  document.getElementById('dialog-price').textContent = money(item.price);
  document.getElementById('dialog-rating').textContent = stars(item.rating);
  document.getElementById('dialog-description').textContent = item.description;
  dialog.showModal();
}

function renderMenu(restaurant) {
  const list = document.getElementById('menu-list');
  const tpl = document.getElementById('menu-item-template');
  list.innerHTML = '';

  restaurant.items.forEach((item) => {
    const card = tpl.content.firstElementChild.cloneNode(true);
    card.dataset.itemId = item.id;
    card.querySelector('.menu-image').src = item.image;
    card.querySelector('.menu-image').alt = item.name;
    card.querySelector('.menu-name').textContent = item.name;
    card.querySelector('.menu-price').textContent = money(item.price);
    card.querySelector('.menu-rating').textContent = stars(item.rating);

    const open = () => showDialog(item);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });

    list.append(card);
  });
}

function init() {
  const restaurantId = parseRestaurantId();
  const restaurant = restaurants[restaurantId] ?? restaurants.demo;

  document.getElementById('restaurant-name').textContent = restaurant.name;
  document.getElementById('restaurant-tagline').textContent = restaurant.tagline;
  renderMenu(restaurant);

  const dialog = document.getElementById('item-dialog');
  document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    const outside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;
    if (outside) dialog.close();
  });
}

init();
