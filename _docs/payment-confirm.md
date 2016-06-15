---
layout: doc
title: Confirm Payment
navigation_weight: 7
---

## Confirm Payment

Once you have requested a payment, and recieved a response that it has been created, you now are
required to confirm to SAG to process the payment requested. On confirmation it will trigger a pop
on your client's phone. You client will be required to key in his __BONGA POINTS PIN__ to complete
the payment process.

> Yes! I'm also wondering why not just his/her MPESA PIN

### Confirm your payment request:

__`GET`__ __`https://project-mulla-companyname.herokuapp.com/api/v1/payment/confirm/{trx_id}`__

### Sample request using CURL in the command line/terminal:

```bash
$ curl -i https://project-mulla-companyname.herokuapp.com/api/v1/payment/confirm/453c70c4b2434bd94bcbafb17518dc8e
```

### Expected Response

If all goes well you get HTTP status code **`200`** accompanied with the a similar structed JSON response:

```json
{
  "response": {
    "return_code": "00",
    "status_code": 200,
    "message": "Transaction carried successfully",
    "description": "success",
    "trx_id": "453c70c4b2434bd94bcbafb17518dc8e"
  }
}
```

This response accertains that the pop up has been triggered/pushed to the client's phone to complete
his/her owed payment to you/the merchant.

<br />
<img class="img-responsive" src="http://res.cloudinary.com/dpmk2cnpi/image/upload/c_scale,q_97,w_320/v1465975912/mpesa-api-ussd-pop-up_tcjsmi.jpg">
