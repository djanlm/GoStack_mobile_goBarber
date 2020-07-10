import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string; // o key pode ser qualquer nome, desde que seja uma string pq não sabemos os campos que um formulario pode ter
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach((error) => {
    validationErrors[error.path] = error.message;
  });
  return validationErrors;
}
