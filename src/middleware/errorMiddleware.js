const multer = require("multer");


const errorHandler = (err, req, res, next) => {
    console.error(err.message);
    console.error(err.stack || '');
    const status = err.status || 500;

    if( err instanceof multer.MulterError ){
        res.status(400).json(`Invalid file type of too large file`);
    }

    res.status(status).json({
        error: err.message
    });

    next();
    
}


module.exports = errorHandler;