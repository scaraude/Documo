import React from 'react';
import { Folder } from '../types';

interface FolderSelectorProps {
    folders: Folder[];
    selectedFolderId: string | null;
    setSelectedFolderId: (id: string | null) => void;
}

export const FolderSelector: React.FC<FolderSelectorProps> = ({
    folders,
    selectedFolderId,
    setSelectedFolderId
}) => {
    return (
        <div className="space-y-2">
            {folders.map((folder) => (
                <label
                    key={folder.id}
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${selectedFolderId === folder.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'hover:bg-gray-50'
                        }`}
                >
                    <input
                        type="radio"
                        name="folder"
                        value={folder.id}
                        checked={selectedFolderId === folder.id}
                        onChange={() => setSelectedFolderId(folder.id)}
                        className="mr-3"
                    />
                    <div>
                        <span className="font-medium">{folder.name}</span>
                        <p className="text-sm text-gray-500">
                            {folder.requestedDocuments.length} type(s) de document(s)
                            {folder.requestsCount !== undefined && ` • ${folder.requestsCount} demande(s)`}
                        </p>
                    </div>
                </label>
            ))}
        </div>
    );
};