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