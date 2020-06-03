const rName = document.getElementById('rName');
const cTime = document.getElementById('cTime');
const pTime = document.getElementById('pTime');
const tTime = document.getElementById('tTime');
const servings = document.getElementById('servings');
const submit = document.getElementById('submit');

submit.addEventListener("click", function() {
  console.log('Hello World');
});

function test() {
  console.log(rName.value);  
}

function sendData() {

  fetch('/recipe', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
       body: JSON.stringify({
      rName: rName.value,
      cTime: cTime.value,
      pTime: pTime.value,
      tTime: tTime.value,
      servings: servings.value,
    })
  })
  .then(function (data) {
    console.log('Request success: ', data);
  })
  .catch(function (error) {
    console.log('Request failure: ', error);
  });

}
