# Profile (Frontend) — Historias de Usuario y Reglas de Negocio

> Este documento describe las historias de usuario y las reglas de negocio que rigen el módulo de perfil en el frontend.

---

## Historias de usuario

### HU-PROFILE-FE-01: Ver mi perfil en el panel

**Como** usuario autenticado,  
**quiero** ver mi información de perfil en el panel,  
**para** saber qué datos son visibles y poder gestionarlos.

**Criterios de aceptación**:
- Se muestran: nombre, apellido, username, email, bio y avatar.
- El email se muestra en modo lectura (no editable desde aquí).
- Mientras cargan los datos, se muestra un estado de carga.
- Si el perfil no puede cargarse, se ofrece un botón para reintentar.

---

### HU-PROFILE-FE-02: Editar mi información de perfil

**Como** usuario autenticado,  
**quiero** editar mi nombre, apellido, username o bio,  
**para** mantener mi información pública actualizada.

**Criterios de aceptación**:
- El formulario de edición está pre-rellenado con los datos actuales.
- El campo `username` se valida en tiempo real contra el backend (verificación de disponibilidad).
- El campo `bio` muestra un contador de caracteres (máx. 160).
- Al guardar con éxito, el perfil en el contexto se actualiza y se muestra un feedback positivo.
- Si el username ya está en uso, se resalta el campo con un mensaje de error.
- El campo `email` no es editable desde este formulario.

---

### HU-PROFILE-FE-03: Subir o cambiar mi avatar

**Como** usuario autenticado,  
**quiero** subir o reemplazar mi foto de perfil,  
**para** personalizar mi presencia en la plataforma.

**Criterios de aceptación**:
- Hay una zona de carga de imagen (click o drag-and-drop).
- Se acepta sólo formatos jpg, png y webp; la validación ocurre antes de enviar.
- Se muestra una previsualización de la imagen seleccionada antes de confirmar la subida.
- Tras la subida exitosa, el avatar se actualiza en el perfil y en la interfaz sin recargar.
- Si hay error, se descarta la previsualización y se muestra el mensaje de error.

---

### HU-PROFILE-FE-04: Eliminar mi avatar

**Como** usuario autenticado,  
**quiero** quitar mi foto de perfil,  
**para** volver a usar el avatar por defecto.

**Criterios de aceptación**:
- Existe un botón de eliminar avatar visible sólo cuando el usuario tiene avatar.
- Se solicita confirmación antes de proceder.
- Tras la eliminación, el perfil muestra el avatar por defecto.
- Si hay error, el avatar actual permanece sin cambios.

---

## Reglas de negocio (frontend)

| ID | Regla |
|---|---|
| RN-PROFILE-FE-01 | El estado del perfil se gestiona en `ProfileContext`. Los componentes de perfil no tienen estado propio de los datos del usuario. |
| RN-PROFILE-FE-02 | El campo `email` se muestra en modo lectura. No existe formulario para cambiarlo en el frontend actual. |
| RN-PROFILE-FE-03 | La `bio` tiene un límite de 160 caracteres. El formulario valida localmente con un contador visual antes de enviar. |
| RN-PROFILE-FE-04 | El tipo MIME del archivo de avatar se valida localmente antes de enviar (`image/jpeg`, `image/png`, `image/webp`). Si no es válido, no se realiza la petición. |
| RN-PROFILE-FE-05 | El botón "Eliminar avatar" se deshabilita automáticamente si `profile.avatar_url === null`. |
| RN-PROFILE-FE-06 | La previsualización del avatar es temporal y local. No se persiste hasta que el servidor confirma la subida. |
| RN-PROFILE-FE-07 | El `ProfileContext` se inicializa con `fetchProfile()` al montar el `ProfileProvider`. No se depende del `AuthContext` para obtener los datos del perfil (son fuentes independientes). |
| RN-PROFILE-FE-08 | Si la verificación de disponibilidad de username devuelve `409`, se bloquea el envío del formulario hasta que el usuario cambie el valor. |
