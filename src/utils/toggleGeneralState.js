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
  toggleLoadingState(pressedBtn, !isFinished, isFinished ? '' : 'white');
};
