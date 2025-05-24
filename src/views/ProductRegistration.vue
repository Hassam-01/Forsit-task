<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerProduct } from '../services/productService'

const router = useRouter()

const categories = ref([
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Toys & Games',
  'Books',
  'Automotive'
])

const formData = ref({
  name: '',
  sku: '',
  category: '',
  price: null as number | null,
  cost: null as number | null,
  stock: null as number | null,
  lowStockThreshold: 10,
  description: '',
  imageUrl: ''
})

const previewImage = ref('')
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const showSuccessMessage = ref(false)

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // In a real app, you would upload this to a server/storage
    // For demo purposes, we'll just create a local object URL
    previewImage.value = URL.createObjectURL(file)
    
    // In a real app, the image URL would come from the server response
    formData.value.imageUrl = 'https://via.placeholder.com/150'
  }
}

const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}
  
  if (!formData.value.name.trim()) {
    newErrors.name = 'Product name is required'
  }
  
  if (!formData.value.sku.trim()) {
    newErrors.sku = 'SKU is required'
  }
  
  if (!formData.value.category) {
    newErrors.category = 'Category is required'
  }
  
  if (formData.value.price === null || formData.value.price <= 0) {
    newErrors.price = 'Price must be greater than zero'
  }
  
  if (formData.value.stock === null || formData.value.stock < 0) {
    newErrors.stock = 'Stock must be zero or greater'
  }
  
  if (!formData.value.description.trim()) {
    newErrors.description = 'Description is required'
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    const product = await registerProduct({
      ...formData.value,
      price: formData.value.price as number,
      stock: formData.value.stock as number,
      cost: formData.value.cost as number
    })
    
    showSuccessMessage.value = true
    
    // Reset form after submission
    setTimeout(() => {
      router.push('/inventory')
    }, 2000)
    
  } catch (error) {
    console.error('Failed to register product', error)
  } finally {
    isSubmitting.value = false
  }
}

const generateSku = () => {
  if (!formData.value.name) return
  
  // Generate a SKU based on category and name
  const categoryPrefix = formData.value.category ? formData.value.category.substring(0, 3).toUpperCase() : 'PRD'
  const namePrefix = formData.value.name.substring(0, 3).toUpperCase()
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  
  formData.value.sku = `${categoryPrefix}-${namePrefix}-${randomNum}`
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Add New Product</h1>
      <button @click="router.push('/inventory')" class="btn btn-secondary">
        Cancel
      </button>
    </div>
    
    <div v-if="showSuccessMessage" class="bg-success-100 border border-success-200 text-success-800 px-4 py-3 rounded mb-6">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Product successfully added! Redirecting to inventory...</span>
      </div>
    </div>
    
    <form @submit.prevent="handleSubmit" class="card">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Product Information</h2>
        </div>
        
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            class="input w-full"
            :class="{ 'border-error-500': errors.name }"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-error-600">{{ errors.name }}</p>
        </div>
        
        <div>
          <label for="sku" class="block text-sm font-medium text-gray-700 mb-1">SKU*</label>
          <div class="flex">
            <input
              id="sku"
              v-model="formData.sku"
              type="text"
              class="input w-full rounded-r-none"
              :class="{ 'border-error-500': errors.sku }"
            />
            <button 
              type="button" 
              @click="generateSku" 
              class="btn btn-secondary rounded-l-none"
            >
              Generate
            </button>
          </div>
          <p v-if="errors.sku" class="mt-1 text-sm text-error-600">{{ errors.sku }}</p>
        </div>
        
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category*</label>
          <select
            id="category"
            v-model="formData.category"
            class="input w-full"
            :class="{ 'border-error-500': errors.category }"
          >
            <option value="" disabled>Select a category</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <p v-if="errors.category" class="mt-1 text-sm text-error-600">{{ errors.category }}</p>
        </div>
        
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Price ($)*</label>
          <input
            id="price"
            v-model.number="formData.price"
            type="number"
            step="0.01"
            min="0"
            class="input w-full"
            :class="{ 'border-error-500': errors.price }"
          />
          <p v-if="errors.price" class="mt-1 text-sm text-error-600">{{ errors.price }}</p>
        </div>
        
        <div>
          <label for="cost" class="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
          <input
            id="cost"
            v-model.number="formData.cost"
            type="number"
            step="0.01"
            min="0"
            class="input w-full"
          />
        </div>
        
        <div>
          <label for="stock" class="block text-sm font-medium text-gray-700 mb-1">Initial Stock*</label>
          <input
            id="stock"
            v-model.number="formData.stock"
            type="number"
            min="0"
            class="input w-full"
            :class="{ 'border-error-500': errors.stock }"
          />
          <p v-if="errors.stock" class="mt-1 text-sm text-error-600">{{ errors.stock }}</p>
        </div>
        
        <div class="md:col-span-2">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description*</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="4"
            class="input w-full"
            :class="{ 'border-error-500': errors.description }"
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-error-600">{{ errors.description }}</p>
        </div>
        
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
          <div class="flex items-start space-x-4">
            <div
              class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center"
              :class="{ 'border-primary-500': previewImage }"
            >
              <img
                v-if="previewImage"
                :src="previewImage"
                alt="Product preview"
                class="w-full h-full object-cover rounded-md"
              />
              <div v-else class="text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mx-auto text-gray-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <label class="btn btn-secondary cursor-pointer">
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageChange"
                  class="hidden"
                />
              </label>
              <p class="mt-2 text-sm text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-8 flex justify-end">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>Add Product</span>
        </button>
      </div>
    </form>
  </div>
</template>