import Principles from '../sections/Principles'
import Process from '../sections/Process'
import ClosingCta from '../components/ClosingCta'

export default function ProcessPage() {
  return (
    <>
      <Process />
      <Principles />
      <ClosingCta
        title="See what has been shipped."
        body="A point of sale system, a live website and the invoicing tool the studio runs on."
        to="/work"
        label="View the work"
      />
    </>
  )
}
