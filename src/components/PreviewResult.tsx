'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResultatCalcul } from '@/lib/calculateScore';

interface PreviewResultProps {
  resultat: ResultatCalcul;
  onContinue: () => void;
}

export default function PreviewResult({ resultat, onContinue }: PreviewResultProps) {
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Résultat de votre audit URSSAF
        </CardTitle>
        <CardDescription className="text-center">
          Étape 2/4 : Score de conformité URSSAF
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score principal */}
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold" style={{ color: getScoreColor(resultat.score) }}>
            {resultat.score}%
          </div>
          <div className={`text-lg font-semibold ${getNiveauRisqueColor(resultat.niveauRisque)}`}>
            {getNiveauRisqueText(resultat.niveauRisque)}
          </div>
          <p className="text-lg text-gray-600">
            {getScoreMessage(resultat.score)}
          </p>
        </div>

        {/* Alertes détectées */}
                  <div className="bg-[#edfffe] border border-[#81ebdf] rounded-lg p-4">
            <h3 className="font-semibold text-[#075650] mb-2">
              ⚠️ {resultat.alertes.length} alerte{resultat.alertes.length > 1 ? 's' : ''} détectée{resultat.alertes.length > 1 ? 's' : ''}
            </h3>
            <p className="text-[#075650] text-sm">
              Pour voir le détail complet de votre audit et recevoir des recommandations personnalisées, 
              laissez-nous vos coordonnées.
            </p>
          </div>

        {/* Avantages du rapport complet */}
                  <div className="bg-[#edfffe] border border-[#81ebdf] rounded-lg p-4">
            <h3 className="font-semibold text-[#075650] mb-2">
              📋 Votre rapport complet inclura :
            </h3>
            <ul className="text-[#075650] text-sm space-y-1">
              <li>• Analyse détaillée de chaque avantage social</li>
              <li>• Recommandations personnalisées pour optimiser la conformité</li>
              <li>• Comparaison avec les bonnes pratiques URSSAF</li>
              <li>• Rapport PDF téléchargeable</li>
              <li>• Accès à nos experts pour un accompagnement personnalisé</li>
            </ul>
          </div>

        {/* CTA */}
        <div className="text-center space-y-4">
                      <Button 
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-[#075650] to-[#01debb] hover:from-[#075650] hover:to-[#81ebdf] text-white"
              size="lg"
            >
              📧 Recevoir mon audit complet gratuitement
            </Button>
          <p className="text-xs text-gray-500">
            Vos données sont protégées et ne seront utilisées que pour vous envoyer votre rapport.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 