import { NextResponse } from 'next/server';
import * as repository from '@/features/request-templates/repository/requestTemplatesRepository';
import { CreateRequestTemplateParams } from '@/features/request-templates/types';

// GET /api/templates - Récupérer tous les templates
export async function GET() {
    try {
        const templates = await repository.getTemplates();
        return NextResponse.json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        return NextResponse.json(
            { error: 'Failed to fetch templates' },
            { status: 500 }
        );
    }
}

// POST /api/templates - Créer un nouveau template
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const template = await repository.createTemplate(body as CreateRequestTemplateParams);
        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        console.error('Error creating template:', error);
        return NextResponse.json(
            { error: 'Failed to create template' },
            { status: 500 }
        );
    }
}