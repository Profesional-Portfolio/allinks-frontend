# Links (Frontend) — Contratos de Interfaz

> Este documento describe los contratos de comunicación del módulo de gestión de enlaces en el frontend, independientemente de la implementación del backend.

---

## Arquitectura del módulo

```
links/
├── application/use-cases/
│   ├── get-links.use-case.ts
│   ├── create-link.use-case.ts
│   ├── update-link.use-case.ts
│   ├── delete-link.use-case.ts
│   ├── change-visibility.use-case.ts
│   └── reorder-links.use-case.ts
├── domain/
│   └── repositories/          # ILinksRepository
├── infrastructure/
│   └── repositories/          # LinksRepositoryImpl (Axios)
└── presentation/
    ├── hooks/                 # useLinks
    ├── pages/                 # LinksPage
    └── store/                 # LinksContext, LinksProvider, LinksReducer
```

---

## Contratos de casos de uso

### `GetLinksUseCase.execute()`

**Input**: ninguno (la autenticación viene de la cookie)

**Output esperado (éxito)**:
```typescript
interface Link {
  id: string;
  user_id: string;
  url: string;
  platform: string;
  title: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

type GetLinksOutput = Link[];
```

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| No autenticado | `401` | Interceptor dispara refresh → redirige a login si falla |
| Error de servidor | `500` | Mostrar estado de error en la página |

---

### `CreateLinkUseCase.execute(dto)`

**Input**:
```typescript
interface CreateLinkDto {
  title: string;    // Requerido
  url: string;      // Requerido — URL válida
  platform: string; // Requerido
  is_active?: boolean; // Opcional, por defecto true
}
```

**Output esperado (éxito)**: el `Link` creado, que se añade al estado local de `LinksContext`.

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| URL inválida | `400` | Mostrar error de validación |
| No autenticado | `401` | Interceptor → refresh o login |
| Error de servidor | `500` | Mostrar error genérico |

---

### `UpdateLinkUseCase.execute(id, dto)`

**Input**:
```typescript
interface UpdateLinkDto {
  title?: string;
  url?: string;
  platform?: string;
  is_active?: boolean;
}
```

**Output esperado (éxito)**: el `Link` actualizado, que reemplaza al anterior en el estado local.

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| URL inválida | `400` | Mostrar error de validación |
| No autenticado | `401` | Interceptor → refresh o login |
| No autorizado | `403` | Mostrar: "No tienes permiso para editar este enlace" |
| Enlace no encontrado | `404` | Eliminar del estado local y notificar |
| Error de servidor | `500` | Mostrar error genérico |

---

### `DeleteLinkUseCase.execute(id)`

**Input**:
```typescript
id: string; // UUID del enlace a eliminar
```

**Output esperado (éxito)**: sin datos. El enlace se elimina del estado local de `LinksContext`.

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| No autenticado | `401` | Interceptor → refresh o login |
| No autorizado | `403` | Mostrar: "No tienes permiso" |
| Enlace no encontrado | `404` | Eliminar del estado local de todas formas |
| Error de servidor | `500` | Mostrar error genérico |

---

### `ChangeVisibilityUseCase.execute(id, visibility)`

**Input**:
```typescript
id: string;
visibility: boolean; // true = activo, false = oculto
```

**Output esperado (éxito)**: el `Link` actualizado con el nuevo `is_active`.

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| No autenticado | `401` | Interceptor → refresh o login |
| No autorizado | `403` | Mostrar: "No tienes permiso" |
| Error de servidor | `500` | Revertir el cambio optimista si se había aplicado |

---

### `ReorderLinksUseCase.execute(links)`

**Input**:
```typescript
interface ReorderItem {
  id: string;
  display_order: number;
}

type ReorderLinksInput = ReorderItem[];
```

**Output esperado (éxito)**: la lista de `Link[]` reordenada.

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| No autenticado | `401` | Interceptor → refresh o login |
| Algún link no es del usuario | `403` | Revertir el reorder y notificar |
| Error de servidor | `500` | Revertir el reorder optimista |

---

## Contexto de enlaces (`LinksContext`)

El estado de enlaces se gestiona en `LinksProvider` y expone:

```typescript
interface LinksContextType {
  links: Link[];
  isLoading: boolean;
  error: string | null;
  fetchLinks: () => Promise<void>;
  createLink: (dto: CreateLinkDto) => Promise<void>;
  updateLink: (id: string, dto: UpdateLinkDto) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  changeVisibility: (id: string, visibility: boolean) => Promise<void>;
  reorderLinks: (links: ReorderItem[]) => Promise<void>;
}
```

---

## Casos de error comunes en el frontend

| Situación | Comportamiento esperado |
|---|---|
| Lista vacía | Mostrar mensaje invitando a crear el primer enlace |
| Error al cargar links | Mostrar estado de error con opción de reintentar |
| Error al crear/editar | Mostrar mensaje de error; no modificar el estado local |
| Reorder fallido | Revertir al orden anterior (estado pre-drag); notificar al usuario |
| Visibilidad con fallo | Revertir el toggle; notificar al usuario |
