// app/page.tsx
import Link from 'next/link'

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
    <div className="min-h-screen flex flex-col">
      {/* Top half container */}
      <div className="flex-1 flex flex-col sm:flex-row">
        {/* Top left quarter - Image and text */}
        <div className="w-full sm:w-1/2 h-64 sm:h-auto flex flex-col items-center justify-center p-6 bg-blue-50">
          <img
            src="/api/placeholder/300/200"
            alt="Document Transfer"
            className="w-32 h-32 object-contain mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Transfert Sécurisé de Documents
          </h1>
          <p className="text-gray-600 mt-2 text-center">
            Partagez vos documents en toute sécurité avec les organisations
          </p>
        </div>

        {/* Top right quarter - New request button */}
        <div className="w-full sm:w-1/2 h-64 sm:h-auto flex items-center justify-center p-6">
          <Link href="/new-request">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
              Nouvelle Demande
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom half - Logs */}
      <div className="flex-1 bg-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4">Historique des demandes</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Demande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{log.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.request}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${log.status === 'Accepté' ? 'bg-green-100 text-green-800' :
                        log.status === 'Refusé' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}