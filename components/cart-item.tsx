'use client'

import { updateCartItem, removeFromCart } from '@/app/actions/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import Image from 'next/image'

interface CartItemProps {
  item: {
    id: string
    productId: string
    quantity: number
    size: string
    color: string
    product: {
      id: string
      name: string
      price: string
      image_url: string
    }
  }
}

export function CartItemComponent({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [removing, setRemoving] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    setQuantity(newQuantity)
    await updateCartItem(item.id, newQuantity)
  }

  const handleRemove = async () => {
    setRemoving(true)
    try {
      await removeFromCart(item.id)
    } finally {
      setRemoving(false)
    }
  }

  const itemTotal = Number(item.product.price) * quantity

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={item.product.image_url}
            alt={item.product.name}
            className="w-24 h-24 object-cover rounded"
          />

          <div className="flex-1">
            <h3 className="font-semibold text-lg">{item.product.name}</h3>
            <p className="text-sm text-gray-600">
              Size: {item.size} | Color: {item.color}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold">
              IDR {itemTotal.toLocaleString('id-ID')}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              IDR {Number(item.product.price).toLocaleString('id-ID')} each
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={removing}
            >
              {removing ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
