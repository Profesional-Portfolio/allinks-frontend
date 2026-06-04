# Links (Frontend) — Historias de Usuario y Reglas de Negocio

> Este documento describe las historias de usuario y las reglas de negocio que rigen el módulo de gestión de enlaces en el frontend.

---

## Historias de usuario

### HU-LINKS-FE-01: Ver mis enlaces en el panel

**Como** usuario autenticado,  
**quiero** ver todos mis enlaces en el panel,  
**para** tener una visión clara del estado actual de mi perfil.

**Criterios de aceptación**:
- Los enlaces se cargan automáticamente al entrar al panel.
- Se muestran tanto los activos como los inactivos, con indicación visual de su estado.
- Los enlaces aparecen en el orden definido por `display_order`.
- Si no hay enlaces, se muestra un estado vacío invitando a crear el primero.
- Mientras cargan, se muestra un esqueleto o spinner de carga.

---

### HU-LINKS-FE-02: Crear un nuevo enlace

**Como** usuario autenticado,  
**quiero** añadir un nuevo enlace desde el panel,  
**para** compartirlo en mi perfil público.

**Criterios de aceptación**:
- Existe un botón o formulario para añadir un nuevo enlace.
- Los campos del formulario son: título, URL y plataforma.
- Se valida localmente que la URL tenga formato válido antes de enviar.
- Tras la creación exitosa, el nuevo enlace aparece al final de la lista sin recargar la página.
- Si hay un error, se muestra un mensaje descriptivo sin limpiar el formulario.

---

### HU-LINKS-FE-03: Editar un enlace

**Como** usuario autenticado,  
**quiero** modificar el título, URL o plataforma de un enlace,  
**para** corregir o actualizar mi información.

**Criterios de aceptación**:
- Cada enlace tiene una opción de edición (botón o modal).
- El formulario de edición se pre-rellena con los datos actuales del enlace.
- Tras la edición exitosa, el enlace se actualiza en la lista sin recargar.
- Si hay un error, el enlace mantiene sus valores anteriores.

---

### HU-LINKS-FE-04: Eliminar un enlace

**Como** usuario autenticado,  
**quiero** eliminar un enlace de mi perfil,  
**para** quitarlo permanentemente de mi página pública.

**Criterios de aceptación**:
- Cada enlace tiene un botón de eliminar.
- Se solicita confirmación antes de proceder (modal o confirm).
- Tras la eliminación exitosa, el enlace desaparece de la lista sin recargar.
- Si hay un error, el enlace permanece en la lista.

---

### HU-LINKS-FE-05: Activar/desactivar un enlace

**Como** usuario autenticado,  
**quiero** ocultar o mostrar un enlace de forma rápida,  
**para** controlar qué se ve en mi perfil sin tener que eliminarlo.

**Criterios de aceptación**:
- Cada enlace tiene un toggle (switch) para cambiar su visibilidad.
- El cambio se refleja visualmente de forma inmediata (actualización optimista).
- Si la petición al backend falla, el toggle vuelve a su estado anterior.
- Los enlaces inactivos se muestran con un estilo visual diferenciado (ej. opacidad reducida).

---

### HU-LINKS-FE-06: Reordenar enlaces mediante drag-and-drop

**Como** usuario autenticado,  
**quiero** arrastrar los enlaces para cambiar su orden,  
**para** decidir qué links aparecen primero en mi perfil.

**Criterios de aceptación**:
- Los enlaces son arrastrables (drag-and-drop).
- El nuevo orden se refleja visualmente de forma inmediata al soltar.
- Tras soltar, se envía la petición de reordenamiento al backend.
- Si la petición falla, la lista vuelve al orden anterior.
- El orden se persiste en el backend y se mantiene al recargar la página.

---

## Reglas de negocio (frontend)

| ID | Regla |
|---|---|
| RN-LINKS-FE-01 | El estado de la lista de enlaces se gestiona exclusivamente en `LinksContext`. Los componentes no gestionan su propio estado de lista. |
| RN-LINKS-FE-02 | Las operaciones de visibilidad y reordenamiento aplican **actualización optimista**: el estado local se actualiza inmediatamente y se revierte si el backend responde con error. |
| RN-LINKS-FE-03 | La URL de un enlace debe validarse localmente antes de enviar (protocolo http/https requerido). |
| RN-LINKS-FE-04 | El módulo no importa ni depende del `AuthContext` directamente. Si necesita el `userId`, lo obtiene de los datos del enlace o de un hook de perfil. |
| RN-LINKS-FE-05 | No se duplica la lógica de autorización en el frontend. Si el backend retorna `403`, se muestra el error al usuario; no se intenta re-validar la propiedad localmente. |
| RN-LINKS-FE-06 | La lista de links se re-fetcha automáticamente al montar `LinksProvider`. No se cachea en `localStorage`. |
| RN-LINKS-FE-07 | La eliminación de un enlace requiere confirmación explícita del usuario antes de ejecutar la petición. |
