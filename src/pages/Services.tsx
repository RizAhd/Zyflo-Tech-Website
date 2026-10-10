import Capabilities from '../sections/Capabilities'
import PageCta from '../components/PageCta'
import ServiceTabs from '../components/ServiceTabs'

export default function Services() {
  return (
    <div className="pt-12 sm:pt-16">
      <ServiceTabs />
      <Capabilities />
      <PageCta
        title="See how a project runs."
        body="Four steps, a fixed quote in LKR up front, and a full handover at the end."
        to="/process"
        label="How it works"
      />
    </div>
  )
}
