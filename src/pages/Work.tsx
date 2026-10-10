import Work from '../sections/Work'
import PageCta from '../components/PageCta'

export default function WorkPage() {
  return (
    <div className="pt-12 sm:pt-16">
      <Work h1 />
      <PageCta
        title="Meet the person doing the work."
        body="One person, start to finish. Here is how the studio runs and what you can count on."
        to="/about"
        label="About the studio"
      />
    </div>
  )
}
