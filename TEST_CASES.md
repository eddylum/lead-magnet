# Cas de Test - Simulateur URSSAF CSE

## 🧪 Tests de Validation

### Cas de Test 1 : CSE Conforme (Score élevé)

**Données d'entrée :**
```json
{
  "nomEntreprise": "Entreprise Test Conforme",
  "nombreSalaries": 100,
  "budgetAnnuelASC": 100000,
  "budgetFonctionnement": 5000,
  "avantages": {
    "chequesCadeaux": {
      "utilise": true,
      "montantMoyenAnnuel": 200,
      "evenements": ["Noël (salarié ou enfants)", "Naissance"]
    },
    "billetterieCultureLoisirs": true,
    "voyagesVacancesColonies": {
      "utilise": true,
      "usageCollectif": true
    },
    "cartesSportCulture": true,
    "cesuGardeEnfants": {
      "utilise": true,
      "montantAnnuelMoyen": 500
    },
    "subventionRepas": {
      "utilise": true,
      "montantSubventionJour": 5.50
    },
    "modulation": {
      "quotientFamilial": true,
      "nombreEnfants": true,
      "anciennete": false
    },
    "precisionsLibres": ""
  }
}
```

**Résultat attendu :**
- Score : ~90%
- Niveau : Conforme
- Alertes : 0 ou très peu
- Recommandations : Positives

### Cas de Test 2 : CSE à Risques Modérés

**Données d'entrée :**
```json
{
  "nomEntreprise": "Entreprise Test Risques",
  "nombreSalaries": 50,
  "budgetAnnuelASC": 15000,
  "budgetFonctionnement": 8000,
  "avantages": {
    "chequesCadeaux": {
      "utilise": true,
      "montantMoyenAnnuel": 1500,
      "evenements": ["Noël (salarié ou enfants)"]
    },
    "billetterieCultureLoisirs": false,
    "voyagesVacancesColonies": {
      "utilise": true,
      "usageCollectif": false
    },
    "cartesSportCulture": false,
    "cesuGardeEnfants": {
      "utilise": false,
      "montantAnnuelMoyen": 0
    },
    "subventionRepas": {
      "utilise": true,
      "montantSubventionJour": 8.00
    },
    "modulation": {
      "quotientFamilial": false,
      "nombreEnfants": false,
      "anciennete": false
    },
    "precisionsLibres": ""
  }
}
```

**Résultat attendu :**
- Score : ~65%
- Niveau : Risques modérés
- Alertes : 3-4 alertes
- Recommandations : Ajustements nécessaires

### Cas de Test 3 : CSE à Risques Significatifs

**Données d'entrée :**
```json
{
  "nomEntreprise": "Entreprise Test Critique",
  "nombreSalaries": 20,
  "budgetAnnuelASC": 5000,
  "budgetFonctionnement": 15000,
  "avantages": {
    "chequesCadeaux": {
      "utilise": true,
      "montantMoyenAnnuel": 2000,
      "evenements": []
    },
    "billetterieCultureLoisirs": false,
    "voyagesVacancesColonies": {
      "utilise": true,
      "usageCollectif": false
    },
    "cartesSportCulture": false,
    "cesuGardeEnfants": {
      "utilise": false,
      "montantAnnuelMoyen": 0
    },
    "subventionRepas": {
      "utilise": true,
      "montantSubventionJour": 10.00
    },
    "modulation": {
      "quotientFamilial": false,
      "nombreEnfants": false,
      "anciennete": true
    },
    "precisionsLibres": "Monétisation des avantages"
  }
}
```

**Résultat attendu :**
- Score : ~30%
- Niveau : Risques significatifs
- Alertes : 6+ alertes critiques
- Recommandations : Actions urgentes

## 🔍 Points de Validation

### 1. Calculs Automatiques
- [ ] Score calculé correctement selon les règles URSSAF
- [ ] Niveau de risque déterminé automatiquement
- [ ] Alertes générées pour les non-conformités

### 2. Interface Utilisateur
- [ ] Formulaire en 2 étapes (générales + avantages)
- [ ] Champs conditionnels qui apparaissent/disparaissent
- [ ] Validation des champs obligatoires
- [ ] Messages d'erreur clairs

### 3. Logique Métier
- [ ] Détection des critères d'ancienneté (CRITIQUE)
- [ ] Vérification du budget fonctionnement
- [ ] Validation des plafonds URSSAF
- [ ] Événements autorisés pour les chèques cadeaux

### 4. Flow de Lead Generation
- [ ] Étape 1 : Formulaire CSE
- [ ] Étape 2 : Score partiel + CTA
- [ ] Étape 3 : Capture lead
- [ ] Étape 4 : Résultats complets

## 🚨 Alertes Critiques à Tester

### Ancienneté
- [ ] Checkbox "Modulation par ancienneté" cochée
- [ ] Alerte rouge "CRITIQUE" affichée
- [ ] -15 points appliqués
- [ ] Recommandation urgente

### Budget Fonctionnement
- [ ] Budget fonctionnement > 1000€
- [ ] Alerte sur usage illégal
- [ ] -20 points appliqués

### Chèques Cadeaux
- [ ] Montant > 1086€
- [ ] Aucun événement sélectionné
- [ ] Alertes appropriées

### Voyages
- [ ] Usage personnel sélectionné
- [ ] Alerte requalification salariale
- [ ] -10 points appliqués

## 📊 Métriques de Performance

### Temps de Réponse
- [ ] Calcul du score < 1 seconde
- [ ] Navigation entre étapes fluide
- [ ] Pas de lag sur les interactions

### UX/UI
- [ ] Design responsive (mobile, tablette, desktop)
- [ ] Contraste des couleurs suffisant
- [ ] Navigation au clavier possible
- [ ] Messages d'erreur clairs

### Fonctionnalités
- [ ] Sauvegarde des données entre étapes
- [ ] Validation en temps réel
- [ ] Messages d'aide contextuels
- [ ] Boutons d'action clairs

## 🎯 Tests d'Intégration

### API Endpoints
```bash
# Test calcul
curl -X POST http://localhost:3000/api/calcule \
  -H "Content-Type: application/json" \
  -d '{"nomEntreprise":"Test","nombreSalaries":50,"budgetAnnuelASC":20000,"budgetFonctionnement":5000,"avantages":{"chequesCadeaux":{"utilise":true,"montantMoyenAnnuel":200,"evenements":["Noël (salarié ou enfants)"]},"billetterieCultureLoisirs":false,"voyagesVacancesColonies":{"utilise":false,"usageCollectif":true},"cartesSportCulture":false,"cesuGardeEnfants":{"utilise":false,"montantAnnuelMoyen":0},"subventionRepas":{"utilise":false,"montantSubventionJour":0},"modulation":{"quotientFamilial":false,"nombreEnfants":false,"anciennete":false},"precisionsLibres":""}}'

# Test lead
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{"prenom":"Jean","nom":"Dupont","email":"jean@test.com","telephone":"0600000000","entreprise":"Test Corp","fonction":"Président CSE","score":85}'
```

### Réponses Attendues
- [ ] Status 200 pour les requêtes valides
- [ ] Status 400 pour les données manquantes
- [ ] Status 500 pour les erreurs serveur
- [ ] JSON valide avec tous les champs requis 