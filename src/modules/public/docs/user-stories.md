# Public (Frontend) — Historias de Usuario y Reglas de Negocio

> Este documento describe las historias de usuario y las reglas de negocio que rigen el módulo de perfil público en el frontend.

---

## Historias de usuario

### HU-PUBLIC-FE-01: Ver el perfil público de un usuario

**Como** visitante (con o sin cuenta),  
**quiero** acceder a la página pública de un usuario usando su username en la URL (`/users/:username`),  
**para** ver sus enlaces y acceder a sus redes sociales o recursos compartidos.

**Criterios de aceptación**:
- La página carga el perfil del usuario con su nombre, bio, avatar y lista de enlaces activos.
- Los enlaces se muestran ordenados (por `display_order`) y son clicables, abriendo en nueva pestaña.
- Si el usuario no tiene enlaces activos, se muestra un mensaje indicativo.
- La página es de acceso público: no requiere login.
- El diseño es responsivo y optimizado para compartir en redes sociales.
- Si el username no existe, se muestra una página de error 404 personalizada.

---

### HU-PUBLIC-FE-02: Compartir mi perfil público

**Como** usuario autenticado,  
**quiero** poder copiar el enlace a mi perfil público desde el panel,  
**para** compartirlo fácilmente con otras personas.

**Criterios de aceptación**:
- En el panel existe un elemento (botón o input) con la URL del perfil (`/users/:username`).
- Al hacer clic, la URL se copia al portapapeles.
- Se muestra una confirmación visual tras copiar ("¡Enlace copiado!").

---

### HU-PUBLIC-FE-03: Ver disponibilidad de username durante el registro

**Como** visitante registrándose,  
**quiero** saber si el username que estoy escribiendo está disponible,  
**para** no enviar el formulario con un username que ya está en uso.

**Criterios de aceptación**:
- El campo de username en el formulario de registro valida la disponibilidad en tiempo real (con debounce de ~500ms).
- Se muestra un indicador visual: ✅ disponible / ❌ en uso.
- Si hay error de red, el indicador no se muestra y no bloquea el formulario.
- La verificación no bloquea el formulario durante la petición (estado de carga transitorio).

---

## Reglas de negocio (frontend)

| ID | Regla |
|---|---|
| RN-PUBLIC-FE-01 | La ruta `/users/:username` es pública. No se aplica `<ProtectedRoute>` ni ningún guard de autenticación. |
| RN-PUBLIC-FE-02 | La página del perfil público no carga el estado de autenticación para renderizarse. Es completamente independiente de `AuthContext`. |
| RN-PUBLIC-FE-03 | Los enlaces del perfil público se abren **siempre en nueva pestaña** (`target="_blank"` con `rel="noopener noreferrer"`). |
| RN-PUBLIC-FE-04 | La verificación de username disponible usa **debounce** (mínimo 300-500ms) para no saturar el backend con cada tecla pulsada. |
| RN-PUBLIC-FE-05 | Si la verificación de disponibilidad devuelve un error de servidor, el campo no muestra estado de error/éxito y el formulario permanece habilitado. |
| RN-PUBLIC-FE-06 | El perfil público no permite edición. Es una vista de sólo lectura. El botón de "editar" existe sólo en el panel privado. |
| RN-PUBLIC-FE-07 | Si el usuario visitado no tiene links activos, se muestra un estado vacío descriptivo en lugar de una lista en blanco. |
| RN-PUBLIC-FE-08 | La URL canónica del perfil sigue el patrón `/users/:username`. Nunca se usa el `id` del usuario en URLs públicas. |
