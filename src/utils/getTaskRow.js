export const getTaskRow = ($element, taskId) => {
  return $element.querySelector(`#task-title-${taskId}`);
};
