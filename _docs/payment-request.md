---
layout: doc
title: Request Payment
navigation_weight: 6
---

# Step by step process of making a payment transaction

## Request Payment

This is initial step is to tell the SAG to initialise a payment you want to transact. After
initialisation, you then make another request to the SAG as a confirmation prompt signaling the
SAG to process the payment request requested.

Assuming __{{ site.project_name }}__ is now your mediator, you'd now make a __POST__ request to
{{ site.project_name }}. _Not Safaricom_.

See below how you'd make this initial request:

### Initiate Payment Request:

__`POST`__ __`https://project-mulla-companyname.herokuapp.com/api/v1/payment/request`__

_Body Parameters_:

- `phoneNumber` - The phone number of your client
- `totalAmount` - The total amount you are charging the client
- `referenceID` [optional] - The reference ID of the order or service
- `merchantTransactionID` [optional] - This specific order's or service's transaction ID

> __NOTE:__ If `merchantTransactionID` or `referenceID` are not provided a time-based and random
UUID is generated for each respectively.

### Extra Body Parameters

Any extra **body parameters of the POST request** that is not part of the mandatory request
parameters will be considered to be **extra payload** and concatenated into one object before being
serialized and added as the `ENC_PARAMS` SOAP parameter.

It will then eventually be sent back to you as a BASE64 string through the **payment notification
POST request** made to your provided `MERCHANT_ENDPOINT`.

### Sample request using CURL in the command line/terminal:

```bash
$ curl -i -X POST \
--url http://project-mulla-companyname.herokuapp.com/api/v1/payment/request \
--data 'phoneNumber=254723001575' \
--data 'totalAmount=45.00' \
--data 'clientName="Eugene Mutai"' \
--data 'clientLocation=Kilimani' \
```

### Expected Response

If all goes well you get HTTP status code **`200`** accompanied with the a similar structed JSON response:

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
    "amount_in_double_float": "45.00",
    "client_phone_number": "254723001575",
    "extra_payload": {
      "clientName": "Eugene Mutai",
      "clientLocation": "Kilimani"
    },
    "time_stamp": "20160528234142"
  }
}

```

## Next step: confirmation

You are to use `trx_id` or `merchant_transaction_id` to make the confirmation payment
request. The confirmation request is the request the payment requested above to be processed and
triggers a pop up on the your client's mobile phone.
