# Public (Frontend) — Contratos de Interfaz

> Este documento describe los contratos de comunicación del módulo de perfil público en el frontend, independientemente de la implementación del backend.

---

## Arquitectura del módulo

```
public/
├── domain/
│   └── repositories/          # IPublicRepository
├── infrastructure/
│   └── repositories/          # PublicRepositoryImpl (Axios)
└── presentation/
    └── pages/                 # PublicProfilePage
```

> **Nota**: Este módulo no tiene `application/use-cases` propio. La lógica de obtención del perfil es suficientemente simple para manejarse directamente en la página, aunque puede extraerse a un caso de uso si crece en complejidad.

---

## Contratos de consumo de API

### Obtener perfil público

**Endpoint**: `GET /api/public/:username`

**Llamado desde**: `PublicProfilePage` al montar el componente (leyendo `:username` de los params de React Router).

**Output esperado (éxito)**:
```typescript
interface PublicLink {
  id: string;
  url: string;
  platform: string;
  title: string;
  display_order: number;
  is_active: true; // Sólo activos
}

interface PublicProfile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  bio: string | null;
  avatar_url: string | null;
  links: PublicLink[];
}
```

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| Username no encontrado | `404` | Mostrar página 404 personalizada ("Este perfil no existe") |
| Error de servidor | `500` | Mostrar mensaje de error genérico |
| Sin conexión | Network error | Mostrar: "Sin conexión. Verifica tu red." |

---

### Verificar disponibilidad de username

**Endpoint**: `GET /api/public/check-availability/:username`

**Llamado desde**: formulario de registro (`RegisterPage`) o formulario de edición de perfil (`ProfilePage`), típicamente con debounce mientras el usuario escribe.

**Output esperado (éxito — disponible)**:
```typescript
interface UsernameAvailabilityResult {
  available: true;
  username: string;
}
```

**Output esperado (no disponible)**:

El backend retorna `409 Conflict`. El frontend interpreta esto como `available: false`.

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| Username disponible | `200` | Mostrar indicador verde: "Username disponible" |
| Username no disponible | `409` | Mostrar indicador rojo: "Username no disponible" |
| Error de servidor | `500` | No mostrar indicador; no bloquear el formulario |

---

## Casos de error comunes en el frontend

| Situación | Comportamiento esperado |
|---|---|
| Perfil no encontrado (404) | Mostrar página de error 404 con enlace al inicio |
| Usuario sin enlaces activos | Mostrar sección vacía: "Este usuario aún no tiene enlaces" |
| Error de red | Mostrar mensaje de error con opción de reintentar |
| Username checking con error de servidor | Omitir feedback de disponibilidad; no bloquear el formulario |
| Visita a perfil propio | El sistema no diferencia; se muestra el perfil público igualmente |
