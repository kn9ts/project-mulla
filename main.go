package main

import (
	"github.com/labstack/echo"
	middleware "github.com/labstack/echo/middleware"
	"net/http"
)

func main() {
	// Echo instance
	Echo := echo.New()
	Echo.SetDebug(true)

	// Middleware
	Echo.Use(middleware.Logger())
	Echo.Use(middleware.Recover())

	createRequest := Echo.Group("/v1/api")
	createRequest.Get("/checkout", func(context *echo.Context) error {
		soapEnvelope := NewEnvelope()
		context.Response().Header().Set(echo.ContentType, echo.ApplicationXML)
		context.Response().WriteHeader(http.StatusOK)
		context.Response().Write(soapEnvelope.processCheckoutRequest())
		return nil
	})

	createRequest.Get("/transaction/verify", func(context *echo.Context) error {
		soapEnvelope := NewEnvelope()
		context.Response().Header().Set(echo.ContentType, echo.ApplicationXML)
		context.Response().WriteHeader(http.StatusOK)
		context.Response().Write(soapEnvelope.transactionConfirmRequest(false))
		return nil
	})

	createRequest.Get("/transaction/status", func(context *echo.Context) error {
		soapEnvelope := NewEnvelope()
		context.Response().Header().Set(echo.ContentType, echo.ApplicationXML)
		context.Response().WriteHeader(http.StatusOK)
		context.Response().Write(soapEnvelope.transactionStatusRequest())
		return nil
	})

	createRequest.Get("/status", func(context *echo.Context) error {
		return context.String(200, "Hello world")
	})

	// Start server
	Echo.Run(":1300")
}
