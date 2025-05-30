'use client'
import React, { useState } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useFolderTypes } from '../../features/folder-types';
import { useFolder } from '../../features/folders/hooks/useFolder';
import { Folder } from '../../features/folders/types';
import { useFolderStatus } from '../../shared/hooks/useComputedStatus';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const FoldersPageUI = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { folderTypes } = useFolderTypes();
    const { folders } = useFolder();

    const FolderGridItem = ({ folder }: { folder: Folder }) => {
        const folderStatus = useFolderStatus(folder);

        return (<div className="group cursor-pointer">
            {/* Folder Representation */}
            <div className="relative">
                {/* Folder Tab */}
                <div className="absolute -top-2 left-4 bg-stone-200 w-11 h-6 rounded-t-lg border-2 border-stone-300 border-b-0 group-hover:-translate-y-2 duration-200 group-hover:bg-stone-300"></div>

                {/* Folder Body */}
                <div className="bg-stone-200 border-2 border-stone-300 rounded-lg h-32 p-4 shadow-lg transition-all duration-200 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:bg-stone-300 relative overflow-hidden">
                    {/* Date in top right */}
                    <div className="absolute top-2 right-2">
                        <p className="text-xs text-gray-600">
                            {formatDistanceToNow(new Date(folder.lastActivityAt), { locale: fr })}
                        </p>
                    </div>

                    {/* Folder Content */}
                    <div className="h-full flex flex-col justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                                {folder.name}
                            </h3>
                            <div className="flex text-gray-500 text-xs my-4">
                                <FileText className="h-3 w-3" />
                                <span className="ml-1">{folder.requestedDocuments.length} document(s)</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${folderStatus === 'COMPLETED' ? 'bg-green-200 text-green-800' :
                                folderStatus === 'PENDING' ? 'bg-orange-200 text-orange-800' :
                                    'bg-blue-200 text-blue-800'
                                }`}>
                                {folderStatus === 'COMPLETED' ? 'Terminé' :
                                    folderStatus === 'PENDING' ? 'En attente' : 'Actif'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">

                {/* Types de dossier Section */}
                <div className="mb-12">
                    <div className="flex justify-end items-center mb-8">

                        <div className="h-full w-full flex flex-col items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">Types de dossier :</h1>
                            <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg">
                                <Plus className="h-5 w-5" />
                                Nouveau type de dossier
                            </button>
                        </div>


                        {/* Carousel */}
                        <div className="relative">
                            <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg transition-all">
                                <ChevronLeft className="h-6 w-6 text-gray-600" />
                            </button>

                            <div className="flex gap-6 overflow-hidden px-12">
                                {folderTypes.map((type) => (
                                    <div key={type.id} className="flex-shrink-0 group cursor-pointer">
                                        {/* Folder Tab */}
                                        <div className="relative">

                                            {/* Folder Body */}
                                            <div className="bg-white border-4 border-teal-500 rounded-xl p-6 w-42 h-52 flex flex-col justify-center items-center shadow-lg transition-all group-hover:shadow-xl group-hover:-translate-y-1">
                                                <h3 className="font-bold text-gray-900 text-center text-sm leading-tight mb-2">
                                                    {type.name}
                                                </h3>
                                                <div className="flex text-gray-500 text-xs my-4">
                                                    <FileText className="h-3 w-3" />
                                                    <span className="ml-1">{type.requiredDocuments.length} document(s)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg transition-all">
                                <ChevronRight className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dossiers en cours Section */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Dossiers en cours:</h2>

                    {/* Search Bar */}
                    <div className="flex justify-center mb-12">
                        <div className="relative w-full max-w-lg">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Recherche"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-200 rounded-full text-lg focus:outline-none focus:border-blue-400 shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Folders Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {folders.map((folder) => (
                            <FolderGridItem key={folder.id} folder={folder} />
                        ))}
                    </div>

                    {/* Add New Folder Button */}
                    <div className="flex justify-center mt-8">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
                            <Plus className="h-5 w-5" />
                            Nouveau dossier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoldersPageUI;