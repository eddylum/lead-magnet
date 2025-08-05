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
          score: body.score || null
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