import Work from '../sections/Work'
import PageCta from '../components/PageCta'

export default function WorkPage() {
  return (
    <div className="pt-12 sm:pt-16">
      <Work h1 />
      <PageCta
        title="Meet the studio behind the work."
        body="Start to finish, the same people. Here is how the studio runs and what you can count on."
        to="/about"
        label="About the studio"
      />
    </div>
  )
}
