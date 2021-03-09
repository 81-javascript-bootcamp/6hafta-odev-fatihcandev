export const toggleDisabledState = ($element) => {
  const isDisabled = $element.getAttribute('disabled') === 'true';
  if (isDisabled) {
    $element.removeAttribute('disabled');
  } else {
    $element.setAttribute('disabled', 'true');
  }
};
