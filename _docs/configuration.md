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
  PAYBILL_NUMBER: '898998'
  PASSKEY: 'a8eac82d7ac1461ba0348b0cb24d3f8140d3afb9be864e56a10d7e8026eaed66'
  MERCHANT_ENDPOINT: 'http://merchant-endpoint.com/mpesa/payment/complete'

# Everything below is only relevant if you are looking
# to deploy Project Mulla to Google App Engine.
runtime: nodejs
vm: true

skip_files:
  - ^(.*/)?.*/node_modules/.*$
```

> __PLEASE NOTE:__ The `PAYBILL_NUMBER` and `PASSKEY` are provided by Safaricom once you have registered for the MPESA G2 API

> __PLEASE NOTE:__ The details above only serve as examples
