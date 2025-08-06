'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResultatCalcul, DonneesCSE } from '@/lib/calculateScore';

interface LeadFormProps {
  resultat: ResultatCalcul;
  donneesCSE?: DonneesCSE;
  onComplete: (leadData: {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    entreprise: string;
    fonction: string;
  }) => void;
}

export default function LeadForm({ resultat, donneesCSE, onComplete }: LeadFormProps) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    fonction: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          resultat: resultat,
          score: resultat.score,
          donneesCSE: donneesCSE
        }),
      });

      if (response.ok) {
        onComplete(formData);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de l\'enregistrement');
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Recevez votre audit complet
        </CardTitle>
        <CardDescription className="text-center">
          Étape 3/4 : Vos coordonnées pour recevoir le rapport détaillé
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Score rappel */}
          <div className="bg-[#edfffe] border border-[#81ebdf] rounded-lg p-4 text-center">
            <p className="text-[#075650] font-semibold">
              Votre score : <span className="text-2xl font-bold">{resultat.score}%</span>
            </p>
            <p className="text-[#075650] text-sm">
              {resultat.alertes.length} alerte{resultat.alertes.length > 1 ? 's' : ''} détectée{resultat.alertes.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Formulaire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                placeholder="Votre prénom"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                placeholder="Votre nom"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email professionnel *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="votre.email@entreprise.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              type="tel"
              value={formData.telephone}
              onChange={(e) => handleInputChange('telephone', e.target.value)}
              placeholder="06 12 34 56 78"
            />
          </div>

          <div>
            <Label htmlFor="entreprise">Entreprise *</Label>
            <Input
              id="entreprise"
              value={formData.entreprise}
              onChange={(e) => handleInputChange('entreprise', e.target.value)}
              placeholder="Nom de votre entreprise"
              required
            />
          </div>

          <div>
            <Label htmlFor="fonction">Fonction dans le CSE *</Label>
            <Input
              id="fonction"
              value={formData.fonction}
              onChange={(e) => handleInputChange('fonction', e.target.value)}
              placeholder="Ex: Président CSE, Trésorier, etc."
              required
            />
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* CTA */}
          <div className="space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#01debb] to-[#075650] hover:from-[#81ebdf] hover:to-[#075650] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi en cours...' : '📧 Recevoir mon audit complet'}
            </Button>
            
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500">
                ✅ Rapport gratuit et personnalisé
              </p>
              <p className="text-xs text-gray-500">
                ✅ Recommandations d'experts URSSAF
              </p>
              <p className="text-xs text-gray-500">
                ✅ Pas de spam, données protégées
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 