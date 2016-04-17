// ucFirst (typeof String): returns the String in question but changes the First Character to an Upper case
module.exports = function(string) {
  var word = string,
    ucFirstWord = '';

  for (var x = 0, length = word.length; x < length; x++) {
    // get the character's ASCII code
    var character = word[x],
      // check to see if the character is capitalised/in uppercase using REGEX
      isUpperCase = /[A-Z]/g.test(character),
      asciiCode = character.charCodeAt(0);

    if ((asciiCode >= 65 && asciiCode <= (65 + 25)) || (asciiCode >= 97 && asciiCode <= (97 + 25))) {
      // If the 1st letter is not in uppercase
      if (!isUpperCase && x === 0) {
        // capitalize the letter, then convert it back to decimal value
        character = String.fromCharCode(asciiCode - 32);
      }
      // lowercase any of the letters that are not in the 1st postion that are in uppercase
      else if (isUpperCase && x > 0) {
        // lower case the letter, converting it back to decimal value
        character = String.fromCharCode(asciiCode + 32);
      }
    }

    ucFirstWord += character;
  }
  return ucFirstWord;
};
