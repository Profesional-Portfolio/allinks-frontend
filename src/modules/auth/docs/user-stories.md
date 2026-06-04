# Auth (Frontend) — Historias de Usuario y Reglas de Negocio

> Este documento describe las historias de usuario y las reglas de negocio que rigen el módulo de autenticación en el frontend.

---

## Historias de usuario

### HU-AUTH-FE-01: Iniciar sesión

**Como** usuario registrado,  
**quiero** iniciar sesión desde la página de login,  
**para** acceder a mi panel de gestión de enlaces.

**Criterios de aceptación**:
- La página muestra un formulario con campos de email y contraseña.
- Los campos se validan localmente antes de enviar (no deben estar vacíos, email bien formado).
- Mientras se procesa la petición, el botón queda deshabilitado y muestra un indicador de carga.
- Si las credenciales son correctas, se redirige al dashboard (`/`).
- Si las credenciales son incorrectas, se muestra un mensaje de error en el formulario.
- Si ya hay sesión activa, se redirige directamente al dashboard sin mostrar el login.

---

### HU-AUTH-FE-02: Registrarse

**Como** visitante,  
**quiero** crear una cuenta desde la página de registro,  
**para** empezar a usar la plataforma.

**Criterios de aceptación**:
- El formulario solicita: nombre, apellido, username, email, contraseña y opcionalmente bio y avatar.
- Los campos se validan localmente (formatos, campos requeridos, longitudes).
- Durante el proceso de verificación de disponibilidad de username se puede ofrecer feedback en tiempo real.
- Tras un registro exitoso, el usuario es redirigido al dashboard ya autenticado.
- Si el email o username ya existen, se muestra el mensaje de error correspondiente.

---

### HU-AUTH-FE-03: Cerrar sesión

**Como** usuario autenticado,  
**quiero** cerrar sesión desde el panel,  
**para** proteger mi cuenta al terminar de usarla.

**Criterios de aceptación**:
- Existe un botón o acción de "Cerrar sesión" en el panel.
- Al cerrar sesión, el estado de autenticación se limpia y se redirige a `/auth/login`.
- Si hay un error en el servidor al cerrar sesión, la sesión se limpia localmente de todas formas (best-effort).

---

### HU-AUTH-FE-04: Recuperar contraseña

**Como** usuario que olvidó su contraseña,  
**quiero** solicitar un email de recuperación,  
**para** poder restablecer mi contraseña.

**Criterios de aceptación**:
- La página `ForgotPasswordPage` muestra un campo de email.
- Tras enviar el formulario, se muestra un mensaje de confirmación independientemente del resultado (para no revelar si el email existe).
- Un enlace para volver a login está siempre visible.

---

### HU-AUTH-FE-05: Restablecer contraseña

**Como** usuario que recibió el email de recuperación,  
**quiero** establecer una nueva contraseña usando el enlace del correo,  
**para** recuperar el acceso a mi cuenta.

**Criterios de aceptación**:
- La página `ResetPasswordPage` lee el token de la URL (query param).
- Muestra campos de nueva contraseña y confirmación.
- Valida localmente que las contraseñas coincidan antes de enviar.
- Valida que el token sea vigente llamando a `/api/auth/validate-token` al cargar la página.
- Si el token es inválido o expirado, muestra un mensaje y ofrece volver a solicitar el email.
- Tras el restablecimiento exitoso, redirige a `/auth/login`.

---

### HU-AUTH-FE-06: Verificar email

**Como** usuario recién registrado,  
**quiero** confirmar mi email haciendo clic en el enlace del correo de bienvenida,  
**para** completar mi registro.

**Criterios de aceptación**:
- La página `VerifyEmailPage` lee el token de la URL (query param).
- Muestra feedback inmediato: "Verificando..." → "Email verificado" o "Error al verificar".
- Si el token expiró, ofrece un enlace para reenviar el email de verificación.
- Tras la verificación exitosa, redirige al login o al dashboard si ya está autenticado.

---

### HU-AUTH-FE-07: Persistencia de sesión al recargar

**Como** usuario autenticado,  
**quiero** seguir autenticado al recargar la página,  
**para** no tener que volver a iniciar sesión constantemente.

**Criterios de aceptación**:
- Al montar `AuthProvider`, se llama a `GetCurrentUserUseCase` para verificar la sesión existente (cookie).
- Si la sesión es válida, el usuario queda autenticado sin necesidad de hacer login.
- Si la cookie de acceso expiró, se intenta el refresco automático con `RefreshTokenUseCase`.
- Si el refresco también falla, se muestra la pantalla de login.

---

## Reglas de negocio (frontend)

| ID | Regla |
|---|---|
| RN-AUTH-FE-01 | La autenticación se gestiona exclusivamente desde `AuthContext`. Ningún componente accede directamente al servicio HTTP de autenticación. |
| RN-AUTH-FE-02 | `<ProtectedRoute>` evalúa `isAuthenticated` del `AuthContext`. Si es `false`, redirige a `/auth/login`. |
| RN-AUTH-FE-03 | Mientras `isLoading` es `true` en `AuthContext` (verificando sesión inicial), las rutas protegidas muestran un estado de carga, no el login. |
| RN-AUTH-FE-04 | Los tokens (cookies) son gestionados **exclusivamente por el navegador y el servidor**. El frontend nunca lee, escribe ni almacena tokens en `localStorage` o `sessionStorage`. |
| RN-AUTH-FE-05 | Si una petición devuelve `401`, el interceptor de Axios intenta el refresco antes de redirigir al login. |
| RN-AUTH-FE-06 | Un usuario ya autenticado que visita `/auth/login` o `/auth/register` es redirigido automáticamente al dashboard. |
| RN-AUTH-FE-07 | Los errores del servidor (`500`) nunca se muestran en crudo al usuario. Se mapean a mensajes amigables. |
| RN-AUTH-FE-08 | La validación de formularios ocurre **en el cliente** antes de enviar la petición, reduciendo peticiones innecesarias al backend. |
