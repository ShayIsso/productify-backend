import dotenv from 'dotenv'
import { readFile } from 'fs/promises'
import { productService } from './services/product.service.js'
import { logger } from './services/logger.service.js'

dotenv.config()

const rawData = await readFile('./data/product.json', 'utf-8')
const data = JSON.parse(rawData)

for (const product of data) {
  try {
    await productService.add(product)
    logger.info(`Added product: ${product.name}`)
  } catch (err) {
    logger.error(`Failed to add product: ${product.name}`, err.message)
  }
}

logger.info('Seeding done!')
process.exit()
