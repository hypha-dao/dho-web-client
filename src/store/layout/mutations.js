export const setRightSidebarType = (state, content) => {
  if (content === null) {
    state.rightSidebarType = null
    state.data = null
  } else if (typeof content === 'string') {
    state.rightSidebarType = content
    state.data = null
  } else {
    state.data = content.data
    state.rightSidebarType = content.type
  }
}

export const setShowRightSidebar = (state, status) => {
  state.showRightSidebar = status
  if (!status) {
    state.rightSidebarType = null
    state.data = null
  }
}

export const setBreadcrumbs = (state, breadcrumbs) => {
  state.breadcrumbs = breadcrumbs
}

export const setAlert = (state, { level, content }) => {
  if (localStorage.getItem('banner')) {
    const banner = JSON.parse(localStorage.getItem('banner'))
    if (banner.level === level && banner.content === content && banner.dismissDate + 7 * 60 * 60 * 1000 > Date.now()) {
      return
    }
  }

  state.alert = {
    level,
    content,
    hidden: false
  }
}

export const dismissAlert = (state) => {
  state.alert.hidden = true
  localStorage.setItem('banner', JSON.stringify({
    dismissDate: Date.now(),
    content: state.alert.content,
    level: state.alert.level
  }))
}
