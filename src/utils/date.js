export const getNow = () => new Date();

export const setMinutes = (date, minutes) => {
  const dateTimestamp = date.getTime();
  const minutesTimestamp = minutes * 60000;
  return new Date(dateTimestamp + minutesTimestamp);
};

export const getRemainingDate = (date) => {
  const total = Date.parse(date) - Date.parse(getNow());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  return { total, seconds, minutes };
};
