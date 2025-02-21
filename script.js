let recognition;
let recognizedText = ""; // Kullanıcının konuştuğu metni saklamak için

// 1. Kullanıcının konuşmasını tanıma başlat
function startRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "tr-TR"; // Türkçe giriş

    document.getElementById("output").innerText = "Dinleniyor...";
    document.getElementById("startButton").style.display = "none";
    document.getElementById("stopButton").style.display = "inline-block";

    recognition.start();

    recognition.onresult = function (event) {
        recognizedText = event.results[0][0].transcript;
        document.getElementById("output").innerText = "Söylenen: " + recognizedText;
    };

    recognition.onerror = function (event) {
        document.getElementById("output").innerText = "Hata: " + event.error;
    };
}

// 2. Konuşmayı durdur ve onay al
function stopRecognition() {
    if (recognition) {
        recognition.stop();
        document.getElementById("stopButton").style.display = "none";
        document.getElementById("convertButton").style.display = "inline-block";
    }
}

// 3. MyMemory API ile çeviri yapma (Türkçeden İtalyancaya)
async function translateText() {
    if (!recognizedText) {
        document.getElementById("output").innerText = "Önce konuşmayı başlatmalısınız!";
        return;
    }

    let url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(recognizedText)}&langpair=tr|it`;

    try {
        let response = await fetch(url);
        let data = await response.json();
        let translatedText = data.responseData.translatedText;
        document.getElementById("output").innerText = "Çeviri: " + translatedText;

        speakText(translatedText, "it-IT");
    } catch (error) {
        console.error("Çeviri hatası:", error);
        document.getElementById("output").innerText = "Çeviri başarısız.";
    }
}

// 4. Çevrilen metni sesli okuma (İtalyanca)
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
document.getElementById("startButton").addEventListener("click", startRecognition);
document.getElementById("stopButton").addEventListener("click", stopRecognition);
document.getElementById("convertButton").addEventListener("click", translateText);