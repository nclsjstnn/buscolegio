# Buscolegio

Directorio de colegios de Chile — busca y compara los 16.768 establecimientos educacionales del país usando el Directorio Oficial del Mineduc 2025 (https://datosabiertos.mineduc.cl/directorio-de-establecimientos-educacionales/).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4**
- **MongoDB Atlas** + **Mongoose** — base de datos de establecimientos
- **react-leaflet** — mapa interactivo en ficha de colegio
- **csv-parse** — importación del CSV oficial del Mineduc

## Inicio rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea `.env.local` en la raíz del proyecto:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/buscolegio
IMPORT_SECRET=dev-secret
```

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### 4. Importar los datos del Mineduc

Con el servidor corriendo, ejecuta una sola vez:

```bash
curl -X POST http://localhost:3000/api/import \
  -H "x-import-secret: dev-secret"
```

Respuesta esperada: `{ "imported": 16768, "errors": [] }` (tarda ~30–60 segundos).

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                     # Página principal — buscador con filtros y paginación
│   ├── layout.tsx                   # Layout raíz (fuente Geist)
│   ├── globals.css
│   ├── colegios/
│   │   └── [rbd]/page.tsx           # Ficha de colegio (Server Component)
│   └── api/
│       ├── import/route.ts          # POST — importa CSV a MongoDB
│       ├── colegios/route.ts        # GET  — lista paginada con filtros
│       └── colegios/[rbd]/route.ts  # GET  — detalle por RBD
├── components/
│   ├── ColegioCard.tsx              # Tarjeta de colegio
│   ├── MapComponent.tsx             # Mapa Leaflet (client-only)
│   └── MapWrapper.tsx               # Wrapper 'use client' para SSR
├── lib/
│   ├── mongodb.ts                   # Singleton de conexión Mongoose
│   └── codigos.ts                   # Tablas de decodificación Mineduc
└── models/
    └── Establecimiento.ts           # Modelo Mongoose

Directorio-Oficial-EE-2025/
└── 20250926_Directorio_Oficial_EE_2025_20250430_WEB.csv
```

<<<<<<< HEAD
Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Made by Nicolas Justiniano
=======
## API

### `GET /api/colegios`

Parámetros de query:

| Param | Descripción |
|---|---|
| `q` | Búsqueda por nombre o comuna |
| `region` | Código de región (1–16) |
| `tipo` | Tipo de dependencia: 1=Municipal, 2=Part. Subv., 3=Part. Pagado, 4=Corp. Delegada, 5=SLE |
| `page` | Número de página (default: 1) |
| `limit` | Resultados por página (default: 20, max: 50) |

Ejemplo:
```
GET /api/colegios?q=liceo&region=13&tipo=1&page=1
```

Respuesta: `{ total, page, limit, colegios[] }`

### `GET /api/colegios/[rbd]`

Retorna el documento completo de un establecimiento por su RBD.

Ejemplo:
```
GET /api/colegios/1
```

### `POST /api/import`

Requiere header `x-import-secret`. Lee el CSV desde disco y hace upsert masivo en MongoDB en lotes de 500 registros.

## Comandos

```bash
npm run dev      # Servidor de desarrollo en localhost:3000
npm run build    # Build de producción
npm run start    # Ejecutar build de producción
npm run lint     # ESLint
npx tsc --noEmit # Verificar tipos sin compilar
```

## Fuente de datos

**Directorio Oficial de Establecimientos Educacionales 2025** — Ministerio de Educación de Chile.

El CSV (`Directorio-Oficial-EE-2025/`) contiene 16.768 establecimientos con datos de ubicación, dependencia, niveles de enseñanza, matrícula, especialidades técnico-profesionales y aranceles.
>>>>>>> e7670c7 (añadiendo lista de colegios del 2025)
