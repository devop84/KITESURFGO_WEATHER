const toggleSelectLocation = document.getElementById('toggle-select-location');
const selectLocation = document.querySelector('.select-location');

toggleSelectLocation.addEventListener('click', () => {
  selectLocation.classList.toggle('display-select-location');
});


const myLocation = document.getElementById('my_location');

myLocation.addEventListener('click', getLocation);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition);
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function setPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const inputField = document.querySelector('input[type="text"]');
  inputField.value = `${latitude}, ${longitude}`;
}



