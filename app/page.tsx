import { ActionSection } from '@/components'
import { RequestsList } from '@/features/requests/components'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Call to action section */}
      <div className="w-full bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <ActionSection />
        </div>
      </div>

      {/* Requests list section */}
      <div className="flex-1 max-w-7xl mx-auto w-full">
        <RequestsList />
      </div>
    </div>
  )
}