# Plan Técnico - Prueba Técnica React Native
## Aplicación de Productos Financieros

---

## 1. ANÁLISIS DE REQUERIMIENTOS

### Funcionalidades Core
- **F1**: Listado de productos con detalle
- **F2**: Búsqueda en tiempo real
- **F3**: Contador de registros
- **F4**: Formulario de creación con validaciones complejas
- **F5**: Formulario de edición (ID bloqueado)

### Criterios de Calidad
- ✅ Clean Code & SOLID
- ✅ UI custom (sin frameworks como Native Base, React Native Paper)
- ✅ Manejo robusto de errores
- ✅ Testing: ≥70% coverage
- ✅ Defensa técnica posterior

---

## 2. STACK TECNOLÓGICO

### Core
```
React Native (latest stable)
TypeScript (strict mode)
React Navigation (Stack + posible Tab)
```

### Gestión de Estado

```
Zustand
```

### Networking
```
Custom hooks con `fetch`
```

### Testing
```
Jest (unit tests)
@testing-library/react-native (component tests)
@testing-library/jest-native (matchers adicionales)
```

### Utilidades
```
date-fns (manejo de fechas para validaciones)
```

---

## 3. ARQUITECTURA DEL PROYECTO

### Estructura de Carpetas

```
src/
├── api/
│   ├── client.ts              # Axios instance configurada
│   ├── products.api.ts        # CRUD endpoints
│   └── types.ts               # Response types
│
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.styles.ts
│   │   │   └── Button.test.tsx
│   │   ├── Input/
│   │   ├── ErrorMessage/
│   │   └── LoadingSpinner/
│   │
│   └── products/
│       ├── ProductCard/
│       ├── ProductList/
│       ├── SearchBar/
│       └── ResultCounter/
│
├── screens/
│   ├── ProductListScreen/
│   │   ├── ProductListScreen.tsx
│   │   ├── ProductListScreen.styles.ts
│   │   └── ProductListScreen.test.tsx
│   ├── ProductDetailScreen/
│   ├── ProductFormScreen/      # Compartido para Create/Edit
│   └── index.ts
│
├── navigation/
│   ├── AppNavigator.tsx
│   ├── types.ts               # Navigation types
│   └── screens.ts             # Screen names constants
│
├── store/                     # Zustand
│   ├── products/
│   │   ├── products.store.ts
│   │   ├── products.actions.ts
│   │   └── products.types.ts
│   └── ui/
│       └── ui.store.ts        # Loading, errors globales
│
├── hooks/
│   ├── useProducts.ts         # Custom hook para lógica de productos
│   ├── useProductForm.ts      # Lógica de formulario
│   └── useDebounce.ts         # Para búsqueda
│
├── validators/
│   ├── product.schema.ts      # Zod/Yup schemas
│   └── validation.utils.ts
│
├── utils/
│   ├── date.utils.ts
│   ├── error.utils.ts
│   └── constants.ts
│
├── types/
│   ├── product.types.ts
│   └── api.types.ts
│
└── theme/
    ├── colors.ts
    ├── typography.ts
    ├── spacing.ts
    └── index.ts
```

---

## 4. DISEÑO DE COMPONENTES

### Componentes Atómicos (Reusables)

#### Button
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
}
```

#### Input
```typescript
interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  testID?: string;
}
```

#### ErrorMessage
```typescript
interface ErrorMessageProps {
  message: string;
  visible: boolean;
}
```

### Componentes Específicos

#### ProductCard
- Muestra: logo, nombre, descripción corta, ID
- Action: navegación a detalle
- Estado: seleccionable/presionable

#### SearchBar
- Debounce de 300ms
- Clear button
- Loading indicator interno

#### ResultCounter
- Display simple: "X resultados"
- Actualización reactiva

---

## 5. GESTIÓN DE ESTADO (Zustand)

### Products Store

```typescript
interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: () => Promise<void>;
  createProduct: (product: ProductInput) => Promise<void>;
  updateProduct: (id: string, product: ProductInput) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  verifyProductId: (id: string) => Promise<boolean>;
}
```

### Separación de Concerns

- **Store**: Solo estado
- **Actions**: Lógica async en archivo separado
- **Selectors**: Hooks custom para derived state

---

## 6. VALIDACIONES DEL FORMULARIO

### Validación Manual

Para la validación vamos a crear un modulo llamado `utils/validator.ts`


### Estrategia de Validación
1. **On Blur**: Validar campo individual
2. **On Submit**: Validar todo el form
3. **Async ID Check**: Solo cuando el campo pierde foco y es válido en formato

---

## 7. NAVEGACIÓN

### Stack Navigator

```typescript
type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: string };
  ProductForm: { 
    mode: 'create' | 'edit'; 
    productId?: string;
  };
};
```

### Flujos
1. **List → Detail**: Tap en card
2. **List → Form (Create)**: Botón "Agregar" (floating action button)
3. **Detail → Form (Edit)**: Botón "Editar"
4. **Form → List**: Después de crear/editar exitosamente

---

## 8. MANEJO DE ERRORES

### Estrategia en Capas

#### API Layer
```typescript
// Axios interceptor
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 'Error desconocido';
    throw new AppError(message, error.response?.status);
  }
);
```

#### Store Layer
```typescript
try {
  const createdProduct = await productsApi.createProduct(product);
  set({ products: [...get().products, createdProduct] });
} catch (error) {
  set({ error: error.message });
  throw error; // Re-throw para que UI pueda manejarlo
}
```

#### UI Layer
```typescript
// Toast/Alert nativo para errores globales
// Mensajes inline para errores de validación
```

---

## 9. TESTING STRATEGY

### Coverage Target: ≥70%

#### Unit Tests
- **Utils**: Validaciones, formateo de fechas
- **Validators**: Schemas de Zod
- **Store Actions**: Lógica de negocio

#### Component Tests
- **Atomic Components**: Button, Input, ErrorMessage
- **Product Components**: ProductCard, SearchBar
- **Screens**: Renderizado, interacciones, navegación

#### Integration Tests
- **Product Form**: Flujo completo de validación
- **Search Flow**: Debounce + filtrado
- **CRUD Operations**: Mocked API calls

### Ejemplo de Test

```typescript
describe('ProductForm', () => {
  it('should show error when ID already exists', async () => {
    const { getByTestId, findByText } = render(<ProductForm />);
    
    const idInput = getByTestId('input-id');
    fireEvent.changeText(idInput, 'existing-id');
    fireEvent(idInput, 'blur');
    
    const error = await findByText('ID ya existe');
    expect(error).toBeTruthy();
  });
});
```

---

## 10. PLAN DE IMPLEMENTACIÓN

### Fase 1: Setup & Fundaciones 
- [x] Inicializar proyecto React Native + TypeScript
- [x] Estructura de carpetas
- [x] Configurar Jest + Testing Library
- [x] Theme system (colores, tipografía, espaciado)

### Fase 2: Componentes Base 
- [x] Button component + tests
- [x] Input component + tests
- [x] ErrorMessage component + tests
- [x] LoadingSpinner component

### Fase 3: API & Store 
- [x] API client con interceptors
- [x] Products API methods (CRUD + verify)
- [x] Zustand store para productos
- [x] Error handling centralizado
- [x] Tests para API layer

### Fase 4: F1 - Lista de Productos 
- [x] ProductCard component
- [x] ProductList component
- [x] ProductListScreen
- [x] Navegación a detalle
- [x] ProductDetailScreen
- [x] Tests

### Fase 5: F2 & F3 - Búsqueda y Contador 
- [x] SearchBar component con debounce
- [x] ResultCounter component
- [x] Integración en ProductListScreen
- [x] Tests de búsqueda

### Fase 6: F4 - Crear Producto 
- [x] Validators
- [x] ProductFormScreen (modo create)
- [x] Validaciones en tiempo real
- [x] Verificación async de ID
- [x] Cálculo automático de date_revision
- [x] Tests de validación
- [x] Botón flotante "Agregar"

### Fase 7: F5 - Editar Producto 
- [x] ProductFormScreen (modo edit)
- [x] Pre-carga de datos
- [x] ID field disabled
- [x] Botón "Editar" en detalle
- [x] Tests

### Fase 8: Pulido & Testing 
- [ ] Alcanzar ≥70% coverage
- [ ] Manejo de errores visuales
- [ ] Loading states
- [ ] Empty states
- [ ] Optimizaciones de performance

### Fase 9: Documentación 
- [ ] README con setup instructions
- [ ] Guía de testing

---

## 11. PRINCIPIOS SOLID APLICADOS

### Single Responsibility
- Cada componente tiene una única razón para cambiar
- Separación: UI components vs. Business logic (hooks/store)

### Open/Closed
- Componentes base (Button, Input) extensibles vía props
- No modificar componentes base, crear variantes

### Liskov Substitution
- Interfaces consistentes (ej: todos los inputs siguen InputProps)

### Interface Segregation
- Props interfaces específicas, no "god objects"
- useProducts hook expone solo lo necesario

### Dependency Inversion
- Componentes dependen de abstracciones (hooks), no de store directamente
- API layer inyectable para testing

---

## 12. CLEAN CODE CHECKLIST

- [ ] Nombres descriptivos (no `data`, `temp`, `x`)
- [ ] Funciones pequeñas (<20 líneas idealmente)
- [ ] DRY: No repetir lógica
- [ ] Comentarios solo cuando el código no es auto-explicativo
- [ ] Constantes en lugar de magic numbers/strings
- [ ] Error handling explícito (no silent fails)
- [ ] TypeScript strict mode (no `any`)

---

## 13. CONSIDERACIONES TÉCNICAS ADICIONALES

### Performance
- `React.memo` en ProductCard (evitar re-renders)
- `useMemo` para filtrado de productos
- `useCallback` en handlers pasados a listas
- FlatList con `keyExtractor` optimizado

### Accesibilidad
- `accessibilityLabel` en todos los touchables
- `testID` para testing
- Contraste de colores adecuado

### Offline Handling
- Mensaje claro si backend no está corriendo
- Retry logic en llamadas API

### Date Handling
- Usar date-fns para evitar bugs de zona horaria
- Format consistente: ISO 8601

---

## 14. RIESGOS Y MITIGACIONES

| Riesgo | Mitigación |
|--------|------------|
| Validación async de ID lenta | Implementar debounce, cache de IDs verificados |
| Tests no llegan a 70% | Priorizar coverage de business logic, usar coverage reports |
| UI custom consume mucho tiempo | Crear design system mínimo primero |
| Fechas con bugs de timezone | Siempre usar date-fns, tests para edge cases |
| Backend local no corre | Instrucciones claras en README, error handling robusto |

---

## 15. ENTREGABLES FINALES

### Repositorio Git
- [ ] `.gitignore` configurado
- [ ] Commits atómicos con mensajes descriptivos
- [ ] Branches: `main` + feature branches (opcional)

### Documentación
- [ ] README con:
  - Setup instructions
  - Comandos para correr app
  - Comandos para correr tests
  - Estructura del proyecto
  - Decisiones técnicas
- [ ] Evidencia de coverage ≥70%

### Código
- [ ] Todas las funcionalidades implementadas
- [ ] Tests pasando
- [ ] Sin warnings en build
- [ ] Código formateado

---

## RESUMEN EJECUTIVO

**Tecnologías Core**: React Native, TypeScript, Zustand, Jest  
**Arquitectura**: Component-based con separation of concerns  
**Testing**: ≥70% coverage (unit + component + integration)  
**Principios**: Clean Code + SOLID rigurosos  

