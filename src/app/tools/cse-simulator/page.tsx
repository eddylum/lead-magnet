'use client';

import { useState } from 'react';
import { DonneesCSE, ResultatCalcul } from '@/lib/calculateScore';
import FormCSE from '@/components/FormCSE';
import PreviewResult from '@/components/PreviewResult';
import LeadForm from '@/components/LeadForm';
import FullResult from '@/components/FullResult';

type Step = 'form' | 'preview' | 'lead' | 'result';

export default function CSESimulatorPage() {
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultat, setResultat] = useState<ResultatCalcul | null>(null);
  const [donneesCSE, setDonneesCSE] = useState<DonneesCSE | null>(null);
  const [leadData, setLeadData] = useState<{
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    entreprise: string;
    fonction: string;
  } | null>(null);

  const handleFormComplete = async (donnees: DonneesCSE) => {
    setIsCalculating(true);
    setDonneesCSE(donnees);

    try {
      const response = await fetch('/api/calcule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donnees),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du calcul');
      }

      const resultatCalcul = await response.json();
      setResultat(resultatCalcul);
      setCurrentStep('preview');
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Erreur lors du calcul du score: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsCalculating(false);
    }
  };

  const handlePreviewContinue = () => {
    setCurrentStep('lead');
  };

  const handleLeadComplete = (lead: {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    entreprise: string;
    fonction: string;
  }) => {
    setLeadData(lead);
    setCurrentStep('result');
  };

  const handleDownloadPDF = () => {
    // Logique de téléchargement PDF
    console.log('Téléchargement PDF...');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'form':
        return (
          <div className="min-h-screen bg-gradient-to-br from-[#edfffe] to-[#81ebdf] py-8">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[#075650] mb-4">
                  Evaluez la conformité de votre CSE avec l'URSSAF
                </h1>
                <p className="text-lg text-[#075650] max-w-3xl mx-auto">
                  Répondez à quelques questions en moins de 2 minutes et recevez un audit personnalisé gratuit.
                </p>
                <div className="mt-6 flex justify-center space-x-4 text-sm text-[#075650]">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#01debb] rounded-full mr-2"></span>
                    ✅ Conforme (0 alerte)
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#81ebdf] rounded-full mr-2"></span>
                    🟡 À surveiller (1-2 alertes)
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#01debb] rounded-full mr-2"></span>
                    🟠 Alerte (3-4 alertes)
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#075650] rounded-full mr-2"></span>
                    🔴 Critique (5+ alertes)
                  </div>
                </div>
              </div>
              
              {isCalculating ? (
                <div className="flex justify-center items-center min-h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#075650] mx-auto mb-4"></div>
                    <p className="text-[#075650]">Calcul de votre score de conformité...</p>
                  </div>
                </div>
              ) : (
                <FormCSE onComplete={handleFormComplete} />
              )}
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="min-h-screen bg-gradient-to-br from-[#edfffe] to-[#81ebdf] py-8">
            <div className="container mx-auto px-4">
              <PreviewResult 
                resultat={resultat!} 
                onContinue={handlePreviewContinue} 
              />
            </div>
          </div>
        );

      case 'lead':
        return (
          <div className="min-h-screen bg-gradient-to-br from-[#edfffe] to-[#81ebdf] py-8">
            <div className="container mx-auto px-4">
              <LeadForm 
                resultat={resultat!} 
                onComplete={handleLeadComplete} 
              />
            </div>
          </div>
        );

      case 'result':
        return (
          <div className="min-h-screen bg-gradient-to-br from-[#edfffe] to-[#81ebdf] py-8">
            <div className="container mx-auto px-4">
              <FullResult 
                resultat={resultat!}
                donnees={donneesCSE!}
                leadData={leadData!}
                onDownloadPDF={handleDownloadPDF}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen">
      {renderStep()}
    </main>
  );
} 