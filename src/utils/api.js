import { API_URL } from '../constants';

export const getTasks = async () => {
  const data = await fetch(API_URL);
  const tasks = await data.json();
  return tasks;
};

export const getTask = async (taskId) => {
  const data = await fetch(`${API_URL}/${taskId}`);
  const task = await data.json();
  return task;
};

export const createTask = async (task) => {
  const data = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  const newTask = await data.json();
  return newTask;
};

export const deleteTask = async (taskId) => {
  const data = await fetch(`${API_URL}/${taskId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const deletedTask = await data.json();
  return deletedTask;
};

export const completeTask = async (task) => {
  const data = await fetch(`${API_URL}/${task.id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...task, completed: true }),
  });
  const completedTask = await data.json();
  return completedTask;
};
