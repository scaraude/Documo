'use client';

import { ReactNode } from 'react';
import { ComputedRequestStatus, DocumentRequest } from '@/shared/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/components';
import { Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRequestStatus } from '@/shared/hooks/useComputedStatus';

interface RequestIconProps {
    request: DocumentRequest;
    onClick: () => void;
}

export function RequestIcon({ request, onClick }: RequestIconProps): ReactNode {
    const { civilId, requestedDocuments, createdAt } = request;
    const requestStatus = useRequestStatus(request);

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // Determine icon color based on status
    const getStatusColor = (requestStatus: ComputedRequestStatus) => {
        switch (requestStatus) {
            case "ACCEPTED":
                return 'text-green-500 bg-green-50';
            case "COMPLETED":
                return 'text-blue-500 bg-blue-50';
            case "PENDING":
            case "REJECTED":
                return 'text-gray-500 bg-gray-50';
            default:
                const never: never = requestStatus;
                return never;
        }
    };

    return (
        <Card
            onClick={onClick}
            className="cursor-pointer transition-all duration-200 hover:shadow-md"
        >
            <CardHeader className="pb-2">
                <div className={cn("p-4 rounded-lg mb-2 flex justify-center", getStatusColor(requestStatus))}>
                    <Folder size={48} />
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <h3 className="text-base font-medium truncate" title={civilId}>
                    ID: {civilId}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {requestedDocuments.length} document{requestedDocuments.length > 1 ? 's' : ''}
                </p>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>
            </CardFooter>
        </Card>
    );
}