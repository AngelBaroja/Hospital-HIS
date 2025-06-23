const Modelos = require('../models/modelosBD');
const { sequelize, Paciente, Doctor, Enfermero, Recepcionista, Especialidad, Recepcion, Motivo, Turno, Cama, Habitacion, Ala, Mutual, Usuario, Mutual_Paciente, Contacto_Emergencia} = Modelos;
const bcrypt = require('bcrypt');

async function seed() {
  await sequelize.sync({ force: true });
    //Mutuales
    const mutuales = await Mutual.bulkCreate([
        {nombre: 'OSDE'},
        {nombre: 'Galeno'},
        {nombre: 'Swiss Medical'},
        {nombre: 'PAMI'},
        {nombre: 'Sancor Salud'},
        {nombre: 'MEOC'}
    ]);
    console.log('Mutuales creadas:', mutuales.length);

  // Pacientes
  const pacientes = await Paciente.bulkCreate([
{
  nombre: 'Juan',
  apellido: 'Pérez',
  dni: '12345678',
  fecha_nacimiento: new Date('1990-05-15'),
  genero: 'Masculino',
  direccion: 'Calle Falsa 123',
  contacto: '1122334455',
  provincia: 'Buenos Aires',
  localidad: 'La Plata'  
},
{
  nombre: 'María',
  apellido: 'Gómez',
  dni: '23456789',
  fecha_nacimiento: new Date('1985-10-20'),
  genero: 'Femenino',
  direccion: 'Av. Siempre Viva 742',
  contacto: '1133445566',
  provincia: 'Córdoba',
  localidad: 'Córdoba'
},
{
  nombre: 'Carlos',
  apellido: 'López',
  dni: '34567890',
  fecha_nacimiento: new Date('1978-03-12'),
  genero: 'Masculino',
  direccion: 'San Martín 456',
  contacto: '1144556677',
  provincia: 'Santa Fe',
  localidad: 'Rosario'
},
{
  nombre: 'Ana',
  apellido: 'Martínez',
  dni: '45678901',
  fecha_nacimiento: new Date('1995-07-08'),
  genero: 'Femenino',
  direccion: 'Belgrano 789',
  contacto: '1155667788',
  provincia: 'Mendoza',
  localidad: 'Mendoza'
},
{
  nombre: 'Lucía',
  apellido: 'Fernández',
  dni: '56789012',
  fecha_nacimiento: new Date('2000-12-01'),
  genero: 'Femenino',
  direccion: 'Mitre 321',
  contacto: '1166778899',
  provincia: 'Salta',
  localidad: 'Salta'
}]);
  console.log('Pacientes creados:', pacientes.length);

// Contactos de emergencia
const contactosEmergencia = await Contacto_Emergencia.bulkCreate([
  { numero: '1122334455', id_paciente: 1 },
  { numero: '1133445566', id_paciente: 1 },
  { numero: '1144556677', id_paciente: 1 },
  { numero: '1155667788', id_paciente: 4 },
  { numero: '1166778899', id_paciente: 5 }
]);
console.log('Contactos de emergencia creados:', contactosEmergencia.length);

//Mutuales_Pacientes
const mutualesPacientes = await Mutual_Paciente.bulkCreate([
{
    id_paciente: 1,
    id_mutual: 1,
    codigo_mutual: "1000",
    tipo_cobertura: "Basico",
    activa: true
},
{
    id_paciente:2,
    id_mutual: 2,
    codigo_mutual: "1001",
    tipo_cobertura: "Completo",
    activa: true
},
{
    id_paciente: 3,
    id_mutual: 3,
    codigo_mutual: "1002",
    tipo_cobertura: "Premium",
    activa: true
},
{
    id_paciente: 4,
    id_mutual: 4,
    codigo_mutual: "1003",
    tipo_cobertura: "Basico",
    activa: true
},
{
    id_paciente: 5,
    id_mutual: 5,
    codigo_mutual: "1004",
    tipo_cobertura: "Completo",
    activa: true
}
]);
console.log('Mutuales_Pacientes creados:', mutualesPacientes.length);

// Motivos de internación generales
const motivos = await Motivo.bulkCreate([
    { tipos: 'ACV' },
    { tipos: 'Accidente' },
    { tipos: 'Aislamiento' },
    { tipos: 'Complicaciones post-parto' },
    { tipos: 'Control post-operatorio' },
    { tipos: 'Crisis hipertensiva' },
    { tipos: 'Cuidados paliativos' },
    { tipos: 'Descompensación' },
    { tipos: 'Deshidratación' },
    { tipos: 'Enfermedad cardiovascular' },
    { tipos: 'Enfermedad respiratoria' },
    { tipos: 'Estudios diagnósticos' },
    { tipos: 'Fractura' },
    { tipos: 'Hemorragia interna' },
    { tipos: 'Infección' },
    { tipos: 'Insuficiencia renal' },
    { tipos: 'Intoxicación' },
    { tipos: 'Parto' },
    { tipos: 'Psiquiatría' },
    { tipos: 'Quemaduras' },
    { tipos: 'Rehabilitación' },
    { tipos: 'Shock séptico' },
    { tipos: 'Transplante' },
    { tipos: 'Tratamiento oncológico' }
]);
console.log('Motivos creados:', motivos.length);

// Turnos
const turnos = await Turno.bulkCreate([
  { doctor: 'Dr. Smith', fecha_turno: new Date('2025-06-03'), hora: '9', id_paciente: 1 },
  { doctor: 'Dra. Johnson', fecha_turno: new Date('2025-06-03'), hora: '19', id_paciente: 2 },
  { doctor: 'Dr. Brown', fecha_turno: new Date('2025-06-03'), hora: '20', id_paciente: 3 },
  { doctor: 'Dra. Davis', fecha_turno: new Date('2025-06-03'), hora: '15', id_paciente: 4 },
  { doctor: 'Dr. Wilson', fecha_turno: new Date('2025-06-03'), hora: '10', id_paciente: 5 }
]);
console.log('Turnos creados:', turnos.length);

// Alas
const alas = await Ala.bulkCreate([
    { sector: 'Norte', descripcion: 'Ala principal del hospital', activo: true },
    { sector: 'Sur', descripcion: 'Ala secundaria del hospital', activo: true },
    { sector: 'Este', descripcion: 'Ala de cuidados intensivos', activo: true },
    { sector: 'Oeste', descripcion: 'Ala de maternidad', activo: true }
]);
console.log('Alas creadas:', alas.length);

// Habitaciones
const habitaciones = await Habitacion.bulkCreate([
    { numero: '101', tipo: 'Individual',  activa: true, id_ala: 1 },
    { numero: '102', tipo: 'Compartida',  activa: true, id_ala: 1 },
    { numero: '103', tipo: 'Individual',  activa: true, id_ala: 1 },
    { numero: '104', tipo: 'Compartida',  activa: true, id_ala: 2 },
    { numero: '105', tipo: 'Individual',  activa: true, id_ala: 2 },
    { numero: '106', tipo: 'Individual',  activa: true, id_ala: 2 },
    { numero: '107', tipo: 'Compartida',  activa: true, id_ala: 2 },
    { numero: '108', tipo: 'Individual',  activa: true, id_ala: 3 },
    { numero: '109', tipo: 'Compartida',  activa: true, id_ala: 3 },
    { numero: '110', tipo: 'Individual',  activa: true, id_ala: 3 },
    { numero: '111', tipo: 'Individual',  activa: true, id_ala: 3 },
    { numero: '112', tipo: 'Compartida',  activa: true, id_ala: 4 },
    { numero: '113', tipo: 'Individual',  activa: true, id_ala: 4 },
    { numero: '114', tipo: 'Compartida',  activa: true, id_ala: 4 },
    { numero: '115', tipo: 'Individual',  activa: true, id_ala: 4 },
    { numero: '116', tipo: 'Individual',  activa: true, id_ala: 1 },
    { numero: '117', tipo: 'Individual',  activa: true, id_ala: 2 },
    { numero: '118', tipo: 'Individual',  activa: true, id_ala: 3 },
    { numero: '119', tipo: 'Individual',  activa: true, id_ala: 4 },
    { numero: '120', tipo: 'Compartida',  activa: true, id_ala: 1 }
]);
console.log('Habitaciones creadas:', habitaciones.length);

// Camas
const camas = await Cama.bulkCreate([
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 1},
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: true, id_habitacion: 2 },
    { numero: 2, tipo: 'UCI', estado: 'Libre', electrica: true, oxigeno: true, id_habitacion: 2 },
    { numero: 1, tipo: 'UCI', estado: 'Libre', electrica: true, oxigeno: true, id_habitacion: 3 },
    { numero: 1, tipo: 'Reanimacion', estado: 'Libre', electrica: true, oxigeno: true, id_habitacion: 4},
    { numero: 2, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 4 },
    { numero: 1, tipo: 'Pediátrica', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 5 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: true, id_habitacion: 6},
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 7 },
    { numero: 2, tipo: 'Normal', estado: 'Ocupada', electrica: false, oxigeno: false, id_habitacion: 7 },
    { numero: 1, tipo: 'Reanimacion', estado: 'Libre', electrica: true, oxigeno: true, id_habitacion: 8 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: true, id_habitacion: 9},
    { numero: 2, tipo: 'UCI', estado: 'Libre', electrica: true, oxigeno: true, id_habitacion: 9 },
    { numero: 1, tipo: 'UCI', estado: 'Libre', electrica: true, oxigeno: true, id_habitacion: 10},
    { numero: 1, tipo: 'Reanimacion', estado: 'Ocupada', electrica: true, oxigeno: true, id_habitacion: 11},
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 12 },
    { numero: 2, tipo: 'Pediátrica', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 12},
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: true, id_habitacion: 13 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 14},
    { numero: 2, tipo: 'Normal', estado: 'Ocupada', electrica: false, oxigeno: false, id_habitacion: 14 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 15 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 16 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 17 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 18 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 19 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 20 },
    { numero: 1, tipo: 'UCI', estado: 'Libre', electrica: true, oxigeno: true, id_habitacion: 20 }
]);
console.log('Camas creadas:', camas.length);

// Recepciones
const recepciones = await Recepcion.bulkCreate([
  {
    tipo: 'Cita Programada',
    detalle_motivo: 'Consulta de rutina',
    hora: 10,
    fecha_entrada: new Date('2025-06-01'),
    estado: 'Internado',
    id_paciente: 3,
    id_cama: 20,
    id_motivo: 12
  },
  {
    tipo: 'Emergencia',
    detalle_motivo: 'Dolor agudo en el pecho',
    hora: 12,
    fecha_entrada: new Date('2025-06-02'),
    estado: 'Internado',
    id_paciente: 4,
    id_cama: 15,
    id_motivo: 2
  },
  {
    tipo: 'Derivacion',
    detalle_motivo: 'Mareaos y desmayos',
    hora: 14,
    fecha_entrada: new Date('2025-06-03'),
    estado: 'Internado',
    id_paciente: 5,
    id_cama: 10,
    id_motivo: 6
  }
]);
console.log('Recepciones creadas:', recepciones.length);


// Especialidades
const especialidades = await Especialidad.bulkCreate([
    { tipo: 'Cardiologia' },
    { tipo: 'Pediatria' },
    { tipo: 'Traumatologia' },
    { tipo: 'Ginecologia' },
    { tipo: 'Neurologia' },
    { tipo: 'Oncologia' },
    { tipo: 'Psiquiatria' },
    { tipo: 'Dermatologia' },
    { tipo: 'Oftalmologia' },
    { tipo: 'Otorrinolaringologia' },
    { tipo: 'Endocrinologia' },
    { tipo: 'Gastroenterologia' },
    { tipo: 'Nefrologia' },
    { tipo: 'Infectologia' },
    { tipo: 'Reumatologia' },
    { tipo: 'Medicina General' },
    { tipo: 'Enfermeria pediatrica' },
    { tipo: 'Enfermeria geriatrica' },
    { tipo: 'Enfermeria obstetrica' },
    { tipo: 'Enfermeria quirurgica' },
    { tipo: 'Enfermeria en cuidados intensivos' },
    { tipo: 'Enfermeria en emergencias' }
]);
console.log('Especialidades creadas:', especialidades.length);

// Hashear contraseñas
    const saltRounds = 10;
    const passwordDoctor = await bcrypt.hash('doctor1', saltRounds);
    const passwordEnfermero = await bcrypt.hash('enfermero1', saltRounds);
    const passwordRecepcion = await bcrypt.hash('recepcion1', saltRounds);

  // Crear usuarios
  const usuarios = await Usuario.bulkCreate([
    {
      usuario: 'Dr.Lautaro',
      contraseña: passwordDoctor   
    },
    {
      usuario: 'Enf.Perez',
      contraseña: passwordEnfermero   
    },
    {
      usuario: 'Rec.Angel',
      contraseña: passwordRecepcion
    }
  ]);
  console.log('Usuarios creados:', usuarios.length);

  // Crear empleados asociados
  // Doctores
  const doctores = await Doctor.bulkCreate([
    {
      nombre: 'Lautaro',
      apellido: 'González',    
      dni: '33356789',
      genero: 'Masculino',
      direccion: 'Sucre 1254',
      telefono: '2657111050',
      provincia: 'San Luis',
      localidad: 'Villa Mercedes',
      activo: true,
      id_usuario: 1,
      id_especialidad: 1     
    }
  ]);
  console.log('Doctores creados:', doctores.length);

  // Enfermeros
  const enfermero = await Enfermero.bulkCreate([
    {
      nombre: 'Fernanda',
      apellido: 'Pérez',    
      dni: '34567890',
      genero: 'Femenino',
      direccion: 'Belgrano 500',
      telefono: '2664522325',
      provincia: 'Buenos Aires',
      localidad: 'Quilmes',
      activo: true,
      id_usuario: 2,
      id_especialidad: 16
    }
  ]);
  console.log('Enfermero creados:', enfermero.length);

  // Recepcionistas
  const recepcionista = await Recepcionista.bulkCreate([
    {
      nombre: 'Angel',
      apellido: 'Baroja',
      dni: '39137714',
      genero: 'Masculino',
      direccion: 'Belgrano 1200',
      telefono: '2657507376',
      provincia: 'San Luis',
      localidad: 'Villa Mercedes',
      activo: true,
      id_usuario: 3,
    }
  ]);
  console.log('Recepcionista creados:', recepcionista.length);

process.exit(); 
}

seed();


