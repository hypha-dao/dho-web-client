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
  state.alert = {
    level,
    content,
    hidden: false
  }
}

export const dismissAlert = (state) => {
  state.alert.hidden = true
}
