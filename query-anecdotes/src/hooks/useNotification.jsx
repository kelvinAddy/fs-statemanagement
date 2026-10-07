import { NotificationContext } from '../context/NotificationContext'
import { useContext } from 'react'

export const useNotication = () => useContext(NotificationContext)
