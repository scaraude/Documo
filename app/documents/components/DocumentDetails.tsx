'use client';

import { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Tabs, TabsContent, TabsList, TabsTrigger, Button, Card, ScrollArea } from '@/shared/components';
import { Loader2, Download, FileImage, FileText, FileCog, Calendar } from 'lucide-react';
import { DocumentRequest, AppDocument } from '@/shared/types';
import { getDocumentsByRequest } from '@/features/documents/api/documentsApi';
import { ALLOWED_FILE_TYPES } from '@/shared/constants/documents/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DocumentDetailsProps {
    request: DocumentRequest | null;
    isOpen: boolean;
    onClose: () => void;
}

export function DocumentDetails({ request, isOpen, onClose }: DocumentDetailsProps) {
    const [documents, setDocuments] = useState<AppDocument[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [activeTab, setActiveTab] = useState('documents');

    const loadDocuments = useCallback(async () => {
        if (!request) return;

        try {
            setIsLoading(true);
            setError(null);
            const docs = await getDocumentsByRequest(request.id);
            setDocuments(docs);
        } catch (err) {
            console.error('Error loading documents:', err);
            setError(err instanceof Error ? err : new Error('Failed to load documents'));
        } finally {
            setIsLoading(false);
        }
    }, [request]);

    useEffect(() => {

        if (isOpen && request) {
            loadDocuments();
        }
    }, [isOpen, request, loadDocuments]);

    if (!request) return null;

    const formatCreatedDate = (date: Date) => {
        try {
            return new Date(date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return 'Date inconnue';
        }
    };

    const formatTimeAgo = (date: Date) => {
        try {
            return formatDistanceToNow(new Date(date), {
                addSuffix: true,
                locale: fr
            });
        } catch {
            return '';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-xl flex items-center gap-2">
                        Demande - <span className="font-mono bg-secondary px-2 py-1 rounded text-secondary-foreground">{request.civilId}</span>
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="documents" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="px-6">
                        <TabsList className="w-full grid grid-cols-2">
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                            <TabsTrigger value="details">Détails</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="documents" className="mt-4 focus-visible:outline-none focus-visible:ring-0">
                        <ScrollArea className="h-[60vh] px-6">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-32">
                                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                </div>
                            ) : error ? (
                                <div className="p-4 text-center text-destructive">
                                    <p>Impossible de charger les documents.</p>
                                    <Button variant="outline" className="mt-2" onClick={() => loadDocuments()}>
                                        Réessayer
                                    </Button>
                                </div>
                            ) : documents.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">
                                        Aucun document disponible pour cette demande.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3 pb-6">
                                    {documents.map((doc) => (
                                        <DocumentCard key={doc.id} document={doc} />
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="details" className="focus-visible:outline-none focus-visible:ring-0">
                        <ScrollArea className="h-[60vh]">
                            <div className="px-6 py-4">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                            Identifiant
                                        </h3>
                                        <p className="font-medium">{request.civilId}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                            Documents demandés
                                        </h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {request.requestedDocuments.map((doc, index) => (
                                                <li key={index} className="text-sm">
                                                    {doc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                            Statut
                                        </h3>
                                        <div className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                            {request.status}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                            Date de création
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{formatCreatedDate(request.createdAt)}</span>
                                            <span className="text-xs text-muted-foreground">
                                                ({formatTimeAgo(request.createdAt)})
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                            Expiration
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{formatCreatedDate(request.expiresAt)}</span>
                                            <span className="text-xs text-muted-foreground">
                                                ({formatTimeAgo(request.expiresAt)})
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>

                <div className="p-4 flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Fermer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function DocumentCard({ document }: { document: AppDocument }) {
    // Get file icon based on type
    function getDocumentIcon() {
        const { type } = document.metadata;

        if (type === ALLOWED_FILE_TYPES.PDF) {
            return <FileCog className="h-8 w-8 text-red-500" />;
        }

        if (type === ALLOWED_FILE_TYPES.JPEG || type === ALLOWED_FILE_TYPES.PNG) {
            return <FileImage className="h-8 w-8 text-blue-500" />;
        }

        return <FileText className="h-8 w-8 text-muted-foreground" />;
    }

    // Format file size
    function formatFileSize(bytes: number) {
        if (bytes < 1024) return bytes + ' bytes';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    return (
        <Card className="p-4 flex items-start hover:bg-accent/50 transition-colors">
            <div className="shrink-0 mr-4 p-2 bg-accent rounded">
                {getDocumentIcon()}
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="font-medium truncate" title={document.metadata.name}>
                    {document.metadata.name}
                </h3>

                <div className="mt-1 text-muted-foreground text-sm">
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                        <span>{document.type}</span>
                        <span>{formatFileSize(document.metadata.size)}</span>
                        <span
                            className={
                                document.status === 'VALID' ? 'text-green-600' :
                                    document.status === 'INVALID' ? 'text-destructive' :
                                        'text-muted-foreground'
                            }
                        >
                            {document.status}
                        </span>
                    </div>
                </div>
            </div>

            {document.url && (
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 ml-2"
                    asChild
                >
                    <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Télécharger"
                    >
                        <Download className="h-4 w-4" />
                    </a>
                </Button>
            )}
        </Card>
    );
}