---
layout: doc
title: Configuration
navigation_weight: 2
---

# Configuration

## Create app.yaml configurations file

The last but not least step is creating a `app.yaml` file with your configurations in the root directory of `project-mulla`.

This is the same folder estate where `index.js` can be found.

It should look like the example below, only with your specific config values:

```yaml
env_variables:
  SESSION_SECRET_KEY: '88735405ab8d9f968ed4dab89da5515KadjaklJK238adnkLD32'
  PAYBILL_NUMBER: '898998'
  PASSKEY: 'ab8d88186735405ab8d59f968ed4dab891588186735405ab8d59asku8'
  ENDPOINT: 'https://safaricom.co.ke/mpesa_online/lnmo_checkout_server.php?wsdl'
  CALLBACK_URL: 'http://awesome-service.com/mpesa/confirm-checkout.php'
  CALLBACK_METHOD: 'POST'

# Everything below is only relevant if you are looking
# to deploy Project Mulla to Google App Engine.
runtime: nodejs
vm: true

skip_files:
  - ^(.*/)?.*/node_modules/.*$
```

> __PLEASE NOTE:__ The `PAYBILL_NUMBER` and `PASSKEY` are provided by Safaricom once you have registered for the MPESA G2 API

> __PLEASE NOTE:__ The details above only serve as examples
