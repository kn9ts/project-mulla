---
layout: doc
title: Get Started
navigation_weight: 3
---

## Getting Started

## It's now ready to launch

1st run the command `npm test` in the console and see if everything is all good. Then run:

```bash
$ npm start

> project-mulla@0.1.1 start ../project-mulla
> node index.js

Your secret session key is: 5f06b1f1-1bff-470d-8198-9ca2f18919c5
Express server listening on 8080, in development mode
```

## Do a test run

Now make a test run using **CURL**:

```bash
$ curl -i -X POST \
  --url http://localhost:8080/api/v1/payment/request \
  --data 'phoneNumber=254723001575' \
  --data 'totalAmount=10.00' \
  --data 'clientName="Eugene Mutai"' \
  --data 'clientLocation=Kilimani' \
```

Or if you have [httpie](https://github.com/jkbrzt/httpie) installed, run:

```bash
$ http POST localhost:8080/api/v1/payment/request \
  phoneNumber='254723001575' \
  totalAmount='10.00' \
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

> __NOTE:__ [httpie](https://github.com/jkbrzt/httpie) returns a nice prettified response as the
above
