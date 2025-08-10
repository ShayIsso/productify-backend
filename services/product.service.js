import { ObjectId } from 'mongodb'

import { dbService } from './db.service.js'
import { clampDateRange, weekAgoDateStr } from './util.service.js'

const COLLECTION_NAME = 'product'
const COUNTERS_COLLECTION = 'counters'

export const productService = {
  query,
  getById,
  add,
  update,
  remove,
}

// GET /api/product?term=&type=&dateFrom=&dateTo=
async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy)
  const collection = await dbService.getCollection(COLLECTION_NAME)

  return collection
    .find(criteria)
    .sort({ number: 1, _id: 1 })
    .toArray()
}

// GET /api/product/:id
async function getById(id) {
  const _id = _toObjectId(id)
  if (!_id) return null

  const collection = await dbService.getCollection(COLLECTION_NAME)
  return collection.findOne({ _id })
}

// POST /api/product
async function add(product) {
  const collection = await dbService.getCollection(COLLECTION_NAME)

  const doc = _prepProductForSave(product)
  doc.number = await _getNextSequence('product')

  const { insertedId } = await collection.insertOne(doc)
  return { _id: insertedId, ...doc }
}

// PUT /api/product/:id
async function update(id, product) {
  const _id = _toObjectId(id)
  if (!_id) return null

  const collection = await dbService.getCollection(COLLECTION_NAME)

  // number remains immutable after creation
  const $set = _prepProductForSave(product, { keepNumber: true })

  const res = await collection.updateOne({ _id }, { $set })
  if (!res.matchedCount) return null

  const savedProduct = await collection.findOne({ _id })
  return savedProduct
}

// DELETE /api/product/:id
async function remove(id) {
  const _id = _toObjectId(id)
  if (!_id) return

  const collection = await dbService.getCollection(COLLECTION_NAME)
  await collection.deleteOne({ _id })
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function _buildCriteria({ term = '', type = '', dateFrom = '', dateTo = '' } = {}) {
  const criteria = {}

  if (type) criteria.type = type

  if (term.trim()) {
    criteria.name = { $regex: term.trim(), $options: 'i' }
    // To include SKU in the search, switch to $or with an additional condition.
  }

  const { from, to } = clampDateRange(dateFrom, dateTo)
  if (from || to) {
    criteria.marketingDate = {}
    if (from) criteria.marketingDate.$gte = from
    if (to) criteria.marketingDate.$lte = to
  }

  return criteria
}

function _prepProductForSave(partial, { keepNumber = false } = {}) {
  const base = {
    name: (partial.name || '').trim(),
    sku: Number(partial.sku) || 0,
    description: partial.description || '',
    type: partial.type || '',
    marketingDate: partial.marketingDate || weekAgoDateStr(),
  }

  if (keepNumber && typeof partial.number !== 'undefined') {
    base.number = partial.number
  }

  return base
}

function _toObjectId(id) {
  if (!ObjectId.isValid(id)) return null
  return ObjectId.createFromHexString(id)
}

async function _getNextSequence(name) {
  const collection = await dbService.getCollection(COUNTERS_COLLECTION)
  await collection.updateOne({ _id: name }, { $inc: { seq: 1 } }, { upsert: true })
  const { seq } = await collection.findOne({ _id: name })
  return seq
}