var express = require('express')
var router = express.Router();


router.get('/', async function (req, res, next) {
    let secrets = [];

    res.render('keyvault', { title: 'List Azure Key Vault Secrets', secrets: secrets });
});

module.exports = router;