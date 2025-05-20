import { NextResponse } from 'next/server';
import * as repository from '@/features/request-templates/repository/requestTemplatesRepository';

// GET /api/templates/[id] - Récupérer un template par ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const template = await repository.getTemplateById(params.id);
        if (!template) {
            return NextResponse.json(
                { error: 'Template not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(template);
    } catch (error) {
        console.error(`Error fetching template with ID ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch template' },
            { status: 500 }
        );
    }
}

// PUT /api/templates/[id] - Mettre à jour un template
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const updatedTemplate = await repository.updateTemplate(params.id, body);
        return NextResponse.json(updatedTemplate);
    } catch (error) {
        console.error(`Error updating template with ID ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to update template' },
            { status: 500 }
        );
    }
}