import { format, subDays } from 'date-fns'

// This is a mock service that would normally fetch data from an API
export const fetchDashboardData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Generate mock data for the dashboard
  const today = new Date()
  const labels = Array.from({ length: 7 }, (_, i) => {
    return format(subDays(today, 6 - i), 'MMM d')
  })
  
  const revenueData = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: [35400, 28700, 42600, 39800, 43200, 48900, 53500],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Orders',
        data: [42, 35, 52, 48, 53, 58, 65],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        borderDash: [5, 5],
        fill: false
      }
    ]
  }
  
  return {
    totalRevenue: 292100,
    totalOrders: 353,
    averageOrderValue: 827,
    lowStockItems: 12,
    revenueData
  }
}