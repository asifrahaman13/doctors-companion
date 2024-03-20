function speakerConfig() {
  try {
    const SPEECH_KEY = "feefac3b7ad24451872006cefba4ef39";
    const SPEECH_REGION = "eastus";

    return { SPEECH_KEY, SPEECH_REGION };
  } catch (e) {
    console.log(e);
  }
}

export { speakerConfig };
