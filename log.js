function log(req, res, next) {
    console.log(`${req.ip} - [${new Date().toISOString()}] "${req.method} ${req.originalUrl} HTTP/${req.httpVersion}" ${res.statusCode}`);
    next();
}

module.exports = log;