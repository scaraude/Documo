interface Log {
    name: string
    request: string
    status: string
}

export const LogsHistoric = ({ logs }: { logs: Log[] }) =>
    <div className="flex-1 p-6">
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