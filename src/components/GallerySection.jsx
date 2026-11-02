import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useImageFallback } from '../hooks/useImageFallback'
import './GallerySection.css'

// عشان تضيفي صورك: حطي الـ 6 صور في مجلد public/images
// وسميهم بالظبط: photo1.jpg, photo2.jpg ... لحد photo6.jpg
// مفيش أي تعديل تاني مطلوب في الكود — الموقع هياخدهم تلقائي

function GalleryPhoto({ id, caption, placeholder, index, onOpen }) {
  const { src, failed, onError } = useImageFallback(`/images/photo${id}`)

  return (
    <div className="photo-placeholder" onClick={() => !failed && onOpen(index)}>
      {!failed ? (
        <img
          src={src}
          alt={caption}
          onError={onError}
          loading="lazy"
        />
      ) : (
        <span className="placeholder-icon">{placeholder}</span>
      )}
      {!failed && (
        <div className="photo-zoom-hint">
          <span>✦</span>
        </div>
      )}
    </div>
  )
}

export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const placeholders = ['♥', '✦', '☾', '♡', '✿', '★']
  const captions = [
    'أول لحظة شفتك فيها وحسّيت إن حاجة اتغيّرت',
    'أحلى ابتسامة شفتها في حياتي كلها',
    'لحظة معنديش استعداد أنساها أبداً',
    'انتي حياتي كلها بصراحة، مش مبالغة',
    'انتي أمان قلبي ومكاني اللي بترتاح فيه',
    'كل سنة وانتي أحلى حاجة حصلتلي.. بحبك',
  ]
  const photos = captions.map((caption, i) => ({
    id: i + 1,
    caption,
    placeholder: placeholders[i],
  }))

  const openAt = (index) => setLightboxIndex(index)
  const close = () => setLightboxIndex(null)
  const showPrev = () => setLightboxIndex((i) => (i - 1 + photos.length) % photos.length)
  const showNext = () => setLightboxIndex((i) => (i + 1) % photos.length)

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') showNext() // RTL: left arrow = next
      if (e.key === 'ArrowRight') showPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex])

  const activePhoto = lightboxIndex !== null ? photos[lightboxIndex] : null

  return (
    <section className="gallery-section" id="gallery">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="section-tag">معرض ذكرياتنا</span>
        <h2 className="section-title">لحظات لا تُنسى</h2>
        <p className="section-subtitle">كل صورة بتحكي قصة حب لوحدها.. دوسي عليها تكبر</p>
      </motion.div>

      <div className="gallery-grid">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            className="gallery-card"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -8, scale: 1.03 }}
          >
            <GalleryPhoto {...photo} index={i} onOpen={openAt} />
            <div className="photo-caption">{photo.caption}</div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activePhoto && (
          <Lightbox
            photo={activePhoto}
            onClose={close}
            onPrev={showPrev}
            onNext={showNext}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function Lightbox({ photo, onClose, onPrev, onNext }) {
  const { src } = useImageFallback(`/images/photo${photo.id}`)

  return (
    <motion.div
      className="lightbox-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button className="lightbox-close" onClick={onClose} aria-label="قفل">×</button>

      <button
        className="lightbox-nav lightbox-nav-prev"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label="الصورة اللي فاتت"
      >
        ‹
      </button>

      <motion.div
        className="lightbox-content"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={photo.caption} className="lightbox-image" />
        <p className="lightbox-caption">{photo.caption}</p>
      </motion.div>

      <button
        className="lightbox-nav lightbox-nav-next"
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="الصورة اللي جاية"
      >
        ›
      </button>
    </motion.div>
  )
}
