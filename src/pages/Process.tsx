import Principles from '../sections/Principles'
import Process from '../sections/Process'
import PageCta from '../components/PageCta'

export default function ProcessPage() {
  return (
    <>
      <Process />
      <Principles />
      <PageCta
        title="See what has been shipped."
        body="A point of sale system, a live website and the invoicing tool the studio runs on."
        to="/work"
        label="View the work"
      />
    </>
  )
}
