<script setup lang="ts">
import { ref } from 'vue'
import { useSidebarStore } from '../../stores/sidebar'
import { useRoute } from 'vue-router'

const sidebarStore = useSidebarStore()
const route = useRoute()

const toggleSidebar = () => {
  sidebarStore.toggle()
}

const getPageTitle = () => {
  return route.meta.title as string || 'Dashboard'
}

const userMenuOpen = ref(false)
const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}
</script>

<template>
  <header class="bg-white shadow-sm z-10">
    <div class="flex items-center justify-between h-16 px-4">
      <div class="flex items-center">
        <button 
          @click="toggleSidebar" 
          class="text-gray-600 focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <h1 class="ml-4 text-xl font-semibold text-gray-800">{{ getPageTitle() }}</h1>
      </div>
      
      <div class="flex items-center">
        <div class="relative">
          <button 
            @click="toggleUserMenu" 
            class="flex items-center space-x-2 focus:outline-none"
            aria-label="User Menu"
          >
            <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
              JS
            </div>
            <span class="hidden md:block text-sm font-medium text-gray-700">John Smith</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          
          <div 
            v-if="userMenuOpen" 
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
          >
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>