'use client'

import { useState, useRef, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { Product } from '../lib/types'

export default function SwipeableCardContainer({ items }: { items: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      container.scrollLeft += e.deltaY
    }

    container.addEventListener('wheel', handleWheelNative, { passive: false })
    return () => container.removeEventListener('wheel', handleWheelNative)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    containerRef.current.scrollLeft = scrollLeft - (x - startX) * 2
  }

  const handleMouseUp = () => setIsDragging(false)
  const handleMouseLeave = () => setIsDragging(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return
    const x = e.touches[0].pageX - containerRef.current.offsetLeft
    containerRef.current.scrollLeft = scrollLeft - (x - startX) * 2
  }

  const handleTouchEnd = () => setIsDragging(false)

  return (
    <div
      ref={containerRef}
      className={`flex gap-3 overflow-x-auto pb-2 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ scrollbarWidth: 'thin' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {items.map((product, idx) => (
        <div key={idx} className="flex-shrink-0 w-64">
          <ProductCard
            category={product.category}
            name={product.name}
            subTitle={product.subTitle}
            price={product.price}
            priceDisplay={product.priceDisplay}
            tags={product.tags}
            imageUrl={product.imageUrl}
            url={product.url}
            authorName={product.authorName}
            likesCount={product.likesCount}
          />
        </div>
      ))}
    </div>
  )
}
