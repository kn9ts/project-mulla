---
layout: doc
title: Deploy to App Engine
navigation_weight: 5
---

# Deploying to Google App Engine

## Requirements

Deploying {{ site.project_name }} to [Google App Engine](https://cloud.google.com/appengine/) is
fast and easy but there are a few requirements you’ll need to make sure have done to carry on
with the deployment.

1. You have a free [Google App Engine account](https://console.cloud.google.com/freetrial)
2. You have [**Node.js and npm**](https://nodejs.org/en/) installed locally.
3. You have installed the [Google Cloud SDK](https://cloud.google.com/sdk/docs/)

## Add deployment configurations in app.yaml

{% assign config = site.docs | where:"navigation_weight", 2 %}
In the [Configurations]({{ config[0].url | prepend: site.baseurl }}) step, I stated only add the block of code below in
your `app.yaml` config file if you plan to deploy the application to Google App Engine.

```yaml
# Your specific app environment variables
...

runtime: nodejs
vm: true

skip_files:
  - ^(.*/)?.*/node_modules/.*$
```

Your final `app.yaml` file should look something similar to this:

```yaml
env_variables:
  PAYBILL_NUMBER: '898998'
  PASSKEY: 'ab8d88186735405ab8d59f968ed4dab891588186735405ab8d59asku8'
  CALLBACK_URL: 'http://awesome-service.com/mpesa/confirm-checkout.php'
  CALLBACK_METHOD: 'POST'

runtime: nodejs
vm: true

skip_files:
  - ^(.*/)?.*/node_modules/.*$
```

## Testing locally

Google App Engine deploys and runs your application inside a docker container environment. It is
expected to perform as similar as running your application in a unix system. You may 1st ensure
everything is okay by running the tests.

```bash
# ensure everything is works as expected
$ npm test
```

```bash
# serve up the application one more time
$ npm start

> project-mulla@0.1.1 start ../project-mulla
> node index.js

Your secret session key is: 5f06b1f1-1bff-470d-8198-9ca2f18919c5
Express server listening on 8080, in development mode
```

## Deploy to Google App Engine

Once you have ensured all the tests have passed, your `app.yaml` file has the required
configurations variables and the app is running smoothly locally, deploy to App Engine using
the following command:

```bash
$ gclould preview deploy app
```

> Yes! It's that easy.
