import { ComputedRequestStatus, DocumentRequest } from "@/shared/types"
import { ROUTES } from "@/shared/constants"
import Link from "next/link"
import { useRequestStatus } from "../../../shared/hooks/useComputedStatus";

interface FolderRequestDetailProps {
    folderId: string;
    request: DocumentRequest;
    formatDate: (date: Date) => string;
    onRemoveRequest: (folderId: string, requestId: string) => Promise<void>
}

export const FolderRequestDetail = (props: FolderRequestDetailProps) => {
    const { folderId, request, formatDate, onRemoveRequest } = props;

    const status = useRequestStatus(request);

    const getRequestStatusText = (status: ComputedRequestStatus) => {
        switch (status) {
            case 'PENDING': return 'En attente';
            case 'ACCEPTED': return 'Accepté';
            case 'REJECTED': return 'Refusé';
            case 'COMPLETED': return 'Complété';
            default: return status;
        }
    };

    const getRequestStatusClass = (status: ComputedRequestStatus) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'ACCEPTED': return 'bg-green-100 text-green-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            case 'COMPLETED': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{request.civilId}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRequestStatusClass(
                        status
                    )}`}
                >
                    {getRequestStatusText(status)}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(request.createdAt)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(request.expiresAt)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                    href={ROUTES.REQUESTS.DETAIL(request.id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                >
                    Voir
                </Link>
                <button
                    onClick={() => onRemoveRequest(folderId, request.id)}
                    className="text-red-600 hover:text-red-900"
                >
                    Retirer
                </button>
            </td>
        </tr>
    )
}