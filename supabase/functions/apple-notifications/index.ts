import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Décode un JWT sans vérifier la signature (approche simple)
function decodeJWT(token: string) {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('JWT invalide')
  const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  const decoded = atob(payload.padEnd(payload.length + (4 - payload.length % 4) % 4, '='))
  return JSON.parse(decoded)
}

Deno.serve(async (req) => {
  try {
    const body = await req.json()
    const { signedPayload } = body
    if (!signedPayload) {
      return new Response('signedPayload manquant', { status: 400 })
    }

    const notification = decodeJWT(signedPayload)
    const notificationType = notification.notificationType
    const subtype = notification.subtype

    console.log('📬 Notification Apple:', notificationType, subtype ?? '')

    const transactionInfo = notification.data?.signedTransactionInfo
      ? decodeJWT(notification.data.signedTransactionInfo)
      : null

    const originalTransactionId = transactionInfo?.originalTransactionId
    if (!originalTransactionId) {
      console.log('⚠️ Pas d\'originalTransactionId, ignoré')
      return new Response('OK', { status: 200 })
    }

    console.log('🔑 originalTransactionId:', originalTransactionId)

    // Détermine si l'accès Premium doit rester actif
    let isPremium: boolean | null = null

    switch (notificationType) {
      case 'SUBSCRIBED':
      case 'DID_RENEW':
      case 'OFFER_REDEEMED':
        isPremium = true
        break
      case 'EXPIRED':
      case 'REFUND':
      case 'REVOKE':
        isPremium = false
        break
      case 'DID_CHANGE_RENEWAL_STATUS':
      case 'DID_FAIL_TO_RENEW':
        // L'utilisateur garde l'accès jusqu'à EXPIRED
        isPremium = null
        break
      default:
        isPremium = null
    }

    if (isPremium === null) {
      console.log('ℹ️ Aucun changement de statut nécessaire')
      return new Response('OK', { status: 200 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data, error } = await supabase
      .from('profiles')
      .update({ is_premium: isPremium })
      .eq('apple_original_transaction_id', originalTransactionId)
      .select('email')

    if (error) {
      console.error('❌ Erreur Supabase:', error.message)
      return new Response('Erreur DB', { status: 500 })
    }

    if (!data || data.length === 0) {
      console.log('⚠️ Aucun profil trouvé pour cet identifiant')
    } else {
      console.log(`✅ is_premium=${isPremium} pour:`, data[0].email)
    }

    return new Response('OK', { status: 200 })
    } catch (err) {
    console.error('❌ Erreur:', err instanceof Error ? err.message : String(err))

    // On renvoie 200 pour éviter que Apple ne réessaie en boucle sur une erreur de parsing
    return new Response('OK', { status: 200 })
  }
})
