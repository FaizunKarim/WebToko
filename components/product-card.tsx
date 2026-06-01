import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  id: string
  name: string
  price: number
  imageUrl?: string
  category?: string
}

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  category,
}: ProductCardProps) {
  return (
    <Link href={`/products/${id}`}>
      <div className='bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer'>
        <div className='aspect-square bg-gray-100 relative overflow-hidden'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className='object-cover hover:scale-105 transition'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-gray-400'>
              <span>Tidak ada gambar</span>
            </div>
          )}
        </div>
        <div className='p-4'>
          {category && (
            <p className='text-xs text-gray-500 uppercase tracking-wider mb-2'>
              {category}
            </p>
          )}
          <h3 className='font-semibold text-gray-900 mb-3 line-clamp-2'>{name}</h3>
          <p className='text-lg font-bold text-gray-900'>
            Rp {Math.round(price).toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </Link>
  )
}
