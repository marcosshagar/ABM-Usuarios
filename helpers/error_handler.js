//Marcos Shanahan

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    console.log("Ingreso a manejo de errores");
    console.log(err);
    if (typeof (err) === 'string') {
        // Errores de la aplicacion
        return res.status(400).json({ message: err }); 
    }

    if (err.name === 'ValidationError') {
        // Error de Validacion de mongoose
        return res.status(400).json({ message: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        // Error de Autorizacion de JWT
        return res.status(401).json({ message: 'Invalid Token' });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ message: err.message });
    }

    if (err.name === "Bad Request"){
       return res.status(err.status_code).json({ message: err.message });
    }

    if (err.name === "Forbidden") {
        return res.status(403).json({ message: err.message });
    }

    // Error por defecto del servidor
    return res.status(500).json({ message: err.message });
}
