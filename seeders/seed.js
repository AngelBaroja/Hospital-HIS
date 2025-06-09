const Modelos = require('../models/modelosBD');
const { sequelize, Paciente, Recepcion, Motivo, Turno, Cama, Habitacion, Ala, Mutual, Empleado, Usuario, Mutual_Paciente } = Modelos;

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
  contacto_emergencia: '1122334455',
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
  contacto_emergencia: '1133445566',
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
  contacto_emergencia: '1144556677',
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
  contacto_emergencia: '1155667788',
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
  contacto_emergencia: '1166778899',
  provincia: 'Salta',
  localidad: 'Salta'
}]);
  console.log('Pacientes creados:', pacientes.length);

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

// Turnos
const turnos = await Turno.bulkCreate([
  { doctor: 'Dr. Smith', fecha_turno: new Date('2025-06-03'), hora: '9', id_paciente: 1 },
  { doctor: 'Dra. Johnson', fecha_turno: new Date('2025-06-03'), hora: '19', id_paciente: 2 },
  { doctor: 'Dr. Brown', fecha_turno: new Date('2025-06-03'), hora: '20', id_paciente: 3 },
  { doctor: 'Dra. Davis', fecha_turno: new Date('2025-06-03'), hora: '15', id_paciente: 4 },
  { doctor: 'Dr. Wilson', fecha_turno: new Date('2025-06-03'), hora: '10', id_paciente: 5 }
]);
console.log('Turnos creados:', turnos.length);

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
    { numero: 2, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 7 },
    { numero: 1, tipo: 'Reanimacion', estado: 'Libre', electrica: true, oxigeno: true, id_habitacion: 8 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: true, id_habitacion: 9},
    { numero: 2, tipo: 'UCI', estado: 'Libre', electrica: true, oxigeno: true, id_habitacion: 9 },
    { numero: 1, tipo: 'UCI', estado: 'Libre', electrica: true, oxigeno: true, id_habitacion: 10},
    { numero: 1, tipo: 'Reanimacion', estado: 'Libre', electrica: true, oxigeno: true, id_habitacion: 11},
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 12 },
    { numero: 2, tipo: 'Pediátrica', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 12},
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: true, id_habitacion: 13 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 14},
    { numero: 2, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 14 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 15 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 16 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 17 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 18 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 19 },
    { numero: 1, tipo: 'Normal', estado: 'Libre', electrica: false, oxigeno: false, id_habitacion: 20 },
    { numero: 1, tipo: 'UCI', estado: 'Libre', electrica: true, oxigeno: true, id_habitacion: 20 }
]);

console.log('Camas creadas:', camas.length);
process.exit(); 
}

seed();


