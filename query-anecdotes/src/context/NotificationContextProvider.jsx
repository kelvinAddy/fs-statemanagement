import { useState } from 'react'
import { NotificationContext } from './NotificationContext'

export const NotificationContextProvider = ({ children }) => {
  const [notification, setNotification] = useState(null)

  const updateNotification = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, updateNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}
