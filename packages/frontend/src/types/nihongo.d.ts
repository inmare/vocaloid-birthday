// nihongo.d.ts
declare module "nihongo" {
  interface Nihongo {
    isJapanese(text: string): boolean;
    isKana(char: string): boolean;
    isJouyouKanji(char: string): boolean;
  }
  const nihongo: Nihongo;
  export default nihongo;
}
