// This is a mock service that would normally fetch data from an API
export const fetchInventoryData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Generate mock categories
  const categories = [
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Toys & Games',
    'Books',
    'Automotive'
  ]
  
  // Generate mock products
  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      sku: 'ELE-IPH-1234',
      category: 'Electronics',
      price: 999,
      stock: 42,
      lowStockThreshold: 10,
      image: 'https://images.pexels.com/photos/7256694/pexels-photo-7256694.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 2,
      name: 'MacBook Pro 16"',
      sku: 'ELE-MAC-2345',
      category: 'Electronics',
      price: 2499,
      stock: 15,
      lowStockThreshold: 5,
      image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 3,
      name: 'Nike Air Max',
      sku: 'CLO-NIK-3456',
      category: 'Clothing',
      price: 120,
      stock: 78,
      lowStockThreshold: 15,
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 4,
      name: 'Amazon Echo Dot',
      sku: 'ELE-ECH-4567',
      category: 'Electronics',
      price: 49.99,
      stock: 92,
      lowStockThreshold: 20,
      image: 'https://images.pexels.com/photos/4790255/pexels-photo-4790255.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 5,
      name: 'Keurig Coffee Maker',
      sku: 'HOM-KEU-5678',
      category: 'Home & Kitchen',
      price: 89.99,
      stock: 27,
      lowStockThreshold: 10,
      image: 'https://images.pexels.com/photos/6205791/pexels-photo-6205791.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 6,
      name: 'Levi\'s 501 Jeans',
      sku: 'CLO-LEV-6789',
      category: 'Clothing',
      price: 59.99,
      stock: 64,
      lowStockThreshold: 15,
      image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 7,
      name: 'Sony WH-1000XM4',
      sku: 'ELE-SON-7890',
      category: 'Electronics',
      price: 349.99,
      stock: 8,
      lowStockThreshold: 10,
      image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 8,
      name: 'Instant Pot Duo',
      sku: 'HOM-INS-8901',
      category: 'Home & Kitchen',
      price: 119.95,
      stock: 35,
      lowStockThreshold: 10,
      image: 'https://images.pexels.com/photos/5677790/pexels-photo-5677790.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 9,
      name: 'Dyson V11 Vacuum',
      sku: 'HOM-DYS-9012',
      category: 'Home & Kitchen',
      price: 599.99,
      stock: 12,
      lowStockThreshold: 5,
      image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 10,
      name: 'Apple AirPods Pro',
      sku: 'ELE-APP-0123',
      category: 'Electronics',
      price: 249.99,
      stock: 3,
      lowStockThreshold: 10,
      image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 11,
      name: 'Samsung 65" QLED TV',
      sku: 'ELE-SAM-1234',
      category: 'Electronics',
      price: 1299.99,
      stock: 6,
      lowStockThreshold: 5,
      image: 'https://images.pexels.com/photos/5552789/pexels-photo-5552789.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 12,
      name: 'Kindle Paperwhite',
      sku: 'ELE-KIN-2345',
      category: 'Electronics',
      price: 139.99,
      stock: 22,
      lowStockThreshold: 10,
      image: 'https://images.pexels.com/photos/6033993/pexels-photo-6033993.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 13,
      name: 'Patagonia Jacket',
      sku: 'CLO-PAT-3456',
      category: 'Clothing',
      price: 229.99,
      stock: 17,
      lowStockThreshold: 5,
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 14,
      name: 'Bose QuietComfort 45',
      sku: 'ELE-BOS-4567',
      category: 'Electronics',
      price: 329.99,
      stock: 0,
      lowStockThreshold: 8,
      image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 15,
      name: 'Nespresso Machine',
      sku: 'HOM-NES-5678',
      category: 'Home & Kitchen',
      price: 149.99,
      stock: 31,
      lowStockThreshold: 10,
      image: 'https://images.pexels.com/photos/7474372/pexels-photo-7474372.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ]
  
  return {
    products,
    categories
  }
}

export const updateProductStock = async (productId: number, newStock: number) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400))
  
  // In a real app, this would update the stock in the database
  console.log(`Updated product ${productId} stock to ${newStock}`)
  
  return { success: true }
}