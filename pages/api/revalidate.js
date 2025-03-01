// pages/api/revalidate.js

export default async function handler(req, res) {
    if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
      return res.status(401).json({ message: 'Invalid token' })
    }
  
    if (!req.query.type || !req.query.seo) {
      return res.status(400).json({ message: 'Missing type or SEO parameter' })
    }
  
    try {
      if (req.query.type === 'product') {
        await revalidateProduct(req.query.seo, res)
      } else if (req.query.type === 'category') {
        await revalidateCategory(req.query.seo, res)
      } else {
        return res.status(400).json({ message: 'Invalid type parameter' })
      }
  
      return res.json({ revalidated: true })
    } catch (err) {
      console.error('Revalidation error:', err)
      return res.status(500).json({ message: 'Error revalidating', error: err.message })
    }
  }
  
  async function revalidateProduct(seo, res) {
    await res.revalidate(`/products/${seo}`)
  }
  
  async function revalidateCategory(seo, res) {
    await res.revalidate(`/${seo}`)
  }