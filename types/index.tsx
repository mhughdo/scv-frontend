export interface Language {
  id: number
  name: string
  code: string
}

export interface File {
  hash: string
  language: Language
  content: string
}
