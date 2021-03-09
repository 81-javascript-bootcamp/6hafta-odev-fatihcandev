export const getActionButton = ({ type, taskId }) => {
  return document.getElementById(`${type}-task-btn-${taskId}`);
};
