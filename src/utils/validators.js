export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'El email es requerido';
  }
  if (!emailRegex.test(email)) {
    return 'Email inválido';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'La contraseña es requerida';
  }
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  return null;
};

export const validateRequired = (value, fieldName = 'Este campo') => {
  if (!value || value.trim() === '') {
    return `${fieldName} es requerido`;
  }
  return null;
};