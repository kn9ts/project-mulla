package main

import (
	"bytes"
	"encoding/xml"
	// "fmt"
	"github.com/webconnex/xmlutil"
	"log"
)

// Envelope is the parent structure of a soap request
type Envelope struct {
	Header `xml:"SOAP-ENV:"`
	Body   `xml:"SOAP-ENV:"`
}

// Header is a child of Envelope
type Header struct {
	CheckOutHeader
}

// Body is a child of Envelope
type Body struct {
	processCheckoutRequest
	transactionConfirmRequest
	transactionStatusRequest
}

// CheckOutHeader is sent with every soap request
type CheckOutHeader struct {
	MERCHANT_ID string
	PASSWORD    string
	TIMESTAMP   string
}

// NewEnvelope creates a new SOAP request
func NewEnvelope() *Envelope {
	return &Envelope{}
}

// ProcessCheckoutRequest creates the SOAP XML to be sent in the request
func (soap *Envelope) ProcessCheckoutRequest() string {
	x := xmlutil.NewXmlUtil()
	x.RegisterNamespace("http://schemas.xmlsoap.org/soap/envelope/", "SOAP-ENV")

	x.RegisterTypeMore(Envelope{}, xml.Name{"http://schemas.xmlsoap.org/soap/envelope/", ""},
		[]xml.Attr{
			// ----------------- Adding Safaricom SOAP Configurations ------------------------
			// {xml.Name{"xmlns", "SOAP-ENV"}, "http://schemas.xmlsoap.org/soap/envelope/"},
			{xml.Name{"xmlns", "soapenv"}, "http://schemas.xmlsoap.org/soap/envelope/"},
			{xml.Name{"xmlns", "tns"}, "tns:ns"},
		})

	buf := new(bytes.Buffer)
	enc := x.NewEncoder(buf)

	env := &Envelope{Header{}, Body{}}

	if err := enc.Encode(env); err != nil {
		log.Fatal(err)
	}

	// Print request
	bs := buf.Bytes()
	bs = bytes.Replace(bs, []byte{'>', '<'}, []byte{'>', '\n', '<'}, -1)
	// fmt.Printf("%s\n\n", bs)
	return string(bs)
}
