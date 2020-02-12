export const setRightSidebarType = (state, content) => {
  if (content === null) {
    state.rightSidebarType = null
    state.data = null
  } else if (typeof content === 'string') {
    state.rightSidebarType = content
    state.data = null
  } else {
    state.rightSidebarType = content.type
    state.data = content.data
  }
}

export const setShowRightSidebar = (state, status) => {
  state.showRightSidebar = status
}
