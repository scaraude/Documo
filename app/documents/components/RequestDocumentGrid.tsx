'use client';

import { useEffect, useState } from 'react';
import { useRequest } from '@/features/requests/hooks/useRequest';
import { DocumentRequest } from '@/shared/types';
import { RequestIcon } from './RequestIcon';
import { RequestListItem } from './RequestListItem';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileText } from 'lucide-react';

interface RequestDocumentGridProps {
    viewMode: 'grid' | 'list';
    onRequestClick: (request: DocumentRequest) => void;
}

export function RequestDocumentGrid({ viewMode, onRequestClick }: RequestDocumentGridProps) {
    const { requests, isLoaded, error } = useRequest();
    const [filteredRequests, setFilteredRequests] = useState<DocumentRequest[]>([]);

    useEffect(() => {
        // Filter requests that have the status 'ACCEPTED' or 'COMPLETED'
        if (isLoaded && requests) {
            const acceptedRequests = requests.filter(
                request => request.status === 'ACCEPTED' || request.status === 'COMPLETED'
            );
            setFilteredRequests(acceptedRequests);
        }
    }, [isLoaded, requests]);

    if (!isLoaded) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array(5).fill(0).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-24 w-full mb-4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-16 mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>
                    Une erreur est survenue lors du chargement des demandes.
                </AlertDescription>
            </Alert>
        );
    }

    if (filteredRequests.length === 0) {
        return (
            <Card className="text-center p-8">
                <div className="flex flex-col items-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle>Aucun document disponible</CardTitle>
                    <CardDescription className="mt-2">
                        Il n&apos;y a pas de documents à afficher pour le moment.
                    </CardDescription>
                </div>
            </Card>
        );
    }

    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredRequests.map((request) => (
                    <RequestIcon
                        key={request.id}
                        request={request}
                        onClick={() => onRequestClick(request)}
                    />
                ))}
            </div>
        );
    }

    return (
        <Card>
            <ul className="divide-y">
                {filteredRequests.map((request) => (
                    <RequestListItem
                        key={request.id}
                        request={request}
                        onClick={() => onRequestClick(request)}
                    />
                ))}
            </ul>
        </Card>
    );
}