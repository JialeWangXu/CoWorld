export function isEmail(email: string): boolean {
    const emailRgx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRgx.test(email);
}

export function onlyLetters(str: string): boolean{
    const strRgx = /^[A-Za-z]+$/;
    return strRgx.test(str);
}

export function onlyLastNames(str: string): boolean{
    // puede tener mas que 2 apellidos, pero solo puede contener 1 space entre ellos
    const strRgx = /^[A-Za-z]+( [A-Za-z]+)*$/;
    return strRgx.test(str);
}

// Prevenir cualquier que sea menor de 8 caracteres, 
// OR no tiene 1 numero OR no tine una mayuscula OR no tiene una minuscula
// OR no tiene un caracter especial 
export function passwordRestrict(str:string): boolean{
    const strRgx = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
    return strRgx.test(str);
}