'use client';

import { ReactNode } from 'react';
import { DocumentRequest } from '@/shared/types';
import { DOCUMENT_REQUEST_STATUS } from '@/shared/constants';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RequestIconProps {
    request: DocumentRequest;
    onClick: () => void;
}

export function RequestIcon({ request, onClick }: RequestIconProps): ReactNode {
    const { civilId, requestedDocuments, createdAt } = request;

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // Determine icon color based on status
    const getStatusColor = () => {
        switch (request.status) {
            case DOCUMENT_REQUEST_STATUS.ACCEPTED:
                return 'text-green-500 bg-green-50';
            case DOCUMENT_REQUEST_STATUS.COMPLETED:
                return 'text-blue-500 bg-blue-50';
            default:
                return 'text-gray-500 bg-gray-50';
        }
    };

    return (
        <Card
            onClick={onClick}
            className="cursor-pointer transition-all duration-200 hover:shadow-md"
        >
            <CardHeader className="pb-2">
                <div className={cn("p-4 rounded-lg mb-2 flex justify-center", getStatusColor())}>
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