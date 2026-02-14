# Documo MVP - Tickets Techniques

> **Objectif MVP** : Design fini, professionnel, qui inspire confiance. Les features sont présentes, focus sur le polish UI/UX.

---

## 🎨 Référence Design (Brand Book v1)

| Élément              | Valeur                              |
| -------------------- | ----------------------------------- |
| **Bleu Documo**      | `#2B7AE8`                           |
| **Bleu Profond**     | `#1A5BB5` (hover)                   |
| **Bleu Clair**       | `#E8F1FC` (fonds)                   |
| **Noir Doux**        | `#1A1A2E` (texte principal)         |
| **Texte secondaire** | `#4A4A5A`                           |
| **Texte tertiaire**  | `#8E8E9E`                           |
| **Fond clair**       | `#F4F5F7`                           |
| **Police**           | Inter                               |
| **Espacement**       | Base 8 (4, 8, 16, 24, 32, 48, 64px) |
| **Ton**              | Tutoiement, sobre, clair, rassurant |

---

## 📋 Tickets MVP - Priorité Haute

### TICKET-001: Refonte Design Homepage

**Priorité** : 🔴 Critique
**Estimation** : 1-2 jours
**Type** : Design/Frontend

#### Description

La landing page doit refléter le Brand Book : sobre, professionnelle, inspirant confiance. Utiliser le skill `frontend-design` pour une refonte complète.

#### Critères d'acceptation

- [x] Palette de couleurs conforme au Brand Book
- [x] Typographie Inter avec l'échelle définie
- [x] Espacement base 8
- [x] Ton sobre (pas d'emojis excessifs, pas de "Super !", pas de "🎉")
- [x] Hero clair : problème → solution
- [x] Beaucoup d'espace blanc
- [x] Ombres subtiles sur les cartes (elevation 1-2)

#### Notes techniques

- Vérifier les contrastes (ratio minimal 4.5:1)
- Utiliser les icônes Lucide (style outline, 1.5-2px)

---

### TICKET-002: Ajouter CTA Login sur Homepage

**Priorité** : 🔴 Critique
**Estimation** : 0.5 jour
**Type** : UX/Frontend

#### Description

La landing page actuelle est trop orientée onboarding. Les utilisateurs existants doivent pouvoir accéder facilement à l'app.

#### Critères d'acceptation

- [x] Bouton "Se connecter" visible dans le header/navigation
- [x] CTA secondaire discret mais accessible
- [x] Ne pas surcharger le hero principal

#### Emplacement suggéré

- Header : lien "Se connecter" à droite
- Ou bouton secondaire (outline) à côté du CTA principal

---

### TICKET-003: Réviser le Wording Homepage

**Priorité** : 🔴 Critique
**Estimation** : 0.5 jour
**Type** : UX/Copywriting

#### Description

Adapter les textes pour être clairs, accessibles et conformes au Brand Book.

#### Modifications requises

| Section actuelle              | Nouveau texte                                                                             | Raison                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| "Demandes par email"          | "Workflow automatique par email"                                                          | Clarifier que tout passe par email, sans outil spécifique côté client |
| "Gain de temps"               | Mettre en avant : demande automatique, relance automatique, évite les dossiers incomplets | Plus concret                                                          |
| "Collaboration fluide"        | "Centralisation sécurisée" + "Tout est au même endroit, pour tout le monde"               | Plus précis                                                           |
| "Déploiement rapide"          | "Prise en main rapide" + "Crée un dossier, envoie la demande, attends la réponse"         | Plus simple                                                           |
| "Créez les types de dossiers" | Ajouter une explication contextuelle ou un exemple                                        | Le concept n'est pas clair au premier abord                           |
| Section CTA finale            | Retirer "Se connecter" (doublon avec header)                                              | Éviter la redondance                                                  |

#### Ton à respecter

- Tutoiement
- Phrases courtes
- Pas de jargon ("synergies", "disruption", "solutions innovantes")
- Test : "Ma grand-mère comprendrait-elle ?"

---

### TICKET-004: Ajouter Section Contact Homepage

**Priorité** : 🟡 Haute
**Estimation** : 0.25 jour
**Type** : Frontend

#### Description

Ajouter une section de contact en bas de page.

#### Critères d'acceptation

- [x] Section sobre avec titre "Une question ?"
- [x] Lien mailto vers support@documo.fr
- [x] Style cohérent avec le reste de la page
- [x] Pas de formulaire complexe (simplicité)

---

### TICKET-005: Refonte Page /requests

**Priorité** : 🔴 Critique
**Estimation** : 1-2 jours
**Type** : Design/Frontend

#### Description

La page est trop "toyful" avec beaucoup de couleurs et d'informations redondantes. Elle doit devenir sobre et professionnelle.

#### Problèmes identifiés

- Trop de couleurs
- Informations répétées (filtres + statistiques)
- Manque de sobriété

#### Critères d'acceptation

- [x] Réduire l'usage des couleurs (bleu Documo pour les actions uniquement)
- [x] Supprimer les statistiques redondantes ou les fusionner
- [x] Conserver la présentation en liste accordéon (c'est bien)
- [x] Utiliser le skill `frontend-design` pour la refonte
- [x] Respecter le Brand Book

---

### TICKET-006: Refonte Page /external/upload/:id

**Priorité** : 🔴 Critique
**Estimation** : 1 jour
**Type** : Design/Frontend

#### Description

Page vue par les clients externes - elle doit inspirer confiance et être ultra simple.

#### Critères d'acceptation

- [x] Design sobre et professionnel
- [x] Instructions claires
- [x] Feedback visuel sur l'upload
- [x] Message de confirmation rassurant
- [x] Utiliser le skill `frontend-design`

#### Notes

Cette page est critique car c'est le premier contact du client avec Documo. Elle doit être irréprochable.

---

### TICKET-007: Améliorer Page /external/requests/:id

**Priorité** : 🟡 Haute
**Estimation** : 0.25 jour
**Type** : UX/Frontend

#### Description

Ajouter un sous-titre contextuel pour clarifier la demande.

#### Modification

Sous le titre "Demande de documents", ajouter :

> "{Prénom} {Nom} souhaite accéder aux documents suivants :"

#### Critères d'acceptation

- [ ] Sous-titre dynamique avec le nom du demandeur
- [ ] Style texte secondaire (`#4A4A5A`)

---

### TICKET-008: Corriger Page /folder-types/new

**Priorité** : 🟡 Haute
**Estimation** : 0.5 jour
**Type** : Bug/UX

#### Description

Plusieurs corrections sur le formulaire de création de type de dossier.

#### Modifications requises

1. **Titre** : "Créer un nouveau type de dossier" → "Créer un type de dossier"
2. **Description** : Exemples orientés agences immo : "dossier locatif, demande de vente, dossier d'achat"
3. **Label** : "Nom du type de dossier" → "Type de dossier"
4. **Comportement autocomplete** :
   - Au focus, afficher la liste des types existants
   - Option "Créer un type de dossier" en haut des suggestions
   - À la validation : créer le type si nouveau, puis créer le template dans tous les cas
5. **Bug fix** : La suggestion de documents est vide (à investiguer)

#### Critères d'acceptation

- [ ] Wording corrigé
- [ ] Autocomplete fonctionnel
- [ ] Suggestions de documents affichées
- [ ] Logique de création type + template

---

### TICKET-009: Corriger Wording Page /folders/new

**Priorité** : 🟢 Moyenne
**Estimation** : 0.1 jour
**Type** : UX

#### Modification

"Vous devez d'abord créer un type de dossier avant de pouvoir créer un dossier"
→
"Vous devez d'abord créer un type de dossier avant de pouvoir ouvrir un dossier"

---

## 📋 Tickets MVP - Priorité Moyenne (Différables)

### TICKET-010: Renommage Data Model (Folder → Case)

**Priorité** : 🟠 Différable
**Estimation** : 2-3 jours
**Type** : Refactoring/Data

#### Description

Aligner la nomenclature avec le modèle métier correct.

#### Mapping

| Ancien          | Nouveau           | Anglais      |
| --------------- | ----------------- | ------------ |
| Type de dossier | Type de dossier   | CaseType     |
| (nouveau)       | Modèle de dossier | CaseTemplate |
| Dossier         | Dossier           | Case         |
| Pièce           | Document          | Document     |

#### Scope

- Renommer `Folder` → `Case`
- Renommer `FolderType` → `CaseType`
- Créer `CaseTemplate`
- Mettre à jour toutes les URLs
- Mettre à jour tout le naming dans le codebase

#### ⚠️ Recommandation

**Différer après MVP** - Ce refactoring est important pour la cohérence DDD mais n'impacte pas l'expérience utilisateur finale. Risque de régressions élevé.

---

### TICKET-011: Créer Page Dédiée Gestion CaseType/CaseTemplate

**Priorité** : 🟠 Différable
**Estimation** : 1-2 jours
**Type** : Feature/Frontend

#### Description

Extraire la gestion des types de dossiers dans une page dédiée, inspirée du design de la section "Types de dossier" sur documo.fr/folders.

#### Critères d'acceptation

- [ ] Page dédiée `/case-types` (ou `/folder-types` si renommage différé)
- [ ] CRUD complet : créer, modifier, archiver
- [ ] Liste claire des templates par type
- [ ] Design cohérent avec le Brand Book

#### Dépendance

- Dépend de TICKET-010 si on veut le bon naming

---

### TICKET-012: Simplifier Page /folders

**Priorité** : 🟠 Différable
**Estimation** : 0.5 jour
**Type** : UX/Frontend

#### Description

Recentrer la page sur les dossiers en cours.

#### Modifications

- [ ] Afficher les dossiers en cours sous forme de liste/tableau
- [ ] Supprimer la section "Types de dossier" (déplacée vers page dédiée - TICKET-011)

#### Dépendance

- TICKET-011 doit être fait avant ou en même temps

---

## 📋 Tickets Ajoutés (Manquants identifiés)

### TICKET-013: Audit Cohérence Couleurs

**Priorité** : 🟡 Haute
**Estimation** : 0.5 jour
**Type** : Design Audit

#### Description

Vérifier que toutes les pages utilisent la palette Brand Book.

#### Points de contrôle

- [ ] Bleu Documo `#2B7AE8` pour tous les CTA
- [ ] Noir Doux `#1A1A2E` pour le texte principal (pas de `#000`)
- [ ] Couleurs fonctionnelles uniquement pour les états (succès, erreur, attention)
- [ ] Pas de couleurs décoratives

---

### TICKET-014: Audit Typographie

**Priorité** : 🟡 Haute
**Estimation** : 0.25 jour
**Type** : Design Audit

#### Description

Vérifier la cohérence typographique sur toutes les pages.

#### Points de contrôle

- [ ] Police Inter chargée correctement
- [ ] Échelle typographique respectée
- [ ] Hauteur de ligne 1.5 pour le texte, 1.2 pour les titres
- [ ] Pas de texte tout en majuscules (sauf labels courts)

---

### TICKET-015: Audit Espacement

**Priorité** : 🟢 Moyenne
**Estimation** : 0.5 jour
**Type** : Design Audit

#### Description

Vérifier que l'espacement base 8 est respecté partout.

#### Points de contrôle

- [ ] Marges et paddings en multiples de 8 (4, 8, 16, 24, 32, 48, 64px)
- [ ] Cohérence des espacements entre composants similaires

---

### TICKET-016: Messages de Confirmation Sobres

**Priorité** : 🟢 Moyenne
**Estimation** : 0.25 jour
**Type** : UX

#### Description

Revoir tous les messages toast/confirmation pour respecter le ton Brand Book.

#### Exemples à corriger

| ❌ Actuel                                             | ✅ Corrigé      |
| ----------------------------------------------------- | --------------- |
| "Super, ton document a été transmis avec succès ! 🎉" | "C'est envoyé." |
| "Félicitations, votre dossier a été créé !"           | "Dossier créé." |

#### Critères

- Pas d'emojis (sauf si demandé explicitement)
- Pas de superlatifs ("Super", "Félicitations")
- Factuel et sobre

---

### TICKET-017: Vérification Accessibilité

**Priorité** : 🟡 Haute
**Estimation** : 0.5 jour
**Type** : Accessibilité

#### Description

L'accessibilité n'est pas une option (Brand Book règle 04).

#### Points de contrôle

- [ ] Contrastes suffisants (4.5:1 texte, 3:1 éléments larges)
- [ ] Navigation clavier fonctionnelle
- [ ] Labels explicites sur tous les inputs
- [ ] Tailles de texte lisibles (min 16px body)
- [ ] Alt text sur les images

---

### TICKET-018: Favicon et Icône App

**Priorité** : 🟢 Moyenne
**Estimation** : 0.25 jour
**Type** : Branding

#### Description

S'assurer que le favicon et les icônes PWA sont conformes au Brand Book.

#### Critères

- [ ] Logo dossier+flèche sur fond bleu
- [ ] Coins arrondis (guidelines iOS/Android)
- [ ] Pas de dégradé, pas d'ombre interne
- [ ] Couleur unie

---

## 📊 Résumé Priorisation

### Sprint MVP (Focus Design)

| Ticket     | Description                   | Estimation | Priorité |
| ---------- | ----------------------------- | ---------- | -------- |
| TICKET-001 | Refonte Design Homepage       | 1-2j       | 🔴       |
| TICKET-002 | CTA Login Homepage            | 0.5j       | 🔴       |
| TICKET-003 | Wording Homepage              | 0.5j       | 🔴       |
| TICKET-004 | Section Contact               | 0.25j      | 🟡       |
| TICKET-005 | Refonte Page /requests        | 1-2j       | 🔴       |
| TICKET-006 | Refonte Page /external/upload | 1j         | 🔴       |
| TICKET-007 | Sous-titre /external/requests | 0.25j      | 🟡       |
| TICKET-008 | Fix /folder-types/new         | 0.5j       | 🟡       |
| TICKET-009 | Wording /folders/new          | 0.1j       | 🟢       |
| TICKET-013 | Audit Couleurs                | 0.5j       | 🟡       |
| TICKET-014 | Audit Typographie             | 0.25j      | 🟡       |
| TICKET-016 | Messages Sobres               | 0.25j      | 🟢       |
| TICKET-017 | Accessibilité                 | 0.5j       | 🟡       |

**Total estimé MVP** : ~7-10 jours

### Post-MVP

| Ticket     | Description            | Estimation | Raison du report                    |
| ---------- | ---------------------- | ---------- | ----------------------------------- |
| TICKET-010 | Renommage Data Model   | 2-3j       | Refactoring risqué, pas d'impact UX |
| TICKET-011 | Page CaseType/Template | 1-2j       | Dépend du renommage                 |
| TICKET-012 | Simplifier /folders    | 0.5j       | Dépend de TICKET-011                |
| TICKET-015 | Audit Espacement       | 0.5j       | Nice-to-have                        |
| TICKET-018 | Favicon/Icône          | 0.25j      | Nice-to-have                        |

---

## 🚀 Ordre d'Exécution Recommandé

1. **TICKET-001** - Refonte Homepage (le plus visible)
2. **TICKET-002** - CTA Login (quick win critique)
3. **TICKET-003** - Wording Homepage (pendant la refonte)
4. **TICKET-004** - Section Contact (pendant la refonte)
5. **TICKET-013** - Audit Couleurs (base pour la suite)
6. **TICKET-014** - Audit Typographie (base pour la suite)
7. **TICKET-005** - Refonte /requests
8. **TICKET-006** - Refonte /external/upload (critique pour les clients)
9. **TICKET-007** - Amélioration /external/requests
10. **TICKET-008** - Fix /folder-types/new
11. **TICKET-016** - Messages Sobres
12. **TICKET-017** - Accessibilité
13. **TICKET-009** - Wording /folders/new

---

_Document généré le 14/02/2026 - Documo MVP Planning_
