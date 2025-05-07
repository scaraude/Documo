import { RequestsList } from '@/features/requests/components'
import { ActionSection, HeroSection } from '@/shared/components'

export default function Home() {
  return (
    <div className='bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className="min-h-screen flex flex-col">
        <HeroSection />
        <ActionSection />
        <div className="flex-1 max-w-7xl mx-auto w-full">
          <RequestsList />
        </div>
      </div>
    </div>
  )
}