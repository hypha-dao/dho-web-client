export const addNotification = (state, notification) => {
  state.notifications = [...state.notifications].concat({
    ...notification,
    read: false,
    id: Math.round(Math.random() * 10e7)
  })
  if (notification.status === 'success') {
    state.successCount += 1
  } else {
    state.errorCount += 1
  }
  localStorage.setItem('notifications', JSON.stringify(state.notifications))
}

export const unmarkRead = (state) => {
  state.successCount = 0
  state.errorCount = 0
  const notifs = JSON.parse(localStorage.getItem('notifications')) || []
  notifs.forEach(n => {
    n.read = true
  })
  state.notifications = notifs
  localStorage.setItem('notifications', JSON.stringify(notifs))
}

export const clearNotifications = (state) => {
  state.notifications = []
  state.successCount = 0
  state.errorCount = 0
  localStorage.removeItem('notifications')
}

export const initNotifications = (state) => {
  if (!localStorage) return
  const notifs = localStorage.getItem('notifications')
  if (notifs) {
    state.notifications = JSON.parse(notifs)
    state.successCount = state.notifications.filter(n => !n.read && n.status === 'success').length
    state.errorCount = state.notifications.filter(n => !n.read && n.status === 'error').length
  }
}
