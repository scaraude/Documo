-- Insert default document types

INSERT INTO "document_types" ("id", "label", "description", "acceptedFormats", "maxSizeMB", "createdAt")
VALUES
  (
    gen_random_uuid(),
    'Justificatif de domicile',
    'Facture d''électricité, de gaz, d''eau, de téléphone fixe ou d''accès à internet, quittance de loyer, ou attestation d''assurance habitation de moins de 3 mois',
    ARRAY['application/pdf', 'image/jpeg', 'image/png'],
    5,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid(),
    'Carte d''identité',
    'Carte nationale d''identité française en cours de validité (recto-verso)',
    ARRAY['application/pdf', 'image/jpeg', 'image/png'],
    5,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid(),
    'Passeport',
    'Passeport français en cours de validité',
    ARRAY['application/pdf', 'image/jpeg', 'image/png'],
    5,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid(),
    'Relevé de salaire',
    'Bulletin de salaire récent (dernier mois ou trois derniers mois selon les besoins)',
    ARRAY['application/pdf', 'image/jpeg', 'image/png'],
    10,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid(),
    'Déclaration d''impôts',
    'Avis d''imposition ou de non-imposition sur les revenus de l''année précédente',
    ARRAY['application/pdf'],
    10,
    CURRENT_TIMESTAMP
  );
