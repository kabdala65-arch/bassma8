import { useState } from 'react'

// بيجرب امتدادات مختلفة للصورة (jpg, jpeg, png, webp) لحد ما يلاقي
// الملف الموجود فعلاً، وبيرجع "failed" لو مفيش صورة خالص.
const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

export function useImageFallback(basePath) {
  const [extIndex, setExtIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  const src = `${basePath}.${EXTENSIONS[extIndex]}`

  const onError = () => {
    if (extIndex < EXTENSIONS.length - 1) {
      setExtIndex((i) => i + 1)
    } else {
      setFailed(true)
    }
  }

  return { src, failed, onError }
}
