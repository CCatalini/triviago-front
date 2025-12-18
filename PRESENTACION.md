# 🎯 Presentación Triviago
## Guión para Demo (8-10 minutos)

---

## 📖 PARTE 1: Introducción (1 minuto)

### Slide de Apertura

> *"Imaginen esto: un profesor de universidad quiere evaluar el conocimiento de sus alumnos de forma interactiva, o un grupo de amigos quiere retarse con preguntas de cultura general. ¿Cómo lo hacen hoy? Formularios aburridos, WhatsApp, o simplemente... no lo hacen."*

> *"Les presento **Triviago** - una plataforma de quizzes interactivos que transforma el aprendizaje y la diversión en una experiencia social y competitiva."*

---

## 📖 PARTE 2: La Historia de Cami (6-7 minutos)

### Escena 1: Registro e Inicio de Sesión (1 min)

**Narración:**
> *"Conocemos a Cami, una estudiante de tercer año que quiere crear quizzes para ayudar a sus compañeros a estudiar."*

**Demo en vivo:**
1. Ir a `localhost:3000/signin`
2. Mostrar el formulario de registro (nombre, apellido, email, fecha de nacimiento, contraseña)
3. Mostrar que ya tiene cuenta → ir a Login
4. Iniciar sesión con `cami@mail.com`

**Destacar:**
- ✅ Validación de campos
- ✅ Autenticación segura con JWT
- ✅ Protección de rutas (no se puede acceder sin login)

---

### Escena 2: Explorando el Home (1.5 min)

**Narración:**
> *"Una vez dentro, Cami ve el dashboard principal con todos los quizzes disponibles."*

**Demo en vivo:**
1. Mostrar la pantalla Home con los quizzes
2. Mostrar el **filtro lateral**:
   - Búsqueda por título
   - Filtro por etiquetas (Ciencia, Historia, Música, etc.)
   - Rango de preguntas (mínimo/máximo)
   - Opción "Solo de personas que sigo"
3. Filtrar por "Ciencia" → mostrar resultados
4. Mostrar el **buscador de quizzes privados** con código de invitación

**Destacar:**
- ✅ Filtros avanzados
- ✅ Sistema de etiquetas
- ✅ Quizzes públicos vs privados

---

### Escena 3: Creando un Quiz (2 min)

**Narración:**
> *"Cami decide crear un quiz de Ciencias Naturales para su grupo de estudio."*

**Demo en vivo:**
1. Click en "Crear Quiz" en el navbar
2. Completar:
   - **Título:** "Biología Celular"
   - **Descripción:** "Quiz sobre células y sus componentes"
   - **Etiquetas:** Seleccionar "Ciencia", "Educación"
   - **Privacidad:** Marcar como PRIVADO
3. Agregar preguntas:
   - Mostrar cómo se agregan opciones de respuesta
   - Marcar la respuesta correcta
   - Agregar al menos 2-3 preguntas
4. Guardar el quiz
5. **Mostrar el código de invitación de 6 dígitos** que se genera

**Destacar:**
- ✅ Interfaz intuitiva de creación
- ✅ Múltiples opciones por pregunta
- ✅ Sistema de privacidad con código de invitación
- ✅ Botón para copiar código

---

### Escena 4: Resolviendo un Quiz (1.5 min)

**Narración:**
> *"Ahora veamos cómo Ro, una amiga de Cami, resuelve un quiz."*

**Demo en vivo:**
1. Ir a un quiz público (ej: "Música Pop Internacional")
2. Mostrar los **detalles del quiz**:
   - Título, descripción, etiquetas
   - Autor y fecha de creación
   - Rating y cantidad de comentarios
   - Botón de guardar (bookmark)
3. Click en "REALIZAR"
4. Mostrar el **modal de confirmación**
5. Resolver algunas preguntas
6. Enviar resolución
7. **Mostrar resultados**: puntaje, respuestas correctas/incorrectas

**Destacar:**
- ✅ Modal de confirmación elegante
- ✅ Feedback visual de respuestas
- ✅ Resultados inmediatos

---

### Escena 5: Interacción Social (1.5 min)

**Narración:**
> *"Triviago no es solo resolver quizzes, es una comunidad."*

**Demo en vivo:**
1. Volver a los detalles de un quiz
2. Mostrar la sección de **Comentarios**:
   - Ver comentarios existentes
   - Agregar un nuevo comentario
   - Mostrar likes/dislikes
   - Mostrar respuestas a comentarios
3. Cambiar a pestaña **Clasificación**:
   - Mostrar el ranking de usuarios
   - Puntaje, fecha, hora, posición
4. Ir al **Perfil de usuario**:
   - Mostrar quizzes creados
   - Quizzes guardados
   - Quizzes resueltos
   - Sistema de seguidores

**Destacar:**
- ✅ Sistema de comentarios con respuestas
- ✅ Likes y dislikes
- ✅ Ranking competitivo
- ✅ Perfiles de usuario
- ✅ Sistema de seguimiento

---

## 📖 PARTE 3: Stack Tecnológico (1 minuto)

### Slide Técnico

> *"¿Cómo construimos esto?"*

| Frontend | Backend | Base de Datos |
|----------|---------|---------------|
| Next.js 13 | Spring Boot 2.7 | MySQL 8 |
| React 18 | Spring Security | Hibernate/JPA |
| Material UI 5 | JWT Auth | |
| Axios | REST API | |

**Arquitectura:**
```
[React Frontend] ←→ [Spring Boot API] ←→ [MySQL DB]
        ↓                    ↓
    JWT Token          Autenticación
```

---

## 📖 PARTE 4: Cierre (30 seg)

### Slide Final

> *"Triviago transforma la forma en que aprendemos y nos divertimos juntos. Ya sea para estudiar, competir con amigos, o simplemente pasar el rato, Triviago hace que el conocimiento sea social y entretenido."*

**Casos de uso:**
- 🎓 **Educación:** Profesores evaluando alumnos
- 👥 **Social:** Amigos retándose
- 🏢 **Empresas:** Capacitaciones interactivas
- 🎮 **Entretenimiento:** Trivias temáticas

> *"¿Preguntas?"*

---

## 🎬 CHECKLIST PARA LA DEMO

### Antes de empezar:
- [ ] Backend corriendo (`cd back && ./gradlew bootRun`)
- [ ] Frontend corriendo (`cd front && npm run dev`)
- [ ] MySQL con datos de prueba
- [ ] Tener listos los usuarios: `cami@mail.com` y `ro@mail.com` (password: `test12345`)
- [ ] Tener un código de quiz privado a mano

### URLs importantes:
| Página | URL |
|--------|-----|
| Login | `http://localhost:3000/login` |
| Registro | `http://localhost:3000/signin` |
| Home | `http://localhost:3000/home` |
| Crear Quiz | `http://localhost:3000/quizcreation` |
| Perfil | `http://localhost:3000/user/[id]/profile` |

### Tips para la presentación:
- ⏱️ Practicar el timing antes
- 🖱️ Hacer clicks lentos para que se vea bien
- 💬 Narrar mientras hacés las acciones
- 🎯 Si algo falla, seguir adelante con naturalidad

---

## 📋 RESUMEN DE FUNCIONALIDADES

### Autenticación
- Registro de usuarios
- Login con JWT
- Protección de rutas
- Cambio de contraseña

### Quizzes
- Crear quizzes públicos o privados
- Múltiples preguntas con opciones
- Sistema de etiquetas
- Código de invitación para quizzes privados
- Guardar quizzes favoritos

### Resolución
- Resolver quizzes interactivamente
- Ver resultados inmediatos
- Feedback visual (correcto/incorrecto)
- Historial de resoluciones

### Social
- Comentarios en quizzes
- Respuestas a comentarios
- Likes y dislikes
- Ranking/Clasificación
- Seguir usuarios
- Perfiles de usuario

### Filtros y Búsqueda
- Buscar por título
- Filtrar por etiquetas
- Rango de cantidad de preguntas
- Filtrar por usuarios seguidos
- Buscar quizzes privados por código

---

## 🔧 COMANDOS ÚTILES

```bash
# Levantar Backend
cd back
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
./gradlew bootRun

# Levantar Frontend
cd front
npm run dev

# Ver logs del backend
# El backend corre en puerto 8080

# Ver logs del frontend
# El frontend corre en puerto 3000
```

---

*Documento generado para la demo de Triviago - Diciembre 2024*

