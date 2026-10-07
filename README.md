*Prototipo Web para Cafetería (Café en Línea)*

**Este proyecto es un prototipo web adaptativo para la gestión de pedidos, ventas y productos de una cafetería local. Su objetivo es agilizar el trabajo diario de los empleados en caja y facilitar a los clientes la consulta del menú y sus pedidos.**


1. Integrantes del Equipo (Error 404)
- César Martínez: Coordinador 
- Franschesco Navarro: Analista
- Erick Navarro: Desarrollador Depurador 
- Enrique Parra: Desarrollador Diseñador UX/UI 


2. Problemática y Justificación

Durante observaciones en una cafetería local, notamos que llevar el registro de pedidos y ventas de forma manual o poco organizada genera retrasos, confusiones y errores en los cálculos.

Con esta plataforma buscamos solucionar esto:
- Para los empleados: Un sistema simple que calcule automáticamente totales, descuentos y cambio, además de organizar los pedidos.
- Para los clientes: Una opción práctica para ver el menú con precios claros, guardar pedidos frecuentes o hacer pedidos con anticipación para recoger.
- Para el jefe: Un panel centralizado para checar las ventas del día, administrar productos y gestionar al personal.


3. Tecnologías Utilizadas
- HTML5: Estructura semántica de las pantallas.
- CSS3: Variables globales, Flexbox, CSS Grid y diseño responsivo para móviles, tablets y computadoras.
- JavaScript: Interacción básica y validaciones.
- Git y GitHub: Control de versiones con trabajo colaborativo en ramas.
- Figma: Diseño de wireframes y flujo de pantallas.


4. Estructura de Vistas y Navegación
El prototipo cuenta con las pantallas principales interconectadas mediante rutas relativas:

- index.html: Página de inicio (Landing page) con buscador y presentación general.
-  login.html: Pantalla de acceso para clientes, empleados y administrador.
-   registro.html: Formulario para la creación de cuentas de nuevos clientes.
-   dashboard.html: Panel de control según el rol de usuario (resumen de ventas, accesos rápidos).
-   catalogo.html / menu.html: Menú de productos organizados por categorías (cafés, repostería, etc.).
-    personal.html: Control y listado de la base de trabajadores.

5. Mapa de Navegación
- ![Texto alternativo](/imagenes/Captura%20de%20pantalla%202026-10-07%20a%20la(s)%207.48.38.png)


7. Matriz de Trazabilidad (Requerimientos vs. Pantallas)

| ID | Requerimiento (RF / RNF) | Vista / Archivo | Componentes y Funcionalidad |
| :--- | :--- | :--- | :--- |
| RF1 | Registro e inicio de sesión de usuarios | login.html / registro.html | Formulario de acceso con inputs para usuario/contraseña y botones de registro. |
| RF2 | Dashboard del jefe con operaciones | dashboard.html | Tarjetas de métricas y resumen de ventas del día. |
| RF3 / RF8 | Historial de ventas | historial.html / ventas.html | Tabla responsiva para consultar las transacciones realizadas. |
| RF4 | Administración de trabajadores | personal.html | Tabla y opciones para agregar o modificar datos del personal. |
| RF5 / RF9 | Catálogo e inventario de productos | catalogo.html / plantilla.html | Secciones con tarjetas (cards) para productos, precios y categorías. |
| RF6 / RF7 | Panel de ventas y cálculo de totales | ventas.html (Terminal POS) | Interfaz gráfica para registrar pedidos y calcular totales. |
| RNF5 | Diseño responsivo y adaptativo | Todas las vistas (.html) | Adaptación de la interfaz mediante CSS para móvil, tablet y escritorio. |


7. Pasos para Probar el Proyecto Localmente
link =


8. Credenciales de Prueba (Demostración)
- Administrador / Jefe: jefe@cafeteria.com / 123456
- Empleado: empleado@cafeteria.com / 123456
- Cliente: cliente@cafeteria.com / 123456
