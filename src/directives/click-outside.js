const bind = (el, binding) => {
  if (typeof binding.value !== 'function') {
    return
  }
  const bubble = binding.modifiers.bubble
  const handler = (e) => {
    if (bubble || (!el.contains(e.target) && el !== e.target)) {
      binding.value(e)
    }
  }
  el.__vueClickOutside__ = handler
  document.addEventListener('click', handler)
}

const unbind = (el) => {
  if (el.__vueClickOutside__ !== null) {
    document.removeEventListener('click', el.__vueClickOutside__)
    el.__vueClickOutside__ = null
  }
}

const directive = {
  bind,
  unbind
}

export default directive
