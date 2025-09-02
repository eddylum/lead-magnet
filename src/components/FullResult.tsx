'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResultatCalcul, DonneesCSE } from '@/lib/calculateScore';

interface FullResultProps {
  resultat: ResultatCalcul;
  donnees: DonneesCSE;
  leadData: {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    entreprise: string;
    fonction: string;
  };
  onDownloadPDF: () => void;
}

export default function FullResult({ resultat, donnees, leadData }: FullResultProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent ! Votre CSE est bien conforme aux règles URSSAF.';
    if (score >= 60) return 'Correct, mais des améliorations sont possibles pour optimiser la conformité.';
    return 'Attention, des actions sont nécessaires pour assurer la conformité URSSAF.';
  };

  const getNiveauRisqueText = (niveau: string) => {
    switch (niveau) {
      case 'conforme':
        return '✅ Conforme';
      case 'a_surveiller':
        return '🟡 À surveiller';
      case 'alerte':
        return '🟠 Alerte';
      case 'critique':
        return '🔴 Critique';
      default:
        return 'À évaluer';
    }
  };

  const getNiveauRisqueColor = (niveau: string) => {
    switch (niveau) {
      case 'conforme':
        return 'text-green-600';
      case 'a_surveiller':
        return 'text-yellow-600';
      case 'alerte':
        return 'text-orange-600';
      case 'critique':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  // Calcul des statistiques
  const totalAlertes = resultat.alertes.length;
  const partiesAvecAlertes = Object.values(resultat.details).filter(partie => partie.alertes.length > 0).length;
  const scoreColor = getScoreColor(resultat.score);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header avec actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Audit URSSAF - CSE {leadData.entreprise || 'Votre entreprise'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Audit fourni par <span className="font-semibold text-[#075650]">Happypal</span> • Expert CSE et URSSAF
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handlePrintPDF}
            variant="outline"
            className="border-[#01debb] text-[#075650] hover:bg-[#01debb] hover:text-white"
          >
            🖨️ Obtenir le pdf
          </Button>
        </div>
      </div>

      <div className="print-content space-y-8">
        {/* Score principal - Hero Section */}
        <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Score visuel */}
              <div className="relative inline-block">
                <div className={`text-8xl font-black ${scoreColor} drop-shadow-lg`}>
                  {resultat.score}%
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold">🎯</span>
                </div>
              </div>
              
              {/* Statut */}
              <div className="space-y-2">
                <div className={`text-2xl font-bold ${getNiveauRisqueColor(resultat.niveauRisque)}`}>
                  {getNiveauRisqueText(resultat.niveauRisque)}
                </div>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  {getScoreMessage(resultat.score)}
                </p>
              </div>

              {/* Statistiques rapides */}
              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{donnees.nombreSalaries || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Salariés</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{totalAlertes}</div>
                  <div className="text-sm text-gray-600">Points d'attention</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{partiesAvecAlertes}</div>
                  <div className="text-sm text-gray-600">Zones concernées</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analyse par zones - Section principale */}
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyse par zones de conformité</h2>
            <p className="text-gray-600">Détail des points d'attention identifiés dans chaque domaine</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Zone 1: Avantages et financement */}
            <Card className={`${resultat.details.partie1.alertes.length > 0 ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🧮</div>
                    <div>
                      <CardTitle className="text-lg">Avantages & Financement</CardTitle>
                      <CardDescription>Montants et types d'avantages</CardDescription>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${resultat.details.partie1.alertes.length > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {resultat.details.partie1.alertes.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {resultat.details.partie1.alertes.length > 0 ? (
                  <div className="space-y-2">
                    {resultat.details.partie1.alertes.map((alerte: string, index: number) => (
                      <div key={index} className="text-sm text-orange-700 bg-white p-3 rounded-lg border border-orange-200">
                        {alerte}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-green-700 bg-white p-3 rounded-lg border border-green-200">
                    ✅ Aucun problème détecté dans cette zone
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Zone 2: Critères d'attribution */}
            <Card className={`${resultat.details.partie2.alertes.length > 0 ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">👥</div>
                    <div>
                      <CardTitle className="text-lg">Critères d'attribution</CardTitle>
                      <CardDescription>Qui peut bénéficier des avantages</CardDescription>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${resultat.details.partie2.alertes.length > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {resultat.details.partie2.alertes.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {resultat.details.partie2.alertes.length > 0 ? (
                  <div className="space-y-2">
                    {resultat.details.partie2.alertes.map((alerte: string, index: number) => (
                      <div key={index} className="text-sm text-orange-700 bg-white p-3 rounded-lg border border-orange-200">
                        {alerte}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-green-700 bg-white p-3 rounded-lg border border-green-200">
                    ✅ Aucun problème détecté dans cette zone
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Zone 3: Gestion CSE */}
            <Card className={`${resultat.details.partie3.alertes.length > 0 ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">⚙️</div>
                    <div>
                      <CardTitle className="text-lg">Gestion CSE</CardTitle>
                      <CardDescription>Processus et procédures</CardDescription>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${resultat.details.partie3.alertes.length > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {resultat.details.partie3.alertes.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {resultat.details.partie3.alertes.length > 0 ? (
                  <div className="space-y-2">
                    {resultat.details.partie3.alertes.map((alerte: string, index: number) => (
                      <div key={index} className="text-sm text-orange-700 bg-white p-3 rounded-lg border border-orange-200">
                        {alerte}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-green-700 bg-white p-3 rounded-lg border border-green-200">
                    ✅ Aucun problème détecté dans cette zone
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Zone 4: Plateforme CSE */}
            <Card className={`${resultat.details.partie4.alertes.length > 0 ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">💻</div>
                    <div>
                      <CardTitle className="text-lg">Plateforme CSE</CardTitle>
                      <CardDescription>Financement des outils numériques</CardDescription>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${resultat.details.partie4.alertes.length > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {resultat.details.partie4.alertes.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {resultat.details.partie4.alertes.length > 0 ? (
                  <div className="space-y-2">
                    {resultat.details.partie4.alertes.map((alerte: string, index: number) => (
                      <div key={index} className="text-sm text-orange-700 bg-white p-3 rounded-lg border border-orange-200">
                        {alerte}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-green-700 bg-white p-3 rounded-lg border border-green-200">
                    ✅ Aucun problème détecté dans cette zone
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Avantages analysés - Section informative */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📊</div>
              <div>
                <CardTitle>Avantages analysés</CardTitle>
                <CardDescription>Récapitulatif des montants saisis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(donnees.avantagesChiffres || {}).map(([key, value]) => {
                if (key === 'autresOccasions') return null;
                const montant = (value as { montant: number })?.montant || 0;
                if (montant === 0) return null;
                
                const labels = {
                  naissance: 'Naissance',
                  mariagePacs: 'Mariage/PACS',
                  rentreeScolaire: 'Rentrée scolaire',
                  noel: 'Noël',
                  feteMeresPeres: 'Fête mères/pères',
                  departRetraite: 'Départ retraite',
                  saintNicolas: 'Saint-Nicolas',
                  chequesCulture: 'Chèques culture'
                };
                
                return (
                  <div key={key} className="bg-white p-4 rounded-lg border border-blue-200 text-center">
                    <div className="font-medium text-gray-700">{labels[key as keyof typeof labels]}</div>
                    <div className="text-2xl font-bold text-blue-600">{montant}€</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recommandations d'experts */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">💡</div>
              <div>
                <CardTitle>Recommandations d'experts</CardTitle>
                <CardDescription>Actions prioritaires pour améliorer votre conformité</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resultat.recommandations.map((recommandation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-bold">{index + 1}</span>
                  </div>
                  <div className="text-green-800 bg-white p-4 rounded-lg border border-green-200 flex-1">
                    {recommandation}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call-to-action */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="text-4xl">🎯</div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">
                  Audit personnalisé et gratuit ?
                </h3>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  <strong>Évitez les redressements URSSAF</strong> en prenant rendez-vous avec un de nos experts 
                  <span className="text-purple-600 font-semibold"> Happypal CSE et URSSAF</span>.
                </p>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Bénéficiez d'un accompagnement sur-mesure pour sécuriser vos avantages sociaux 
                  et optimiser votre budget CSE.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                <Button 
                  variant="outline"
                  className="bg-gradient-to-r from-[#01debb] to-[#075650] hover:from-[#81ebdf] hover:to-[#075650] text-white"
                  size="lg"
                  asChild
                >
                  <a href="https://www.happypal.fr/predemo" target="_blank" rel="noopener noreferrer">
                    📅 Prendre RDV avec un expert
                  </a>
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 pt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Gratuit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Sans engagement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Expert certifié</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Basé sur les règles URSSAF 2025 • Résultat indicatif • Généré le {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
} 