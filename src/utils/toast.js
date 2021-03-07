export const showToast = ({ type, message }) => {
  document.body.innerHTML += `
        <div class="custom-toast-wrapper">
            <div class="custom-toast ${type}">${message}</div>
        </div>
    `;
};

export const removeToast = () => {
  const toast = document.querySelector('.custom-toast-wrapper');
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast?.remove();
    }, 350);
  }, 2000);
};

export const showSuccessToast = (message) => {
  showToast({
    type: 'success',
    message,
  });
  removeToast();
};

export const showErrorToast = (message) => {
  showToast({
    type: 'error',
    message,
  });
  removeToast();
};
