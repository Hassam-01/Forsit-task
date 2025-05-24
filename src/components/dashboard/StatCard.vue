<script setup lang="ts">
defineProps<{
  title: string
  value: number
  type: 'currency' | 'number' | 'percentage'
  icon: string
  color: 'primary' | 'accent' | 'success' | 'warning' | 'error'
}>()

const formatValue = (value: number, type: string): string => {
  if (type === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  } else if (type === 'percentage') {
    return `${value}%`
  } else {
    return new Intl.NumberFormat('en-US').format(value)
  }
}

const getColorClass = (color: string): string => {
  const colorMap = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    error: 'bg-error-50 text-error-600'
  }
  
  return colorMap[color as keyof typeof colorMap] || colorMap.primary
}
</script>

<template>
  <div class="card hover:shadow-lg transition-shadow duration-300">
    <div class="flex items-center space-x-4">
      <div :class="['p-3 rounded-full', getColorClass(color)]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" :d="icon" />
        </svg>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="text-2xl font-semibold">{{ formatValue(value, type) }}</p>
      </div>
    </div>
  </div>
</template>