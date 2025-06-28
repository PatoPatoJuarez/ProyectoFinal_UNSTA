export function validateLogin({ user, password }) {
  // Verifica que existan y no estén vacíos
  if (!user || !password) {
    return false;
  }

  // Opcional: Validaciones extra (longitud mínima, caracteres, etc.)
  if (user.trim() === '' || password.trim() === '') {
    return false;
  }

  return true;
}
