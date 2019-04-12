module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    
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

    // Error por defecto del servidor
    return res.status(500).json({ message: err.message });
}