export class AppError extends Error {  
  constructor(  
    public message: string,  
    public statusCode: number,  
    public originalError?: unknown  
  ) {  
    super(message);  
    this.name = 'AppError';  
  }  
}  
  
export class NetworkError extends AppError {  
  constructor(message = 'Error de conexión') {  
    super(message, 0);  
    this.name = 'NetworkError';  
  }  
}  
  
export class ValidationError extends AppError {  
  constructor(message: string) {  
    super(message, 400);  
    this.name = 'ValidationError';  
  }  
}  
  
export class NotFoundError extends AppError {  
  constructor(message = 'Recurso no encontrado') {  
    super(message, 404);  
    this.name = 'NotFoundError';  
  }  
}