- review design homepage:

  - general design with frontend-design skill
  - ajouter un CTA login quelque part, pour l'instant la landing page et très onboarding. Ca donne l'impression qu'il n'y a pas d'utilisateur et c'est complexe pour les utilisateurs déjà inscrit d'accéder à l'app, elle doit aussi refléter l'accès
  - "demandes par email" -> workflow automatique par mail (sous entendu, tu n'as rien a faire et tout passe par de simple mail, donc pas besoin d'outils spécifique pour les clients)
  - "Créez les types de dossiers" -> bien mais a ce stade le user ne sait pas ce qu'est un type de dossier.
  - gain de temps -> mettre en avant: demande automatique, relance automatique, evite les dossiers incomplets et les aller retour par mail.
  - collaboration fuilde -> remplacer par contralisation sécurisée (tout est au même endroit, pour tout le monde)
  - Déploiement rapide -> remplacer par prise en main rapide: créer un dossier, envoyé la demande, attendez la réponse.
  - "Configurez vos types de dossiers" -> est ce que c'est clair ? est ce que ce ne serait pas mieux modèle de dossier ? attention au DDD ici !
  - "Prêt à moderniser votre gestion documentaire ?" -> enlever "se connecter"
  - ajouter une section nous contacté pour envoyé un mail sur suppor@documo.fr

- Data:
  -modélisation comme ceci: Type de dossier (ex: Dossier de location, Dossier de colocation, Dossier de vente, Dossier d’achat, etc) - Modèle de dossier (définit pour l'instant: Les documents à fournir. Plus tard: Les champs à remplir, Les validations, Les règles) (ex: Location résidence principale, Location meublée, Location étudiant) - Dossier (instance) - Pièce -> en anglais: Case Type, Case template, Case, Document
  Donc renommer Folder par Case, FolderType by CaseType, create FolderTemplate, renamme all url and namming in the codebase.

- in app:

  - créer un page dédié pour gérer (créer, modifier, archiver les casetype et casetemplate), reprendre le design dans "Types de dossier" section in www.documo.fr/folders
  - page /folders: montrer les dossiers en cours sous forme de liste/tableau dans la page actuelle, supprimer la partie Types de dossier qui aura sa page dédié.
  - page /requests: faire une pass avec frontend-design skill. La page est un peu trop toyful... Il y a beaucoup de couleurs, des infos qui se répètent (les filtres acceptées, en attente, etc) (la partie "statisques" aussi). Il faudrait quelque chose de plus sobre, plus professionnel. la presentation en liste d'accordéon est bien par contre.
  - page /folder-types/new:
    -titre: "Créer un nouveau type de dossier" -> "Créer un type de dossier"
    -informative description: donner que des exemple pour les agences immo "dossier locatif, demande de crédit, inscription scolaire" -> "dossier locatif, demande de vente, dossier d'achat".
    -form: "Nom du type de dossier" -> "Type de dossier". on focus la liste des types de dossier doit apparaitre avec "créer un type de dossier" en haut des suggestion. A la validation du form, si le type est nouveau le créer. Dans tous les cas créer le template.
    -fix: la suggestion de document est vide.
    -page folders/new: "Vous devez d'abord créer un type de dossier avant de pouvoir créer un dossier" -> "Vous devez d'abord créer un type de dossier avant de pouvoir ouvrir un dossier".

  - page external/requests/:id: Demande de documents -> ajouter en sous titre: "<Prenom> <Nom> souhaite accéder aux documents suivants:"
  - page external/upload/:id: faire une passe avec le frontend-design skill
