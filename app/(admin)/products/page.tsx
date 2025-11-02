'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ProductGrid from '../components/product-grid';
import ProductDetail from '../components/product-detail';

const products = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    brand: 'AudioTech',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.5,
    reviewCount: 328,
    stock: 15,
    category: 'Electronics',
    image: '/wireless-headphones.jpg',
  },
  {
    id: '2',
    name: 'Portable Bluetooth Speaker',
    brand: 'SoundWave',
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.3,
    reviewCount: 245,
    stock: 32,
    category: 'Electronics',
    image: '/portable-speaker.png',
  },
  {
    id: '3',
    name: 'Wireless Charging Case',
    brand: 'TechGear',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.6,
    reviewCount: 189,
    stock: 8,
    category: 'Accessories',
    image: '/charging-case.jpg',
  },
  {
    id: '4',
    name: 'Premium Audio Cable',
    brand: 'AudioTech',
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.4,
    reviewCount: 156,
    stock: 45,
    category: 'Accessories',
    image: '/audio-cable.jpg',
  },
];

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [toast, setToast] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [newProduct, setNewProduct] = useState({ name: '', brand: '', price: '' });

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'stock') return b.stock - a.stock;
    return 0;
  });

  const handleCreateProduct = () => {
    if (newProduct.name && newProduct.brand && newProduct.price) {
      setToast(`Product "${newProduct.name}" created successfully!`);
      setShowAddProduct(false);
      setNewProduct({ name: '', brand: '', price: '' });
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Products</h1>
          <p className='text-muted-foreground mt-1'>Manage your product catalog</p>
        </div>
        <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='w-4 h-4 mr-2' />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Create a new product listing</DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <Input
                placeholder='Product name'
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <Input
                placeholder='Brand'
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
              />
              <Input
                placeholder='Price'
                type='number'
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
              <Button className='w-full' onClick={handleCreateProduct}>
                Create Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-2.5 w-4 h-4 text-muted-foreground' />
                <Input
                  placeholder='Search products...'
                  className='pl-10'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className='w-full md:w-48'>
                <SelectValue placeholder='Category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                <SelectItem value='Electronics'>Electronics</SelectItem>
                <SelectItem value='Accessories'>Accessories</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='w-full md:w-48'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='name'>Name (A-Z)</SelectItem>
                <SelectItem value='price-low'>Price (Low to High)</SelectItem>
                <SelectItem value='price-high'>Price (High to Low)</SelectItem>
                <SelectItem value='rating'>Rating (High to Low)</SelectItem>
                <SelectItem value='stock'>Stock (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Product Grid */}
      <ProductGrid
        products={sortedProducts}
        selectedProduct={selectedProduct}
        onSelectProduct={setSelectedProduct}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <ProductDetail product={selectedProduct} />
          </DialogContent>
        </Dialog>
      )}

      {/* Toast notification */}
      {toast && (
        <div className='fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm'>
          {toast}
        </div>
      )}
    </div>
  );
}
