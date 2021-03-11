import { Notify } from 'quasar'

export const addNotification = (state, { transactionId, actions, error }) => {
  state.notifications = [...state.notifications].concat({
    ...actionsToNotification(actions),
    actions,
    transactionId,
    status: error ? 'error' : 'success',
    error,
    read: false,
    id: Math.round(Math.random() * 10e7)
  })
  if (error === null) {
    state.successCount += 1
    Notify.create({
      color: 'green',
      message: 'Transaction processing, please refresh screen.',
      position: 'bottom',
      icon: 'fas fa-spinner fa-spin notif-icon',
      timeout: 10000,
      actions: [
        { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
      ]
    })
  } else {
    state.errorCount += 1
    Notify.create({
      color: 'red',
      message: 'Transaction error, please check the console.',
      position: 'bottom',
      timeout: 10000,
      actions: [
        { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
      ]
    })
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

const actionsToNotification = actions => {
  const action = actions[0]
  return { icon: 'fas fa-rss', title: action.name }
}
