declare module 'hcaptcha' {
  export function verify(secret: string, token: string): Promise<any>;
}
