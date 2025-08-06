import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des données lead
    const requiredFields = ['prenom', 'nom', 'email', 'telephone', 'entreprise', 'fonction'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Champ manquant: ${field}` }, { status: 400 });
      }
    }

    // Envoi vers Zapier webhook (optionnel)
    const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL;
    if (zapierWebhookUrl) {
      try {
        // Extraction d'informations utiles des données CSE
        const donneesCSE = body.donneesCSE || {};
        const resumeCSE = {
          nombreSalaries: donneesCSE.nombreSalaries || 0,
          plateformeUtilisee: donneesCSE.plateformeCSE?.nomPlateforme || 'Aucune',
          dateFinContrat: donneesCSE.plateformeCSE?.dateFinContrat || null,
          financementPlateforme: donneesCSE.plateformeCSE?.financement || null,
          utilisePlateforme: donneesCSE.plateformeCSE?.utilisePlateforme || false,
          // Résumé des avantages
          avantagesPrincipaux: Object.entries(donneesCSE.avantagesChiffres || {})
            .filter(([key, value]) => key !== 'autresOccasions' && (value as { montant: number })?.montant > 0)
            .map(([key, value]) => ({ type: key, montant: (value as { montant: number })?.montant || 0 }))
            .sort((a, b) => b.montant - a.montant)
            .slice(0, 3), // Top 3 des avantages
          // Nombre d'alertes par partie
          alertesPartie1: (body.resultat?.details?.partie1?.alertes || []).length,
          alertesPartie2: (body.resultat?.details?.partie2?.alertes || []).length,
          alertesPartie3: (body.resultat?.details?.partie3?.alertes || []).length,
          alertesPartie4: (body.resultat?.details?.partie4?.alertes || []).length,
          alertesPartie5: (body.resultat?.details?.partie5?.alertes || []).length
        };

        const leadData = {
          timestamp: new Date().toISOString(),
          source: 'cse_simulator',
          lead: {
            prenom: body.prenom,
            nom: body.nom,
            email: body.email,
            telephone: body.telephone,
            entreprise: body.entreprise,
            fonction: body.fonction
          },
          resultat: body.resultat || null,
          score: body.score || null,
          donneesCSE: body.donneesCSE || null,
          resumeCSE: resumeCSE
        };

        const response = await fetch(zapierWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadData),
        });

        if (!response.ok) {
          console.error(`Erreur webhook: ${response.status}`);
        }
      } catch (webhookError) {
        console.error('Erreur webhook:', webhookError);
        // On continue même si le webhook échoue
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Lead envoyé avec succès' 
    });

  } catch (error) {
    console.error('Erreur envoi lead:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'envoi du lead' 
    }, { status: 500 });
  }
} 