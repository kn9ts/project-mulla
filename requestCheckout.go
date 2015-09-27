package main

type ProcessCheckoutRequest struct {
	MERCHANT_TRANSACTION_ID string
	REFERENCE_ID            string
	AMOUNT                  string
	MSISDN                  string
	ENC_PARAMS              string // is Optional
	CALL_BACK_URL           string
	CALL_BACK_METHOD        string // xml, get, post
	TIMESTAMP               string
}
