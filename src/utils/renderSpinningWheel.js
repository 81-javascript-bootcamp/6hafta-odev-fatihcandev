const getSpinningWheelSize = (size) => {
  switch (size) {
    case 'm':
      return '25';
    case 'l':
      return '35';
    case 'xl':
      return '45';
    default:
      return '15';
  }
};

export const renderSpinningWheel = (color, size) => {
  const spinningWheelSize = getSpinningWheelSize(size);

  return `
    <span class="spinning-wheel-container">
      <span class="wheel" style="border-top-color: ${color}; width: ${spinningWheelSize}px; height: ${spinningWheelSize}px" />
    </span>
    `;
};
