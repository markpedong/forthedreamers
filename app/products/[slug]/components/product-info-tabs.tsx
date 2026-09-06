import SellerInfo from './seller-info'

type ProductInfoTabsProps = {
  product: {
    brand: string | null
    description: string
    tags: string[]
    category: {name: string}
    specs: Array<{id: string; label: string; value: string}>
    variants: Array<{id: string; name: string; attributes: Record<string, string>}>
    seller: {
      storeName: string
      description: string | null
      logo: string | null
      createdAt: Date | string
    }
    sellerProductCount: number
  }
}

const ProductInfoTabs = ({product}: ProductInfoTabsProps) => {
  const attributes = Array.from(new Set(product.variants.flatMap(variant => Object.keys(variant.attributes))))

  return (
    <div className='space-y-8'>
      <SellerInfo seller={{...product.seller, activeProductCount: product.sellerProductCount}} />

      <section className='grid gap-8 rounded-xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]'>
        <div>
          <p className='text-xs uppercase tracking-widest text-muted-foreground'>About the product</p>
          <h2 className='mt-2 text-2xl font-semibold text-foreground'>Description</h2>
          {product.description.trim() ? (
            <div className='mt-4 space-y-3 whitespace-pre-line leading-relaxed text-muted-foreground'>{product.description}</div>
          ) : (
            <p className='mt-4 text-muted-foreground'>The seller has not added a description yet.</p>
          )}
        </div>

        <div>
          <p className='text-xs uppercase tracking-widest text-muted-foreground'>Product details</p>
          <h2 className='mt-2 text-2xl font-semibold text-foreground'>Specifications</h2>
          <dl className='mt-4 divide-y divide-border rounded-lg border border-border'>
            <div className='grid grid-cols-2 gap-4 p-3 text-sm'>
              <dt className='text-muted-foreground'>Category</dt>
              <dd className='text-right font-medium text-foreground'>{product.category.name}</dd>
            </div>
            {product.brand && (
              <div className='grid grid-cols-2 gap-4 p-3 text-sm'>
                <dt className='text-muted-foreground'>Brand</dt>
                <dd className='text-right font-medium text-foreground'>{product.brand}</dd>
              </div>
            )}
            {product.specs.filter(spec => spec.label.trim() && spec.value.trim()).map(spec => (
              <div key={spec.id} className='grid grid-cols-2 gap-4 p-3 text-sm'>
                <dt className='text-muted-foreground'>{spec.label}</dt>
                <dd className='text-right font-medium text-foreground'>{spec.value}</dd>
              </div>
            ))}
            {attributes.length > 0 && (
              <div className='grid grid-cols-2 gap-4 p-3 text-sm'>
                <dt className='text-muted-foreground'>Options</dt>
                <dd className='text-right font-medium text-foreground'>{attributes.join(', ')}</dd>
              </div>
            )}
          </dl>
          {product.tags.length > 0 && (
            <div className='mt-4 flex flex-wrap gap-2'>
              {product.tags.map(tag => (
                <span key={tag} className='rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground'>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProductInfoTabs
