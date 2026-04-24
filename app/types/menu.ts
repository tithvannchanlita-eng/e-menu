export interface MenuCategory {
  id: string
  name: string
  createdAt: string
}

export interface MenuProduct {
  id: string
  name: string
  price: number
  categoryId: string
  imageUrl: string
  description: string
  isAvailable: boolean
  createdAt: string
}

export interface MenuCategoryDraft {
  name: string
}

export interface MenuProductDraft {
  name: string
  price: number
  categoryId: string
  imageUrl: string
  description: string
  isAvailable: boolean
}

export interface CategoryWithProducts extends MenuCategory {
  products: MenuProduct[]
}

export interface AdminUser {
  email: string
}
