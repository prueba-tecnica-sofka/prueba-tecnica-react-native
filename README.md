# Prueba Técnica React Native - Productos Financieros

Aplicación mobile construida con Expo, React Native y TypeScript para gestionar productos financieros contra una API local. Cubre las cinco funcionalidades requeridas: listado, búsqueda, contador, creación y edición, con validaciones de negocio, manejo de errores visual y una arquitectura modular orientada a Clean Code y principios SOLID.

---

## Funcionalidades implementadas

### F1 — Listado de productos
Pantalla principal que consume `GET /bp/products` y renderiza un `FlatList` de tarjetas (`ProductCard`). Al tocar una tarjeta, navega a la pantalla de detalle mostrando toda la información del producto seleccionado.

### F2 — Búsqueda en tiempo real
Campo de búsqueda integrado en la pantalla de listado con un debounce de 300 ms para evitar filtrar en cada pulsación. Filtra por nombre, descripción e ID de forma local sobre los productos ya cargados.

### F3 — Contador de resultados
Componente `ResultCounter` que se actualiza reactivamente junto al filtrado. Muestra el número de productos que coinciden con la búsqueda activa, o el total si no hay término.

### F4 — Crear producto
Formulario accesible desde un botón flotante (+) en la pantalla de listado. Valida cada campo antes de enviar:

| Campo | Regla |
|---|---|
| ID | Requerido, 3–10 caracteres, verificación asíncrona de unicidad |
| Nombre | Requerido, 5–100 caracteres |
| Descripción | Requerido, 10–200 caracteres |
| Logo | Requerido (URL) |
| Fecha de liberación | Requerido, igual o mayor a la fecha actual |
| Fecha de revisión | Requerido, exactamente +1 año respecto a la fecha de liberación |

Los errores de validación se muestran inline bajo cada campo. La verificación de ID es asíncrona y consulta `GET /bp/products/verification/:id` al salir del campo.

### F5 — Editar producto
Mismo formulario que F4, accesible desde la pantalla de detalle. El campo ID se deshabilita en modo edición para evitar modificar el identificador. Los datos del producto se precargan automáticamente al abrir el formulario.

---

## Arquitectura

```
src/
├── api/          # Cliente HTTP, endpoints y tipos de respuesta
├── components/   # Componentes reutilizables (common/) y de dominio (products/)
├── hooks/        # Lógica encapsulada: useProducts, useProductForm, useDebounce
├── navigation/   # Stack Navigator y tipos de rutas
├── screens/      # Pantallas: ProductList, ProductDetail, ProductForm
├── store/        # Estado global con Zustand (productos + UI)
├── validators/   # Reglas de validación independientes del formulario
├── utils/        # Fechas, errores, constantes
└── theme/        # Colores, tipografía y espaciado centralizados
```

**Decisiones de diseño:**
- Los componentes de presentación no contienen lógica de negocio; ésta vive en hooks o en el store.
- El módulo `validators/` es independiente de React para poder testear reglas sin montar componentes.
- El cliente HTTP (`src/api/client.ts`) centraliza el manejo de errores HTTP y normaliza las respuestas antes de exponerlas.
- Zustand se usa sin middleware adicional para mantener el estado predecible y fácil de testear.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Expo / React Native |
| Lenguaje | TypeScript strict |
| Estado global | Zustand |
| Navegación | React Navigation (Native Stack) |
| Fechas nativas | @react-native-community/datetimepicker |
| Testing | Jest + @testing-library/react-native |

La UI es completamente custom: no se usan librerías de componentes prefabricados (sin Native Base, React Native Paper, etc.).

---

## Setup instructions

### 1) Prerrequisitos

- Node.js 18+ (recomendado LTS)
- npm 9+
- Expo Go instalado en el dispositivo (opcional, para prueba en físico)
- Backend local corriendo en el puerto `3002`

Para levantar el backend:
1. Descomprimir `repo-interview-main.zip`.
2. Abrir terminal en la carpeta descomprimida.
3. Ejecutar `npm install` y luego `npm run start:dev`.
4. El servicio quedará disponible en `http://localhost:3002`.

### 2) Instalar dependencias del frontend

```bash
npm install
```

### 3) Configurar la URL de la API

**Emulador / simulador local:** no se requiere configuración extra, la app apunta a `http://localhost:3002` por defecto.

**Expo Go en dispositivo físico:** `localhost` resuelve al propio teléfono, no al computador. Para conectarse al backend hay que apuntar a la IP local de la máquina de desarrollo. Crear un archivo `.env` en la raíz del proyecto:

```bash
EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3002
# Ejemplo: EXPO_PUBLIC_API_URL=http://192.168.1.25:3002
```

> El celular y la computadora deben estar en la misma red Wi-Fi.

### 4) Levantar la app

```bash
npm run start        # Metro bundler (escanear QR con Expo Go)
npm run android      # Emulador Android
npm run ios          # Simulador iOS (requiere macOS)
npm run web          # Navegador
```

---

## Guía de testing

### Ejecutar la suite completa

```bash
npm test
```

Corre todos los archivos `*.test.ts` y `*.test.tsx` bajo `src/` y `App.tsx`. Al finalizar imprime un resumen de resultados en la terminal.

### Ejecutar con reporte de cobertura

```bash
npm run test:coverage
```

Genera tres artefactos:

| Artefacto | Ubicación |
|---|---|
| Resumen en terminal | salida estándar |
| Reporte HTML navegable | `coverage/lcov-report/index.html` |
| JSON con métricas brutas | `coverage/coverage-summary.json` |

### Qué está cubierto por los tests

Las pruebas priorizan las rutas críticas del negocio:

- **Validaciones del formulario**: reglas de longitud, formato, fecha y unicidad de ID.
- **Hooks de estado**: `useProducts`, `useProductForm`, `useDebounce`, `useErrorHandler`.
- **Capa API**: `client.ts` y `products.api.ts` con fetch mockeado.
- **Pantallas**: `ProductListScreen` y flujos de error/loading.
- **Utils**: utilidades de fechas y mensajes de error.

### Archivos excluidos del coverage

Por configuración en `package.json` se excluyen del cómputo:
- Archivos `*.styles.ts` (solo estilos, sin lógica)
- Archivos de tipos (`src/types/`, `src/navigation/types.ts`)
- Barriles de exportación (`index.ts`)

---

## API — Referencia de endpoints

Base URL: `http://localhost:3002`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/bp/products` | Obtener todos los productos |
| `POST` | `/bp/products` | Crear un nuevo producto |
| `PUT` | `/bp/products/:id` | Actualizar producto existente |
| `DELETE` | `/bp/products/:id` | Eliminar producto |
| `GET` | `/bp/products/verification/:id` | Verificar si un ID ya existe (`true`/`false`) |

### Modelo de producto

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | Identificador único (ej. `trj-crd`) |
| `name` | string | Nombre del producto |
| `description` | string | Descripción del producto |
| `logo` | string | URL de imagen representativa |
| `date_release` | string (ISO) | Fecha de liberación (`YYYY-MM-DD`) |
| `date_revision` | string (ISO) | Fecha de revisión, siempre +1 año desde `date_release` |