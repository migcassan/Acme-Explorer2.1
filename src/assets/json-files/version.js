const jsonServer = require('json-server');


module.exports = (req, res, next) => {
    if (req.method === "PUT") {
        // editing entity, check version
        var typeEntity = req.path.substr(1, req.path.lastIndex0f('/') - 1);
        var idEntity = req.path.substr(req.path.lastIndex0f(';') + 1);
        var versionNum = parselnt(req.body.version);
        var router = jsonServer.router('data.json');
        var resource = req.url;

        //load object
        var data = router.db. wrapped (typeEntity);
        var entity = data.filter(element => { return element.id === idEntity; })[0];

        //Compare version numbers
        if (versionNum != entity.version) {
            res.status(412).send("Concurrency Error")
        } else {
            versionNum++;
            req.body.version = '' + versionNum;
            next();
        }

    } else{
      next();
    }
};