# Home (Frontend) — Contratos de Interfaz

> El módulo `home` actúa como **shell del dashboard privado**. No tiene casos de uso propios ni llama directamente al backend. Su responsabilidad es proporcionar el layout, la navegación y el punto de montaje de los módulos privados (`links` y `profile`).

---

## Arquitectura del módulo

```
home/
└── presentation/
    └── pages/
        └── home.page.tsx   # Layout del dashboard (sidebar, header, <Outlet />)
```

---

## Responsabilidades de interfaz

El módulo `home` no consume ningún endpoint de la API directamente. Su interfaz se define por las **rutas hijo** que renderiza:

| Ruta hija | Componente renderizado | Módulo dueño |
|---|---|---|
| `/` (index) | `<LinksPage />` | `links` |
| `/profile` | `<ProfilePage />` | `profile` |

El componente `HomePage` actúa como wrapper con `<Outlet />` de React Router y provee:

- **Barra de navegación** (lateral o superior) con enlaces a las secciones del dashboard.
- **Acción de cierre de sesión** disponible en todo el dashboard.
- **Información del usuario** (nombre, avatar) obtenida del `ProfileContext` o `AuthContext`.

---

## Dependencias de contextos

Aunque no realiza llamadas HTTP directas, `HomePage` puede consumir contextos ya inicializados en sus providers padres:

| Contexto | Datos usados |
|---|---|
| `AuthContext` | `user.username`, `user.avatar_url` para mostrar en el header |
| `ProfileContext` | Información de perfil actualizada para reflejar cambios recientes |

---

## Casos de error

| Situación | Comportamiento esperado |
|---|---|
| Usuario no autenticado al intentar acceder | `<ProtectedRoute>` redirige a `/auth/login` antes de montar `HomePage` |
| Error al cargar contextos hijo | Cada módulo hijo (`links`, `profile`) gestiona su propio estado de error |
