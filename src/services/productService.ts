// This is a mock service that would normally interact with an API
export const registerProduct = async (productData: any) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200))
  
  // In a real app, this would send the data to the server
  console.log('Registering product:', productData)
  
  // Mock response with an ID
  return {
    ...productData,
    id: Math.floor(Math.random() * 10000) + 1,
    createdAt: new Date().toISOString()
  }
}