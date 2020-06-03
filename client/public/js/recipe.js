const rName = document.getElementById('rName');
const cTime = document.getElementById('cTime');
const pTime = document.getElementById('pTime');
const tTime = document.getElementById('tTime');
const servings = document.getElementById('servings');
const submit = document.getElementById('submit');

submit.addEventListener("click", function() {
  console.log('Hello World');
});

function sendData() {

  fetch('/recipe', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
       body: JSON.stringify({
      rName: rName.innerHTML,
      cTime: cTime.innerHTML,
      pTime: pTime.innerHTML,
      tTime: tTime.innerHTML,
      servings: servings.innerHTML,
    })
  })
  .then(function (data) {
    console.log('Request success: ', data);
  })
  .catch(function (error) {
    console.log('Request failure: ', error);
  });

}
