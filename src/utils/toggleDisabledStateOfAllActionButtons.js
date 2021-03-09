import { toggleDisabledState } from './toggleDisabledState';

export const toggleDisabledStateOfAllActionButtons = ($element) => {
  const $actionButtons = $element.querySelectorAll('button');
  $actionButtons.forEach((button) => toggleDisabledState(button));
};
