import Contact from '../sections/Contact'
import Faqs from '../sections/Faqs'

// The header is a solid white bar on this page (see Nav), so the dark panel
// starts just under it rather than behind it.
export default function ContactPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <Contact />
      <Faqs />
    </div>
  )
}
