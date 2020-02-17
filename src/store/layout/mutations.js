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
}
