module.exports = function(app) {
    // Install a `/` route that returns app status
    var router = app.loopback.Router();
    router.get('/', app.loopback.status());
    app.use(router);
};
