---
layout: doc
title: Check Payment Status
navigation_weight: 8
---

## Check Payment Status

To check the status of the payment transaction, you can make a `GET` request to the end point
`api/v1/payment/status/:trx_id` as follows:

__`GET`__ __`https://project-mulla-companyname.herokuapp.com/api/v1/payment/status/:trx_id`__

### Sample request using CURL in the command line/terminal:

```bash
$ curl -i https://project-mulla-companyname.herokuapp.com/api/v1/payment/status/453c70c4b2434bd94bcbafb17518dc8e
```

### Expected Response

If all goes well you get HTTP status code **`200`** accompanied with the a similar structed JSON response:

```json
{
  "response": {
    "return_code": "00",
    "status_code": 200,
    "message": "Transaction carried successfully",
    "trx_status": "pending",
    "trx_id": "453c70c4b2434bd94bcbafb17518dc8e",
    "msisdn": "254723001575",
    "amount": "45",
    "mpesa_trx_id": "n/a"
  }
}
```
