# Project Mulla

__What MPESA G2 API should have been in the 21st century.__

__MPESA API RESTful mediator__. Basically converts all merchant requests to the dreaded ancient SOAP/XML
requests. It then mediates all communications to and from the Safaricom MPESA gateway frictionlessly.
Responding to the merchant via a beautiful and soothing 21st century REST API.

In short, it'll deal with all of the SOAP shenanigans while you REST. 😄

The aim of __Project Mulla__, is to create a REST API that interfaces with the __ugly MPESA G2 API.__

### Yes We Know! SOAP! Yuck!

Developers should not go through the __trauma__ involved with dealing with SOAP/XML in the 21st century.

# Example of how it works

Once __Project Mulla__ is set up, up and running in whichever clould platform you prefer(we recommend `Heroku.com`). Your 1st request once your customer/client has consumed your services or purchasing products from you is to innitiate a payment request.

##### Initiate Payment Request:

_Method_: __`POST`__ 

_Endpoint_: __`https://awesome-service.com/api/v1/payment/request`__

_Parameters_:
- __`phoneNumber`__ - The phone number of your client
- __`totalAmount`__ - The total amount you are charging the client
- __`referenceID`__ - The reference ID of the order or service __[optional; one is provided for you if missing]__
- __`merchantTransactionID`__ - This specific order's or service's transaction ID __[optional; one is provided for you if missing]__

_Response:_

```http
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 510
Content-Type: application/json; charset=utf-8
Date: Sat, 21 May 2016 10:03:37 GMT
ETag: W/"1fe-jy66YehfhiFHWoyTNHpSnA"
X-Powered-By: Express
set-cookie: connect.sid=s%3Anc8L7qNbCJRKILyn7XLYf4IIg7_QuJIV.wuWGgb3r7XdQrkOF4P7GdzAY1HRZ0utmIfC6yW8%2BMuY; Path=/; HttpOnly

{
    "amountInDoubleFloat": "10.00", 
    "clientPhoneNumber": "0723001575", 
    "cust_msg": "to complete this transaction, enter your bonga pin on your handset. if you don't have one dial *126*5# for instructions", 
    "description": "success", 
    "extraPayload": "{}", 
    "http_code": 200, 
    "merchantTransactionID": "4938a780-1f3b-11e6-acc6-5dabc98661b9", 
    "message": "Transaction carried successfully", 
    "referenceID": "f765b1ef-6890-44f2-bc7a-9be23013da1c", 
    "return_code": "00", 
    "timeStamp": "20160521130337",
    "trx_id": "6c1b1dcc796ed6c1d5ea6d03d34ddb7f"
}
```

# This project uses GPL3 LICENSE

__*TL;DR*__ Here's what the license entails:

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

*__PLEASE NOTE:__ All opinions aired in this repo are ours and do not reflect any company or organisation any contributor is involved with.*
