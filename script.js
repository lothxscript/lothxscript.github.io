// 1. Kullanıcının konuşmasını tanıma
function recognizeSpeech() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "tr-TR"; // Türkçe giriş

    recognition.start();
    recognition.onresult = async function (event) {
        let spokenText = event.results[0][0].transcript;
        document.getElementById("output").innerText = "Söylenen: " + spokenText;

        let translatedText = await translateText(spokenText, "tr", "ru"); // Türkçeden Rusçaya çeviri
        document.getElementById("output").innerText = "Çeviri: " + translatedText;

        speakText(translatedText, "ru-RU");
    };
}

// 2. MyMemory API ile çeviri yapma
async function translateText(text, fromLang, toLang) {
    let url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
    
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error("Çeviri hatası:", error);
        return "Çeviri başarısız.";
    }
}

// 3. Çevrilen metni sesli okuma
function speakText(text, lang) {
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
}

// Butona tıklayınca konuşmayı başlat
document.getElementById("translateButton").addEventListener("click", recognizeSpeech);