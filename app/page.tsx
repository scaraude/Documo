import { ActionSection, RequestsList } from '@/components'

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col p-18">
      {/* Top half container */}
      <div className="flex sm:flex-row">
        {/* Top left quarter - Image and text */}

        {/* Top right quarter - New request button */}
        <ActionSection />
      </div>

      {/* Bottom half - Logs */}
      <RequestsList />
    </div>
  )
}