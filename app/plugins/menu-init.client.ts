export default defineNuxtPlugin(() => {
  const menuStore = useMenuStore()

  menuStore.ensureLoaded()
})
