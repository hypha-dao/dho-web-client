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
      message: 'Transaction successful',
      position: 'bottom',
      icon: 'fas fa-spinner fa-spin notif-icon',
      timeout: 4000,
      actions: [
        { icon: 'fas fa-times', color: 'white', handler: () => { /* ... */ } }
      ]
    })
  } else {
    state.errorCount += 1
    Notify.create({
      color: 'red',
      message: 'Transaction error, please check the console.',
      position: 'bottom',
      icon: 'fas fa-exclamation-circle',
      timeout: 4000,
      actions: [
        { icon: 'fas fa-times', color: 'white', handler: () => { /* ... */ } }
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
