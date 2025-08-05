# Simulateur d'Audit URSSAF CSE – Happypal

## Objectif
Développer un outil lead gen intégré dans une page Webflow via iframe, qui permet aux élus CSE :

- De simuler la conformité URSSAF de leurs avantages.
- D'obtenir un score et un audit complet après avoir laissé leurs coordonnées (lead magnet).
- De télécharger un rapport PDF personnalisé.

## Tech stack

- **Next.js 14 (App Router)** – Framework React.
- **TypeScript** – Typage fort.
- **TailwindCSS + Shadcn UI** – UI moderne et rapide.
- **Node API Routes** – Calculs et génération du rapport.
- **Vercel** – Déploiement.
- **HTML iframe** – Intégration Webflow.

## 1. Installation de la stack

### Prérequis
- Node.js ≥ 18
- Git
- Compte Vercel (pour le déploiement)
- Editor : Cursor (idéal pour live coding avec IA)

### Commande de démarrage
```bash
npx create-next-app simulateur-urssaf --typescript --app
cd simulateur-urssaf
```

## 2. Ajout UI & Tailwind

### Installer Shadcn UI :
```bash
npx shadcn-ui@latest init
```

### Ajouter les composants nécessaires :
```bash
npx shadcn-ui@latest add input button card checkbox form textarea dialog
```

Vérifier que `tailwind.config.js` contient les presets Shadcn.

## 3. Arborescence recommandée

```
simulateur-urssaf/
│
├── app/
│   ├── page.tsx             # Page principale du simulateur
│   ├── api/
│   │   ├── calcule/route.ts # Endpoint calcul score URSSAF
│   │   └── lead/route.ts    # Endpoint enregistrement lead
│
├── components/
│   ├── FormCSE.tsx          # Étape 1
│   ├── PreviewResult.tsx    # Étape 2 (score partiel)
│   ├── LeadForm.tsx         # Étape 3 (lead)
│   ├── FullResult.tsx       # Étape 4
│   └── PDFReport.tsx        # Génération PDF
│
├── lib/
│   └── calculateScore.ts    # Logique URSSAF
│
├── public/
│
└── README.md
```

## 4. Logique produit (Flow)

### Étape 1 : Formulaire CSE
- **Inputs** : effectif, budget ASC, avantages (checkbox : chèques cadeaux, CESU, billetterie, etc.).
- **Objectif** : collecter les données brutes du CSE.

### Étape 2 : Score partiel
- Appel API `/api/calcule` → retourne score global (ex : 64 %).
- **Affichage** :
  - Score + "X alertes détectées" (sans détails).
  - CTA : "Recevoir mon audit complet".

### Étape 3 : Formulaire Lead
- **Champs** : prénom, nom, email pro, téléphone, entreprise, fonction CSE.
- **Action** : POST `/api/lead` → stocker lead + form CSE.

### Étape 4 : Résultats complets
- Score complet + alertes détaillées + conseils.
- PDF téléchargeable via bouton.

## 5. Règles URSSAF (Scoring)

**Score global : 100 pts**

| Critère URSSAF | Points | Règle |
|---|---|---|
| Chèques cadeaux conformes (événement + plafond 5% PASS) | +25 | Max ~1 086 € en 2025 |
| Pas de double avantage pour le même événement | +5 | Sinon -10 |
| Voyages collectifs conformes (≠ usage perso) | +10 | Sinon -10 |
| CESU utilisé correctement | +10 | Sinon -10 |
| Avantages accessibles à tous (pas d'ancienneté) | +10 | Ancienneté interdite depuis 2024 |
| Budget ASC ≥ 50 €/salarié/an | +5 | Sinon alerte |
| Aide repas conforme URSSAF (< 6,91 €/repas) | +10 | Sinon -5 |
| Critères sociaux autorisés (QF, enfants) | +5 | Bonus |
| Autres incohérences | -5/-10 | Ex : monétisation avantages |

## 6. Génération PDF

Utiliser `@react-pdf/renderer` ou `html2pdf.js`.

**Contenu PDF :**
- Résumé réponses
- Score global
- Alertes
- Recommandations
- Branding Happypal
- Disclaimer : "Basé sur URSSAF 2025 – résultat indicatif."

## 7. API Endpoints

### `/api/calcule` (POST)
**Input :**
```json
{
  "effectif": 50,
  "budget": 20000,
  "avantages": {
    "chequesCadeaux": { "montant": 200, "evenements": ["Noel"] },
    "cesu": true,
    "billetterie": false
  }
}
```

**Output :**
```json
{
  "score": 64,
  "alertes": ["Montant chèque cadeau > 5% PASS"]
}
```

### `/api/lead` (POST)
**Input :**
```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean@entreprise.com",
  "telephone": "0600000000",
  "entreprise": "Entreprise X",
  "fonction": "Président CSE",
  "score": 64
}
```

**Action :** stocker ou envoyer au CRM.

## 8. Déploiement

1. Push sur GitHub.
2. Connecter à Vercel.
3. Déployer sur `https://simulateur.happypal.com`.

## 9. Intégration Webflow

Ajouter un bloc Embed avec :

```html
<iframe
  src="https://simulateur.happypal.com"
  width="100%"
  height="1600"
  style="border:none;overflow:hidden"
  allowfullscreen>
</iframe>
```

## 10. Checklist de développement

### Semaine 1 : Setup + UI
- [x] Créer projet Next.js + Tailwind + Shadcn.
- [ ] Composant FormCSE (étape 1).
- [ ] API `/api/calcule` avec `calculateScore.ts`.

### Semaine 2 : Lead capture + Résultat
- [ ] UI PreviewResult (étape 2).
- [ ] UI LeadForm (étape 3).
- [ ] UI FullResult (étape 4).
- [ ] API `/api/lead` → CRM ou log JSON.

### Semaine 3 : PDF + Déploiement
- [ ] Génération rapport PDF.
- [ ] Déploiement sur Vercel.
- [ ] Intégration iframe dans Webflow.

## 11. Améliorations futures

- Ajout analytics (Matomo ou GTM).
- Stockage leads dans Airtable / HubSpot via Zapier.
- Test A/B du CTA lead (pop-up vs inline).
- Multi-langue (fr/en).

## Prochaines étapes

👉 Souhaites-tu que je t'écrive un `calculateScore.ts` complet (avec toutes les règles URSSAF codées et commentées) pour le placer dans `lib/` et tester immédiatement dans Cursor ?
