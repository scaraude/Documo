#!/usr/bin/env ts-node

import { readFileSync } from 'fs';
import { join } from 'path';
import logger from '@/lib/logger';

interface EnvConfig {
  key: string;
  required: boolean;
  description: string;
  sensitive?: boolean;
}

// Configuration des clés d'environnement attendues
const EXPECTED_ENV_KEYS: EnvConfig[] = [
  {
    key: 'DATABASE_URL',
    required: true,
    description: 'URL de connexion à la base de données PostgreSQL',
    sensitive: true,
  },
  {
    key: 'TEST_DATABASE_URL',
    required: true,
    description: 'URL de connexion à la base de données de test',
    sensitive: true,
  },
  {
    key: 'NODE_ENV',
    required: true,
    description: "Environnement d'exécution (development, production, test)",
  },
  {
    key: 'FROM_EMAIL',
    required: true,
    description: "Adresse email d'expéditeur pour les notifications",
  },
  {
    key: 'BLOB_READ_WRITE_TOKEN',
    required: true,
    description: 'Token Vercel Blob pour le stockage des fichiers',
    sensitive: true,
  },
  {
    key: 'VERCEL_OIDC_TOKEN',
    required: false,
    description: 'Token OIDC Vercel (généré automatiquement)',
    sensitive: true,
  },
  {
    key: 'RESEND_API_KEY',
    required: true,
    description: "Clé API Resend pour l'envoi d'emails",
    sensitive: true,
  },
  {
    key: 'NEXT_PUBLIC_APP_URL',
    required: true,
    description: "URL publique de l'application",
  },
];

/**
 * Parse le fichier .env et retourne un objet avec les clés/valeurs
 */
function parseEnvFile(filePath: string): Record<string, string> {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const env: Record<string, string> = {};

    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          env[key] = valueParts.join('=').replace(/^["']|["']$/g, '');
        }
      }
    });

    return env;
  } catch (error) {
    logger.error(
      { error: (error as Error).message, filePath },
      'Erreur lors de la lecture du fichier .env'
    );
    throw error;
  }
}

/**
 * Masque les valeurs sensibles pour l'affichage
 */
function maskSensitiveValue(value: string, isSensitive = true): string {
  if (!isSensitive) return value;
  if (value.length <= 8) return '***';
  return value.substring(0, 4) + '***' + value.substring(value.length - 4);
}

/**
 * Vérifie les clés d'environnement
 */
function checkEnvKeys(envPath: string = '.env'): void {
  const fullPath = join(process.cwd(), envPath);

  logger.info({ envPath: fullPath }, "Vérification du fichier d'environnement");

  try {
    const envVars = parseEnvFile(fullPath);
    const foundKeys = Object.keys(envVars);

    console.log("\n🔍 VÉRIFICATION DES VARIABLES D'ENVIRONNEMENT\n");
    console.log(`📁 Fichier: ${fullPath}\n`);

    // Vérification des clés requises
    const missingRequired: string[] = [];
    const presentKeys: EnvConfig[] = [];
    const extraKeys: string[] = [];

    // Vérifier les clés attendues
    EXPECTED_ENV_KEYS.forEach(config => {
      if (foundKeys.includes(config.key)) {
        presentKeys.push(config);
      } else if (config.required) {
        missingRequired.push(config.key);
      }
    });

    // Identifier les clés supplémentaires
    const expectedKeyNames = EXPECTED_ENV_KEYS.map(c => c.key);
    foundKeys.forEach(key => {
      if (!expectedKeyNames.includes(key)) {
        extraKeys.push(key);
      }
    });

    // Affichage des résultats
    console.log('✅ CLÉS PRÉSENTES:');
    presentKeys.forEach(config => {
      const value = envVars[config.key];
      const maskedValue = maskSensitiveValue(value, config.sensitive);
      const status = config.required ? '(obligatoire)' : '(optionnelle)';

      console.log(`   ${config.key} = ${maskedValue} ${status}`);
      console.log(`      └── ${config.description}`);
    });

    if (missingRequired.length > 0) {
      console.log('\n❌ CLÉS MANQUANTES (OBLIGATOIRES):');
      missingRequired.forEach(key => {
        const config = EXPECTED_ENV_KEYS.find(c => c.key === key);
        console.log(`   ${key}`);
        if (config) {
          console.log(`      └── ${config.description}`);
        }
      });
    }

    if (extraKeys.length > 0) {
      console.log('\n⚠️  CLÉS SUPPLÉMENTAIRES (non documentées):');
      extraKeys.forEach(key => {
        const maskedValue = maskSensitiveValue(envVars[key]);
        console.log(`   ${key} = ${maskedValue}`);
      });
    }

    // Résumé
    console.log('\n📊 RÉSUMÉ:');
    console.log(`   Total de clés trouvées: ${foundKeys.length}`);
    console.log(
      `   Clés obligatoires présentes: ${presentKeys.filter(c => c.required).length}/${EXPECTED_ENV_KEYS.filter(c => c.required).length}`
    );
    console.log(
      `   Clés optionnelles présentes: ${presentKeys.filter(c => !c.required).length}/${EXPECTED_ENV_KEYS.filter(c => !c.required).length}`
    );
    console.log(`   Clés supplémentaires: ${extraKeys.length}`);

    // Validation finale
    if (missingRequired.length > 0) {
      console.log('\n❌ ÉCHEC: Des clés obligatoires sont manquantes');
      logger.error(
        { missingKeys: missingRequired },
        "Clés d'environnement manquantes"
      );
      process.exit(1);
    } else {
      console.log('\n✅ SUCCÈS: Toutes les clés obligatoires sont présentes');
      logger.info(
        { presentKeys: presentKeys.length, extraKeys: extraKeys.length },
        "Vérification des variables d'environnement terminée"
      );
    }
  } catch (error) {
    console.error(
      '❌ Erreur lors de la vérification:',
      (error as Error).message
    );
    process.exit(1);
  }
}

// Exécution si appelé directement
if (require.main === module) {
  const envFile = process.argv[2] || '.env';
  checkEnvKeys(envFile);
}

export { checkEnvKeys, EXPECTED_ENV_KEYS };
