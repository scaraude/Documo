'use client'
import Link from 'next/link'
import { FolderType } from '../types'
import { ROUTES } from '@/shared/constants'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/shared/components'
import { FolderOpen, FileText, Plus, TrendingUp } from 'lucide-react'
import { APP_DOCUMENT_TYPE_TO_LABEL_MAP } from '../../../shared/mapper'

interface FolderTypeCarouselProps {
    folderTypes: Array<FolderType & {
        foldersCount?: number;
        activeFoldersCount?: number;
    }>
}

export const FolderTypeCarousel = ({ folderTypes }: FolderTypeCarouselProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {folderTypes.map((folderType) => (
                <Card key={folderType.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FolderOpen className="h-6 w-6 text-blue-600" />
                            </div>
                            {folderType.foldersCount !== undefined && (
                                <Badge variant="secondary" className="text-xs">
                                    {folderType.foldersCount} dossier{folderType.foldersCount > 1 ? 's' : ''}
                                </Badge>
                            )}
                        </div>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {folderType.name}
                        </CardTitle>
                        {folderType.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {folderType.description}
                            </p>
                        )}
                    </CardHeader>

                    <CardContent className="pt-0">
                        <div className="space-y-3">
                            {/* Documents Required */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Documents requis
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {folderType.requiredDocuments.slice(0, 3).map((doc, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {APP_DOCUMENT_TYPE_TO_LABEL_MAP[doc]}
                                        </Badge>
                                    ))}
                                    {folderType.requiredDocuments.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{folderType.requiredDocuments.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            {(folderType.foldersCount !== undefined || folderType.activeFoldersCount !== undefined) && (
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    {folderType.activeFoldersCount !== undefined && (
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" />
                                            <span>{folderType.activeFoldersCount} actif{folderType.activeFoldersCount > 1 ? 's' : ''}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                                <Link
                                    href={`${ROUTES.FOLDERS.NEW}?typeId=${folderType.id}`}
                                    className="flex-1"
                                >
                                    <button className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Créer dossier
                                    </button>
                                </Link>
                                <Link href={`/folder-types/${folderType.id}`}>
                                    <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                        Voir
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}