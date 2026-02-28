# buscolegio.com

🌐 **[buscolegio.com](https://buscolegio.com)** — Directorio abierto de los **16.768 establecimientos educacionales** de Chile con datos oficiales del Ministerio de Educación (Mineduc) 2025.

Construido 100% con **vibe coding** usando [Claude Code](https://claude.ai/code).

## ¿Qué es vibe coding?

Programar describiendo en lenguaje natural lo que quieres construir y dejar que un agente de IA (Claude Code) genere el código. No reemplaza el criterio del desarrollador, pero elimina la fricción del código repetitivo y permite construir productos funcionales mucho más rápido.

---

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4**
- **MongoDB Atlas** + **Mongoose** — base de datos de establecimientos
- **react-leaflet** — mapa interactivo en ficha de colegio
- **csv-parse** — importación del CSV oficial del Mineduc
- **Google Places API** — enriquecimiento opcional de datos (foto, rating, web) en primer acceso

## Features

- Búsqueda por nombre / comuna con debounce
- Filtros por región (16) y tipo de dependencia (5)
- Paginación de resultados
- Ficha de colegio: niveles, matrículas, mapa, dependencia, programas PIE/PACE
- Sistema de reseñas con localStorage
- Enriquecimiento con Google Places en primer acceso
- Footer compartido con créditos y link a "Sobre nosotros"
- Página `/sobre-nosotros` con la historia del proyecto

---

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
GOOGLE_PLACES_API_KEY=AIza...   # opcional
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
│   ├── sobre-nosotros/
│   │   └── page.tsx                 # Página "Sobre nosotros" — origen del proyecto y vibe coding
│   └── api/
│       ├── import/route.ts          # POST — importa CSV a MongoDB
│       ├── colegios/route.ts        # GET  — lista paginada con filtros
│       └── colegios/[rbd]/route.ts  # GET  — detalle por RBD
├── components/
│   ├── ColegioCard.tsx              # Tarjeta de colegio
│   ├── MapComponent.tsx             # Mapa Leaflet (client-only)
│   ├── MapWrapper.tsx               # Wrapper 'use client' para SSR
│   ├── ReviewsSection.tsx           # Reseñas con localStorage
│   └── SiteFooter.tsx               # Footer compartido (logo, "Sobre nosotros", créditos)
├── lib/
│   ├── mongodb.ts                   # Singleton de conexión Mongoose
│   └── codigos.ts                   # Tablas de decodificación Mineduc
└── models/
    └── Establecimiento.ts           # Modelo Mongoose

Directorio-Oficial-EE-2025/
└── 20250926_Directorio_Oficial_EE_2025_20250430_WEB.csv
```
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

### `POST /api/import`

Requiere header `x-import-secret`. Lee el CSV desde disco y hace upsert masivo en MongoDB en lotes de 500 registros.

---

## Comandos

```bash
npm run dev      # Servidor de desarrollo en localhost:3000
npm run build    # Build de producción
npm run start    # Ejecutar build de producción
npm run lint     # ESLint
npx tsc --noEmit # Verificar tipos sin compilar
```

---

## Fuente de datos

**Directorio Oficial de Establecimientos Educacionales 2025** — Ministerio de Educación de Chile.

El CSV (`Directorio-Oficial-EE-2025/`) contiene 16.768 establecimientos con datos de ubicación, dependencia, niveles de enseñanza, matrícula, especialidades técnico-profesionales y aranceles.

Vibecodeado con ♥ desde Chile por [Nicolas Justiniano](https://github.com/nclsjstnn).

---

## Contribuir

Pull requests y issues son bienvenidos. Si encuentras un dato incorrecto o quieres agregar una feature, abre un issue en [GitHub](https://github.com/nclsjstnn/buscolegio).
