import { readFileSync } from 'fs'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

// Load .env.local manually (dotenv)
const dotenv = require('dotenv')
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const mongoose = require('mongoose')

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buscolegio.com'
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not set in .env.local')
  process.exit(1)
}

const EstablecimientoSchema = new mongoose.Schema(
  { rbd: Number, estadoCodigo: Number },
  { collection: 'establecimientos' }
)
const Establecimiento =
  mongoose.models.Establecimiento ||
  mongoose.model('Establecimiento', EstablecimientoSchema)

async function main() {
  await mongoose.connect(MONGODB_URI)

  const docs = await Establecimiento.find({ estadoCodigo: 1 }, { rbd: 1, _id: 0 }).lean()
  const rbds = docs.map((d) => d.rbd)

  // Build sitemap XML
  const urlEntries = [
    `  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
    ...rbds.map(
      (rbd) => `  <url>
    <loc>${BASE_URL}/colegios/${rbd}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    ),
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`

  const publicDir = resolve(__dirname, '../public')
  writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap, 'utf-8')
  console.log(`✓ sitemap.xml generado con ${rbds.length + 1} URLs`)

  // Build robots.txt
  const robots = `User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml`

  writeFileSync(resolve(publicDir, 'robots.txt'), robots, 'utf-8')
  console.log('✓ robots.txt generado')

  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
