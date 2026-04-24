import type {
  AdminUser,
  CategoryWithProducts,
  MenuCategory,
  MenuCategoryDraft,
  MenuProduct,
  MenuProductDraft
} from '~/types/menu'

const MENU_STORAGE_KEY = 'harvest-table-menu-v1'
const SESSION_COOKIE = 'harvest-table-session'
const ADMIN_EMAIL_COOKIE = 'harvest-table-admin-email'

const DEFAULT_ADMIN_EMAIL = 'admin@emenu.local'
const DEFAULT_ADMIN_PASSWORD = 'admin12345'

const seedCategories: MenuCategory[] = [
  { id: 'cat-specials', name: 'House Specials', createdAt: '2026-04-01T08:00:00.000Z' },
  { id: 'cat-khmer', name: 'Khmer Classics', createdAt: '2026-04-01T08:05:00.000Z' },
  { id: 'cat-drinks', name: 'Iced Drinks', createdAt: '2026-04-01T08:10:00.000Z' },
  { id: 'cat-desserts', name: 'Desserts', createdAt: '2026-04-01T08:15:00.000Z' }
]

const seedProducts: MenuProduct[] = [
  {
    id: 'prd-smoked-rice',
    name: 'Lemongrass Smoked Rice Bowl',
    price: 8.5,
    categoryId: 'cat-specials',
    imageUrl: '',
    description: 'Charred chicken, herb rice, pickled papaya, and tamarind glaze.',
    isAvailable: true,
    createdAt: '2026-04-01T09:00:00.000Z'
  },
  {
    id: 'prd-morning-market',
    name: 'Morning Market Noodles',
    price: 7.25,
    categoryId: 'cat-specials',
    imageUrl: '',
    description: 'Rice noodles in a bright pork broth with fresh herbs and crispy garlic.',
    isAvailable: true,
    createdAt: '2026-04-01T09:15:00.000Z'
  },
  {
    id: 'prd-fish-amok',
    name: 'Fish Amok',
    price: 9.75,
    categoryId: 'cat-khmer',
    imageUrl: '',
    description: 'Cambodian coconut curry steamed with white fish, kaffir lime, and kroeung.',
    isAvailable: true,
    createdAt: '2026-04-01T09:30:00.000Z'
  },
  {
    id: 'prd-lok-lak',
    name: 'Pepper Beef Lok Lak',
    price: 10.5,
    categoryId: 'cat-khmer',
    imageUrl: '',
    description: 'Seared beef, black pepper lime dip, tomatoes, cucumber, and fried egg.',
    isAvailable: true,
    createdAt: '2026-04-01T09:45:00.000Z'
  },
  {
    id: 'prd-pandan-latte',
    name: 'Pandan Coconut Latte',
    price: 3.95,
    categoryId: 'cat-drinks',
    imageUrl: '',
    description: 'Cold brew espresso shaken with coconut milk and pandan syrup.',
    isAvailable: true,
    createdAt: '2026-04-01T10:00:00.000Z'
  },
  {
    id: 'prd-kumquat-soda',
    name: 'Salted Kumquat Soda',
    price: 3.5,
    categoryId: 'cat-drinks',
    imageUrl: '',
    description: 'A sparkling citrus cooler with sweet, tart, and savory balance.',
    isAvailable: false,
    createdAt: '2026-04-01T10:15:00.000Z'
  },
  {
    id: 'prd-sticky-mango',
    name: 'Black Rice Mango Cup',
    price: 4.5,
    categoryId: 'cat-desserts',
    imageUrl: '',
    description: 'Sweet black sticky rice with coconut cream and ripe mango.',
    isAvailable: true,
    createdAt: '2026-04-01T10:30:00.000Z'
  }
]

interface StoredMenuData {
  categories: MenuCategory[]
  products: MenuProduct[]
}

function cloneSeed<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function sortCategories(categories: MenuCategory[]): MenuCategory[] {
  return [...categories].sort((first, second) => first.name.localeCompare(second.name))
}

function sortProducts(products: MenuProduct[]): MenuProduct[] {
  return [...products].sort((first, second) => first.name.localeCompare(second.name))
}

function normalizeCategoryDraft(draft: MenuCategoryDraft): MenuCategoryDraft {
  return {
    name: draft.name.trim()
  }
}

function normalizeProductDraft(draft: MenuProductDraft): MenuProductDraft {
  return {
    name: draft.name.trim(),
    price: Number(draft.price),
    categoryId: draft.categoryId,
    imageUrl: draft.imageUrl,
    description: draft.description.trim(),
    isAvailable: draft.isAvailable
  }
}

export function useMenuStore() {
  const categories = useState<MenuCategory[]>('menu-categories', () => cloneSeed(seedCategories))
  const products = useState<MenuProduct[]>('menu-products', () => cloneSeed(seedProducts))
  const isLoaded = useState<boolean>('menu-loaded', () => false)
  const session = useCookie<string | null>(SESSION_COOKIE, {
    sameSite: 'lax',
    default: () => null
  })
  const adminEmail = useCookie<string | null>(ADMIN_EMAIL_COOKIE, {
    sameSite: 'lax',
    default: () => null
  })

  const currentUser = computed<AdminUser | null>(() => {
    if (session.value !== 'authenticated' || !adminEmail.value) {
      return null
    }

    return { email: adminEmail.value }
  })

  const availableProducts = computed(() => sortProducts(products.value.filter(product => product.isAvailable)))

  const dashboardProducts = computed(() => {
    return [...products.value].sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt))
  })

  const categoriesWithProducts = computed<CategoryWithProducts[]>(() => {
    return sortCategories(categories.value)
      .map(category => ({
        ...category,
        products: sortProducts(
          products.value.filter(product => product.categoryId === category.id && product.isAvailable)
        )
      }))
      .filter(category => category.products.length > 0)
  })

  const stats = computed(() => ({
    categories: categories.value.length,
    totalProducts: products.value.length,
    availableProducts: products.value.filter(product => product.isAvailable).length
  }))

  function persist() {
    if (!import.meta.client) {
      return
    }

    const payload: StoredMenuData = {
      categories: categories.value,
      products: products.value
    }

    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(payload))
  }

  function ensureLoaded() {
    if (!import.meta.client || isLoaded.value) {
      return
    }

    const rawData = localStorage.getItem(MENU_STORAGE_KEY)

    if (!rawData) {
      persist()
      isLoaded.value = true
      return
    }

    try {
      const parsed = JSON.parse(rawData) as Partial<StoredMenuData>
      categories.value = Array.isArray(parsed.categories) && parsed.categories.length
        ? parsed.categories
        : cloneSeed(seedCategories)
      products.value = Array.isArray(parsed.products) && parsed.products.length
        ? parsed.products
        : cloneSeed(seedProducts)
    } catch {
      categories.value = cloneSeed(seedCategories)
      products.value = cloneSeed(seedProducts)
      persist()
    }

    isLoaded.value = true
  }

  if (import.meta.client && !isLoaded.value) {
    ensureLoaded()
  }

  function createCategory(draft: MenuCategoryDraft) {
    const normalizedDraft = normalizeCategoryDraft(draft)

    if (!normalizedDraft.name) {
      throw new Error('Category name is required.')
    }

    const category: MenuCategory = {
      id: createId('cat'),
      name: normalizedDraft.name,
      createdAt: new Date().toISOString()
    }

    categories.value = sortCategories([...categories.value, category])
    persist()

    return category
  }

  function updateCategory(id: string, draft: MenuCategoryDraft) {
    const normalizedDraft = normalizeCategoryDraft(draft)

    if (!normalizedDraft.name) {
      throw new Error('Category name is required.')
    }

    categories.value = categories.value.map((category) => {
      if (category.id !== id) {
        return category
      }

      return {
        ...category,
        name: normalizedDraft.name
      }
    })

    categories.value = sortCategories(categories.value)
    persist()
  }

  function deleteCategory(id: string) {
    const hasLinkedProducts = products.value.some(product => product.categoryId === id)

    if (hasLinkedProducts) {
      throw new Error('Move or delete products in this category before deleting it.')
    }

    categories.value = categories.value.filter(category => category.id !== id)
    persist()
  }

  function createProduct(draft: MenuProductDraft) {
    const normalizedDraft = normalizeProductDraft(draft)

    if (!normalizedDraft.name) {
      throw new Error('Product name is required.')
    }

    if (!normalizedDraft.categoryId) {
      throw new Error('Select a category for this product.')
    }

    if (Number.isNaN(normalizedDraft.price) || normalizedDraft.price <= 0) {
      throw new Error('Product price must be greater than zero.')
    }

    const product: MenuProduct = {
      id: createId('prd'),
      name: normalizedDraft.name,
      price: normalizedDraft.price,
      categoryId: normalizedDraft.categoryId,
      imageUrl: normalizedDraft.imageUrl,
      description: normalizedDraft.description,
      isAvailable: normalizedDraft.isAvailable,
      createdAt: new Date().toISOString()
    }

    products.value = [product, ...products.value]
    persist()

    return product
  }

  function updateProduct(id: string, draft: MenuProductDraft) {
    const normalizedDraft = normalizeProductDraft(draft)

    if (!normalizedDraft.name) {
      throw new Error('Product name is required.')
    }

    if (!normalizedDraft.categoryId) {
      throw new Error('Select a category for this product.')
    }

    if (Number.isNaN(normalizedDraft.price) || normalizedDraft.price <= 0) {
      throw new Error('Product price must be greater than zero.')
    }

    products.value = products.value.map((product) => {
      if (product.id !== id) {
        return product
      }

      return {
        ...product,
        ...normalizedDraft
      }
    })

    persist()
  }

  function deleteProduct(id: string) {
    products.value = products.value.filter(product => product.id !== id)
    persist()
  }

  function toggleProductAvailability(id: string) {
    products.value = products.value.map((product) => {
      if (product.id !== id) {
        return product
      }

      return {
        ...product,
        isAvailable: !product.isAvailable
      }
    })

    persist()
  }

  async function login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase()

    if (normalizedEmail !== DEFAULT_ADMIN_EMAIL || password !== DEFAULT_ADMIN_PASSWORD) {
      throw new Error('Use the seeded admin credentials to enter the local dashboard.')
    }

    session.value = 'authenticated'
    adminEmail.value = normalizedEmail

    return {
      email: normalizedEmail
    } satisfies AdminUser
  }

  function logout() {
    session.value = null
    adminEmail.value = null
  }

  function resetDemoData() {
    categories.value = cloneSeed(seedCategories)
    products.value = cloneSeed(seedProducts)
    persist()
  }

  function getCategoryName(categoryId: string): string {
    return categories.value.find(category => category.id === categoryId)?.name ?? 'Unknown category'
  }

  return {
    categories,
    products,
    availableProducts,
    categoriesWithProducts,
    dashboardProducts,
    currentUser,
    isLoaded,
    stats,
    adminCredentials: {
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD
    },
    ensureLoaded,
    createCategory,
    updateCategory,
    deleteCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    login,
    logout,
    resetDemoData,
    getCategoryName
  }
}
