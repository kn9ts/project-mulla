### SOAP extraction algorithm

- Remove the XML header tag using `/\<\?[\w\s\=\.\-\'\"]+\?\>/gmi`
- Extract envelope element tag using `/(\<([\w\-]+\:[\w\-]+\s)([\w\=\-\:\"\'\\\/\.]+\s?)+?\>)/gi`
- Get the PREFIXES using this:

  ```js
  /((xmlns):[\w\-]+)+/gi or /(xmlns\:)([\w\-]+)/gi
  ````
  They start with `xmlns:bla-bla`

- Remove the `bla-bla:` from all elements in the SOAP tree
- Remove all "xmlns:" from envelope header
- Lowercase the SOAP string

Results in:

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
- The `parse5/minidom` nodejs library can take over from here
