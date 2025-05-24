<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { fetchInventoryData, updateProductStock } from '../services/inventoryService'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLoading = ref(true)
const searchTerm = ref('')
const selectedCategory = ref('all')
const sortBy = ref('name')
const sortOrder = ref('asc')
const showLowStock = ref(false)

const products = ref([])
const categories = ref([])

onMounted(async () => {
  await loadInventoryData()
})

const loadInventoryData = async () => {
  isLoading.value = true
  try {
    const data = await fetchInventoryData()
    products.value = data.products
    categories.value = data.categories
  } catch (error) {
    console.error('Failed to fetch inventory data', error)
  } finally {
    isLoading.value = false
  }
}

const filteredProducts = computed(() => {
  let result = [...products.value]
  
  // Filter by search term
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(product => 
      product.name.toLowerCase().includes(term) || 
      product.sku.toLowerCase().includes(term)
    )
  }
  
  // Filter by category
  if (selectedCategory.value !== 'all') {
    result = result.filter(product => product.category === selectedCategory.value)
  }
  
  // Filter by stock status
  if (showLowStock.value) {
    result = result.filter(product => product.stock <= product.lowStockThreshold)
  }
  
  // Sort products
  result.sort((a, b) => {
    let valueA = a[sortBy.value]
    let valueB = b[sortBy.value]
    
    // Handle string comparison
    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase()
      valueB = valueB.toLowerCase()
    }
    
    if (valueA < valueB) return sortOrder.value === 'asc' ? -1 : 1
    if (valueA > valueB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
  
  return result
})

const toggleSort = (field: string) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

const getSortIcon = (field: string) => {
  if (sortBy.value !== field) return 'M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9'
  return sortOrder.value === 'asc' 
    ? 'M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75' 
    : 'M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75'
}

const getStockStatusClass = (stock: number, threshold: number) => {
  if (stock <= 0) return 'bg-error-100 text-error-800'
  if (stock <= threshold) return 'bg-warning-100 text-warning-800'
  return 'bg-success-100 text-success-800'
}

const getStockStatus = (stock: number, threshold: number) => {
  if (stock <= 0) return 'Out of Stock'
  if (stock <= threshold) return 'Low Stock'
  return 'In Stock'
}

const updateStock = async (productId: number, newStock: number) => {
  try {
    await updateProductStock(productId, newStock)
    // Update local data
    const product = products.value.find(p => p.id === productId)
    if (product) {
      product.stock = newStock
    }
  } catch (error) {
    console.error('Failed to update product stock', error)
  }
}

const addNewProduct = () => {
  router.push('/products/new')
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Inventory Management</h1>
      
      <div class="mt-4 md:mt-0">
        <button @click="addNewProduct" class="btn btn-primary">
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Product
          </span>
        </button>
      </div>
    </div>
    
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              id="search"
              v-model="searchTerm"
              type="text"
              placeholder="Search by name or SKU"
              class="input pl-10 w-full"
            />
          </div>
        </div>
        
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select id="category" v-model="selectedCategory" class="input w-full">
            <option value="all">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        
        <div class="flex items-end">
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="showLowStock" class="form-checkbox h-5 w-5 text-primary-600">
            <span class="ml-2 text-sm text-gray-700">Show Low Stock Items Only</span>
          </label>
        </div>
      </div>
    </div>
    
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
    
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th @click="toggleSort('name')" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                <div class="flex items-center space-x-1">
                  <span>Product Name</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="getSortIcon('name')" />
                  </svg>
                </div>
              </th>
              <th @click="toggleSort('sku')" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                <div class="flex items-center space-x-1">
                  <span>SKU</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="getSortIcon('sku')" />
                  </svg>
                </div>
              </th>
              <th @click="toggleSort('category')" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                <div class="flex items-center space-x-1">
                  <span>Category</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="getSortIcon('category')" />
                  </svg>
                </div>
              </th>
              <th @click="toggleSort('price')" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                <div class="flex items-center space-x-1">
                  <span>Price</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="getSortIcon('price')" />
                  </svg>
                </div>
              </th>
              <th @click="toggleSort('stock')" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                <div class="flex items-center space-x-1">
                  <span>Stock</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="getSortIcon('stock')" />
                  </svg>
                </div>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product.id">
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img :src="product.image" :alt="product.name" class="h-10 w-10 rounded-md object-cover" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.sku }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.category }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${{ product.price.toFixed(2) }}</td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <button 
                    @click="updateStock(product.id, Math.max(0, product.stock - 1))" 
                    class="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                    </svg>
                  </button>
                  <span class="mx-2 text-sm text-gray-900">{{ product.stock }}</span>
                  <button 
                    @click="updateStock(product.id, product.stock + 1)" 
                    class="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'px-2 py-1 text-xs rounded-full',
                    getStockStatusClass(product.stock, product.lowStockThreshold)
                  ]"
                >
                  {{ getStockStatus(product.stock, product.lowStockThreshold) }}
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex space-x-2">
                  <button class="text-primary-600 hover:text-primary-800">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button class="text-error-600 hover:text-error-800">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">{{ filteredProducts.length }}</span> products
        </div>
        
        <div class="flex space-x-2">
          <button class="btn btn-secondary text-sm">Previous</button>
          <button class="btn btn-primary text-sm">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>