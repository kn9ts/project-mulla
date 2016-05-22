'use strict';
const cheerio = require('cheerio');
const _ = require('lodash');
const statusCodes = require('../config/statusCodes');


module.exports = class ParseResponse {
  constructor(bodyTagName) {
    this.bodyTagName = bodyTagName;
  }

  parse(soapResponse) {
    let XMLHeader = /\<\?[\w\s\=\.\-\'\"]+\?\>/gi;
    let soapHeaderPrefixes = /(\<([\w\-]+\:[\w\-]+\s)([\w\=\-\:\"\'\\\/\.]+\s?)+?\>)/gi;

    // Remove the XML header tag
    soapResponse = soapResponse.replace(XMLHeader, '');

    // Get the element PREFIXES from the soap wrapper
    let soapInstance = soapResponse.match(soapHeaderPrefixes);
    let soapPrefixes = soapInstance[0].match(/((xmlns):[\w\-]+)+/gi);
    soapPrefixes = soapPrefixes.map(prefix => prefix.split(':')[1].replace(/\s+/gi, ''));

    // Now clean the SOAP elements in the response
    soapPrefixes.forEach(prefix => {
      let xmlPrefixes = new RegExp(prefix + ':', 'gmi');
      soapResponse = soapResponse.replace(xmlPrefixes, '');
    });

    // Remove xmlns from the soap wrapper
    soapResponse = soapResponse.replace(/(xmlns)\:/gmi, '');

    // lowercase and trim before returning it
    this.response = soapResponse.toLowerCase().trim();
    return this;
  }

  toJSON() {
    this.json = {};
    let $ = cheerio.load(this.response, { xmlMode: true });

    // Get the children tagName and its values
    $(this.bodyTagName).children().each((i, el) => {
      // if (el.children.length > 1) return;
      if (el.children.length === 1) {
        // console.log(el.name, el.children[0].data);
        let value = el.children[0].data.replace(/\s{2,}/gi, ' ');
        value = value.replace(/\n/gi, '').trim();
        this.json[el.name] = value;
      }
    });

    // Unserialise the ENC_PARAMS value
    if ('enc_params' in this.json) {
      this.json.enc_params = JSON.parse(this.json.enc_params);
    }

    // Get the equivalent HTTP CODE to respond with
    this.json = _.assignIn(this.extractCode(), this.json);
    return this.json;
  }

  extractCode() {
    return _.find(statusCodes, (o) => o.return_code == this.json.return_code);
  }
}
