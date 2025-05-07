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
          <ButtonNewModel />
          <ButtonNewRequest />
        </div>
      </div>

      {/* Requests list section */}
      <div className="flex-1 max-w-7xl mx-auto w-full">
        <RequestsList />
      </div>
    </div>
  )
}