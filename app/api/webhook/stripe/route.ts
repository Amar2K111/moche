import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// Helper function to send dispute notifications to administrators
async function sendDisputeNotification(data: {
  dispute: Stripe.Dispute
  userId: string | null
  userEmail: string | null
  userDisputeCount: number
  accountRestricted: boolean
  chargeMetadata: Record<string, string>
}) {
  const { dispute, userId, userEmail, userDisputeCount, accountRestricted, chargeMetadata } = data
  
  const notificationData = {
    type: 'dispute_alert',
    disputeId: dispute.id,
    chargeId: dispute.charge,
    amount: `${(dispute.amount / 100).toFixed(2)} ${dispute.currency.toUpperCase()}`,
    reason: dispute.reason,
    status: dispute.status,
    userId: userId || 'Unknown',
    userEmail: userEmail || 'Unknown',
    userDisputeCount,
    accountRestricted,
    isChargeRefundable: dispute.is_charge_refundable,
    createdAt: new Date(dispute.created * 1000).toISOString(),
    chargeMetadata,
    dashboardUrl: `https://dashboard.stripe.com/disputes/${dispute.id}`,
  }

  // Store notification in Firestore for admin dashboard
  if (adminDb) {
    try {
      await adminDb.collection('admin_notifications').add({
        ...notificationData,
        read: false,
        timestamp: new Date(),
        priority: accountRestricted ? 'high' : 'medium'
      })
    } catch (error) {
      console.error('Failed to store admin notification:', error)
    }
  }
}

export async function POST(req: NextRequest) {
  
  if (!stripe || !webhookSecret) {
    console.error('Missing Stripe configuration')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    console.error('Missing Stripe signature')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }


  try {
    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      
      const session = event.data.object as Stripe.Checkout.Session
      
      if (!session.metadata?.user_id) {
        console.error('No user_id in session metadata')
        return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
      }

      const userId = session.metadata.user_id
      const customerEmail = session.customer_details?.email || session.customer_email
      // Compatibility shim: support both uploads_amount (new) and credits_amount (legacy)
      const uploadsAmount = session.metadata.uploads_amount || session.metadata.credits_amount


      if (!adminDb) {
        throw new Error('Database not initialized')
      }

      // Get user data
      const userDocRef = adminDb!.collection('users').doc(userId)
      const userDoc = await userDocRef.get()
      
      if (!userDoc.exists) {
        console.error('User not found:', userId)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const userData = userDoc.data()
      
      if (!userData) {
        throw new Error('User data not found')
      }

      // Check if payment already processed (idempotency protection)
      const existingPayment = await adminDb!.collection('users').doc(userId).collection('payments').doc(session.id).get()
      
      if (existingPayment.exists) {
        return NextResponse.json({ received: true, message: 'Payment already processed' })
      }

      // Update user to enable PDF generation (unlimited)
      await adminDb.runTransaction(async (transaction) => {
        // Set premium: true to enable unlimited PDF generation
        transaction.update(userDocRef, {
          premium: true,
          uploadsRemaining: FieldValue.delete() // Remove old field
        })

        // Create payment record
        transaction.set(adminDb!.collection('users').doc(userId).collection('payments').doc(session.id), {
          sessionId: session.id,
          userId: userId,
          email: customerEmail,
          amount: session.amount_total,
          currency: session.currency,
          status: 'completed',
          premiumEnabled: true,
          timestamp: new Date(),
          paymentIntentId: session.payment_intent
        })
      })

    }

    // Handle payment failures
    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      // Compatibility shim: support both uploads_amount (new) and credits_amount (legacy)
      const uploadsAmount = session.metadata?.uploads_amount || session.metadata?.credits_amount

    }

    // Handle disputes
    if (event.type === 'charge.dispute.created') {
      const dispute = event.data.object as Stripe.Dispute
      const chargeId = typeof dispute.charge === 'string' ? dispute.charge : dispute.charge.id
      

      // Get charge details to find user
      const charge = await stripe.charges.retrieve(chargeId)
      const paymentIntentId = charge.payment_intent 
        ? (typeof charge.payment_intent === 'string' 
            ? charge.payment_intent 
            : charge.payment_intent.id)
        : null

      if (!paymentIntentId) {
        console.error('No payment intent found for charge:', chargeId)
        return NextResponse.json({ received: true, message: 'No payment intent found' })
      }

      // Get payment intent to find checkout session
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      
      // Find checkout session
      let checkoutSessionId: string | null = null
      
      // Try to get checkout session from payment intent metadata first
      checkoutSessionId = paymentIntent.metadata?.checkout_session_id || null


      if (!checkoutSessionId) {
        console.error('Could not find checkout session for dispute:', dispute.id)
        return NextResponse.json({ received: true, message: 'Could not find checkout session' })
      }

      // Get session to find user
      const session = await stripe.checkout.sessions.retrieve(checkoutSessionId)
      const userId = session.metadata?.user_id || null
      const userEmail = session.customer_details?.email || session.customer_email || null

      // Get user dispute count
      let userDisputeCount = 0
      if (userId && adminDb) {
        try {
          const disputeQuery = await adminDb
            .collection('users')
            .doc(userId)
            .collection('disputes')
            .get()
          userDisputeCount = disputeQuery.size
        } catch (error) {
          console.error('Error getting user dispute count:', error)
        }
      }

      // Check if this is the first dispute
      const accountRestricted = userDisputeCount >= 1

      // Store dispute record
      if (userId && adminDb) {
        try {
          await adminDb
            .collection('users')
            .doc(userId)
            .collection('disputes')
            .doc(dispute.id)
            .set({
              disputeId: dispute.id,
              chargeId: chargeId,
              amount: dispute.amount,
              currency: dispute.currency,
              reason: dispute.reason,
              status: dispute.status,
              created: new Date(dispute.created * 1000),
              isChargeRefundable: dispute.is_charge_refundable,
              checkoutSessionId: checkoutSessionId,
              userEmail: userEmail
            })
        } catch (error) {
          console.error('Error storing dispute record:', error)
        }
      }

      // Send admin notification
      await sendDisputeNotification({
        dispute,
        userId,
        userEmail,
        userDisputeCount: userDisputeCount + 1,
        accountRestricted,
        chargeMetadata: charge.metadata || {}
      })

    }

    // Handle refunds
    if (event.type === 'charge.dispute.updated') {
      const dispute = event.data.object as Stripe.Dispute
    }

    // Handle invoice events
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice
    }

    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice
    }

    // Handle customer events
    if (event.type === 'customer.created') {
      const customer = event.data.object as Stripe.Customer
    }

    if (event.type === 'customer.updated') {
      const customer = event.data.object as Stripe.Customer
    }

    // Handle security events
    if (event.type === 'account.updated') {
      const account = event.data.object as Stripe.Account
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Error processing webhook:', error)
    
    return NextResponse.json(
      { error: 'Webhook processing failed' }, 
      { status: 500 }
    )
  }
}