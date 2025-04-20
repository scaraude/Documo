import { ActionSection, LogsHistoric, Navbar } from '../components'

interface Log {
  name: string
  request: string
  status: string
}

export default function Home() {
  // Sample logs data - in production, this would come from an API or database
  const logs: Log[] = [
    { name: "John Doe", request: "Justificatif de domicile", status: "En attente" },
    { name: "Marie Martin", request: "Avis d'imposition", status: "Accepté" },
    { name: "Pierre Dupont", request: "RIB", status: "Refusé" },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col p-18">
        {/* Top half container */}
        <div className="flex sm:flex-row">
          {/* Top left quarter - Image and text */}

          {/* Top right quarter - New request button */}
          <ActionSection />
        </div>

        {/* Bottom half - Logs */}
        <LogsHistoric logs={logs} />
      </div>
    </>
  )
}