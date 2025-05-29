'use client'
import { CustomField } from '../types';
import { z } from 'zod';

export function useCustomFieldValidation() {
    const validateFieldValue = (field: CustomField, value: string | number | null | undefined): string | null => {
        // Validation de base
        if (field.required && !value) {
            return `${field.name} est requis`;
        }

        if (!value) return null;

        // Validation par type
        switch (field.type) {
            case 'email':
                if (!z.string().email().safeParse(value).success) {
                    return 'Email invalide';
                }
                break;

            case 'url':
                if (!z.string().url().safeParse(value).success) {
                    return 'URL invalide';
                }
                break;

            case 'tel':
                if (!z.string().regex(/^\+?[\d\s-()]+$/).safeParse(value).success) {
                    return 'Numéro de téléphone invalide';
                }
                break;

            case 'number':
                const num = Number(value);
                if (isNaN(num)) return 'Nombre invalide';

                if (field.validation?.min !== undefined && num < field.validation.min) {
                    return `La valeur doit être supérieure ou égale à ${field.validation.min}`;
                }
                if (field.validation?.max !== undefined && num > field.validation.max) {
                    return `La valeur doit être inférieure ou égale à ${field.validation.max}`;
                }
                break;

            case 'text':
                const str = String(value);
                if (field.validation?.minLength && str.length < field.validation.minLength) {
                    return `Minimum ${field.validation.minLength} caractères`;
                }
                if (field.validation?.maxLength && str.length > field.validation.maxLength) {
                    return `Maximum ${field.validation.maxLength} caractères`;
                }
                if (field.validation?.pattern) {
                    const regex = new RegExp(field.validation.pattern);
                    if (!regex.test(str)) {
                        return 'Format invalide';
                    }
                }
                break;
        }

        return null;
    };

    const validateAllFields = (
        fields: CustomField[],
        values: Record<string, string | number | null | undefined>
    ): Record<string, string> => {
        const errors: Record<string, string> = {};

        fields.forEach(field => {
            const error = validateFieldValue(field, values[field.id]);
            if (error) {
                errors[field.id] = error;
            }
        });

        return errors;
    };

    const getFieldInputType = (fieldType: CustomField['type']): string => {
        const typeMap: Record<CustomField['type'], string> = {
            text: 'text',
            number: 'number',
            date: 'date',
            email: 'email',
            tel: 'tel',
            url: 'url'
        };
        return typeMap[fieldType];
    };

    return {
        validateFieldValue,
        validateAllFields,
        getFieldInputType
    };
}