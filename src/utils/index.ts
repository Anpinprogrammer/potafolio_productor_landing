export const PHONE = "573206062300";
export const EMAIL = "yamamotogalejandro@gmail.com";
export const MESSAGE = "Hola, quiero información sobre edición de video.";

export function formatearTelefono(numero: string) {
  // Asegura que sea un string y elimina espacios o guiones previos
  const limpio = String(numero).replace(/\D/g, '');
  
  // Verifica si cumple con el largo de un número colombiano con indicativo (12 dígitos)
  if (limpio.length === 12) {
    return limpio.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})$/, '+$1 ($2) $3 $4');
  }
  
  // Retorna el número original si no tiene la estructura esperada
  return numero;
}