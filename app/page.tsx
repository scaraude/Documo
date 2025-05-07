import { RequestsList } from '@/features/requests/components'
import { ButtonNewRequest, HeroSection } from '@/shared/components'
import { ButtonNewModel } from '../shared/components/ui/ButtonNewModel'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Call to action section */}
      <HeroSection />
      <div className="w-full bg-gray-50">
        <div className="max-w-7xl mx-auto flex">
          <div className="w-full flex-1 py-6 sm:py-8 md:py-12 flex items-center justify-around px-4 sm:px-6">
            <ButtonNewModel />
            <ButtonNewRequest />
          </div>
        </div>
      </div>

      {/* Requests list section */}
      <div className="flex-1 max-w-7xl mx-auto w-full">
        <RequestsList />
      </div>
    </div>
  )
}