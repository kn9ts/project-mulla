import cheerio from 'cheerio';

export default class ParseResponse {
  constructor(soapResponse) {
    // console.log(soapResponse);
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

  toJSON() {
    // console.log(this.response);
    let soapTree = cheerio.load(this.response, {
      xmlMode: true
    });

    let JSON = {};
    soapTree('processcheckoutresponse').children().each((i, el) => {
      if (el.children.length > 1) {
        console.log('Has more than one child.');
      }

      if (el.children.length === 1) {
        // console.log(el.name, el.children[0].data);
        JSON[el.name] = el.children[0].data;
      }
    });

    return JSON;
  }
}
