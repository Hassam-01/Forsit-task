<script setup lang="ts">
import { useSidebarStore } from '../../stores/sidebar'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const sidebarStore = useSidebarStore()
const route = useRoute()

const isOpen = computed(() => sidebarStore.isOpen)

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
  { name: 'Revenue Analysis', path: '/revenue', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  { name: 'Inventory Management', path: '/inventory', icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' },
  { name: 'Add New Product', path: '/products/new', icon: 'M12 4.5v15m7.5-7.5h-15' }
]

const isActive = (path: string) => {
  return route.path === path
}
</script>

<template>
  <aside 
    class="bg-white shadow-md transform transition-transform duration-300 ease-in-out z-20"
    :class="[isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0 md:translate-x-0 md:w-20']"
  >
    <div class="h-full flex flex-col">
      <div class="flex items-center justify-between h-16 px-4">
        <router-link to="/" class="flex items-center space-x-2">
          <span class="text-primary-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>
          </span>
          <span v-if="isOpen" class="text-xl font-semibold text-gray-800">EcomAdmin</span>
        </router-link>
      </div>

      <nav class="flex-1 px-2 py-4 space-y-1">
        <router-link 
          v-for="item in navItems" 
          :key="item.name"
          :to="item.path"
          :class="[
            isActive(item.path) ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100',
            isOpen ? 'justify-start px-4' : 'justify-center',
            'flex items-center py-3 rounded-md font-medium transition-colors duration-200'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
          </svg>
          <span v-if="isOpen" class="ml-3">{{ item.name }}</span>
        </router-link>
      </nav>
    </div>
  </aside>
</template>