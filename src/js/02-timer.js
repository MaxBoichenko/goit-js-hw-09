import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

import { convertMs } from './timer-files/convert';

const inputDate = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

startBtn.addEventListener('click', onClickStartTimer);

let selectedTime = null;
let interval = null;
let leftTime = 0;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    startBtn.disabled = false;
    if (selectedDates[0] <= Date.now()) {
      startBtn.disabled = true;
      Notiflix.Notify.failure('Это прошлое вообще-то(');
      return;
    }
    selectedTime = selectedDates[0];

    if (leftTime) {
      clearInterval(interval);
      leftTime = 0;
    }
  },
};

flatpickr(inputDate, options);

function onClickStartTimer() {
  startBtn.disabled = true;

  interval = setInterval(() => {
    leftTime = selectedTime - Date.now();

    if (leftTime <= 0) {
      Notiflix.Notify.success('Час НАСТАЛ!');
      clearInterval(interval);
      leftTime = 0;
      return;
    }

    daysEl.textContent = addLeadingZero(convertMs(leftTime).days);
    hoursEl.textContent = addLeadingZero(convertMs(leftTime).hours);
    minutesEl.textContent = addLeadingZero(convertMs(leftTime).minutes);
    secondsEl.textContent = addLeadingZero(convertMs(leftTime).seconds);
  }, 1000);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}
