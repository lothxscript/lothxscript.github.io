let recognition;
let recognizedText = "";
let isListening = false; // Konuşma aktif mi?

// 1. Kullanıcının konuşmasını başlat
function startRecognition() {
    if (isListening) return; // Eğer zaten dinliyorsa tekrar başlatma

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "tr-TR"; // Türkçe giriş
    recognition.continuous = true; // Kesintisiz dinleme
    recognition.interimResults = false; // Geçici sonuçları gösterme

    document.getElementById("output").innerText = "Dinleniyor...";
    document.getElementById("startButton").style.display = "none";
    document.getElementById("stopButton").style.display = "inline-block";

    recognizedText = ""; // Önceki konuşmayı sıfırla
    isListening = true; // Dinleme moduna geç

    recognition.start();

    recognition.onresult = function (event) {
        for (let i = 0; i < event.results.length; i++) {
            recognizedText += event.results[i][0].transcript + " "; // Her yeni cümleyi ekle
        }
        document.getElementById("output").innerText = "Söylenen: " + recognizedText;
    };

    recognition.onerror = function (event) {
        document.getElementById("output").innerText = "Hata: " + event.error;
    };

    recognition.onend = function () {
        if (isListening) recognition.start(); // Kullanıcı dur demedikçe tekrar başlat
    };
}

// 2. Kullanıcı konuşmayı durdurmak istediğinde çağrılır
function stopRecognition() {
    isListening = false; // Dinlemeyi kapat
    if (recognition) {
        recognition.stop();
    }
    document.getElementById("stopButton").style.display = "none";
    document.getElementById("convertButton").style.display = "inline-block";
}

// 3. MyMemory API ile çeviri yapma (Türkçeden Fransızcaya)
async function translateText() {
    if (!recognizedText.trim()) {
        document.getElementById("output").innerText = "Önce konuşmayı başlatmalısınız!";
        return;
    }

    let url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(recognizedText)}&langpair=tr|fr`;

    try {
        let response = await fetch(url);
        let data = await response.json();
        let translatedText = data.responseData.translatedText;
        document.getElementById("output").innerText = "Çeviri: " + translatedText;

        speakText(translatedText, "fr-FR");
    } catch (error) {
        console.error("Çeviri hatası:", error);
        document.getElementById("output").innerText = "Çeviri başarısız.";
    }
}

// 4. Çevrilen metni sesli okuma (Fransızca)
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