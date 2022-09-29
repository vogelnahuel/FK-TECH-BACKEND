export function setDate(): string {
    const date: Date = new Date();
    const year: number = date.getFullYear()
    const month: string = String( date.getMonth() + 1 ).padStart(2, '0')
    const day: string =  String(date.getDate()).padStart(2, '0')
    const hours: string = String(date. getHours()).padStart(2, '0')
    const minutes: string = String(date.getMinutes()).padStart(2, '0')
    const seconds: string = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} - ${hours}:${minutes}:${seconds}`;
}
