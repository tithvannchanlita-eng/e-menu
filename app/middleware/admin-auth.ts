export default defineNuxtRouteMiddleware(() => {
  const { currentUser } = useMenuStore()

  if (!currentUser.value) {
    return navigateTo('/admin')
  }
})
