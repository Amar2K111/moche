import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { UPLOADS_PACKAGE } from '@/lib/constants'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }
    
    const { success_url, cancel_url, user_id } = await request.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Crédits',
              description: `${UPLOADS_PACKAGE.amount} crédits pour l'analyse faciale`,
            },
            unit_amount: UPLOADS_PACKAGE.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      locale: 'fr',
      currency: 'eur',
      success_url: success_url || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_BASE_URL}/offer`,
      metadata: {
        uploads_amount: UPLOADS_PACKAGE.amount.toString(),
        user_id: user_id || '',
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error
    })
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

