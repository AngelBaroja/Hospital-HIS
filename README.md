*¿Cómo ejecutar este proyecto en tu PC?*
1-Clona el repositorio y entra a la carpeta del proyecto:
git clone https://github.com/AngelBaroja/Hospital-HIS.git
cd Hospital-HIS

2-Instala las dependencias:
npm install

3-Configura el archivo .env:

Copia el archivo .env.example o crea uno nuevo llamado .env con tus datos de base de datos y sesión.

4-Carga los datos de prueba (para que puedas tener usuarios con los que ingresar a la pagina)
npm run seed

5-Inicia el servidor:
npm run start

*Usuarios y Contraseñas*
    usuario: Admin,
    contraseña: admin1     

    usuario: Dr.Lautaro,
    contraseña: medico1   

    usuario: Enf.Perez,
    contraseña: enfermero1  

    usuario: 'Rec.Angel',
    contraseña: recepcion1

Por el momento todos tendran la funcion del Recepcionista. Mas adelante cada usuario dependiendo de su rol tendra diferentes funcionalidades. Por ejemplo un enfermero o medico podra cargar los datos a un paciente que ingreso por Emergencia


*Descripción de las rutas principales (routes)*

_index.js: Ruta principal que redirige al formulario de login.

_login.js: Gestiona el login de usuarios. Muestra el formulario y procesa el inicio de sesión usando Passport.

_home.js: Muestra la página principal (home) del sistema, protegida para usuarios autenticados.

_recepcion.js: Gestiona toda la lógica de recepción de pacientes, búsqueda, registro, asignación de habitaciones y listado de pacientes internados. Y tambien se encuentra protegida para usuarios.

_turno.js: Permite la gestión de turnos médicos: generación y listado. Como tambien puede crear y/o actulizar pacientes y mutuales de pacientes.  

_paciente.js: (Actualmente sin funcionalidad relevante; no conecta con controladores activos.)

*Dependencias del proyecto*

_dotenv: Me permite cargar variables de entorno desde un archivo .env para la configuración sensible (como claves secretas y credenciales).

_express: Framework principal para crear el servidor web y definir rutas y middlewares.

_express-session: Me permite manejar las sesiones de usuario en Express, permitiendo login, logout y persistencia de sesión.

_mysql2: Driver para conectarse y trabajar con bases de datos MySQL desde Node.js.

_bcrypt: Para hashear y comparar contraseñas de usuarios de forma segura.

_passport: Middleware de autenticación para Node.js, facilita la implementación de login local y social.

_passport-local: Estrategia de Passport para autenticación con usuario y contraseña propios.

_pug: Es el motor de plantillas para renderizar vistas HTML dinámicas en el servidor.

_sequelize: ORM para Node.js que facilita la interacción con la base de datos MySQL usando modelos y asociaciones.

_sequelize-cli:Herramienta de línea de comandos para gestionar migraciones, modelos y seeders de Sequelize.

_nodemon (devDependency): Reinicia automáticamente el servidor al detectar cambios en el código durante el desarrollo.
