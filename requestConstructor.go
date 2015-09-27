package main

import (
	"bytes"
	"encoding/xml"
	"fmt"
	"regexp"
	// "github.com/labstack/echo"
	"github.com/webconnex/xmlutil"
	"log"
	"strings"
)

// Envelope is the parent structure of a soap request
type Envelope struct {
	Header `xml:"soapenv:"`
	Body   `xml:"soapenv:"`
}

// Header is a child of Envelope
type Header struct {
	CheckOutHeader `xml:"tns:"`
}

// Body is a child of Envelope
type Body struct {
	ProcessCheckoutRequest    `xml:"tns:"`
	TransactionConfirmRequest `xml:"tns:"`
	TransactionStatusRequest  `xml:"tns:"`
}

// CheckOutHeader is sent with every soap request as the child of the Headerstruct
type CheckOutHeader struct {
	MERCHANT_ID string
	PASSWORD    string
	TIMESTAMP   string
}

var replaceNS = map[string][]string{
	"ProcessCheckoutRequest": []string{
		"tns:ProcessCheckoutRequest", "undefined",
	},
	"TransactionConfirmRequest": []string{
		"tns:TransactionConfirmRequest", "undefined",
	},
	"TransactionConfirmStatus": []string{
		"tns:TransactionStatusRequest", "undefined",
	},
}

// NewEnvelope creates a new SOAP request
func NewEnvelope() *Envelope {
	return &Envelope{}
}

func (soap *Envelope) newSoapEnvelope() *Envelope {
	return &Envelope{
		Header{
			CheckOutHeader{
				MERCHANT_ID: "8012092",
				PASSWORD:    "MmRmNTliMjIzNjJhNmI5ODVhZGU5OTAxY...",
				TIMESTAMP:   "20141128174717",
			},
		},
		Body{
			ProcessCheckoutRequest{},
			TransactionConfirmRequest{},
			TransactionStatusRequest{},
		},
	}
}

func (soap *Envelope) createSoapInstance() *xmlutil.XmlUtil {
	x := xmlutil.NewXmlUtil()

	// Register the name spaces used in the SOAP request
	x.RegisterNamespace("http://schemas.xmlsoap.org/soap/envelope/", "soapenv")
	x.RegisterNamespace("tns", "tns") // for body part

	x.RegisterTypeMore(Envelope{}, xml.Name{"http://schemas.xmlsoap.org/soap/envelope/", ""},
		[]xml.Attr{
			// ----------------- Adding Safaricom SOAP attributes ------------------------
			// {xml.Name{"xmlns", "SOAP-ENV"}, "http://schemas.xmlsoap.org/soap/envelope/"},
			{xml.Name{"xmlns", "soapenv"}, "http://schemas.xmlsoap.org/soap/envelope/"},
			{xml.Name{"xmlns", "tns"}, "tns:ns"},
		})

	// The body child path uses the tns: namespace
	x.RegisterTypeMore(Body{}, xml.Name{"tns", ""}, []xml.Attr{})
	return x
}

func (soap *Envelope) createBuffer(xmlRequest *Envelope) *bytes.Buffer {
	// 1st create the SOAP instance/boilerplate
	xmlInstance := soap.createSoapInstance()

	// now create a new buffer
	// instantiate a new xml encoder, encode the Envelop struct to xml,
	// writing to the xml buffer
	xmlBuffer := new(bytes.Buffer)
	xmlEncoder := xmlInstance.NewEncoder(xmlBuffer)

	if err := xmlEncoder.Encode(xmlRequest); err != nil {
		log.Fatal(err)
	}

	return xmlBuffer
}

// ProcessCheckoutRequest creates the SOAP XML to be sent in the request
func (soap *Envelope) processCheckoutRequest() []byte {

	xmlRequest := soap.newSoapEnvelope()
	xmlRequest.ProcessCheckoutRequest = ProcessCheckoutRequest{
		MERCHANT_TRANSACTION_ID: "911-000",
		REFERENCE_ID:            "1112254500",
		AMOUNT:                  "Some message stuff here to",
		MSISDN:                  "2547204871865",
		ENC_PARAMS:              "Description of the product", // is Optional
		CALL_BACK_METHOD:        "http://callback.com/callback",
		TIMESTAMP:               "20141128174717",
	}

	// create buffer, encoding the Envelope and writing to it
	xmBuffer := soap.createBuffer(xmlRequest)

	// removed unrequired namespaces from the XML request being constructed
	soapReponse := soap.cleanUpSoapRequest(xmBuffer, []string{
		"TransactionStatusRequest", "TransactionConfirmStatus",
	})

	return soapReponse
}

// transactionConfirmRequest creates the SOAP request to confirm a transaction should be carried out
func (soap *Envelope) transactionConfirmRequest(status bool) []byte {

	xmlRequest := soap.newSoapEnvelope()
	xmlRequest.TransactionConfirmRequest = TransactionConfirmRequest{
		TRX_ID:                  "shajhkhJKASJ23kasj321nxdjxlk1sakjJLjNda6778",
		MERCHANT_TRANSACTION_ID: "911-000",
	}

	// create buffer, encoding the Envelope and writing to it
	xmBuffer := soap.createBuffer(xmlRequest)

	// removed unrequired namespaces from the XML request being constructed
	soapReponse := soap.cleanUpSoapRequest(xmBuffer, []string{
		"ProcessCheckoutRequest", "TransactionStatusRequest",
	})

	// Are we checking for the transaction status instead
	if status == true {
		// -- TODO --
		// Convert the transactionConfirmRequest to transactionStatusRequest
	}

	return soapReponse
}

// transactionStatusRequest creates the SOAP request to check the progress of the transaction instantiated
func (soap *Envelope) transactionStatusRequest() []byte {

	xmlRequest := soap.newSoapEnvelope()
	xmlRequest.TransactionStatusRequest = TransactionStatusRequest{
		TRX_ID:                  "shajhkhJKASJ23kasj321nxdjxlk1sakjJLjNda6778",
		MERCHANT_TRANSACTION_ID: "911-000",
	}

	// create buffer, encoding the Envelope and writing to it
	xmBuffer := soap.createBuffer(xmlRequest)

	// removed unrequired namespaces from the XML request being constructed
	soapReponse := soap.cleanUpSoapRequest(xmBuffer, []string{
		"ProcessCheckoutRequest", "TransactionConfirmRequest",
	})

	return soapReponse
}

// cleanUpSoapRequest does some XML/SOAP structure cleaning to confirm with the SOAP structure required
func (soap *Envelope) cleanUpSoapRequest(buf *bytes.Buffer, namespaces []string) []byte {
	// Decapitialize the request body namespaces
	rs := strings.NewReplacer("Transaction", "transaction", "Process", "process")

	namespacesToRemove := make([]string, 4)
	for _, ns := range namespaces {
		namespacesToRemove = append(namespacesToRemove, replaceNS[ns]...)
	}

	// remove all unwanted nested XML tags and their children
	r := strings.NewReplacer(namespacesToRemove...)

	// convert to string, implementing the replacements after convertion
	soapBuffer := rs.Replace(r.Replace(buf.String()))
	soapResponse := regexp.MustCompile(`\<(undefined)\>[\w\s.-<>]+\<\/(undefined)\>`).ReplaceAllString(soapBuffer, "")
	// fmt.Println(soapResponse)
	fmt.Println(strings.Index(soapResponse, "undefined"))

	return []byte(soapResponse)
}
