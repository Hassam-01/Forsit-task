<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Line, Bar } from 'vue-chartjs'
import { fetchRevenueData } from '../services/revenueService'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const timeFrame = ref('monthly')
const selectedCategory = ref('all')
const isLoading = ref(true)

const revenueData = ref({
  summary: {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    revenueGrowth: 0
  },
  chartData: {
    labels: [] as string[],
    datasets: [] as any[]
  },
  categoryData: {
    labels: [] as string[],
    datasets: [] as any[]
  },
  categories: [] as string[]
})

onMounted(async () => {
  await loadRevenueData()
})

const loadRevenueData = async () => {
  isLoading.value = true
  try {
    const data = await fetchRevenueData(timeFrame.value, selectedCategory.value)
    revenueData.value = data
  } catch (error) {
    console.error('Failed to fetch revenue data', error)
  } finally {
    isLoading.value = false
  }
}

const changeTimeFrame = async (newTimeFrame: string) => {
  timeFrame.value = newTimeFrame
  await loadRevenueData()
}

const changeCategory = async (category: string) => {
  selectedCategory.value = category
  await loadRevenueData()
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      position: 'top' as const
    }
  }
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const formatGrowth = (value: number): string => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value}%`
}

const growthClass = computed(() => {
  return revenueData.value.summary.revenueGrowth >= 0 ? 'text-success-600' : 'text-error-600'
})
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Revenue Analysis</h1>
      
      <div class="mt-4 md:mt-0 flex space-x-2">
        <button 
          v-for="option in ['daily', 'weekly', 'monthly', 'yearly']" 
          :key="option"
          @click="changeTimeFrame(option)"
          :class="[
            'btn',
            timeFrame === option ? 'btn-primary' : 'btn-secondary',
            'text-sm'
          ]"
        >
          {{ option.charAt(0).toUpperCase() + option.slice(1) }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
    
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="card">
          <h3 class="text-sm font-medium text-gray-500">Total Revenue</h3>
          <div class="mt-2 flex items-baseline">
            <p class="text-2xl font-semibold">{{ formatCurrency(revenueData.summary.totalRevenue) }}</p>
            <p :class="['ml-2 text-sm font-medium', growthClass]">
              {{ formatGrowth(revenueData.summary.revenueGrowth) }}
            </p>
          </div>
        </div>
        
        <div class="card">
          <h3 class="text-sm font-medium text-gray-500">Total Orders</h3>
          <p class="mt-2 text-2xl font-semibold">{{ revenueData.summary.totalOrders.toLocaleString() }}</p>
        </div>
        
        <div class="card">
          <h3 class="text-sm font-medium text-gray-500">Average Order Value</h3>
          <p class="mt-2 text-2xl font-semibold">{{ formatCurrency(revenueData.summary.averageOrderValue) }}</p>
        </div>
        
        <div class="card">
          <h3 class="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p class="mt-2 text-2xl font-semibold">3.2%</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="card lg:col-span-2">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-800">Revenue Trends</h2>
            <div class="flex items-center space-x-2">
              <select 
                v-model="selectedCategory" 
                @change="changeCategory(selectedCategory)"
                class="input text-sm"
              >
                <option value="all">All Categories</option>
                <option v-for="category in revenueData.categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
          </div>
          <div class="h-80">
            <Line
              :data="revenueData.chartData"
              :options="chartOptions"
            />
          </div>
        </div>
        
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Revenue by Category</h2>
          <div class="h-80">
            <Bar
              :data="revenueData.categoryData"
              :options="chartOptions"
            />
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Revenue Breakdown</h2>
          <button class="btn btn-secondary text-sm">Export CSV</button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Order Value</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="px-4 py-3 whitespace-nowrap">Oct 2023</td>
                <td class="px-4 py-3 whitespace-nowrap">1,254</td>
                <td class="px-4 py-3 whitespace-nowrap">$1,245,000</td>
                <td class="px-4 py-3 whitespace-nowrap">$992</td>
                <td class="px-4 py-3 whitespace-nowrap text-success-600">+12.3%</td>
              </tr>
              <tr>
                <td class="px-4 py-3 whitespace-nowrap">Sep 2023</td>
                <td class="px-4 py-3 whitespace-nowrap">1,189</td>
                <td class="px-4 py-3 whitespace-nowrap">$1,109,000</td>
                <td class="px-4 py-3 whitespace-nowrap">$933</td>
                <td class="px-4 py-3 whitespace-nowrap text-success-600">+5.2%</td>
              </tr>
              <tr>
                <td class="px-4 py-3 whitespace-nowrap">Aug 2023</td>
                <td class="px-4 py-3 whitespace-nowrap">1,032</td>
                <td class="px-4 py-3 whitespace-nowrap">$943,000</td>
                <td class="px-4 py-3 whitespace-nowrap">$914</td>
                <td class="px-4 py-3 whitespace-nowrap text-error-600">-2.1%</td>
              </tr>
              <tr>
                <td class="px-4 py-3 whitespace-nowrap">Jul 2023</td>
                <td class="px-4 py-3 whitespace-nowrap">1,056</td>
                <td class="px-4 py-3 whitespace-nowrap">$967,000</td>
                <td class="px-4 py-3 whitespace-nowrap">$916</td>
                <td class="px-4 py-3 whitespace-nowrap text-success-600">+8.4%</td>
              </tr>
              <tr>
                <td class="px-4 py-3 whitespace-nowrap">Jun 2023</td>
                <td class="px-4 py-3 whitespace-nowrap">921</td>
                <td class="px-4 py-3 whitespace-nowrap">$823,000</td>
                <td class="px-4 py-3 whitespace-nowrap">$893</td>
                <td class="px-4 py-3 whitespace-nowrap text-success-600">+3.7%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>