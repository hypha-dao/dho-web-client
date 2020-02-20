import { Notify } from 'quasar'

export const addNotification = (state, { transactionId, actions, error }) => {
  state.notifications = [...state.notifications].concat({
    ...actionsToNotification(actions),
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
      message: 'Transaction success',
      position: 'bottom-right'
    })
  } else {
    state.errorCount += 1
    Notify.create({
      color: 'red',
      message: 'Transaction error',
      position: 'bottom-right'
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
  const actionName = `${action.account}_${action.name}`
  switch (actionName) {
    case `${process.env.DAO_CONTRACT}_create`:
      return { icon: 'fa fa-lightbulb', title: 'Submit a proposal', content: action.data.strings.find(o => o.key === 'title').value }
    case `${process.env.DAOCONTRACT}_closeprop`:
      return { icon: 'fas fa-window-close', title: 'Closing a proposal', content: action.data.type }
    case 'trailservice_castvote':
      return { icon: 'fas fa-person-booth', title: 'Vote on a proposal', content: `${action.data.voter} voted ${action.data.options[0]}` }
    default:
      return { icon: 'fas fa-rss', title: actionName, content: JSON.stringify(action.data) }
  }
}
