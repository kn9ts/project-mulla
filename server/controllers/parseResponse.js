export default class ParseResponse {
  constructor(soapResponse) {
    // Remove the XML header tag
    soapResponse = soapResponse.replace(/\<\?[\w\s\=\.\-\'\"]+\?\>/gmi, '');

    // Get the element PREFIXES from the soap wrapper
    let soapInstance = soapResponse.match(/(\<([\w\-]+\:[\w\-]+\s)([\w\=\-\:\"\'\\\/\.]+\s?)+?\>)/gi);
    let soapPrefixes = soapInstance[0].match(/((xmlns):[\w\-]+)+/gi);
    soapPrefixes = soapPrefixes.map((prefix) => {
      return prefix.split(':')[1].replace(/\s+/gi, '');
    });

    // Now clean the SOAP elements in the response
    soapPrefixes.forEach((prefix) => {
      soapResponse = soapResponse.replace(new RegExp(prefix + ':', 'gmi'), '');
    });

    // Remove xmlns from the soap wrapper
    soapResponse = soapResponse.replace(/(xmlns)\:/gmi, '');

    // lowercase and trim before returning it
    this.response = soapResponse.toLowerCase().trim();
  }
}
