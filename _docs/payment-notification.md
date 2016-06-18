---
layout: doc
title: Payment Notification
navigation_weight: 9
---

# Payment Notification

### Last milestone

When a confirmation request is made, and the client completes the payment process by accepting and
following the pop up instructions, a payment notification in form of a `POST` request is made to
{{ site.project_name }} from the MPESA G2 API.

---

How this happens is {{ site.project_name }} provide it's own `CALLBACK_URL` when making the
initialisation __Payment Request__. On a successful payment confirmation from the Merchant's client,
the MPESA G2 API will make a `HTTP POST` request to {{ site.project_name }} as a success notification
of the requested payment.

This POST request from the MPESA G2 API will be processed and {{ site.project_name }} will invoke a
`POST` request to the `MERCHANT_ENDPOINT` you configured when deploying {{ site.project_name }} with
the JSON payload - serialized - in the POST body.

---

### An Example of the MPESA G2 API POST request

For example, if your `MERCHANT_ENDPOINT` is `https://merchant-endpoint.com/mpesa/payment/complete`
then {{ site.project_name }} will make a `POST` request with the following JSON payload in the body.
Since the POST body only accepts strings, the JSON has to serialized - stringified.

#### Our extra payload

All the `extra_payload` provided when initialisation a payment request is usually sent back as a
BASE64 encrypted string value of the `ENC_PARAMS`. {{ site.project_name }} will decrypt this and
attach it to the POST request JSON payload as an object before all the payload is serialized to a
string.

#### The completion request made by {{ site.project_name }} to Merchant's endpoint

`POST` `https://merchant-endpoint.com/mpesa/payment`

The __POST__ body:

```text
"{"response":{"msisdn":"254723001575","amount":"450","mpesa_trx_date":"2014-12-01 16:24:06","mpesa_trx_id":"6jk45hsjdhjjky5hjk36wdsgha","trx_status":"success","return_code":"00","description":"success","merchant_transaction_id":"320903","trx_id":"ds9d7f98asf809d8f9098sa098f9008f8"}}"
```

How the JSON looks like __before serialization and after unserialization__:

```json
{
  "response": {
    "msisdn": "254723001575",
    "amount": "450",
    "mpesa_trx_date": "2014-12-01 16:24:06",
    "mpesa_trx_id": "6jk45hsjdhjjky5hjk36wdsgha",
    "trx_status": "success",
    "return_code": "00",
    "description": "success",
    "merchant_transaction_id": "320903",
    "trx_id": "ds9d7f98asf809d8f9098sa098f9008f8",
    "extra_payload": {
      "clientName": "Eugene Mutai",
      "clientLocation": "Kilimani",
      "delivery": "false"
    }
  }
}
```

> __NOTE__: The __JSON__ in the body is serialized and you are __required to parse/unserialize__ it before you can have
access to it's values.
