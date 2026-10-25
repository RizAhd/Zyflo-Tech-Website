import Studio from '../sections/Studio'
import ClosingCta from '../components/ClosingCta'

export default function About() {
  return (
    <>
      <Studio />
      <ClosingCta
        title={
          <>
            Tell us what you <span className="text-brand-strong">need</span>.
          </>
        }
        body="You get an honest answer and a fixed quote in LKR."
        to="/contact"
        label="Start a project"
        showWhatsapp
      />
    </>
  )
}
