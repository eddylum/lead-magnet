// Types pour les données d'entrée selon les nouvelles spécifications
export interface DonneesCSE {
  // Données générales
  nombreSalaries: number;
  
  // PARTIE 1 - VOS AVANTAGES ET LEUR FINANCEMENT
  avantagesChiffres: {
    naissance: {
      montant: number;
    };
    mariagePacs: {
      montant: number;
    };
    rentreeScolaire: {
      montant: number;
    };
    noel: {
      montant: number;
    };
    feteMeresPeres: {
      montant: number;
    };
    departRetraite: {
      montant: number;
    };
    saintNicolas: {
      montant: number;
    };
    chequesCulture: {
      montant: number;
    };
    autresOccasions: boolean;
  };

  // Types d'avantages financés (sans redondance avec les montants)
  typesAvantages: {
    billetterieCulture: boolean;
    sejoursColonies: boolean;
    reductionsSportLoisirs: boolean;
    primesCadeaux: boolean;
    repasEntreprise: boolean;
    abonnementsInternetTV: boolean;
    achatsMateriel: boolean;
  };

  // PARTIE 2 - QUI PEUT EN PROFITER ?
  criteresAttribution: {
    revenuQuotientFamilial: boolean;
    nombreEnfants: boolean;
    tranchesSalaire: boolean;
    anciennete: boolean;
    typeContrat: boolean;
    presenceTempsPlein: boolean;
    categorieSocioProfessionnelle: boolean;
    premierArrive: boolean;
    tirageAuSort: boolean;
  };

  // PARTIE 4 - COMMENT GÉREZ-VOUS VOTRE CSE ?
  gestionCSE: {
    justificatifsRemboursements: boolean;
    cofinancementEmployeur: boolean;
    verificationPlafonds: boolean;
    budgetFonctionnementAvantages: boolean;
    criteresEcritsCommuniques: boolean;
  };

  // PARTIE 5 - FINANCEMENT PLATEFORME CSE
  plateformeCSE: {
    utilisePlateforme: boolean;
    nomPlateforme?: string;
    dateFinContrat?: string;
    financement: 'asc' | 'fonctionnement' | 'les_deux' | 'je_ne_sais_pas';
  };
}

export interface ResultatCalcul {
  score: number;
  niveauRisque: 'conforme' | 'a_surveiller' | 'alerte' | 'critique';
  alertes: string[];
  details: {
    partie1: { points: number; alertes: string[] };
    partie2: { points: number; alertes: string[] };
    partie3: { points: number; alertes: string[] };
    partie4: { points: number; alertes: string[] };
    partie5: { points: number; alertes: string[] };
  };
  recommandations: string[];
}

// Constantes URSSAF 2025
const SEUIL_URSSAF_2025 = 196; // € (5% PMSS 2025)

/**
 * Calcule le score de conformité URSSAF pour un CSE
 * @param donnees - Les données du CSE
 * @returns Le résultat du calcul avec score, alertes et détails
 */
export function calculateScore(donnees: DonneesCSE): ResultatCalcul {
  const resultat: ResultatCalcul = {
    score: 0,
    niveauRisque: 'conforme',
    alertes: [],
    details: {
      partie1: { points: 0, alertes: [] },
      partie2: { points: 0, alertes: [] },
      partie3: { points: 0, alertes: [] },
      partie4: { points: 0, alertes: [] },
      partie5: { points: 0, alertes: [] }
    },
    recommandations: []
  };

  // PARTIE 1 - VOS AVANTAGES EN CHIFFRES
  const avantages = donnees.avantagesChiffres || {};
  
  // Vérification des montants pour chaque avantage
  const avantagesList = [
    { nom: 'Naissance', montant: avantages.naissance?.montant || 0 },
    { nom: 'Mariage/PACS', montant: avantages.mariagePacs?.montant || 0 },
    { nom: 'Rentrée scolaire', montant: avantages.rentreeScolaire?.montant || 0 },
    { nom: 'Noël', montant: avantages.noel?.montant || 0 },
    { nom: 'Fête des mères/pères', montant: avantages.feteMeresPeres?.montant || 0 },
    { nom: 'Départ à la retraite', montant: avantages.departRetraite?.montant || 0 },
    { nom: 'Saint-Nicolas/Sainte-Catherine', montant: avantages.saintNicolas?.montant || 0 }
  ];

  avantagesList.forEach(avantage => {
    if (avantage.montant > 0 && avantage.montant > SEUIL_URSSAF_2025) {
      resultat.details.partie1.alertes.push(
        `🚨 ${avantage.nom} : ${avantage.montant}€ dépasse le seuil URSSAF (${SEUIL_URSSAF_2025}€). ` +
        `Risque : requalification en avantage imposable. ` +
        `Solution : réduire le montant à ${SEUIL_URSSAF_2025}€ maximum ou justifier l'excédent.`
      );
    }
  });

  // Vérification chèques culture
  if (avantages.chequesCulture?.montant > 0) {
    resultat.details.partie1.alertes.push(
      `🎭 Chèques culture : ${avantages.chequesCulture.montant}€ détecté. ` +
      `Risque : URSSAF peut requalifier si pas 100% culturel. ` +
      `Solution : s'assurer que les chèques financent uniquement des activités culturelles (théâtre, musées, etc.).`
    );
  }

  // Vérification autres occasions
  if (avantages.autresOccasions) {
    resultat.details.partie1.alertes.push(
      `⚠️ Autres occasions : événements hors liste URSSAF détectés. ` +
      `Risque : requalification en avantage imposable. ` +
      `Solution : limiter aux événements autorisés (naissance, mariage, rentrée, Noël, etc.) ou justifier l'exception.`
    );
  }

  // PARTIE 2 - QUI PEUT EN PROFITER ?
  const criteres = donnees.criteresAttribution || {};
  
  // Critères autorisés
  const criteresAutorises = [
    criteres.revenuQuotientFamilial || false,
    criteres.nombreEnfants || false,
    criteres.tranchesSalaire || false
  ];

  // Critères interdits
  const criteresInterdits = [
    criteres.anciennete || false,
    criteres.typeContrat || false,
    criteres.presenceTempsPlein || false,
    criteres.categorieSocioProfessionnelle || false,
    criteres.premierArrive || false,
    criteres.tirageAuSort || false
  ];

  if (criteresInterdits.some(critere => critere)) {
    resultat.details.partie2.alertes.push(
      `🚫 Critères interdits détectés (ancienneté, type contrat, etc.). ` +
      `Risque : URSSAF peut requalifier en avantage imposable. ` +
      `Solution : utiliser uniquement des critères objectifs (revenu, nombre d'enfants, tranches de salaire).`
    );
  }

  if (!criteresAutorises.some(critere => critere)) {
    resultat.details.partie2.alertes.push(
      `❌ Absence de critères objectifs d'attribution. ` +
      `Risque : discrimination et requalification URSSAF. ` +
      `Solution : définir des critères écrits et objectifs (revenu, nombre d'enfants, etc.).`
    );
  }

  // Types d'avantages financés (fusion avec partie 1)
  const types = donnees.typesAvantages || {};
  
  if ((types.primesCadeaux || false) || (types.achatsMateriel || false) || (types.abonnementsInternetTV || false)) {
    resultat.details.partie1.alertes.push(
      `💸 Prestations non reconnues comme ASC détectées (primes, matériel, abonnements). ` +
      `Risque : requalification en avantage imposable par l'URSSAF. ` +
      `Solution : financer uniquement des activités sociales et culturelles reconnues (billetterie, séjours, sport, etc.).`
    );
  }

  // PARTIE 3 - COMMENT GÉREZ-VOUS VOTRE CSE ?
  const gestion = donnees.gestionCSE || {};
  
  if (!(gestion.justificatifsRemboursements || false)) {
    resultat.details.partie3.alertes.push(
      `📋 Absence de justificatifs pour les remboursements. ` +
      `Risque : URSSAF peut requalifier en avantage imposable. ` +
      `Solution : exiger factures/reçus pour tous les remboursements et les conserver 3 ans.`
    );
  }

  if ((gestion.cofinancementEmployeur || false) && !(gestion.verificationPlafonds || false)) {
    resultat.details.partie3.alertes.push(
      `💰 Cofinancement employeur sans vérification des plafonds. ` +
      `Risque : dépassement des seuils URSSAF. ` +
      `Solution : additionner CSE + employeur et vérifier les plafonds (ex: 196€ par événement).`
    );
  }

  if (gestion.budgetFonctionnementAvantages || false) {
    resultat.details.partie3.alertes.push(
      `🚨 Utilisation du budget fonctionnement pour des avantages. ` +
      `Risque : détournement de fonds et redressement URSSAF. ` +
      `Solution : utiliser uniquement le budget ASC pour les avantages, budget fonctionnement pour la gestion.`
    );
  }

  if (!(gestion.criteresEcritsCommuniques || false)) {
    resultat.details.partie3.alertes.push(
      `📢 Absence de critères écrits et communiqués. ` +
      `Risque : discrimination et inégalité de traitement. ` +
      `Solution : rédiger un règlement intérieur CSE et le communiquer à tous les salariés.`
    );
  }

  // PARTIE 5 - FINANCEMENT PLATEFORME CSE
  const plateforme = donnees.plateformeCSE || {};
  
  if (plateforme.utilisePlateforme) {
    // Vérification du financement
    if (plateforme.financement === 'fonctionnement') {
      resultat.details.partie5.alertes.push(
        `🚨 Plateforme CSE financée par le budget fonctionnement : ${plateforme.nomPlateforme || 'plateforme'}. ` +
        `Risque : redressement URSSAF car le budget fonctionnement ne peut financer que la gestion du CSE. ` +
        `Solution : transférer le financement vers le budget ASC ou justifier que la plateforme est uniquement pour la gestion.`
      );
    } else if (plateforme.financement === 'les_deux') {
      resultat.details.partie5.alertes.push(
        `⚠️ Plateforme CSE financée par ASC + fonctionnement : ${plateforme.nomPlateforme || 'plateforme'}. ` +
        `Risque : s'assurer que le fonctionnement ne finance que les fonctionnalités de gestion. ` +
        `Solution : vérifier que le budget fonctionnement ne finance aucun avantage aux salariés.`
      );
    } else if (plateforme.financement === 'je_ne_sais_pas') {
      resultat.details.partie5.alertes.push(
        `❓ Financement de la plateforme CSE non précisé : ${plateforme.nomPlateforme || 'plateforme'}. ` +
        `Risque : non-conformité si financée par le budget fonctionnement. ` +
        `Solution : vérifier la répartition ASC vs fonctionnement dans votre contrat.`
      );
    }
    // Si financement === 'asc', c'est conforme, pas d'alerte
  }

  resultat.details.partie5.points = 
    resultat.details.partie5.alertes.length;

  // Calcul du score global
  const totalAlertes = 
    resultat.details.partie1.alertes.length +
    resultat.details.partie2.alertes.length +
    resultat.details.partie3.alertes.length +
    resultat.details.partie4.alertes.length +
    resultat.details.partie5.alertes.length;

  // Détermination du niveau de risque
  if (totalAlertes === 0) {
    resultat.niveauRisque = 'conforme';
    resultat.score = 100;
  } else if (totalAlertes <= 2) {
    resultat.niveauRisque = 'a_surveiller';
    resultat.score = Math.max(60, 100 - (totalAlertes * 15));
  } else if (totalAlertes <= 4) {
    resultat.niveauRisque = 'alerte';
    resultat.score = Math.max(40, 100 - (totalAlertes * 20));
  } else {
    resultat.niveauRisque = 'critique';
    resultat.score = Math.max(0, 100 - (totalAlertes * 25));
  }

  // Compilation des alertes
  resultat.alertes = [
    ...resultat.details.partie1.alertes,
    ...resultat.details.partie2.alertes,
    ...resultat.details.partie3.alertes,
    ...resultat.details.partie4.alertes,
    ...resultat.details.partie5.alertes
  ];

  // Génération des recommandations
  if (resultat.niveauRisque === 'critique') {
    resultat.recommandations.push(
      "🚨 Votre CSE est exposé à un fort risque de redressement URSSAF. Action immédiate requise."
    );
    resultat.recommandations.push(
      "📋 Priorité : auditer tous vos avantages et corriger les dépassements de seuils."
    );
    resultat.recommandations.push(
      "⚖️ Consultez un expert CSE pour un accompagnement personnalisé."
    );
  } else if (resultat.niveauRisque === 'alerte') {
    resultat.recommandations.push(
      "⚠️ Risques significatifs de redressement URSSAF détectés."
    );
    resultat.recommandations.push(
      "🔧 Corrigez les points critiques dans les 3 mois pour éviter les sanctions."
    );
    resultat.recommandations.push(
      "📊 Mettez en place un suivi régulier de vos avantages."
    );
  } else if (resultat.niveauRisque === 'a_surveiller') {
    resultat.recommandations.push(
      "🟡 Quelques points à améliorer pour optimiser votre conformité."
    );
    resultat.recommandations.push(
      "✅ Vos pratiques sont globalement bonnes, quelques ajustements suffisent."
    );
  } else {
    resultat.recommandations.push(
      "🎉 Bravo ! Vos pratiques CSE semblent conformes aux règles URSSAF."
    );
    resultat.recommandations.push(
      "📈 Continuez sur cette voie et maintenez vos bonnes pratiques."
    );
  }

  return resultat;
}

/**
 * Génère un rapport détaillé pour l'export PDF
 */
export function generateReport(resultat: ResultatCalcul) {
  // Vérification de sécurité
  if (!resultat) {
    return {
      date: new Date().toLocaleDateString('fr-FR'),
      score: 0,
      niveauRisque: 'conforme',
      alertes: [],
      recommandations: ['Erreur lors du calcul'],
      details: {
        partie1: { points: 0, alertes: [] },
        partie2: { points: 0, alertes: [] },
        partie4: { points: 0, alertes: [] }
      }
    };
  }

  return {
    date: new Date().toLocaleDateString('fr-FR'),
    score: resultat.score || 0,
    niveauRisque: resultat.niveauRisque || 'conforme',
    alertes: resultat.alertes || [],
    recommandations: resultat.recommandations || [],
    details: resultat.details || {
      partie1: { points: 0, alertes: [] },
      partie2: { points: 0, alertes: [] },
      partie4: { points: 0, alertes: [] }
    }
  };
} 