/**  
 * Utilidades para manejo de fechas en validaciones  
 */  

const parseIsoDateAsLocal = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDateAsIso = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
  
/**  
 * Verifica si una fecha es igual o posterior a la fecha actual  
 * @param dateString - Fecha en formato ISO string  
 * @returns true si la fecha es válida y es hoy o futura  
 */  
export const isDateTodayOrFuture = (dateString: string): boolean => {  
  const date = parseIsoDateAsLocal(dateString);  
  const today = new Date();  
    
  // Resetear horas para comparar solo fechas  
  today.setHours(0, 0, 0, 0);  
  date.setHours(0, 0, 0, 0);  
    
  return date >= today && !isNaN(date.getTime());  
};  
  
/**  
 * Calcula la fecha de revisión (exactamente 1 año después de la fecha de liberación)  
 * @param releaseDateString - Fecha de liberación en formato ISO string  
 * @returns Fecha de revisión en formato ISO string (YYYY-MM-DD)  
 */  
export const calculateRevisionDate = (releaseDateString: string): string => {  
  const releaseDate = parseIsoDateAsLocal(releaseDateString);  
  const revisionDate = new Date(releaseDate);  
  revisionDate.setFullYear(revisionDate.getFullYear() + 1);  

  return formatDateAsIso(revisionDate);  
};  
  
/**  
 * Verifica si la fecha de revisión es exactamente 1 año después de la fecha de liberación  
 * @param releaseDateString - Fecha de liberación en formato ISO string  
 * @param revisionDateString - Fecha de revisión en formato ISO string  
 * @returns true si la fecha de revisión es correcta  
 */  
export const isValidRevisionDate = (  
  releaseDateString: string,  
  revisionDateString: string  
): boolean => {  
  const expectedRevisionDate = calculateRevisionDate(releaseDateString);  
  return revisionDateString === expectedRevisionDate;  
};  
  
/**  
 * Valida formato de fecha ISO (YYYY-MM-DD)  
 * @param dateString - Fecha a validar  
 * @returns true si el formato es válido  
 */  
export const isValidDateFormat = (dateString: string): boolean => {  
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;  
  if (!isoDateRegex.test(dateString)) {  
    return false;  
  }  

  const date = parseIsoDateAsLocal(dateString);
  if (isNaN(date.getTime())) {
    return false;
  }

  // Ensure invalid calendar dates (e.g. 2026-02-30) are rejected.
  return formatDateAsIso(date) === dateString;
};