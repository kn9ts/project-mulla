package main

import (
	"github.com/labstack/echo"
	middleware "github.com/labstack/echo/middleware"
	"net/http"
)

func mai2() {

	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Get("/", func(c *echo.Context) error {
		soap := NewEnvelope()
		return c.String(http.StatusOK, soap.ProcessCheckoutRequest())
	})

	// Start server
	e.Run(":1323")
}
