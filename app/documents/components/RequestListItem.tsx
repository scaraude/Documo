'use client';

import { ReactNode } from 'react';
import { DocumentRequest } from '@/shared/types';
import { DOCUMENT_REQUEST_STATUS } from '@/shared/constants';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, FileText } from 'lucide-react';

interface RequestListItemProps {
    request: DocumentRequest;
    onClick: () => void;
}

export function RequestListItem({ request, onClick }: RequestListItemProps): ReactNode {
    const { civilId, requestedDocuments, createdAt, status } = request;

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getStatusBadgeVariant = () => {
        switch (status) {
            case DOCUMENT_REQUEST_STATUS.ACCEPTED:
                return 'default';
            case DOCUMENT_REQUEST_STATUS.COMPLETED:
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case DOCUMENT_REQUEST_STATUS.ACCEPTED:
                return 'Accepté';
            case DOCUMENT_REQUEST_STATUS.COMPLETED:
                return 'Complété';
            default:
                return status;
        }
    };

    return (
        <li
            className="px-4 py-4 hover:bg-accent/50 cursor-pointer transition-colors"
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-secondary/20 p-2 rounded-md">
                        <FileText className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div className="ml-4">
                        <h4 className="text-sm font-medium">ID: {civilId}</h4>
                        <p className="text-sm text-muted-foreground">
                            {requestedDocuments.length} document{requestedDocuments.length > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Badge variant={getStatusBadgeVariant()}>{getStatusText()}</Badge>
                    <span className="text-sm text-muted-foreground">{formatDate(createdAt)}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>
        </li>
    );
}