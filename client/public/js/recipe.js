// const golbal = require('global.js');

const rName = document.getElementById('rName');
const cTime = document.getElementById('cookTime');
const pTime = document.getElementById('prepTime');
const tTime = document.getElementById('totalTime');
const servings = document.getElementById('servings');
const submit = document.getElementById('submit');

// submit.addEventListener("click", function() {
//   console.log('Hello World');
// });

// function test() {
//   console.log(rName.value);
// }

function sendData() {

  var bodyString = '{"rName": "' + rName.value + '",' +
    '"cTime": "' + cTime.value + '",' +
    '"pTime": "' + pTime.value + '",' +
    '"tTime": "' + tTime.value + '",' +
    '"servings": "' + servings.value + '" ' +
    '}'

  fetch('/recipe', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
       body: bodyString
  })
  .then(function (data) {
    console.log('Request success: ', data);
    document.location.realod();
  })
  .catch(function (error) {
    console.log('Request failure: ', error);
  });

  // golbal.reloadPage;
}
