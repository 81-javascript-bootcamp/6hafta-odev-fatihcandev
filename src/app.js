import {
  POMODORO_LONG_BREAK_TIME,
  POMODORO_SHORT_BREAK_TIME,
  POMODORO_WORK_TIME,
} from './constants';
import {
  getTasks,
  createTask,
  deleteTask,
  completeTask,
  getTask,
} from './utils/api';
import { getRemainingDate, setMinutes } from './utils/date';
import {
  getTimerCycle,
  incrementTimerCycle,
  resetTimerCycle,
} from './utils/timerCycle';
import { getActionButton } from './utils/getActionButton';
import { renderTaskRow } from './utils/renderTaskRow';
import { getTaskRow } from './utils/getTaskRow';
import { toggleGeneralState } from './utils/toggleGeneralState';
import { toggleDisabledState } from './utils/toggleDisabledState';
import { crossOutTask } from './utils/crossOutTask';

class PomodoroApp {
  constructor(options) {
    const {
      tableSelector,
      tableTbodySelector,
      taskFormSelector,
      timerElSelector,
      startBtnSelector,
      pauseBtnSelector,
      resetBtnSelector,
    } = options;
    this.$tableEl = document.getElementById(tableSelector);
    this.$tableTbody = document.getElementById(tableTbodySelector);
    this.$taskForm = document.getElementById(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$addTaskFormBtn = this.$taskForm.querySelector('button');
    this.$startBtn = document.getElementById(startBtnSelector);
    this.$pauseBtn = document.getElementById(pauseBtnSelector);
    this.$resetBtn = document.getElementById(resetBtnSelector);
    this.$timerEl = document.getElementById(timerElSelector);
    this.currentInterval = null;
    this.currentRemaining = null;
    this.timerType = null;
    this.currentTask = null;
  }

  fillTaskTable() {
    getTasks().then((currentTasks) => {
      currentTasks.forEach((task) => {
        const { id, completed } = task;
        this.createTaskRow(task);
        if (completed) {
          const $taskRow = getTaskRow(this.$tableTbody, id);
          crossOutTask($taskRow);
        }
      });
      this.bindActionButtonEvents();
    });
  }

  createTaskRow(task) {
    this.$tableTbody.innerHTML += renderTaskRow(task);
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (event) => {
      event.preventDefault();
      toggleGeneralState({
        addTaskFormBtn: this.$addTaskFormBtn,
        pressedBtn: this.$addTaskFormBtn,
      });
      const task = { title: this.$taskFormInput.value, completed: false };
      this.handleCreateTask(task);
      this.clearInputValue();
    });
  }

  handleCreateTask(task) {
    createTask(task).then((newTask) => {
      this.createTaskRow(newTask);
      this.bindActionButtonEvents(newTask.id);
      toggleGeneralState({
        addTaskFormBtn: this.$addTaskFormBtn,
        pressedBtn: this.$addTaskFormBtn,
        isFinished: true,
      });
    });
  }

  bindActionButtonEvents() {
    this.$tableTbody.addEventListener('click', (event) => {
      const clickedElement = event.target.closest('button');
      const taskId = clickedElement?.getAttribute('data-id');
      const buttonId = clickedElement?.id;
      if (clickedElement) {
        if (buttonId === `delete-task-btn-${taskId}`) {
          toggleGeneralState({
            addTaskFormBtn: this.$addTaskFormBtn,
            pressedBtn: clickedElement,
            tableElement: this.$tableTbody,
          });
          this.handleRemoveTask(taskId);
        } else if (buttonId === `start-task-btn-${taskId}`) {
          this.handleStartWorkingOnTask(taskId);
        } else if (buttonId === `complete-task-btn-${taskId}`) {
          toggleGeneralState({
            addTaskFormBtn: this.$addTaskFormBtn,
            pressedBtn: clickedElement,
            tableElement: this.$tableTbody,
          });
          this.handleCompleteTask(taskId);
        }
      }
    });
  }

  handleRemoveTask(taskId) {
    deleteTask(taskId).then((deletedTask) => {
      const { id } = deletedTask;
      const $deleteButton = this.$tableTbody.querySelector(
        `#delete-task-btn-${id}`
      );
      const rowToDelete = this.$tableTbody.querySelector(`tr[data-id="${id}"]`);
      rowToDelete?.remove();
      if ($deleteButton) {
        toggleGeneralState({
          addTaskFormBtn: this.$addTaskFormBtn,
          pressedBtn: $deleteButton,
          tableElement: this.$tableTbody,
          isFinished: true,
        });
      }
    });
  }

  handleStartWorkingOnTask(taskId) {
    const $taskRow = this.$tableTbody.querySelector(`#task-title-${taskId}`);
    this.currentTask = $taskRow.innerHTML;
    this.createNewTimer('pomodoro');
  }

  handleCompleteTask(taskId) {
    getTask(taskId).then((taskToComplete) => {
      completeTask(taskToComplete).then((completedTask) => {
        const { id } = completedTask;
        const $completeButton = this.$tableTbody.querySelector(
          `#complete-task-btn-${id}`
        );
        const $taskRow = getTaskRow(this.$tableTbody, id);
        crossOutTask($taskRow);
        if ($completeButton) {
          toggleGeneralState({
            addTaskFormBtn: this.$addTaskFormBtn,
            pressedBtn: $completeButton,
            tableElement: this.$tableTbody,
            isFinished: true,
          });
        }
      });
    });
  }

  getNextTimerType() {
    const currentTimerCycle = getTimerCycle();
    if (this.timerType === 'pomodoro' && currentTimerCycle === 4) {
      return 'longBreak';
    } else if (this.timerType === 'pomodoro' && currentTimerCycle !== 4) {
      return 'shortBreak';
    } else {
      return 'pomodoro';
    }
  }

  getTimerMinute() {
    switch (this.timerType) {
      case 'pomodoro':
        return POMODORO_WORK_TIME;
      case 'shortBreak':
        return POMODORO_SHORT_BREAK_TIME;
      case 'longBreak':
        return POMODORO_LONG_BREAK_TIME;
    }
  }

  getTimerText() {
    switch (this.timerType) {
      case 'pomodoro':
        return `👨‍💻 You are working on: ${this.currentTask}`;
      case 'shortBreak':
        return '😴 Short break: ';
      case 'longBreak':
        return '😴 Long break: ';
    }
  }

  handleTimerEnd() {
    if (this.timerType === 'longBreak') {
      resetTimerCycle();
    }
    const nextTimerType = this.getNextTimerType();
    this.createNewTimer(nextTimerType);
  }

  initializeTimer(deadline) {
    this.currentInterval = setInterval(() => {
      const remainingTime = getRemainingDate(deadline);
      const { total, minutes, seconds } = remainingTime;
      if (this.currentRemaining) {
        this.currentRemaining = total;
      }
      this.$timerEl.innerHTML = `${this.getTimerText()} ${minutes}:${seconds}`;
      if (this.timerType === 'pomodoro') {
        incrementTimerCycle();
      }
      if (total <= 0) {
        this.handleTimerEnd();
      }
    }, 1000);
  }

  createNewTimer(timerType) {
    clearInterval(this.currentInterval);
    this.timerType = timerType;
    const minute = this.getTimerMinute();
    const deadline = setMinutes(new Date(), minute);
    this.initializeTimer(deadline);
  }

  continueWorking() {
    const totalRemaining = new Date(
      Date.parse(new Date()) + this.currentRemaining
    );
    this.initializeTimer(totalRemaining);
  }

  handleStart() {
    this.$startBtn.addEventListener('click', () => {
      if (this.currentRemaining) {
        continueWorking();
      } else {
        this.createNewTimer(this.timerType);
      }
    });
  }

  handlePause() {
    this.$pauseBtn.addEventListener('click', () => {
      clearInterval(this.currentInterval);
    });
  }

  handleReset() {
    this.$resetBtn.addEventListener('click', () => {
      clearInterval(this.currentInterval);
      const minute = this.getTimerMinute();
      this.$timerEl.innerHTML = `${minute}:00`;
    });
  }

  clearInputValue() {
    this.$taskFormInput.value = '';
  }

  init() {
    toggleDisabledState(this.$startBtn);
    toggleDisabledState(this.$pauseBtn);
    toggleDisabledState(this.$resetBtn);
    this.fillTaskTable();
    this.handleAddTask();
    this.handleStart();
    this.handlePause();
    this.handleReset();
  }
}

export default PomodoroApp;
