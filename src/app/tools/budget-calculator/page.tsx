'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface BudgetData {
  nombreSalaries: number;
  budgetCSE: number;
  budgetAvantages: number;
  budgetFonctionnement: number;
}

interface ResultatBudget {
  budgetParSalarie: string;
  pourcentageAvantages: string;
  recommandations: string[];
}

export default function BudgetCalculatorPage() {
  const [budget, setBudget] = useState<BudgetData>({
    nombreSalaries: 0,
    budgetCSE: 0,
    budgetAvantages: 0,
    budgetFonctionnement: 0
  });

  const [resultat, setResultat] = useState<ResultatBudget | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculs simples pour l'exemple
    const budgetParSalarie = budget.budgetCSE / budget.nombreSalaries;
    const pourcentageAvantages = (budget.budgetAvantages / budget.budgetCSE) * 100;
    
    setResultat({
      budgetParSalarie: budgetParSalarie.toFixed(2),
      pourcentageAvantages: pourcentageAvantages.toFixed(1),
      recommandations: []
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#edfffe] to-[#81ebdf] py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#075650] mb-4">
            Calculateur Budget CSE
          </h1>
          <p className="text-lg text-[#075650] max-w-3xl mx-auto">
            Calculez et optimisez votre budget CSE selon les règles URSSAF
          </p>
        </div>

        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              📊 Votre Budget CSE
            </CardTitle>
            <CardDescription className="text-center">
              Entrez vos informations pour calculer votre budget optimal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="nombreSalaries">Nombre de salariés</Label>
                <Input
                  id="nombreSalaries"
                  type="number"
                  value={budget.nombreSalaries || ''}
                  onChange={(e) => setBudget(prev => ({
                    ...prev,
                    nombreSalaries: parseInt(e.target.value) || 0
                  }))}
                  placeholder="50"
                  required
                />
              </div>

              <div>
                <Label htmlFor="budgetCSE">Budget total CSE (€)</Label>
                <Input
                  id="budgetCSE"
                  type="number"
                  value={budget.budgetCSE || ''}
                  onChange={(e) => setBudget(prev => ({
                    ...prev,
                    budgetCSE: parseInt(e.target.value) || 0
                  }))}
                  placeholder="100000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="budgetAvantages">Budget avantages sociaux (€)</Label>
                <Input
                  id="budgetAvantages"
                  type="number"
                  value={budget.budgetAvantages || ''}
                  onChange={(e) => setBudget(prev => ({
                    ...prev,
                    budgetAvantages: parseInt(e.target.value) || 0
                  }))}
                  placeholder="80000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="budgetFonctionnement">Budget fonctionnement (€)</Label>
                <Input
                  id="budgetFonctionnement"
                  type="number"
                  value={budget.budgetFonctionnement || ''}
                  onChange={(e) => setBudget(prev => ({
                    ...prev,
                    budgetFonctionnement: parseInt(e.target.value) || 0
                  }))}
                  placeholder="20000"
                  required
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#01debb] to-[#075650] hover:from-[#81ebdf] hover:to-[#075650]"
              >
                Calculer le budget →
              </Button>
            </form>

            {resultat && (
              <div className="mt-6 p-4 bg-[#edfffe] border border-[#81ebdf] rounded-lg">
                <h3 className="font-semibold text-[#075650] mb-2">Résultats :</h3>
                <p className="text-[#075650]">
                  Budget par salarié : <strong>{resultat.budgetParSalarie}€</strong>
                </p>
                <p className="text-[#075650]">
                  % Avantages : <strong>{resultat.pourcentageAvantages}%</strong>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 