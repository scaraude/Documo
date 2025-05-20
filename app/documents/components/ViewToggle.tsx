'use client';

import { ReactNode } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ViewToggleProps {
    currentView: 'grid' | 'list';
    onToggle: (view: 'grid' | 'list') => void;
}

export function ViewToggle({ currentView, onToggle }: ViewToggleProps): ReactNode {
    return (
        <ToggleGroup type="single" value={currentView} onValueChange={(value) => value && onToggle(value as 'grid' | 'list')}>
            <ToggleGroupItem value="grid" aria-label="View as grid">
                <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="View as list">
                <List className="h-4 w-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}