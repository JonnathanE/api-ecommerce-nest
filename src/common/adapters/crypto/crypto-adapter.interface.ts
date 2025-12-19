export interface ICryptoAdapter {
  hash(data: string, rounds?: number): Promise<string>;
  compare(data: string, encrypted: string): Promise<boolean>;
}
