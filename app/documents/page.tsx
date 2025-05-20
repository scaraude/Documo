'use client';

import { useState } from 'react';
import { RequestDocumentGrid } from './components/RequestDocumentGrid';
import { DocumentDetails } from './components/DocumentDetails';
import { DocumentRequest } from '@/shared/types';
import { ViewToggle } from './components/ViewToggle';

export default function DocumentsPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleRequestClick = (request: DocumentRequest) => {
        setSelectedRequest(request);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Mes Documents</h1>
                <ViewToggle
                    currentView={viewMode}
                    onToggle={(mode) => setViewMode(mode)}
                />
            </div>

            <RequestDocumentGrid
                viewMode={viewMode}
                onRequestClick={handleRequestClick}
            />

            <DocumentDetails
                request={selectedRequest}
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
            />
        </div>
    );
}