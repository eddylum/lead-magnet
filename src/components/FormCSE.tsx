'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { DonneesCSE } from '@/lib/calculateScore';

interface FormCSEProps {
  onComplete: (donnees: DonneesCSE) => void;
}

export default function FormCSE({ onComplete }: FormCSEProps) {
  const [currentStep, setCurrentStep] = useState<'partie1' | 'partie2' | 'partie3' | 'partie4' | 'partie5'>('partie1');
      const [formData, setFormData] = useState<DonneesCSE>({
      nombreSalaries: 0,
      avantagesChiffres: {
        naissance: { montant: 0 },
        mariagePacs: { montant: 0 },
        rentreeScolaire: { montant: 0 },
        noel: { montant: 0 },
        feteMeresPeres: { montant: 0 },
        departRetraite: { montant: 0 },
        saintNicolas: { montant: 0 },
        chequesCulture: { montant: 0 },
        autresOccasions: false
      },
    criteresAttribution: {
      revenuQuotientFamilial: false,
      nombreEnfants: false,
      tranchesSalaire: false,
      anciennete: false,
      typeContrat: false,
      presenceTempsPlein: false,
      categorieSocioProfessionnelle: false,
      premierArrive: false,
      tirageAuSort: false
    },
    typesAvantages: {
      billetterieCulture: false,
      sejoursColonies: false,
      reductionsSportLoisirs: false,
      primesCadeaux: false,
      repasEntreprise: false,
      abonnementsInternetTV: false,
      achatsMateriel: false
    },
    gestionCSE: {
      justificatifsRemboursements: false,
      cofinancementEmployeur: false,
      verificationPlafonds: false,
      budgetFonctionnementAvantages: false,
      criteresEcritsCommuniques: false
    },
    plateformeCSE: {
      utilisePlateforme: false,
      nomPlateforme: '',
      dateFinContrat: '',
      financement: 'je_ne_sais_pas'
    }
  });

  const handleAvantageChange = (avantage: string, field: string, value: number | boolean) => {
    setFormData(prev => ({
      ...prev,
      avantagesChiffres: {
        ...prev.avantagesChiffres,
        [avantage]: {
          ...(prev.avantagesChiffres[avantage as keyof typeof prev.avantagesChiffres] as { montant: number }),
          [field]: value
        }
      }
    }));
  };

  const handleCriteresChange = (critere: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      criteresAttribution: {
        ...prev.criteresAttribution,
        [critere]: value
      }
    }));
  };

  const handleTypesChange = (type: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      typesAvantages: {
        ...prev.typesAvantages,
        [type]: value
      }
    }));
  };

  const handleGestionChange = (gestion: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      gestionCSE: {
        ...prev.gestionCSE,
        [gestion]: value
      }
    }));
  };

  const handlePlateformeChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      plateformeCSE: {
        ...prev.plateformeCSE,
        [field]: value
      }
    }));
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const steps = [
    { id: 'partie1', title: 'Vos avantages et leur financement', description: 'Détecter les dépassements et types d\'avantages' },
    { id: 'partie2', title: 'Qui peut en profiter ?', description: 'Détecter les critères illégaux d\'attribution' },
    { id: 'partie3', title: 'Comment gérez-vous votre CSE ?', description: 'Tester la conformité gestionnelle et financière' },
    { id: 'partie4', title: 'Financement plateforme CSE', description: 'Vérifier la conformité du financement' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="max-w-4xl mx-auto">

      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Étape {currentStepIndex + 1} sur 4
          </span>
          <span className="text-sm text-gray-500">
            {steps[currentStepIndex].title}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-[#075650] to-[#01debb] h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            🧮 {steps[currentStepIndex].title}
          </CardTitle>
          <CardDescription className="text-center">
            {steps[currentStepIndex].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            
            {currentStep === 'partie1' && (
              <div className="space-y-6">
                                  <div className="bg-[#edfffe] border border-[#81ebdf] rounded-lg p-4">
                    <p className="text-[#075650] text-sm font-medium">
                      💡 Objectif : Détecter les dépassements de seuils URSSAF
                    </p>
                  </div>

                                {/* Nombre de salariés - Version compacte */}
                <div className="flex items-center space-x-4 mb-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="nombreSalaries" className="text-sm font-medium">Nombre de salariés *</Label>
                    <Input
                      id="nombreSalaries"
                      type="number"
                      value={formData.nombreSalaries || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        nombreSalaries: parseInt(e.target.value) || 0
                      }))}
                      placeholder="50"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    Pour calculer les seuils URSSAF
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-4">
                     Quels avantages financez-vous par an ou occasion ? 
                    </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { key: 'naissance', label: 'Naissance', icon: '👶' },
                    { key: 'mariagePacs', label: 'Mariage/PACS', icon: '💒' },
                    { key: 'rentreeScolaire', label: 'Rentrée scolaire', icon: '📚' },
                    { key: 'noel', label: 'Noël', icon: '🎄' },
                    { key: 'feteMeresPeres', label: 'Fête mères/pères', icon: '🌷' },
                    { key: 'departRetraite', label: 'Départ retraite', icon: '🎉' },
                    { key: 'saintNicolas', label: 'Saint-Nicolas', icon: '🎁' },
                    { key: 'chequesCulture', label: 'Chèques culture', icon: '🎭' }
                  ].map((avantage) => (
                    <div key={avantage.key} className="border rounded-lg p-3 bg-white hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{avantage.icon}</span>
                        <h3 className="font-medium text-sm">{avantage.label}</h3>
                      </div>
                      <div>
                        <Label htmlFor={`${avantage.key}-montant`} className="text-xs font-medium">
                          Montant (€)
                        </Label>
                        <Input
                          id={`${avantage.key}-montant`}
                          type="number"
                          value={(formData.avantagesChiffres[avantage.key as keyof typeof formData.avantagesChiffres] as { montant: number }).montant || ''}
                          onChange={(e) => handleAvantageChange(avantage.key, 'montant', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="mt-1 text-sm"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center space-x-3 mt-4 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      id="autresOccasions"
                      checked={formData.avantagesChiffres.autresOccasions}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        avantagesChiffres: {
                          ...prev.avantagesChiffres,
                          autresOccasions: checked as boolean
                        }
                      }))}
                    />
                    <Label htmlFor="autresOccasions" className="text-sm">Autres occasions</Label>
                  </div>
                </div>

                {/* Section B : Types d'avantages financés */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Quels autres types d'avantages proposez-vous ?
                    </h3>
                    
                    <div className="space-y-3">
                      {[
                        { key: 'billetterieCulture', label: 'Billetterie / culture (places de cinéma, concerts…)' },
                        { key: 'sejoursColonies', label: 'Séjours ou colonies pour enfants' },
                        { key: 'reductionsSportLoisirs', label: 'Réductions sport ou loisirs' },
                        { key: 'primesCadeaux', label: 'Primes d\'objectif ou cadeau entreprise (anniversaire société, résultats…)' },
                        { key: 'repasEntreprise', label: 'Repas d\'entreprise ou pot d\'équipe' },
                        { key: 'abonnementsInternetTV', label: 'Participation aux abonnements Internet, TV, matériel' },
                        { key: 'achatsMateriel', label: 'Achats de matériel (informatique, électro…)' }
                      ].map((type) => (
                        <div key={type.key} className="flex items-center space-x-3">
                          <Checkbox
                            id={type.key}
                            checked={formData.typesAvantages[type.key as keyof typeof formData.typesAvantages]}
                            onCheckedChange={(checked) => handleTypesChange(type.key, checked as boolean)}
                          />
                          <Label htmlFor={type.key}>{type.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'partie2' && (
              <div className="space-y-4">
                <div className="bg-[#edfffe] border border-[#81ebdf] rounded-lg p-3">
                  <p className="text-[#075650] text-sm font-medium">
                    💡 Détecter les critères illégaux d'attribution
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Critères d'attribution de vos avantages sociaux ?
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">Cochez tous ceux qui s'appliquent</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      { key: 'revenuQuotientFamilial', label: 'Revenu ou quotient familial' },
                      { key: 'nombreEnfants', label: 'Nombre d\'enfants' },
                      { key: 'tranchesSalaire', label: 'Tranches de salaire' },
                      { key: 'anciennete', label: 'Ancienneté (ex : > 6 mois)' },
                      { key: 'typeContrat', label: 'Type de contrat (CDI/CDD)' },
                      { key: 'presenceTempsPlein', label: 'Présence temps plein' },
                      { key: 'categorieSocioProfessionnelle', label: 'Catégorie socio-professionnelle' },
                      { key: 'premierArrive', label: 'Premier arrivé / premier servi' },
                      { key: 'tirageAuSort', label: 'Tirage au sort ou décision du bureau' }
                    ].map((critere) => (
                      <div key={critere.key} className="flex items-center space-x-2 p-2 bg-white rounded border">
                        <Checkbox
                          id={critere.key}
                          checked={formData.criteresAttribution[critere.key as keyof typeof formData.criteresAttribution]}
                          onCheckedChange={(checked) => handleCriteresChange(critere.key, checked as boolean)}
                        />
                        <Label htmlFor={critere.key} className="text-sm">{critere.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}



            {currentStep === 'partie3' && (
              <div className="space-y-4">
                <div className="bg-[#edfffe] border border-[#81ebdf] rounded-lg p-3">
                  <p className="text-[#075650] text-sm font-medium">
                    💡 Tester la conformité gestionnelle et financière
                  </p>
                </div>


                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Comment gérez-vous votre CSE ?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Répondez Oui/Non à chaque question</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { 
                        key: 'justificatifsRemboursements', 
                        question: 'Demandez-vous des justificatifs pour les remboursements ?',
                        details: 'Factures, reçus, tickets de caisse obligatoires pour tous les remboursements CSE. L\'URSSAF peut requalifier en avantage imposable si pas de justificatifs.',
                        context: 'Ex: remboursement billet de train, repas, activité sportive'
                      },
                      { 
                        key: 'cofinancementEmployeur', 
                        question: 'L\'employeur participe-t-il aux avantages sociaux ?',
                        details: 'L\'employeur contribue aussi aux avantages (chèques vacances, primes, etc.) en plus du CSE.',
                        context: 'Ex: chèques vacances, primes de fin d\'année, tickets restaurant'
                      },
                      { 
                        key: 'verificationPlafonds', 
                        question: 'Additionnez-vous CSE + employeur pour vérifier les plafonds ?',
                        details: 'Il faut additionner les contributions CSE + employeur pour vérifier que vous ne dépassez pas les seuils URSSAF.',
                        context: 'Ex: CSE 150€ + employeur 50€ = 200€ (dépasse 196€)'
                      },
                      { 
                        key: 'budgetFonctionnementAvantages', 
                        question: 'Utilisez-vous le budget fonctionnement pour des avantages ?',
                        details: 'Le budget fonctionnement est réservé à la gestion du CSE. L\'utiliser pour des avantages = détournement de fonds.',
                        context: 'Ex: voyages, repas, cadeaux payés avec le budget fonctionnement'
                      },
                      { 
                        key: 'criteresEcritsCommuniques', 
                        question: 'Avez-vous des critères d\'attribution écrits et communiqués ?',
                        details: 'Les critères d\'attribution doivent être écrits dans un règlement et communiqués à tous les salariés.',
                        context: 'Ex: règlement intérieur CSE, note de service, affichage'
                      }
                    ].map((gestion) => (
                      <div key={gestion.key} className="border rounded-lg p-3 bg-white">
                        <h3 className="font-semibold text-sm mb-2">{gestion.question}</h3>
                        <p className="text-xs text-gray-600 mb-2">{gestion.details}</p>
                        <p className="text-xs text-blue-600 mb-3 font-medium">{gestion.context}</p>
                        <RadioGroup
                          value={formData.gestionCSE[gestion.key as keyof typeof formData.gestionCSE] ? 'oui' : 'non'}
                          onValueChange={(value) => handleGestionChange(gestion.key, value === 'oui')}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="oui" id={`${gestion.key}-oui`} />
                            <Label htmlFor={`${gestion.key}-oui`} className="text-sm">Oui</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="non" id={`${gestion.key}-non`} />
                            <Label htmlFor={`${gestion.key}-non`} className="text-sm">Non</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'partie4' && (
              <div className="space-y-4">
                <div className="bg-[#edfffe] border border-[#81ebdf] rounded-lg p-3">
                  <p className="text-[#075650] text-sm font-medium">
                    💻 Financement de votre plateforme CSE
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Utilisez-vous une plateforme CSE ?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Billetterie, gestion ASC, etc.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-white">
                      <RadioGroup
                        value={formData.plateformeCSE.utilisePlateforme ? 'oui' : 'non'}
                        onValueChange={(value) => handlePlateformeChange('utilisePlateforme', value === 'oui')}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="oui" id="plateforme-oui" />
                          <Label htmlFor="plateforme-oui" className="text-sm">Oui</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="non" id="plateforme-non" />
                          <Label htmlFor="plateforme-non" className="text-sm">Non</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formData.plateformeCSE.utilisePlateforme && (
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-white">
                          <h4 className="font-semibold text-sm mb-2">Quelle plateforme utilisez-vous ?</h4>
                          <select
                            value={formData.plateformeCSE.nomPlateforme}
                            onChange={(e) => handlePlateformeChange('nomPlateforme', e.target.value)}
                            className="w-full p-2 border rounded-md text-sm"
                          >
                            <option value="">Sélectionnez une plateforme</option>
                            <option value="Groupe Up / Kalidea">Groupe Up / Kalidea</option>
                            <option value="Hello CSE">Hello CSE</option>
                            <option value="Club employés">Club employés</option>
                            <option value="Proweb / Edenred">Proweb / Edenred</option>
                            <option value="Leeto">Leeto</option>
                            <option value="Swile / comiteo">Swile / comiteo</option>
                            <option value="Conseil CSE">Conseil CSE</option>
                            <option value="Couleur CSE">Couleur CSE</option>
                            <option value="Delta CE / Swizy">Delta CE / Swizy</option>
                            <option value="Gestion interne par le CSE">Gestion interne par le CSE</option>
                            <option value="Je ne sais pas">Je ne sais pas</option>
                          </select>
                        </div>

                        <div className="border rounded-lg p-4 bg-white">
                          <h4 className="font-semibold text-sm mb-2">Quand votre contrat se termine-t-il ?</h4>
                          <Input
                            type="date"
                            value={formData.plateformeCSE.dateFinContrat}
                            onChange={(e) => handlePlateformeChange('dateFinContrat', e.target.value)}
                            className="text-sm"
                          />
                          <p className="text-xs text-gray-500 mt-1">Ou laissez vide si vous ne savez pas</p>
                        </div>

                        <div className="border rounded-lg p-4 bg-white">
                          <h4 className="font-semibold text-sm mb-2">Ce service est-il financé par :</h4>
                          <RadioGroup
                            value={formData.plateformeCSE.financement}
                            onValueChange={(value) => handlePlateformeChange('financement', value)}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="asc" id="financement-asc" />
                              <Label htmlFor="financement-asc" className="text-sm">Budget ASC</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="fonctionnement" id="financement-fonctionnement" />
                              <Label htmlFor="financement-fonctionnement" className="text-sm">Budget de fonctionnement</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="les_deux" id="financement-les-deux" />
                              <Label htmlFor="financement-les-deux" className="text-sm">Les deux (ASC + fonctionnement)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="je_ne_sais_pas" id="financement-je-ne-sais-pas" />
                              <Label htmlFor="financement-je-ne-sais-pas" className="text-sm">Je ne sais pas</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  const stepOrder = ['partie1', 'partie2', 'partie3', 'partie4'];
                  const currentIndex = stepOrder.indexOf(currentStep);
                  if (currentIndex > 0) {
                    setCurrentStep(stepOrder[currentIndex - 1] as 'partie1' | 'partie2' | 'partie3' | 'partie4');
                  }
                }}
                disabled={currentStep === 'partie1'}
              >
                ← Précédent
              </Button>
              
              {currentStep === 'partie4' ? (
                <Button 
                  type="button"
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-[#01debb] to-[#075650] hover:from-[#81ebdf] hover:to-[#075650]"
                >
                  Calculer mon score de conformité →
                </Button>
              ) : (
                <Button 
                  type="button"
                                      onClick={() => {
                      const stepOrder = ['partie1', 'partie2', 'partie3', 'partie4'];
                      const currentIndex = stepOrder.indexOf(currentStep);
                      if (currentIndex < stepOrder.length - 1) {
                        const nextStep = stepOrder[currentIndex + 1];
                        setCurrentStep(nextStep as 'partie1' | 'partie2' | 'partie3' | 'partie4');
                      }
                    }}
                  className="bg-gradient-to-r from-[#075650] to-[#01debb] hover:from-[#075650] hover:to-[#81ebdf]"
                >
                  Continuer →
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 