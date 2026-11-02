// منسّق بسيط عشان أي صوت أو فيديو يشتغل في الصفحة يوقف أي صوت تاني شغال
// (الموسيقى في الخلفية، الرسالة الصوتية، أو أي فيديو) عشان الصوت متتداخلش.
// كل مكون بيسجل نفسه هنا، ولما يشتغل بيبلغ الباقيين يوقفوا.

let activeId = null
let interruptedId = null
const registry = new Map() // id -> { pause, resume }

export function registerMedia(id, handlers) {
  registry.set(id, handlers)
  return () => {
    registry.delete(id)
    if (activeId === id) activeId = null
    if (interruptedId === id) interruptedId = null
  }
}

export function notifyPlaying(id) {
  if (activeId && activeId !== id) {
    const other = registry.get(activeId)
    if (other && typeof other.pause === 'function') {
      other.pause()
      interruptedId = activeId
    }
  }
  activeId = id
}

export function notifyStopped(id) {
  if (activeId !== id) return
  activeId = null

  if (interruptedId && interruptedId !== id) {
    const other = registry.get(interruptedId)
    interruptedId = null
    if (other && typeof other.resume === 'function') {
      other.resume()
    }
  }
}
