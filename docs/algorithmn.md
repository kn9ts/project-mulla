### SOAP extraction algorithm

- Remove the XML header tag using `/\<\?[\w\s\=\.\-\'\"]+\?\>/gmi`
- Extract envelope element tag using `/(\<([\w\-]+\:[\w\-]+\s)([\w\=\-\:\"\'\\\/\.]+\s?)+?\>)/gi`
- Get the PREFIXES using this:

  ```js
  var re = (/((xmlns):[\w\-]+)+/gi || /(xmlns\:)([\w\-]+)/gi)
  ```
  They start with `xmlns:bla-bla`

- Remove the `bla-bla:` from all elements in the SOAP tree
- Remove all "xmlns:" from envelope header
- Lowercase the SOAP string

The response from SAG:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="tns:ns">
    <SOAP-ENV:Body>
        <ns1:processCheckOutResponse>
            <RETURN_CODE>34</RETURN_CODE>
            <DESCRIPTION>Failed. The system is experiencing delays. Please try again after 5 minutes.
            </DESCRIPTION>
            <TRX_ID/>
            <ENC_PARAMS></ENC_PARAMS>
            <CUST_MSG></CUST_MSG>
        </ns1:processCheckOutResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

The response parsed into a HTML fragment:

```html
<envelope soap-env="http://schemas.xmlsoap.org/soap/envelope/" ns1="tns:ns">
    <body>
        <processcheckoutresponse>
            <return_code>34</return_code>
            <description>failed. the system is experiencing delays. please try again after 5 minutes.
            </description>
            <trx_id/>
            <enc_params></enc_params>
            <cust_msg></cust_msg>
        </processcheckoutresponse>
    </body>
</envelope>
```

- Now we have a clean HTML-like tree
- The `cheerio` HTML node.js parsing library can take over from here
- We can then interpret the code sent back into a HTTP STATUS CODE.
