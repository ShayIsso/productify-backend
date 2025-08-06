import express from 'express'
import { getProducts, getProductById, addProduct, updateProduct, removeProduct } from './product.controller.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', addProduct)
router.put('/:id', updateProduct)
router.delete('/:id', removeProduct)

export default router
