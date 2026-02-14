interface ProductCardProps {
  category?: string
  name: string
  subTitle?: string
  price: number | string
  priceDisplay?: string
  tags?: string[]
  imageUrl?: string
  url?: string
  authorName?: string
  likesCount?: number
}

export default function ProductCard({
  category,
  name,
  subTitle,
  price,
  priceDisplay,
  tags,
  imageUrl,
  url,
  authorName,
}: ProductCardProps) {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      {imageUrl ? (
        <div className="bg-gray-200 overflow-hidden">
          <img src={imageUrl} alt={name} className="w-full h-auto object-contain" />
        </div>
      ) : (
        <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-4xl text-gray-400">📦</span>
        </div>
      )}

      <div className="p-4">
        {category && (
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
              {category}
            </span>
          </div>
        )}

        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {name}
        </h3>

        {subTitle && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-1">
            {subTitle}
          </p>
        )}

        {tags && tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {tags.map((tag, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mb-3">
          <span className="text-2xl font-bold text-gray-900">
            {priceDisplay || (typeof price === 'number' ? `¥${price.toLocaleString()}` : price)}
          </span>
        </div>

        {authorName && (
          <div className="flex items-center text-sm text-gray-600 mb-3 pb-3 border-b border-gray-200">
            <span>by <span className="font-medium">{authorName}</span></span>
          </div>
        )}

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block text-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition"
        >
          BOOTH
        </a>
      </div>
    </div>
  )
}
