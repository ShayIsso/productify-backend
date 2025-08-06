import { readFile } from 'fs/promises'
import { productService } from './services/product.service.js'

const rawData = await readFile('./data/product.json', 'utf-8')
const data = JSON.parse(rawData)

for (const product of data) {
  try {
    await productService.add(product)
  } catch (err) {
    console.error('❌ Failed to add product:', product.name, err.message)
  }
}

console.log('✅ Seeding done!')
process.exit()
