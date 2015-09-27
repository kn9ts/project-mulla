package main

// TransactionConfirmRequest is used to construct a transaction confirmation SOAP/XML request
type TransactionConfirmRequest struct {
	// Optional, though if not defined then MERCHANT_TRANSCTION_ID is required to be defined.
	TRX_ID                  string
	MERCHANT_TRANSACTION_ID string
}
