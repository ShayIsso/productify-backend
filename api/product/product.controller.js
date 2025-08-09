import { productService } from '../../services/product.service.js'
import { logger } from '../../services/logger.service.js'

// GET /api/product?term=&type=&dateFrom=&dateTo=
export async function getProducts(req, res, next) {
    try {
        const filterBy = {
            term: req.query.term || '',
            type: req.query.type || '',
            dateFrom: req.query.dateFrom || '',
            dateTo: req.query.dateTo || ''
        }
        logger.info('getProducts:start', filterBy)

        const products = await productService.query(filterBy)
        logger.info('getProducts:success', { count: products.length })
        res.json(products)
    } catch (err) {
        logger.error('getProducts:fail', err)
        next(err)
    }
}

export async function getProductById(req, res, next) {
    try {
        const { id } = req.params
        logger.info('getProductById:start', { id })

        const product = await productService.getById(req.params.id)
        if (!product) return res.sendStatus(404)
        logger.info('getProductById:success', { id })
        res.json(product)
    } catch (err) {
        logger.error('getProductById:fail', err)
        next(err)
    }
}

export async function addProduct(req, res, next) {
    try {
        const productToSave = req.body
        logger.info('addProduct:start', productToSave)

        if (!productToSave.name || productToSave.name.trim().length === 0 || productToSave.name.trim().length > 50) {
            return res.status(400).json({ error: 'Name is required and up to 50 chars' })
        }
        if (!Number.isFinite(+productToSave.sku) || +productToSave.sku < 0) {
            return res.status(400).json({ error: 'SKU must be a positive number (or 0)' })
        }
        if (!['vegetable', 'fruit', 'field'].includes(productToSave.type)) {
            return res.status(400).json({ error: 'Invalid type' })
        }

        if (!productToSave.marketingDate) {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            productToSave.marketingDate = weekAgo.toISOString().slice(0, 10)
        }

        const savedProduct = await productService.add(productToSave)
        logger.info('addProduct:success', { _id: savedProduct._id })
        res.status(201).json(savedProduct)
    } catch (err) {
        logger.error('addProduct:fail', err)
        next(err)
    }
}

export async function updateProduct(req, res, next) {
    try {
        const productId = req.params.id
        const productToUpdate = req.body
        logger.info('updateProduct:start', { productId, productToUpdate })

        if (!productToUpdate.name || productToUpdate.name.trim().length === 0 || productToUpdate.name.trim().length > 50) {
            return res.status(400).json({ error: 'Name is required and up to 50 chars' })
        }
        if (!Number.isFinite(+productToUpdate.sku) || +productToUpdate.sku < 0) {
            return res.status(400).json({ error: 'SKU must be a positive number (or 0)' })
        }
        if (!['vegetable', 'fruit', 'field'].includes(productToUpdate.type)) {
            return res.status(400).json({ error: 'Invalid type' })
        }

        const updatedProduct = await productService.update(productId, productToUpdate)
        if (!updatedProduct) return res.sendStatus(404)
        logger.info('updateProduct:success', { productId })
        res.json(updatedProduct)
    } catch (err) {
        logger.error('updateProduct:fail', err)
        next(err)
    }
}

export async function removeProduct(req, res, next) {
    try {
        const { id } = req.params
        logger.info('removeProduct:start', { id })

        await productService.remove(id)
        logger.info('removeProduct:success', { id })
        res.sendStatus(204)
    } catch (err) {
        logger.error('removeProduct:fail', err)
        next(err)
    }
}
