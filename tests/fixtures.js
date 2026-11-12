// Datos sintéticos EXCLUSIVOS de pruebas. La aplicación nunca importa este archivo.
export function fixture(word = 'hello', withAudio = true) {
  return [{
    word, phonetic: '/həˈləʊ/',
    phonetics: [{ text: '/həˈləʊ/', audio: withAudio ? 'https://audio.example.test/hello.mp3' : '' }],
    meanings: [{ partOfSpeech: 'verb', synonyms: ['greet'], definitions: [{ definition: 'To greet someone.', example: 'They helloed each other.', synonyms: ['welcome'] }] }],
    sourceUrls: ['https://en.wiktionary.org/wiki/hello'], license: { name: 'CC BY-SA 3.0', url: 'https://creativecommons.org/licenses/by-sa/3.0/' }
  }];
}
