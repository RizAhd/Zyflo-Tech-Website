import Principles from '../sections/Principles'
import Studio from '../sections/Studio'
import PageCta from '../components/PageCta'

export default function About() {
  return (
    <div className="pt-12 sm:pt-16">
      <Studio />
      <Principles />
      <PageCta
        eyebrow="Ready when you are"
        title="Tell me what you need."
        body="A short message is enough. You get an honest answer and a fixed quote in LKR."
        to="/contact"
        label="Start a project"
      />
    </div>
  )
}
