export function generateConfirmCode() {
    const numbers = '0123456789';

    let code = '';

    for (let i = 0; i < 6; i++)  code += numbers[Math.floor(Math.random() * numbers.length)];

    return code;
}

export function generateUniqueID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let id = '';

    for (let i = 0; i < 20; i++)  id += characters[Math.floor(Math.random() * characters.length)];

    return id;
}

export function encodePassword(password: string) {
    const buff = Buffer.from(password);
    return buff.toString('base64');
}