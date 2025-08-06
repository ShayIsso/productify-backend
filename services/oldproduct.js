import { ObjectId } from 'mongodb'
import { dbService } from './db.service.js'
// import { getNextSequence } from '../../services/counter.service.js'
export const productService = {
  query,
  getById,
  add,
}

export async function query(filterBy = {}) {
  const col = await dbService.getCollection('product')

  const criteria = {}
  if (filterBy.type) criteria.type = filterBy.type

  if (filterBy.term) {
    criteria.name = { $regex: filterBy.term, $options: 'i' }
  }

  if (filterBy.dateFrom || filterBy.dateTo) {
    criteria.marketingDate = {}
    if (filterBy.dateFrom) criteria.marketingDate.$gte = new Date(filterBy.dateFrom)
    if (filterBy.dateTo) criteria.marketingDate.$lte = new Date(filterBy.dateTo)
  }

  return col.find(criteria).sort({ number: 1 }).toArray()
}

export async function getById(id) {
  const col = await dbService.getCollection('product')
  return col.findOne({ _id: new ObjectId(id) })
}

export async function add(product) {
  const col = await dbService.getCollection('product')
  const number = await getNextSequence('product') // מספר רץ

  const doc = {
    number,
    name: product.name.trim(),
    sku: +product.sku,
    description: product.description || '',
    type: product.type,
    // נשמור ב-DB כ-Date כדי שטווח תאריכים יעבוד נכון
    marketingDate: new Date(product.marketingDate)
  }

  const { insertedId } = await col.insertOne(doc)
  return { _id: insertedId, ...doc }
}

export async function remove(productId) {
  return null
}