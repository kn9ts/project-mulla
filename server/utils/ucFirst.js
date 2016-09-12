'use strict';
// ucFirst (typeof String):
// returns String with first character uppercased

module.exports = (string) => {
  const word = string;
  let ucFirstWord = '';

  for (let x = 0, length = word.length; x < length; x++) {
    // get the character's ASCII code
    let character = word[x];
      // check to see if the character is capitalised/in uppercase using REGEX
    const isUpperCase = /[A-Z]/g.test(character);
    const asciiCode = character.charCodeAt(0);

    if ((asciiCode >= 65 && asciiCode <= (65 + 25)) ||
     (asciiCode >= 97 && asciiCode <= (97 + 25))) {
      // If the 1st letter is not in uppercase
      if (!isUpperCase && x === 0) {
        // capitalize the letter, then convert it back to decimal value
        character = String.fromCharCode(asciiCode - 32);
      } else if (isUpperCase && x > 0) {
        // lowercase any of the letters that are not in the 1st postion that are in uppercase
        // lower case the letter, converting it back to decimal value
        character = String.fromCharCode(asciiCode + 32);
      }
    }

    ucFirstWord += character;
  }

  return ucFirstWord;
};
