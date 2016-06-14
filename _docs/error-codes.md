---
layout: doc
title: Error Handling
navigation_weight: 10
---

## HTTP Status codes translated to M-PESA API Error Codes

{{ site.project_name }} uses conventional HTTP response codes to indicate the success or failure of
an API request. In general, codes in the 2xx range indicate success, codes in the 4xx range indicate
an error that failed given the information provided (e.g. a required parameter was omitted, a charge failed, etc.),
and codes in the 5xx range indicate an error with {{ site.project_name }}'s servers (these are seldom).

> __REFERENCE__: `HTTP status code` => `MPESA G2 API SOAP status code` => Descriptionof the error]

## 2xx - Successful

### Successful

- __`200`__ => `00` => The Request has been successfully received or the transaction has successfully completed.

---

## 4xx - Client Error

### Bad requests(incorrect/missing detials)

- __`400`__ => `09` => The store number specified in the transaction could not be found. This happens if the Merchant Pay bill number was incorrectly captured during registration.
- __`400`__ => `10` => This occurs when the system is unable to resolve the credit account i.e the MSISDN provided isn’t registered on M-PESA
- __`400`__ => `30` => Returned when the request is missing reference ID
- __`400`__ => `31` => Returned when the request amount is Invalid or blank
- __`400`__ => `36` => Response given if incorrect credentials are provided in the request (incorrent merchant info)
- __`400`__ => `40` => Missing parameters
- __`400`__ => `41` => MSISDN(phone no.) is in incorrect format

### Unauthorised

- __`401`__ => `32` => Returned when the account in the request hasn’t been activated. (unactivated)
- __`401`__ => `33` => Returned when the account hasn’t been approved to transact. (unapproved to transact)

### Payment required, details are ok, but still fails

- __`402`__ => `01` => Insufficient Funds on MSISDN account
- __`402`__ => `03` => Amount less than the minimum single transfer allowed on the system.
- __`402`__ => `04` => Amount more than the maximum single transfer amount allowed.
- __`402`__ => `08` => Balance would rise above the allowed maximum amount. This happens if the MSISDN has reached its maximum transaction limit for the day.

### Conflict found

- __`409`__ => `35` => Response when a duplicate request is detected.
- __`409`__ => `12` => Message returned when the transaction details are different from original captured request details.

---

## 5xx - Server Error

### Service Unavailable

- __`503`__ => `06` => Transaction could not be confirmed possibly due to confirm operation failure.
- __`503`__ => `11` => This message is returned when the system is unable to complete the transaction.
- __`503`__ => `34` => Returned when there is a request processing delay.
- __`503`__ => `29` => System Downtime message when the system is inaccessible.

### Gateway Timeout

- __`504`__ => `05` => Transaction expired in the instance where it wasn’t picked in time for processing.
