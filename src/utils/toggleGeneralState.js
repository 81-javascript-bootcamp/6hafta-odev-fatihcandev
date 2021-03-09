import { toggleDisabledState } from './toggleDisabledState';
import { toggleDisabledStateOfAllActionButtons } from './toggleDisabledStateOfAllActionButtons';
import { toggleLoadingState } from './toggleLoadingState';

export const toggleGeneralState = ({
  addTaskFormBtn,
  pressedBtn,
  isFinished = false,
  tableElement = null,
}) => {
  if (tableElement) {
    toggleDisabledStateOfAllActionButtons(tableElement);
  }
  toggleDisabledState(addTaskFormBtn);
  toggleLoadingState({
    $element: pressedBtn,
    shouldShow: !isFinished,
    spinningWheelColor: isFinished ? '' : 'white',
  });
};
