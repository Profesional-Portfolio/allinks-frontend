# Profile (Frontend) — Contratos de Interfaz

> Este documento describe los contratos de comunicación del módulo de perfil en el frontend, independientemente de la implementación del backend.

---

## Arquitectura del módulo

```
profile/
├── application/use-cases/
│   ├── get-profile.use-case.ts
│   ├── update-profile.use-case.ts
│   ├── update-avatar.use-case.ts
│   └── delete-avatar.use-case.ts
├── domain/
│   └── repositories/          # IProfileRepository
├── infrastructure/
│   └── repositories/          # ProfileRepositoryImpl (Axios)
└── presentation/
    ├── hooks/                 # useProfile
    ├── pages/                 # ProfilePage
    └── store/                 # ProfileContext, ProfileProvider, ProfileReducer
```

---

## Contratos de casos de uso

### `GetProfileUseCase.execute()`

**Input**: ninguno (autenticación por cookie)

**Output esperado (éxito)**:
```typescript
interface UserProfile {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  bio: string | null;
  avatar_url: string | null;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}
```

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| No autenticado | `401` | Interceptor → refresh o login |
| Error de servidor | `500` | Mostrar estado de error en la página |

---

### `UpdateProfileUseCase.execute(dto)`

**Input**:
```typescript
interface UpdateProfileDto {
  first_name?: string;
  last_name?: string;
  bio?: string;        // Max 160 caracteres
  username?: string;   // Sin espacios, 3-50 chars
}
```

**Output esperado (éxito)**: `UserProfile` actualizado.

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| Username ya en uso | `409` | Mostrar: "Este username ya está en uso" |
| Validación fallida | `400` | Mostrar el campo específico con error |
| No autenticado | `401` | Interceptor → refresh o login |
| Error de servidor | `500` | Mostrar error genérico |

---

### `UpdateAvatarUseCase.execute(file)`

**Input**:
```typescript
file: File; // Imagen jpg, png o webp
```

La imagen se envía como `multipart/form-data` con el campo `avatar`.

**Output esperado (éxito)**: `UserProfile` actualizado con la nueva `avatar_url`.

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| Tipo de archivo no permitido | `400` | Mostrar: "Formato no válido. Usa jpg, png o webp." |
| Archivo muy grande | `400` | Mostrar: "El archivo es demasiado grande." |
| No autenticado | `401` | Interceptor → refresh o login |
| Error al subir a Cloudinary | `500` | Mostrar error genérico |

---

### `DeleteAvatarUseCase.execute()`

**Input**: ninguno

**Output esperado (éxito)**: `UserProfile` con `avatar_url = null`.

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| Sin avatar | `404` | Mostrar: "No tienes avatar que eliminar" |
| No autenticado | `401` | Interceptor → refresh o login |
| Error de servidor | `500` | Mostrar error genérico |

---

## Contexto de perfil (`ProfileContext`)

```typescript
interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (dto: UpdateProfileDto) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
}
```

---

## Casos de error comunes en el frontend

| Situación | Comportamiento esperado |
|---|---|
| Error al cargar perfil | Mostrar estado de error con botón "Reintentar" |
| Username en conflicto | Resaltar el campo username con el mensaje de error |
| Archivo de avatar inválido | Validar tipo MIME localmente antes de enviar |
| Error al subir avatar | Revertir la previsualización (si aplica); mostrar error |
| Sin avatar al eliminar | Deshabilitar el botón de eliminar cuando `avatar_url === null` |
