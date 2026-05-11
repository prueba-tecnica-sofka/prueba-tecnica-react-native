---
description: "Use when creating or refactoring React Native + TypeScript code in this technical test project. Provides practical guidelines for feature-folder architecture, strict typing, product form validations, custom UI without component libraries, and focused unit tests."
name: "React Native Banking App Standards"
applyTo:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "App.tsx"
  - "index.ts"
---
# Estándares del Proyecto (Prueba Técnica React Native)

## Objetivo
- Implementar una app de productos financieros con Clean Code, SOLID y tipado estricto.
- Mantener UI custom de React Native, sin librerías de componentes prefabricados.
- Tratar estas reglas como guías preferidas para mantener consistencia del proyecto.

## Arquitectura y Organización
- Respeta la estructura por dominio definida en `src/` (`api`, `components`, `screens`, `store`, `hooks`, `validators`, `utils`, `types`, `theme`).
- Evita lógica de negocio en componentes de presentación; muévela a hooks, store o capa API.
- Mantén la separación por archivo cuando aplique:
  - `*.tsx`: render y composición
  - `*.styles.ts`: estilos
  - `*.test.tsx`: pruebas
- Para flujo de productos, centraliza networking en `src/api/products.api.ts` y estado en `src/store/products`.

## TypeScript y Calidad de Código
- Usa TypeScript estricto; evita `any` salvo justificación clara y local.
- Declara interfaces/tipos en `src/types` o en el módulo correspondiente si son locales.
- Prefiere funciones pequeñas, nombres explícitos y retornos tempranos.
- No dupliques reglas de negocio: encapsula validaciones y transformaciones en utilidades reutilizables.

## UI y Experiencia de Usuario
- Usa solo componentes base de React Native y componentes propios del proyecto.
- Usa tokens del tema (`src/theme`) para colores, espaciado y tipografía; evita hardcodear valores repetidos.
- Debe existir feedback visual de `loading`, error y estados vacíos en pantallas y formularios.
- Los mensajes de error deben ser comprensibles para usuario final.

## Formularios y Validaciones de Producto
- Reglas obligatorias del formulario:
  - `id`: requerido, min 3, max 10, y verificación asíncrona de existencia.
  - `name`: requerido, min 5, max 100.
  - `description`: requerido, min 10, max 200.
  - `logo`: requerido.
  - `date_release`: requerido, igual o mayor a la fecha actual.
  - `date_revision`: requerido, exactamente +1 año respecto a `date_release`.
- Muestra errores por campo de forma visual y consistente.
- En edición, el `id` debe permanecer deshabilitado.

## Estado y Datos
- Usa utilidades y módulos propios del proyecto para estado y validación; evita introducir nuevas librerías de estado/validación.
- Implementa búsqueda reactiva con debounce en el flujo de productos.
- Normaliza y tipa respuestas de API antes de exponerlas a UI.

## Testing
- Cada componente/pantalla/hook nuevo debe incluir pruebas unitarias cercanas al módulo (`*.test.tsx`).
- Prioriza pruebas de:
  - validaciones del formulario
  - flujos de error/loading
  - búsqueda y contador de resultados
  - creación/edición de producto
- No se exige un umbral rígido de cobertura, pero sí pruebas suficientes para cubrir rutas críticas.

## Restricciones
- No introducir frameworks de UI/componentes prefabricados.
- No mezclar responsabilidades de capa (UI, dominio, acceso a datos).
- No romper contratos de tipos existentes sin actualizar su uso en todo el flujo.
