# Données du Webhook CSE Simulator

## Structure des données envoyées

Le webhook envoie maintenant les informations suivantes :

### Données de base du lead
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "source": "cse_simulator",
  "lead": {
    "prenom": "Jean",
    "nom": "Dupont",
    "email": "jean.dupont@entreprise.com",
    "telephone": "06 12 34 56 78",
    "entreprise": "Ma Société",
    "fonction": "Président CSE"
  }
}
```

### Résultats du calcul
```json
{
  "resultat": {
    "score": 75,
    "niveauRisque": "a_surveiller",
    "alertes": ["..."],
    "details": {
      "partie1": { "points": 1, "alertes": ["..."] },
      "partie2": { "points": 0, "alertes": [] },
      "partie3": { "points": 1, "alertes": ["..."] },
      "partie4": { "points": 0, "alertes": [] },
      "partie5": { "points": 0, "alertes": [] }
    }
  },
  "score": 75
}
```

### Données CSE complètes
```json
{
  "donneesCSE": {
    "nombreSalaries": 150,
    "avantagesChiffres": {
      "naissance": { "montant": 200 },
      "mariagePacs": { "montant": 150 },
      "rentreeScolaire": { "montant": 100 },
      "noel": { "montant": 50 },
      "feteMeresPeres": { "montant": 30 },
      "departRetraite": { "montant": 100 },
      "saintNicolas": { "montant": 25 },
      "chequesCulture": { "montant": 80 },
      "autresOccasions": false
    },
    "plateformeCSE": {
      "utilisePlateforme": true,
      "nomPlateforme": "Groupe Up / Kalidea",
      "dateFinContrat": "2025-12-31",
      "financement": "asc"
    }
  }
}
```

### Résumé CSE (nouvelles données)
```json
{
  "resumeCSE": {
    "nombreSalaries": 150,
    "plateformeUtilisee": "Groupe Up / Kalidea",
    "dateFinContrat": "2025-12-31",
    "financementPlateforme": "asc",
    "utilisePlateforme": true,
    "avantagesPrincipaux": [
      { "type": "naissance", "montant": 200 },
      { "type": "mariagePacs", "montant": 150 },
      { "type": "rentreeScolaire", "montant": 100 }
    ],
    "alertesPartie1": 1,
    "alertesPartie2": 0,
    "alertesPartie3": 1,
    "alertesPartie4": 0,
    "alertesPartie5": 0
  }
}
```

## Informations ajoutées

### 1. Nombre de salariés
- Permet de comprendre la taille de l'entreprise
- Utile pour segmenter les leads

### 2. Plateforme CSE utilisée
- Nom de la plateforme (ex: "Groupe Up / Kalidea", "Hello CSE", etc.)
- Date de fin de contrat
- Type de financement (ASC, fonctionnement, les deux, je ne sais pas)

### 3. Avantages principaux
- Top 3 des avantages les plus importants par montant
- Permet d'identifier rapidement les avantages prioritaires

### 4. Répartition des alertes
- Nombre d'alertes par partie du questionnaire
- Permet d'identifier les domaines les plus problématiques

## Utilisation dans Zapier

Ces données peuvent être utilisées pour :
- Segmenter les leads selon la taille d'entreprise
- Identifier les prospects utilisant des plateformes spécifiques
- Prioriser les leads selon le niveau de risque
- Personnaliser les communications selon les avantages utilisés
- Créer des rapports sur les tendances du marché CSE 