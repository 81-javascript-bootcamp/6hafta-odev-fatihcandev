import './styles/main.scss';
import PomodoroApp from './app';

let pomodoroApp = new PomodoroApp({
  tableSelector: 'tasks-table',
  tableTbodySelector: 'tasks-table-tbody',
  taskFormSelector: 'task-form',
  timerElSelector: 'timer',
  startBtnSelector: 'start-btn',
  pauseBtnSelector: 'pause-btn',
  resetBtnSelector: 'reset-btn',
});

pomodoroApp.init();
