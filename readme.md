# El Perro Vintage - E-commerce de Ropa Vintage

## Descripción del Proyecto

El Perro Vintage es un proyecto desarrollado como parte del bootcamp ISDI Coders (Madrid), un e-commerce especializado en ropa vintage de segunda mano. La aplicación cuenta con funcionalidades clave que permiten a los usuarios explorar, registrar y gestionar productos de manera eficiente.

## Funcionalidades Principales

### Registro y Login de Usuarios

- La aplicación proporciona un sistema de registro y login para que los usuarios gestionen sus cuentas.

### Listado de Productos

- Los usuarios normales tienen acceso para ver la lista completa de productos disponibles en la tienda.

### Funcionalidades de Administrador

- Los usuarios con privilegios de administrador pueden:
  - Crear nuevos productos.
  - Modificar información de productos existentes.
  - Eliminar productos del inventario.

### Detalles del Producto

- Ambos tipos de usuarios pueden acceder a la página de detalles de cada producto.
- Se especifican las propiedades del producto.
- Implementación de un filtro por tallas para facilitar la búsqueda.

## Tecnologías Utilizadas

- **MERN Stack:**

  - MongoDB con Mongoose (Backend)
  - Express (Backend)
  - React (Frontend)
  - Node (Backend)

- **Pruebas:**
  - Todas las funcionalidades están 100% testeadas con Jest.

## Listado de Endpoints

### Usuarios

| Método | URL             | Descripción                                                                    |
| ------ | --------------- | ------------------------------------------------------------------------------ |
| POST   | /users/register | Registrar un nuevo usuario con campos obligatorios.                            |
| POST   | /users/login    | Autenticar un usuario con nombre de usuario o correo electrónico y contraseña. |
| GET    | /users          | Obtener una lista de usuarios. (Solo puede realizarlo el administrador)        |
| GET    | /users/:id      | Obtener un usuario por su ID. (Solo puede realizarlo el administrador)         |

### Ropa

| Método | URL          | Descripción                                                                      |
| ------ | ------------ | -------------------------------------------------------------------------------- |
| GET    | /clothes     | Obtener la lista de prendas disponibles.                                         |
| GET    | /clothes/:id | Obtener información detallada sobre una prenda específica.                       |
| POST   | /clothes     | Agregar una nueva prenda a la colección. Requiere derechos de administrador.     |
| PATCH  | /clothes/:id | Actualizar detalles de una prenda existente. Requiere derechos de administrador. |
| DELETE | /clothes/:id | Eliminar una prenda de la colección. Requiere derechos de administrador.         |

## Instrucciones de Ejecución

Antes de ejecutar el backend de la aplicación, asegúrese de tener instaladas las siguientes dependencias:

- **Node.js:** Descargar e instalar [Node.js](https://nodejs.org/).
- **MongoDB:** Descargar e instalar [MongoDB](https://www.mongodb.com/try/download/community).

### Configuración del Backend:

1. Clone el repositorio:

```bash
git clone https://github.com/isdi-coders-2023/Elias-Martin-Final-Project-back-202309-mad
```

2. Navegue al directorio del proyecto:

```bash
cd Elias-Martin-Final-Project-back-202309-mad
```

3. Instale las dependencias:

```bash
npm install
```

4. Configure las variables de entorno:

- Cree un archivo `.env` en el directorio raíz del proyecto.
- Configure las variables de entorno necesarias. Consulte el archivo `sample.env` para obtener una lista de las variables requeridas.

5. Inicie el compilador:

```bash
npm run build
```

5. Inicie el servidor:

```bash
npm run start:dev
```

Con estos pasos, el backend estará configurado y en ejecución. Ahora puede proceder a iniciar el frontend y explorar El Perro Vintage.

## Contribución

¡Nos encantaría recibir tus contribuciones para mejorar El Perro Vintage! Para hacerlo, sigue estos pasos:

1. **Fork del Repositorio:**

- Crea un fork del repositorio desde la interfaz de GitHub.

2. **Clona tu Repositorio Fork:**

- Clona tu fork del repositorio a tu máquina local usando el comando:

  ```bash
  git clone https://github.com/TuUsuario/Elias-Martin-Final-Project-back-202309-mad.git
  ```

3. **Realiza tus Cambios:**

- Implementa las mejoras o correcciones en tu copia local del proyecto.

4. **Commit y Push:**

- Realiza commits de tus cambios con mensajes descriptivos.
- Sube tus cambios a tu repositorio en GitHub:

  ```bash
  git push origin master
  ```

5. **Envía un Pull Request:**

- Desde la página de tu fork en GitHub, crea un Pull Request (PR).
- Asegúrate de proporcionar detalles claros sobre los cambios realizados y las razones para realizarlos.

## Autor

- Elías Martin (eliasmr98)

¡Gracias por revisar El Perro Vintage! 🐾
