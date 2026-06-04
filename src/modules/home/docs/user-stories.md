# Home (Frontend) — Historias de Usuario y Reglas de Negocio

> El módulo `home` es el shell del dashboard privado. Su historia de usuario central es la navegación entre secciones del panel una vez autenticado.

---

## Historias de usuario

### HU-HOME-FE-01: Navegar entre secciones del dashboard

**Como** usuario autenticado,  
**quiero** acceder a las distintas secciones de mi panel (mis enlaces, mi perfil),  
**para** gestionar mi cuenta de forma rápida sin perder el contexto.

**Criterios de aceptación**:
- El dashboard muestra una navegación persistente (sidebar o header) con acceso a "Mis enlaces" y "Mi perfil".
- Al hacer clic en cada sección, la URL cambia y el contenido central se actualiza sin recargar la página completa.
- La sección activa tiene un indicador visual diferenciado en la navegación.

---

### HU-HOME-FE-02: Ver un resumen de mi información en el dashboard

**Como** usuario autenticado,  
**quiero** ver mi nombre y avatar de forma visible en el panel,  
**para** confirmar que estoy en mi cuenta y tener contexto de quién soy.

**Criterios de aceptación**:
- El header o sidebar muestra el nombre del usuario y su avatar (o avatar por defecto si no tiene).
- Si los datos del perfil están cargando, se muestra un placeholder/skeleton.

---

### HU-HOME-FE-03: Cerrar sesión desde el dashboard

**Como** usuario autenticado,  
**quiero** cerrar sesión desde cualquier sección del dashboard,  
**para** proteger mi cuenta sin tener que navegar a una sección específica.

**Criterios de aceptación**:
- El botón/acción de cerrar sesión está accesible en todo el dashboard (desde `HomePage`).
- Al cerrar sesión, se redirige a `/auth/login`.
- Si hay un error en el servidor, la sesión local se limpia igualmente.

---

## Reglas de negocio (frontend)

| ID | Regla |
|---|---|
| RN-HOME-FE-01 | `HomePage` **sólo es accesible a través de `<ProtectedRoute>`**. No existe ningún camino para acceder a él sin sesión activa. |
| RN-HOME-FE-02 | `HomePage` es un componente de layout puro. **No realiza llamadas HTTP** ni gestiona estado propio de datos. |
| RN-HOME-FE-03 | La navegación entre secciones (`links`, `profile`) usa **React Router nested routes** con `<Outlet />`. No hay recargas de página. |
| RN-HOME-FE-04 | El botón de logout del dashboard llama a la función `logout()` del `AuthContext`, que es la única fuente de verdad para esa acción. |
| RN-HOME-FE-05 | Los `Provider`s de `LinksContext` y `ProfileContext` envuelven a `HomePage` en `App.tsx`, garantizando que sus datos están disponibles en todo el dashboard desde el primer render. |
