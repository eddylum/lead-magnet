import { NextRequest, NextResponse } from 'next/server';
import { calculateScore, generateReport, DonneesCSE } from '@/lib/calculateScore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des données
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    // Validation minimale pour permettre le test libre
    if (!body.avantagesChiffres) {
      return NextResponse.json({ error: 'Données avantages manquantes' }, { status: 400 });
    }

    // Calcul du score
    const resultat = calculateScore(body as DonneesCSE);
    const rapport = generateReport(resultat);

    // Envoi des données vers webhook (optionnel)
    const webhookUrl = process.env.WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            type: 'cse_simulator_result',
            data: {
              formData: body,
              resultat: resultat,
              rapport: rapport
            }
          }),
        });
      } catch (webhookError) {
        console.error('Erreur webhook:', webhookError);
        // On continue même si le webhook échoue
      }
    }

    return NextResponse.json(resultat);

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
} 