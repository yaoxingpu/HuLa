import type { Ref } from 'vue'

export const useContextMenu = (containerRef: Ref) => {
  const showMenu = ref(false)
  const x = ref(0)
  const y = ref(0)

  // 禁止滚动的默认行为
  const preventDefault = (e: Event) => e.preventDefault()

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    showMenu.value = true
    x.value = e.clientX
    y.value = e.clientY
    window.addEventListener('wheel', preventDefault, { passive: false }) // 禁止使用滚轮滚动页面
  }

  const closeMenu = (event: any) => {
    /* 需要判断点击如果不是.context-menu类的元素的时候，menu才会关闭 */
    if (!event.target.matches('.context-menu, .context-menu *')) {
      showMenu.value = false
    }
    window.removeEventListener('wheel', preventDefault) // 移除禁止滚轮滚动
  }

  onMounted(() => {
    const div = containerRef.value
    //这里只监听了div的右键，如果需要监听其他元素的右键，需要在其他元素上监听
    div.addEventListener('contextmenu', handleContextMenu)
    // 这里需要监听window的右键，否则右键会触发div的右键事件，导致menu无法关闭，并且阻止默认右键菜单
    window.addEventListener(
      'contextmenu',
      (e) => {
        e.preventDefault()
        e.stopPropagation()
      },
      false
    )
    window.addEventListener('click', closeMenu, true)
    window.addEventListener('contextmenu', closeMenu, true)
  })

  onUnmounted(() => {
    const div = containerRef.value
    div?.removeEventListener('contextmenu', handleContextMenu)
    window.removeEventListener('click', closeMenu, true)
    window.removeEventListener('contextmenu', closeMenu, true)
  })

  return {
    showMenu,
    x,
    y
  }
}