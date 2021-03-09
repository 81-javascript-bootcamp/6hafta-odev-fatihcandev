export const getTimerCycle = () => {
  return parseInt(localStorage.getItem('timerCycle'));
};

export const incrementTimerCycle = () => {
  let currentTimerCycle = getTimerCycle();
  currentTimerCycle++;
  localStorage.setItem('timerCycle', currentTimerCycle.toString());
};

export const resetTimerCycle = () => {
  localStorage.removeItem('timerCycle');
};
