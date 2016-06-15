---
layout: doc
title: Deploy to Heroku
navigation_weight: 4
---

# Deploying to Heroku

## Requirements

Deploying {{ site.project_name }} is fast and easy but there are a few requirements you’ll need
to make sure have done to carry on with the deployment.

1. You have a free [Heroku account](https://signup.heroku.com/signup/dc)
2. You have [**Node.js and npm**](https://nodejs.org/en/) installed locally.
3. You have installed the [Heroku Toolbelt](https://toolbelt.heroku.com/)

A key part of the toolbelt is the `heroku local` command, which can help in running your
applications locally.

## Testing locally with Heroku

{% assign config = site.docs | where:"navigation_weight", 2 %}
To be able to run the application locally you also need to create an `app.yaml` file with the
basic [custom configurations]({{ config[0].url | prepend: site.baseurl }}) variables specific to you.

```yaml
env_variables:
  PAYBILL_NUMBER: '898998'
  PASSKEY: 'a8eac82d7ac1461ba0348b0cb24d3f8140d3afb9be864e56a10d7e8026eaed66'
  MERCHANT_ENDPOINT: 'http://merchant-endpoint.com/mpesa/payment/complete'
```

> __NOTE__: YAML files use `2 spaces` strictly as indentation

Once you're done checking or creating the `app.yaml` file with your config, just run:

```bash
$ heroku local
[WARN] No ENV file found # Ignore this, the YAML config file takes care of this
6:31:02 PM web.1 |  Your secret session key is: a19e4cdb-a83a-4fa7-9efe-6fd3462af607
6:31:02 PM web.1 |  Express server listening on 5000, in development mode
```

## Everything is good, push to Heroku

Create an application instance in heroku:

```bash
$ heroku create [project-mulla-companyname]
```

The `app.yaml` is only used locally. If {{ site.project_name }} fails to find it's required
configurations in your app's Heroku global config vars it will crash. {{ site.project_name }}
requires you to set this in Heroku since it treats Heroku's environment as a `production` one.

Modify where required in the command below, then copy, paste and run in your command line/terminal
to set the required environment variables in Heroku.

```bash
# set required env config vars
$ heroku config:set \
PAYBILL_NUMBER='898998' \
PASSKEY='a8eac82d7ac1461ba0348b0cb24d3f8140d3afb9be864e56a10d7e8026eaed66' \
MERCHANT_ENDPOINT='http://merchant-endpoint.com/mpesa/payment/complete'
```

```bash
# check if your config vars have been
$ heroku config
```

Now the moment of truth, push the app Heroku.

```bash
$ git push heroku master
```

For the app to work smoothly, ensure you scale to at least one dyno (processor)

```bash
$ heroku ps:scale web=1
```

## Up and running

If all went well, your application should be up and running smoothly now. You can confirm this by
checking the log trail consoled by your app in Heroku.

```bash
$ heroku logs --tail
```

Or running:

```bash
$ curl -i -X POST \
--url http://project-mulla-companyname.herokuapp.com/api/v1/payment/request \
--data 'phoneNumber=254723001575' \
--data 'totalAmount=10.00' \
--data 'clientName="Eugene Mutai"' \
--data 'clientLocation=Kilimani' \
```

## Monitoring your Heroku deployment

You can add **Papertrail**, an application log management service to easily monitor the performance
and health of the mediator. The `FREE tier` offered by Papertrail does the job.

```bash
# add logging to keep track of your application performance
$ heroku addons:create papertrail
```

Open Papertrail from the command line/terminal any time using the command:

```bash
$ heroku addons:open papertrail
```
