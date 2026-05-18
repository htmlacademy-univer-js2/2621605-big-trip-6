const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

const handleEscapeKey = (evt, callback) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    callback();
  }
};

export {capitalizeFirstLetter, handleEscapeKey};
