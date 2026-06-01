'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createOrder, generateMidtransToken } from '@/app/actions/orders'
import { getCartItems } from '@/app/actions/cart'
import { useEffect } from 'react'
import Link from 'next/link'

declare global {
  interface Window {
    snap?: {
      pay(token: string, callbacks: any): void
    }
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [shippingAddress, setShippingAddress] = useState('')

  useEffect(() => {
    loadCart()
    // Load Midtrans SDK
    const script = document.createElement('script')
    script.src = 'https://app.midtrans.com/snap/snap.js'
    script.setAttribute(
      'data-client-key',
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
    )
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  async function loadCart() {
    try {
      const items = await getCartItems()
      setCartItems(items)
    } catch (error) {
      console.error('[v0] Error loading cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!shippingAddress.trim()) {
      alert('Please enter shipping address')
      return
    }

    setProcessing(true)

    try {
      // Create order
      const { orderId } = await createOrder({
        shippingAddress,
        paymentMethod: 'midtrans',
      })

      // Generate Midtrans token
      const { token } = await generateMidtransToken(orderId)

      // Open Midtrans payment modal
      if (window.snap) {
        window.snap.pay(token, {
          onSuccess: function (result: any) {
            console.log('[v0] Payment success:', result)
            router.push(`/orders/${orderId}?status=success`)
          },
          onPending: function (result: any) {
            console.log('[v0] Payment pending:', result)
            router.push(`/orders/${orderId}?status=pending`)
          },
          onError: function (result: any) {
            console.error('[v0] Payment error:', result)
            alert('Payment failed. Please try again.')
          },
          onClose: function () {
            console.log('[v0] Payment modal closed')
          },
        })
      }
    } catch (error) {
      console.error('[v0] Checkout error:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading checkout...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Your cart is empty</p>
        <Link href="/products" className="text-blue-600 hover:underline">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        <div className="mb-8 space-y-4 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between border-b py-2">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-600">
                  Size: {item.size} | Color: {item.color}
                </p>
              </div>
              <p className="font-medium">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="flex justify-between border-t pt-4 text-lg font-bold">
            <span>Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Shipping Address
            </label>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your complete shipping address"
              className="w-full rounded-lg border p-3"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {processing ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          You will be redirected to Midtrans payment gateway
        </p>
      </div>
    </div>
  )
}
