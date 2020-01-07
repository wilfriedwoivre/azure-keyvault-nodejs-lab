var express = require('express')
var router = express.Router();
const { ManagedIdentityCredential, ClientSecretCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const secret = process.env.CLIENT_SECRET;

const vaultName = process.env.KEYVAULT_NAME;
const vaultUri = `https://${vaultName}.vault.azure.net/`;


router.get('/', async function (req, res, next) {
    let credentials;

    if (process.env.USE_MSI) {
        credentials = new ManagedIdentityCredential();
    }
    else {
        credentials = new ClientSecretCredential(tenantId, clientId, secret);
    }

    let client = new SecretClient(vaultUri, credentials);
    let secrets = [];

    for await (const secret of client.listPropertiesOfSecrets()) {
        let secretData = await client.getSecret(secret.name);
        secrets.push({ name: secret.name, value: secretData.value })
    }

    res.render('keyvault', { title: 'List Azure Key Vault Secrets', secrets: secrets });
});

module.exports = router;