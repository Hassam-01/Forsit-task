import { format, subDays, subMonths } from 'date-fns'

// This is a mock service that would normally fetch data from an API
export const fetchRevenueData = async (timeFrame: string, category: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Generate mock data based on the selected time frame and category
  const today = new Date()
  let labels: string[] = []
  let revenueValues: number[] = []
  let orderValues: number[] = []
  
  // Generate labels based on time frame
  switch (timeFrame) {
    case 'daily':
      labels = Array.from({ length: 7 }, (_, i) => {
        return format(subDays(today, 6 - i), 'MMM d')
      })
      revenueValues = [35400, 28700, 42600, 39800, 43200, 48900, 53500]
      orderValues = [42, 35, 52, 48, 53, 58, 65]
      break
    case 'weekly':
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      revenueValues = [142500, 158900, 177300, 185400]
      orderValues = [178, 193, 212, 226]
      break
    case 'monthly':
      labels = Array.from({ length: 6 }, (_, i) => {
        return format(subMonths(today, 5 - i), 'MMM yyyy')
      })
      revenueValues = [823000, 943000, 967000, 1109000, 1245000, 1350000]
      orderValues = [921, 1032, 1056, 1189, 1254, 1387]
      break
    case 'yearly':
      labels = ['2019', '2020', '2021', '2022', '2023']
      revenueValues = [8500000, 9200000, 10500000, 12800000, 14500000]
      orderValues = [9500, 10200, 11800, 13900, 15600]
      break
    default:
      labels = Array.from({ length: 6 }, (_, i) => {
        return format(subMonths(today, 5 - i), 'MMM yyyy')
      })
      revenueValues = [823000, 943000, 967000, 1109000, 1245000, 1350000]
      orderValues = [921, 1032, 1056, 1189, 1254, 1387]
  }
  
  // Apply category filter (in a real app, this would be done on the server)
  if (category !== 'all') {
    // Simulate filtered data by reducing values by a random factor
    const factor = 0.3 + Math.random() * 0.4 // Between 30% and 70%
    revenueValues = revenueValues.map(val => Math.round(val * factor))
    orderValues = orderValues.map(val => Math.round(val * factor))
  }
  
  // Create chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: revenueValues,
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Orders',
        data: orderValues,
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        borderDash: [5, 5],
        fill: false,
        yAxisID: 'y1'
      }
    ]
  }
  
  // Create category data for the bar chart
  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty', 'Sports', 'Books']
  const categoryValues = [450000, 325000, 275000, 180000, 120000, 85000]
  
  const categoryData = {
    labels: categories,
    datasets: [
      {
        label: 'Revenue by Category',
        data: categoryValues,
        backgroundColor: [
          'rgba(37, 99, 235, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(249, 115, 22, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  }
  
  // Calculate summary data
  const totalRevenue = revenueValues.reduce((sum, val) => sum + val, 0)
  const totalOrders = orderValues.reduce((sum, val) => sum + val, 0)
  const averageOrderValue = Math.round(totalRevenue / totalOrders)
  
  // Generate growth percentage (between -5% and +20%)
  const revenueGrowth = Math.round((Math.random() * 25 - 5) * 10) / 10
  
  return {
    summary: {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      revenueGrowth
    },
    chartData,
    categoryData,
    categories
  }
}