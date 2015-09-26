package main

type transactionConfirmRequest struct {
	// Optional, though if not defined then MERCHANT_TRANSCTION_ID is required to be defined.
	TRX_ID                  string
	MERCHANT_TRANSACTION_ID string
}
