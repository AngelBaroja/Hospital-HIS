function requiereSesion(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function requiereAdministrador(req, res, next) {
    if (
        req.session.tipoUsuario === "Administrador" ||
        req.session.tipoUsuario === "Administradora"
    ) {
        return next();
    }
     return res.status(403).render('accesoNoAutorizado',{
      mensaje: `Lo sentimos, ${req.session.tipoUsuario} ${req.session.nombreUsuario} usted 
      no tiene permisos para acceder a esta sección.`
     });
}

function requiereDoctor(req, res, next) {

    const rol = req.session.tipoUsuario;

    if (
        req.session.tipoUsuario ===  "Doctora" ||
        req.session.tipoUsuario ===  "Doctor"
    ) {
        return next();
    }

    return res.status(403).render('accesoNoAutorizado',{
      mensaje: `Lo sentimos, ${req.session.tipoUsuario} ${req.session.nombreUsuario} usted 
      no tiene permisos para acceder a esta sección.`
     });
}

function requiereEnfermeria(req, res, next) {

    const rol = req.session.tipoUsuario;

    if (
        req.session.tipoUsuario ===  "Enfermero" ||
        req.session.tipoUsuario ===  "Enfermera" ||
        req.session.tipoUsuario ===  "Doctora" ||
        req.session.tipoUsuario ===  "Doctor"
    ) {
        return next();
    }

     return res.status(403).render('accesoNoAutorizado',{
      mensaje: `Lo sentimos, ${req.session.tipoUsuario} ${req.session.nombreUsuario} usted 
      no tiene permisos para acceder a esta sección.`
     });
}

function requiereRecepcionista(req, res, next) {

    const rol = req.session.tipoUsuario;

    if (
        req.session.tipoUsuario ===  "Recepcionista" 
    ) {
        return next();
    }

    return res.status(403).render('accesoNoAutorizado',{
      mensaje: `Lo sentimos, ${req.session.tipoUsuario} ${req.session.nombreUsuario} usted 
      no tiene permisos para acceder a esta sección.`
     });
}

module.exports = { requiereSesion, requiereAdministrador, requiereDoctor, requiereEnfermeria, requiereRecepcionista };