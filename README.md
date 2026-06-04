# AlLinks — Frontend

SPA construida con **React 19 + TypeScript + Vite** siguiendo una arquitectura modular orientada a Clean Architecture.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | React 19 |
| Lenguaje | TypeScript 5 |
| Bundler | Vite 7 |
| Enrutamiento | React Router DOM 7 |
| HTTP Client | Axios |
| Gestor paquetes | pnpm |
| Servidor prod | Nginx (Docker) |

---

## Scripts

```bash
pnpm dev       # Servidor de desarrollo (http://localhost:5173)
pnpm build     # Build de producción (tsc + vite build)
pnpm preview   # Sirve la build de producción localmente
pnpm lint      # ESLint
```

---

## Estructura del proyecto

```
frontend/
├── public/              # Assets estáticos servidos directamente
├── src/
│   ├── assets/          # Imágenes, íconos y fuentes
│   ├── App.tsx          # Árbol de rutas principal (BrowserRouter + Providers)
│   ├── main.tsx         # Punto de entrada React
│   ├── index.css        # Estilos globales
│   ├── App.css          # Estilos del componente raíz
│   └── modules/         # Módulos de funcionalidad
│       ├── config/      # Configuración de API (endpoints centralizados)
│       ├── core/        # Utilidades y lógica compartida entre módulos
│       ├── auth/        # Autenticación (login, registro, recuperación de contraseña)
│       ├── links/       # Gestión de enlaces del usuario
│       ├── profile/     # Gestión del perfil del usuario
│       ├── home/        # Dashboard principal (shell con navegación)
│       └── public/      # Página pública de perfil (/users/:username)
├── nginx.conf           # Configuración Nginx para producción (SPA fallback)
├── Dockerfile.prod      # Imagen multi-stage: build con Node + serve con Nginx
├── vite.config.ts       # Configuración Vite (alias, plugins)
└── tsconfig*.json       # Configuraciones TypeScript
```

### Estructura interna de cada módulo

Cada módulo bajo `src/modules/` sigue la misma arquitectura de capas:

```
<módulo>/
├── application/
│   └── use-cases/         # Casos de uso del módulo (orquestan repositorios)
├── domain/
│   ├── models/            # Tipos/interfaces de las entidades del módulo
│   └── repositories/      # Interfaces abstractas de repositorios
├── infrastructure/
│   ├── adapters/          # Adaptadores externos (Axios wrappers, etc.)
│   ├── repositories/      # Implementaciones concretas de repositorios
│   └── services/          # Servicios de infraestructura (HTTP, storage, etc.)
└── presentation/
    ├── components/        # Componentes React reutilizables del módulo
    ├── hooks/             # Custom hooks del módulo
    ├── pages/             # Páginas (un componente por ruta)
    ├── routes/            # Definición de rutas del módulo (si aplica)
    └── store/             # Context + Provider + Reducer del módulo
```

> **Nota**: no todos los módulos tienen todas las capas. Por ejemplo, `home` sólo tiene `presentation` (es sólo el shell de layout). `config` es un módulo plano sin subcapas.

---

## Rutas de la aplicación

| Ruta | Módulo | Visibilidad |
|---|---|---|
| `/auth/login` | auth | Pública |
| `/auth/register` | auth | Pública |
| `/auth/forgot-password` | auth | Pública |
| `/auth/reset-password` | auth | Pública |
| `/auth/verify-email` | auth | Pública |
| `/users/:username` | public | Pública |
| `/` (index) | links | Privada (ProtectedRoute) |
| `/profile` | profile | Privada (ProtectedRoute) |

---

## Comunicación entre capas

El proyecto aplica los principios de **Clean Architecture**: las dependencias siempre apuntan hacia adentro (hacia el dominio) y nunca hacia afuera.

### Diagrama general

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                                                             │
│  Page/Component → Hook → UseCase → Repository (abstract)   │
│                                          ↓                  │
│                              RepositoryImpl → Axios → HTTP  │
└─────────────────────────────────────────────────────────────┘
                                  ↕ HTTP (REST + Cookies)
┌─────────────────────────────────────────────────────────────┐
│                          BACKEND                            │
│                                                             │
│  Routes → Middleware → Controller → UseCase                 │
│                                        ↓                    │
│                          Repository (abstract)              │
│                                        ↓                    │
│                          RepositoryImpl → Datasource → ORM  │
│                                                      ↓      │
│                                              PostgreSQL/Redis│
└─────────────────────────────────────────────────────────────┘
```

### Ejemplo completo: "Crear un enlace"

A continuación se traza el flujo completo de la operación **crear un enlace** desde que el usuario hace clic en el botón hasta que el dato se persiste en la base de datos.

---

#### 1. Frontend — Presentación (`LinksPage` + `useLinks`)

El usuario rellena el formulario y hace submit. El componente invoca la función del hook:

```tsx
// presentation/hooks/useLinks.ts
const { createLink } = useLinks();

// Al hacer submit del formulario:
await createLink({ title: "Mi GitHub", url: "https://github.com/usuario", platform: "github" });
```

---

#### 2. Frontend — Store (`LinksProvider`)

El provider recibe la llamada y delega al caso de uso de la capa de aplicación:

```ts
// presentation/store/links-provider.tsx
const createLink = async (dto: CreateLinkDto) => {
  const newLink = await createLinkUseCase.execute(dto); // ← caso de uso
  dispatch({ type: "ADD_LINK", payload: newLink });
};
```

---

#### 3. Frontend — Aplicación (`CreateLinkUseCase`)

El caso de uso no sabe nada de React ni de Axios. Sólo conoce la interfaz abstracta del repositorio:

```ts
// application/use-cases/create-link.use-case.ts
export class CreateLinkUseCase {
  constructor(private readonly linksRepository: ILinksRepository) {}

  async execute(dto: CreateLinkDto): Promise<Link> {
    return this.linksRepository.create(dto); // ← contrato, no implementación
  }
}
```

---

#### 4. Frontend — Infraestructura (`LinksRepositoryImpl`)

La implementación concreta traduce la llamada a una petición HTTP con Axios:

```ts
// infrastructure/repositories/links.repository.impl.ts
export class LinksRepositoryImpl implements ILinksRepository {
  async create(dto: CreateLinkDto): Promise<Link> {
    const response = await axios.post(API_CONFIG.ENDPOINTS.LINKS.BASE, dto);
    return response.data.data; // extrae el link del wrapper de respuesta
  }
}
```

---


## Reglas de oro

1. **Los módulos son auto-contenidos**: un módulo nunca importa directamente de las capas internas de otro módulo. Si necesita datos de otro módulo, lo hace a través de sus Providers/Contexts.
2. **El acceso al API pasa por repositorios**: los hooks y componentes no llaman a Axios directamente. La cadena es siempre: `Componente → Hook → UseCase → Repository → Service/Adapter → Axios`.
3. **Endpoints centralizados en `config/api-config.ts`**: ninguna URL del API se escribe literal en un componente o servicio.
4. **Estado global por módulo con Context**: cada módulo tiene su propio `Provider` y `Context`. No se mezcla el estado de distintos módulos en un mismo store.
5. **`<ProtectedRoute>` para rutas privadas**: el guard evalúa el estado de autenticación del `AuthContext` y redirige a `/auth/login` si no hay sesión.
6. **Los casos de uso no conocen React**: los archivos en `application/use-cases/` son TypeScript puro, sin hooks ni JSX. Esto los hace testables de forma independiente.
7. **Los tipos se definen en `domain/models/`**: no se usan tipos `any` ni se duplican interfaces entre capas.
8. **ESLint + TypeScript strict**: el código debe compilar sin errores ni warnings de ESLint.
 del módulo
    ├── hooks/             # Custom hooks del módulo
    ├── pages/             # Páginas (un componente por ruta)
    ├── routes/            # Definición de rutas del módulo (si aplica)
    └── store/             # Context + Provider + Reducer del módulo
```

> **Nota**: no todos los módulos tienen todas las capas. Por ejemplo, `home` sólo tiene `presentation` (es sólo el shell de layout). `config` es un módulo plano sin subcapas.

---

## Rutas de la aplicación

| Ruta | Módulo | Visibilidad |
|---|---|---|
| `/auth/login` | auth | Pública |
| `/auth/register` | auth | Pública |
| `/auth/forgot-password` | auth | Pública |
| `/auth/reset-password` | auth | Pública |
| `/auth/verify-email` | auth | Pública |
| `/users/:username` | public | Pública |
| `/` (index) | links | Privada (ProtectedRoute) |
| `/profile` | profile | Privada (ProtectedRoute) |

---

## Reglas de oro

1. **Los módulos son auto-contenidos**: un módulo nunca importa directamente de las capas internas de otro módulo. Si necesita datos de otro módulo, lo hace a través de sus Providers/Contexts.
2. **El acceso al API pasa por repositorios**: los hooks y componentes no llaman a Axios directamente. La cadena es siempre: `Componente → Hook → UseCase → Repository → Service/Adapter → Axios`.
3. **Endpoints centralizados en `config/api-config.ts`**: ninguna URL del API se escribe literal en un componente o servicio.
4. **Estado global por módulo con Context**: cada módulo tiene su propio `Provider` y `Context`. No se mezcla el estado de distintos módulos en un mismo store.
5. **`<ProtectedRoute>` para rutas privadas**: el guard evalúa el estado de autenticación del `AuthContext` y redirige a `/auth/login` si no hay sesión.
6. **Los casos de uso no conocen React**: los archivos en `application/use-cases/` son TypeScript puro, sin hooks ni JSX. Esto los hace testables de forma independiente.
7. **Los tipos se definen en `domain/models/`**: no se usan tipos `any` ni se duplican interfaces entre capas.
8. **ESLint + TypeScript strict**: el código debe compilar sin errores ni warnings de ESLint.
