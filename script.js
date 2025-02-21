let recognizedText = ""; // Kullanıcının konuştuğu metni saklamak için

// 1. Kullanıcının konuşmasını tanıma
function recognizeSpeech() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "tr-TR"; // Türkçe giriş

    recognition.start();
    document.getElementById("output").innerText = "Dinleniyor...";

    recognition.onresult = function (event) {
        recognizedText = event.results[0][0].transcript;
        document.getElementById("output").innerText = "Söylenen: " + recognizedText;

        // Çeviri butonunu görünür yap
        document.getElementById("convertButton").style.display = "inline-block";
    };

    recognition.onerror = function (event) {
        document.getElementById("output").innerText = "Hata: " + event.error;
    };
}

// 2. MyMemory API ile çeviri yapma
async function translateText() {
    if (!recognizedText) {
        document.getElementById("output").innerText = "Önce konuşmayı başlatmalısınız!";
        return;
    }

    let url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(recognizedText)}&langpair=tr|ru`;

    try {
        let response = await fetch(url);
        let data = await response.json();
        let translatedText = data.responseData.translatedText;
        document.getElementById("output").innerText = "Çeviri: " + translatedText;

        speakText(translatedText, "ru-RU");
    } catch (error) {
        console.error("Çeviri hatası:", error);
        document.getElementById("output").innerText = "Çeviri başarısız.";
    }
}

// 3. Çevrilen metni sesli okuma
function speakText(text, lang) {
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
}

// Hata mesajlarını ekrana yazdır
window.onerror = function (message, source, lineno, colno, error) {
    document.getElementById("output").innerText = `Hata: ${message} \nSatır: ${lineno}, Sütun: ${colno}`;
};

// Buton olayları
document.getElementById("translateButton").addEventListener("click", recognizeSpeech);
document.getElementById("convertButton").addEventListener("click", translateText);