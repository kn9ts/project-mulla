![](http://cdn.javascript.co.ke/images/banner.png)

> **What MPESA G2 API should have been in the 21st century.**

**MPESA API RESTful mediator**. Basically converts all merchant requests to the dreaded ancient SOAP/XML
requests. It then mediates all communications to and from the Safaricom MPESA gateway frictionlessly.
Responding to the merchant via a beautiful and soothing 21st century REST API.

In short, it'll deal with all of the SOAP shenanigans while you REST. 

The aim of **Project Mulla**, is to create a REST API that interfaces with the **ugly MPESA G2 API.**

### Yes We Know! SOAP! Yuck!

Developers should not go through the **trauma** involved with dealing with SOAP/XML in the 21st century.

# Example of how it works

Once **Project Mulla** is set up, up and running in whichever clould platform you prefer(we recommend `Heroku.com`). Your 1st request once your customer/client has consumed your services or purchasing products from you is to innitiate a payment request.

##### Initiate Payment Request:

_Method_: **`POST`** 

_Endpoint_: **`https://awesome-service.com/api/v1/payment/request`**

_Parameters_:
- **`phoneNumber`** - The phone number of your client
- **`totalAmount`** - The total amount you are charging the client
- **`referenceID`** - The reference ID of the order or service **[optional]**
- **`merchantTransactionID`** - This specific order's or service's transaction ID **[optional]**

__NOTE:__ If `merchantTransactionID` or `referenceID` are not provided a time-based and random 
UUID is generated for each respectively.

_Response:_

```http
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 510
Content-Type: application/json; charset=utf-8
Date: Sat, 21 May 2016 10:03:37 GMT
ETag: W/"1fe-jy66YehfhiFHWoyTNHpSnA"
X-Powered-By: Express
set-cookie: connect.sid=s:nc8L7qNbCJRKILyn7XLYf4IIg7_QuJIV.wuWGgb3r7XdQrkOF4P7GdzAY1HRZ0utmIfC6yW8%2BMuY; Path=/; HttpOnly

{
    "response": {
        "amount_in_double_float": "450.00", 
        "client_phone_number": "254723001575", 
        "cust_msg": "to complete this transaction, enter your bonga pin on your handset. if you don't have one dial *126*5# for instructions", 
        "description": "success", 
        "extra_payload": {}, 
        "status_code": 200, 
        "merchant_transaction_id": "c9bcf350-201e-11e6-a676-5984a015f2fd", 
        "message": "Transaction carried successfully", 
        "reference_id": "7d2c8f65-1228-4e6c-9b67-bb3b825c8441", 
        "return_code": "00", 
        "time_stamp": "20160522161208", 
        "trx_id": "45a3f4b64cde9d88440211187f73944b"
    }
}
```

# Installation

## Dependencies

You will need to install some stuff, if they are not yet in your machine:

##### Majors:

* **Node.js (v4.4.4 LTS)** - [Click here](http://nodejs.org) to install

##### Secondaries(click for further information):

* **NPM (v3.5+; bundled with node.js installation package)**

You may need to update it to the latest version:

```
$ npm update -g npm
```

## Getting Started

Once you have **Node.js** installed, run _(type or copy & paste; pick your poison)_:

**To download the boilerplate**

```bash
$ git clone https://github.com/kn9ts/project-mulla
```

After cloning, get into your project mulla's directory/folder:

```bash
$ cd project-mulla
```

**Install all of the projects dependecies with:**

```bash
$ npm install
```

**Create .env configurations file**

The last but not least step is creating a `.env` file with your configurations in the root directory of `project mulla`.

Should be in the same location as `index.js`

It should look like the example below, only with your specific config values:

```js
API_VERSION = 1
HOST = localhost
PORT = 3000
EXPRESS_SESSION_KEY = '88186735405ab8d59f968ed4dab89da5515'
WEB_TOKEN_SECRET = 'a7f3f061-197f-4d94-bcfc-0fa72fc2d897'
PAYBILL_NUMBER = '898998'
PASSKEY = 'ab8d88186735405ab8d59f968ed4dab891588186735405ab8d59asku8'
ENDPOINT = 'https://safaricom.co.ke/mpesa_online/lnmo_checkout_server.php?wsdl'
CALLBACK_URL = 'http://awesome-service.com/mpesa/confirm-checkout.php'
CALLBACK_METHOD = 'POST'
TEST_PHONENUMBER = '0720000000'
TEST_AMOUNT = '10.00'
```

__The `PAYBILL_NUMBER` and `PASSKEY` are provided by Safaricom once you have registered for the MPESA G2 API.__

*__PLEASE NOTE__: The details above only serve as examples*

#### It's now ready to launch

```bash
$ npm start

> project-mulla@0.1.1 start ../project-mulla
> node index.js

Express server listening on 3000, in development mode
```

#### Do a test run

You can make a test run using **CURL**:

```bash
$ curl -i -X POST \
  --url http://localhost:3000/api/v1/payment/request \
  --data 'phoneNumber=254723001575' \
  --data 'totalAmount=450.00' \
  --data 'clientName="Eugene Mutai"' \
  --data 'clientLocation=Kilimani' \
```

Or if you have [httpie](https://github.com/jkbrzt/httpie) installed:

```bash
$ http POST localhost:3000/api/v1/payment/request \
  phoneNumber=254723001575 \
  totalAmount=450.00 \
  clientName='Eugene Mutai' \
  clientLocation='Kilimani'
```

You should expect back a similar structured **response** as follows:

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
        "amount_in_double_float": "450.00",
        "client_phone_number": "254723001575",
        "cust_msg": "to complete this transaction, enter your bonga pin on your handset. if you don't have one dial *126*5# for instructions",
        "description": "success",
        "extra_payload": {},
        "status_code": 200,
        "merchant_transaction_id": "c9bcf350-201e-11e6-a676-5984a015f2fd",
        "message": "Transaction carried successfully",
        "reference_id": "7d2c8f65-1228-4e6c-9b67-bb3b825c8441",
        "return_code": "00",
        "time_stamp": "20160522161208",
        "trx_id": "45a3f4b64cde9d88440211187f73944b"
    }
}
```

# This project uses GPL3 LICENSE

**_TL;DR_*** Here's what the license entails:

```markdown
1. Anyone can copy, modify and distrubute this software.
2. You have to include the license and copyright notice with each and every distribution.
3. You can use this software privately.
4. You can use this sofware for commercial purposes.
5. If you dare build your business solely from this code, you risk open-sourcing the whole code base.
6. If you modifiy it, you have to indicate changes made to the code.
7. Any modifications of this code base MUST be distributed with the same license, GPLv3.
8. This sofware is provided without warranty.
9. The software author or license can not be held liable for any damages inflicted by the software.
```

More information on about the [LICENSE can be found here](http://choosealicense.com/licenses/gpl-3.0/)

**_PLEASE NOTE:_** All opinions aired in this repo are ours and do not reflect any company or organisation any contributor is involved with.*
