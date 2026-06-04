# Auth (Frontend) — Contratos de Interfaz

> Este documento describe los contratos de comunicación del módulo de autenticación en el frontend. Define qué datos se envían al backend, qué se espera recibir y cómo se manejan los errores, de forma **independiente de la implementación del backend**.

---

## Arquitectura del módulo

```
auth/
├── application/use-cases/     # Casos de uso (TypeScript puro, sin React)
│   ├── login.use-case.ts
│   ├── register.use-case.ts
│   ├── logout.use-case.ts
│   ├── refresh-token.use-case.ts
│   └── get-current-user.use-case.ts
├── domain/
│   ├── models/                # Interfaces de entidades del módulo
│   └── repositories/          # Interfaces abstractas (IAuthRepository)
├── infrastructure/
│   ├── adapters/              # Adaptadores concretos (Axios)
│   ├── repositories/          # AuthRepositoryImpl
│   └── services/              # AuthService
└── presentation/
    ├── components/            # ProtectedRoute, formularios
    ├── hooks/                 # useAuth, etc.
    ├── pages/                 # LoginPage, RegisterPage, etc.
    ├── routes/                # Definición de rutas públicas de auth
    └── store/                 # AuthContext, AuthProvider, AuthReducer
```

---

## Contratos de casos de uso

### `LoginUseCase.execute(dto)`

**Input**:
```typescript
interface LoginDto {
  email: string;    // Requerido
  password: string; // Requerido
}
```

**Output esperado (éxito)**:
```typescript
interface AuthUser {
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
| Email o contraseña incorrectos | `401` | Mostrar mensaje: "Credenciales inválidas" |
| Campos faltantes | `400` | Validar antes de enviar; mostrar mensaje de campo |
| Rate limit superado | `429` | Mostrar: "Demasiados intentos. Intenta en un rato." |
| Error de servidor | `500` | Mostrar: "Error inesperado. Intenta de nuevo." |

---

### `RegisterUseCase.execute(dto)`

**Input**:
```typescript
interface RegisterDto {
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
  bio?: string;
  avatar?: File;      // Opcional — imagen de perfil
}
```

**Output esperado (éxito)**: igual que `AuthUser` (el usuario queda autenticado tras el registro).

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| Email ya registrado | `409` | Mostrar: "Este email ya está en uso" |
| Username ya en uso | `409` | Mostrar: "Este username ya está en uso" |
| Contraseña débil | `400` | Mostrar mensaje específico de validación |
| Rate limit superado | `429` | Mostrar: "Demasiados intentos" |
| Error de servidor | `500` | Mostrar: "Error inesperado" |

---

### `LogoutUseCase.execute()`

**Input**: ninguno (el token viene de la cookie gestionada por el navegador)

**Output esperado (éxito)**: confirmación de cierre de sesión. El frontend limpia el estado de `AuthContext`.

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| Token ya inválido | `401` | Limpiar estado local y redirigir a login |
| Error de servidor | `500` | Limpiar estado local igualmente (best-effort logout) |

---

### `RefreshTokenUseCase.execute()`

**Input**: ninguno (el `refreshToken` viene de la cookie)

**Output esperado (éxito)**: nuevas cookies seteadas por el servidor. El frontend vuelve a intentar la petición original.

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| Refresh token expirado | `401` | Limpiar sesión y redirigir a login |
| Sin refresh token | `400` | Redirigir a login |

---

### `GetCurrentUserUseCase.execute()`

**Input**: ninguno (el token viene de la cookie)

**Output esperado (éxito)**: objeto `AuthUser` del usuario autenticado.

**Errores esperados**:

| Caso | Código HTTP backend | Manejo en frontend |
|---|---|---|
| No autenticado | `401` | Limpiar sesión y redirigir a login |
| Error de servidor | `500` | Mostrar error genérico |

---

## Contexto de autenticación (`AuthContext`)

El estado global de autenticación es gestionado por `AuthProvider` y expone:

```typescript
interface AuthContextType {
  user: AuthUser | null;         // Usuario autenticado o null
  isAuthenticated: boolean;      // true si hay sesión activa
  isLoading: boolean;            // true mientras se verifica la sesión
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
}
```

---

## Flujo de refresco de token (interceptor Axios)

El repositorio de autenticación implementa un interceptor de respuesta en Axios:

1. Si una petición retorna `401`, se intenta `RefreshTokenUseCase.execute()`.
2. Si el refresco tiene éxito, se reintenta la petición original.
3. Si el refresco falla (también `401`), se invoca `logout()` y se redirige a `/auth/login`.

---

## Casos de error comunes en el frontend

| Situación | Comportamiento esperado |
|---|---|
| Sesión expirada al navegar | Interceptor detecta `401`, intenta refresh, si falla redirige a login |
| Formulario inválido | Validación local antes de enviar. No se realiza petición al backend |
| Network error (sin conexión) | Mostrar: "Sin conexión. Verifica tu red." |
| Error inesperado del servidor | Mostrar mensaje genérico y registrar en consola |
| Usuario ya autenticado visita `/auth/login` | Redirigir al dashboard `/` |
