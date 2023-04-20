const toggleSelectLocation = document.getElementById('toggle-select-location');
const selectLocation = document.querySelector('.select-location');

toggleSelectLocation.addEventListener('click', () => {
  selectLocation.classList.toggle('display-select-location');
});