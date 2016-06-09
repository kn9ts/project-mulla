[![Coverage Status](https://coveralls.io/repos/github/kn9ts/project-mulla/badge.svg?branch=master)](https://coveralls.io/github/kn9ts/project-mulla?branch=master)
[![Build Status](https://semaphoreci.com/api/v1/kn9ts/project-mulla/branches/master/badge.svg)](https://semaphoreci.com/kn9ts/project-mulla)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/bomb1e/project-mulla)
![](http://cdn.javascript.co.ke/images/banner.png)

> **What MPESA G2 API should have been in the 21st century.**

> **PLEASE NOTE: Mediates only C2B portion for now.**

**MPESA API RESTful mediator**. It transforms all merchant REST requests to the dreaded ancient SOAP/XML
requests. And transforms Safaricom MPESA G2 API gateway SOAP responses to JSON. 
Responding back to the merchant via a beautiful and soothing REST API.

In short, it'll deal with all of the SOAP shenanigans while you REST.

The aim of **Project Mulla** is to create a REST API middleman that interfaces with the **MPESA G2 API** for you.

### Yes We Know! SOAP! Yuck!

Developers should not go through the **trauma** involved with dealing with SOAP/XML in the 21st century.

# Example of how it works

Let's go ahead and make the 1st call, **ProcessCheckoutRequest**. This is initial step is to tell the SAG to 
initialise a payment request you want to transact. After initialisation, you then make another POST request to 
the SAG as a confirmation signal to carry out the actual payment/transaction request prior.

Assuming **Project Mulla** is now your mediator, you'd now make a **POST request to Project Mulla**. _Not Safaricom_. 

See below how you'd make this initial request:

##### Initiate Payment Request:

_Method_: **`POST`** 

_Endpoint_: **`https://your-project-mulla-endpoint.herokuapp.com/api/v1/payment/request`**

_Body Parameters_:

- **`phoneNumber`** - The phone number of your client
- **`totalAmount`** - The total amount you are charging the client
- **`referenceID`** - The reference ID of the order or service **[optional]**
- **`merchantTransactionID`** - This specific order's or service's transaction ID **[optional]**

_**NOTE:** If `merchantTransactionID` or `referenceID` are not provided a time-based and random 
UUID is generated for each respectively._

_The response you get:_

_**`HTTP HEADER META DATA`**_
```http
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 510
Content-Type: application/json; charset=utf-8
Date: Sat, 21 May 2016 10:03:37 GMT
ETag: W/"1fe-jy66YehfhiFHWoyTNHpSnA"
X-Powered-By: Express
set-cookie: connect.sid=s:nc8L7qNbCJRKILyn7XLYf4IIg7_QuJIV.wuWGgb3r7XdQrkOF4P7GdzAY1HRZ0utmIfC6yW8%2BMuY; Path=/; HttpOnly
```

_**`The JSON response in the BODY`**_
```json
{
  "response": {
    "return_code": "00",
    "status_code": 200,
    "message": "Transaction carried successfully",
    "trx_id": "453c70c4b2434bd94bcbafb17518dc8e",
    "description": "success",
    "cust_msg": "to complete this transaction, enter your bonga pin on your handset. if you don't have one dial *126*5# for instructions",
    "reference_id": "3e3beff0-fc05-417a-bbf2-190ee19a5e58",
    "merchant_transaction_id": "95d64500-2514-11e6-bcb8-a7f8e1c786c4",
    "amount_in_double_float": "10.00",
    "client_phone_number": "254723001575",
    "extra_payload": {},
    "time_stamp": "20160528234142"
  }
}
```

# Installation & Testing

## Dependencies

You will need to install some stuff, if they are not yet installed in your machine:

##### Majors:

* **Node.js (v4.3.2 or higher; LTS)** - [Click here](http://nodejs.org) to install

##### Secondaries(click for further information):

* **NPM (v3.5+; bundled with node.js installation package)**

If already installed you may need to only update it to the latest version:

```bash
$ npm update -g npm
```

## Getting Started

Once you have **Node.js (and NPM)** installed, run _(type or copy & paste; pick your poison)_:

**To clone/download the boilerplate**

```bash
$ git clone https://github.com/kn9ts/project-mulla
```

After cloning, get into your project mulla's directory/folder:

```bash
$ cd project-mulla
```

**Install all of the projects dependencies with:**

```bash
$ npm install
```

**Create `app.yaml` configurations file**

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

# Everything below from this point onwards are only relevant 
# if you are looking to deploy Project Mulla to Google App Engine.
runtime: nodejs
vm: true

skip_files:
  - ^(.*/)?.*/node_modules/.*$
```

*__PLEASE NOTE:__ The __`PAYBILL_NUMBER`__ and __`PASSKEY`__ are provided by Safaricom once you have registered for the MPESA G2 API.*

*__PLEASE NOTE:__ The details above only serve as examples*

#### It's now ready to launch

1st run the command `npm test` in the console and see if everything is all good. Then run:

```bash
$ npm start

> project-mulla@0.1.1 start ../project-mulla
> node index.js

Express server listening on 8080, in development mode
```

#### Do a test run

Now make a test run using **CURL**:

```bash
$ curl -i -X POST \
  --url http://localhost:8080/api/v1/payment/request \
  --data 'phoneNumber=254723001575' \
  --data 'totalAmount=10.00' \
  --data 'clientName="Eugene Mutai"' \
  --data 'clientLocation=Kilimani' \
```

Or if you have [httpie](https://github.com/jkbrzt/httpie) installed:

```bash
$ http POST localhost:8080/api/v1/payment/request \
  phoneNumber=254723001575 \
  totalAmount=10.00 \
  clientName='Eugene Mutai' \
  clientLocation='Kilimani'
```

Once the request is executed, your console should print a similar structured **response** as below:

```http
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 534
Content-Type: application/json; charset=utf-8
Date: Sun, 22 May 2016 13:12:09 GMT
ETag: W/"216-NgmF2VWb0PIkUOKfya6WlA"
X-Powered-By: Express
set-cookie: connect.sid=s:iWfXH7rbAvXz7cYgmurhGTHDn0LNBmNt; Path=/; HttpOnly

{
  "response": {
    "return_code": "00",
    "status_code": 200,
    "message": "Transaction carried successfully",
    "trx_id": "453c70c4b2434bd94bcbafb17518dc8e",
    "description": "success",
    "cust_msg": "to complete this transaction, enter your bonga pin on your handset. if you don't have one dial *126*5# for instructions",
    "reference_id": "3e3beff0-fc05-417a-bbf2-190ee19a5e58",
    "merchant_transaction_id": "95d64500-2514-11e6-bcb8-a7f8e1c786c4",
    "amount_in_double_float": "10.00",
    "client_phone_number": "254723001575",
    "extra_payload": {},
    "time_stamp": "20160528234142"
  }
}
```

# This project uses GPLv3 LICENSE

**_TL;DR_*** Here's what the license entails:

```markdown
1. Anyone can copy, modify and distribute this software.
2. You have to include the license and copyright notice with each and every distribution.
3. You can use this software privately.
4. You can use this software for commercial purposes.
5. If you dare build your business solely from this code, you risk open-sourcing the whole code base.
6. If you modify it, you have to indicate changes made to the code.
7. Any modifications of this code base MUST be distributed with the same license, GPLv3.
8. This software is provided without warranty.
9. The software author or license can not be held liable for any damages inflicted by the software.
```

More information on the [LICENSE can be found here](http://choosealicense.com/licenses/gpl-3.0/)

**_DISCLAIMER:_** _All opinions aired in this repo are ours and do not reflect any company or organisation any contributor is involved with._
