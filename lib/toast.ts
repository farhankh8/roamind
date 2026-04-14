import toast from 'react-hot-toast'

export const showSuccess = (message: string) =>
  toast.success(message, { duration: 3000 })

export const showError = (message: string) =>
  toast.error(message, { duration: 4000 })

export const showLoading = (message: string) =>
  toast.loading(message)

export const dismissToast = (id: string) =>
  toast.dismiss(id)
