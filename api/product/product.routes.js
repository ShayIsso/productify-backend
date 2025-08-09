import express from 'express'
import { getProducts, getProductById, addProduct, updateProduct, removeProduct } from './product.controller.js'
import { log } from '../../middlewares/logger.middleware.js'

const router = express.Router()

router.use(log)

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', addProduct)
router.put('/:id', updateProduct)
router.delete('/:id', removeProduct)

export default router
