var common_char_list = require('chinese-simplified-common-characters');
var Picker = {};
(function (Picker) {
  Picker.gen_result = function(pos, word) {
    var list = [];
    for (var i = 0; i < 100; i++) {
      if (word.length == 0) {
        list.push(getRandomChar() + getRandomChar());
      }
      else {
        if (pos == 1)
          list.push(getRandomChar(word) + getRandomChar());
        else
          list.push(getRandomChar() + getRandomChar(word));
      }
    }
    return list.join("\t");
  }


  function getRandomChar(char_list) {
    if (char_list != undefined )  {
      return char_list[getRandomInt(0, char_list.length)];
    } else {
      return common_char_list[getRandomInt(0, common_char_list.length)];
    }
  }

  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

})(Picker);

$('#j_id_gen_list').bind('click', function() {
  var result = $('#result pre code');
  var word = $('#input_words').val();
  word = word.replace(/\s+/g, "");
  var pos = $('#optionsRadios1').is(':checked') ? 1 : 2;
  result.html(Picker.gen_result(pos, word));
  ;
});
