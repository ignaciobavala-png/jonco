# Jonco — Turismo Náutico en el Delta

Landing page + panel de administración para **Jonco Turismo**, servicio de expediciones náuticas privadas en el Delta del Tigre, Buenos Aires.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS v4 |
| Animaciones | Framer Motion 12 |
| Base de datos | Supabase (PostgreSQL) |
| Storage | Supabase Storage (`jonco-photos`) |
| Estado global | Zustand |
| Runtime | React 19 |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                  # Landing principal (one-page)
│   ├── layout.tsx
│   ├── globals.css               # Variables CSS + Tailwind
│   ├── joncoadm/                 # Panel de administración
│   └── api/
│       ├── expediciones/         # CRUD de expediciones
│       ├── configuracion/        # Configuración del sitio
│       ├── contacto/             # Datos de contacto
│       ├── horarios/             # Horarios por expedición
│       └── upload/               # Upload de archivos a Storage
├── components/
│   ├── modules/
│   │   ├── Hero.tsx              # Video fullscreen + CTA
│   │   ├── ExperienceGrid.tsx    # Grid de expediciones + modal
│   │   ├── ClientFeedback.tsx    # Carousel de testimonios
│   │   └── CustomExperience.tsx  # Formulario de exp. personalizada
│   ├── shared/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── RootShell.tsx
│   └── admin/
│       ├── ExpedicionesManager.tsx
│       ├── ContactoManager.tsx
│       ├── ConfiguracionManager.tsx
│       └── ImageUploader.tsx
└── lib/
    ├── constants.ts              # Contacto + templates WhatsApp
    └── schema.sql                # Referencia de schema (legacy)
```

---

## Secciones de la landing

1. **Hero** — video de fondo configurable desde el admin, dos CTAs principales
2. **Historia** — texto del Capitán Jonco con tipografía manuscrita (Caveat)
3. **Expediciones** — cards dinámicas desde Supabase; modal inmersivo con galería, precio y reserva por WhatsApp
4. **Feedback** — carousel de testimonios de clientes
5. **Experiencia personalizada** — formulario que genera un mensaje pre-formateado y abre WhatsApp

---

## Panel de administración

Accesible en `/joncoadm`. Sin autenticación (acceso por URL directa).

**Tabs disponibles:**
- **Expediciones** — CRUD completo: título, categoría, descripción, precio, imagen, galería
- **Contacto** — teléfono, email, Instagram, mensaje WhatsApp por defecto
- **Configuración** — URL del video del hero (con uploader directo a Supabase Storage)

---

## Variables de entorno

Crear un archivo `.env` en la raíz con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

> `SUPABASE_SERVICE_ROLE_KEY` es necesaria para el upload de archivos (Storage).

---

## Supabase — tablas requeridas

### `expediciones`
| columna | tipo |
|---|---|
| id | int (PK, autoincrement) |
| title | text |
| category | text |
| description | text |
| price | int (nullable) |
| image | text |
| gallery | text (URLs separadas por coma) |
| activo | int (0/1) |

### `horarios`
| columna | tipo |
|---|---|
| id | int (PK) |
| expedicion_id | int (FK → expediciones) |
| dias | text |
| hora_salida | text |
| hora_regreso | text |
| cupos | int |
| activo | int |

### `contacto`
| columna | tipo |
|---|---|
| clave | text (PK) |
| valor | text |

### `configuracion`
| columna | tipo |
|---|---|
| clave | text (PK) |
| valor | text |
| descripcion | text |
| updated_at | timestamp |

**Row requerida:** `hero_video_url` con `valor` vacío o una URL de video válida.

---

## Supabase Storage

Bucket: **`jonco-photos`** (público).

Estructura de carpetas dentro del bucket:
```
jonco-photos/
├── configuracion/
│   └── videos/       # Video del hero
└── expediciones/
    └── images/       # Imágenes de expediciones
```

---

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para la landing.
Panel de admin: [http://localhost:3000/joncoadm](http://localhost:3000/joncoadm)

---

## Contacto

**Jonco Turismo** — Tigre, Buenos Aires, Argentina
WhatsApp / Reservas: +54 9 11 4076-5354
Instagram: [@joncoexperience](https://instagram.com/joncoexperience)
