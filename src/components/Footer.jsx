import { motion } from 'framer-motion'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="footer-heart">♥</div>
        <p className="footer-text">
          صُمم بكل حب في عيد ميلاد <span className="footer-name">بسمة</span>
        </p>
        <p className="footer-year">2026 ©</p>
      </motion.div>
    </footer>
  )
}
