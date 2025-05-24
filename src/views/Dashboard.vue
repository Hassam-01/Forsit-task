<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'vue-chartjs'
import StatCard from '../components/dashboard/StatCard.vue'
import { fetchDashboardData } from '../services/dashboardService'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const dashboardData = ref({
  totalRevenue: 0,
  totalOrders: 0,
  averageOrderValue: 0,
  lowStockItems: 0,
  revenueData: {
    labels: [] as string[],
    datasets: [] as any[]
  }
})

const isLoading = ref(true)

onMounted(async () => {
  try {
    const data = await fetchDashboardData()
    dashboardData.value = data
  } catch (error) {
    console.error('Failed to fetch dashboard data', error)
  } finally {
    isLoading.value = false
  }
})

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
</script>

<template>
  <div>
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
    
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Revenue" 
          :value="dashboardData.totalRevenue" 
          type="currency"
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          color="primary"
        />
        <StatCard 
          title="Total Orders" 
          :value="dashboardData.totalOrders" 
          type="number"
          icon="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          color="accent"
        />
        <StatCard 
          title="Average Order Value" 
          :value="dashboardData.averageOrderValue" 
          type="currency"
          icon="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
          color="success"
        />
        <StatCard 
          title="Low Stock Items" 
          :value="dashboardData.lowStockItems" 
          type="number"
          icon="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          color="warning"
        />
      </div>
      
      <div class="grid grid-cols-1 gap-6">
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-800">Revenue Overview</h2>
            <div class="flex space-x-2">
              <button class="btn btn-secondary text-sm">Weekly</button>
              <button class="btn btn-primary text-sm">Monthly</button>
              <button class="btn btn-secondary text-sm">Yearly</button>
            </div>
          </div>
          <div class="h-80">
            <Line
              :data="dashboardData.revenueData"
              :options="chartOptions"
            />
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-800">Top Selling Products</h2>
            <router-link to="/inventory" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </router-link>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td class="px-4 py-3 whitespace-nowrap">iPhone 15 Pro</td>
                  <td class="px-4 py-3 whitespace-nowrap">254</td>
                  <td class="px-4 py-3 whitespace-nowrap">$254,000</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 whitespace-nowrap">MacBook Pro 16"</td>
                  <td class="px-4 py-3 whitespace-nowrap">189</td>
                  <td class="px-4 py-3 whitespace-nowrap">$567,000</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 whitespace-nowrap">AirPods Pro</td>
                  <td class="px-4 py-3 whitespace-nowrap">432</td>
                  <td class="px-4 py-3 whitespace-nowrap">$129,600</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 whitespace-nowrap">iPad Pro</td>
                  <td class="px-4 py-3 whitespace-nowrap">156</td>
                  <td class="px-4 py-3 whitespace-nowrap">$156,000</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 whitespace-nowrap">Apple Watch Series 9</td>
                  <td class="px-4 py-3 whitespace-nowrap">201</td>
                  <td class="px-4 py-3 whitespace-nowrap">$90,450</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-800">Recent Orders</h2>
            <a href="#" class="text-primary-600 hover:text-primary-700 text-sm font-medium">View All</a>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td class="px-4 py-3 whitespace-nowrap">#ORD-7392</td>
                  <td class="px-4 py-3 whitespace-nowrap">Sarah Johnson</td>
                  <td class="px-4 py-3 whitespace-nowrap">Oct 15, 2023</td>
                  <td class="px-4 py-3 whitespace-nowrap">$1,249</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full bg-success-100 text-success-800">Completed</span>
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-3 whitespace-nowrap">#ORD-7391</td>
                  <td class="px-4 py-3 whitespace-nowrap">Mike Thompson</td>
                  <td class="px-4 py-3 whitespace-nowrap">Oct 14, 2023</td>
                  <td class="px-4 py-3 whitespace-nowrap">$899</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full bg-warning-100 text-warning-800">Processing</span>
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-3 whitespace-nowrap">#ORD-7390</td>
                  <td class="px-4 py-3 whitespace-nowrap">Emma Davis</td>
                  <td class="px-4 py-3 whitespace-nowrap">Oct 14, 2023</td>
                  <td class="px-4 py-3 whitespace-nowrap">$2,499</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full bg-success-100 text-success-800">Completed</span>
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-3 whitespace-nowrap">#ORD-7389</td>
                  <td class="px-4 py-3 whitespace-nowrap">John Smith</td>
                  <td class="px-4 py-3 whitespace-nowrap">Oct 13, 2023</td>
                  <td class="px-4 py-3 whitespace-nowrap">$349</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full bg-error-100 text-error-800">Cancelled</span>
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-3 whitespace-nowrap">#ORD-7388</td>
                  <td class="px-4 py-3 whitespace-nowrap">Lisa Brown</td>
                  <td class="px-4 py-3 whitespace-nowrap">Oct 12, 2023</td>
                  <td class="px-4 py-3 whitespace-nowrap">$1,149</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full bg-success-100 text-success-800">Completed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>