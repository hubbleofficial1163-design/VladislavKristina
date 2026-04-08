// script.js
document.addEventListener('DOMContentLoaded', function() {
    const tickerElement = document.getElementById('tickerText');
    const container = document.querySelector('.ticker-container');
    initSimpleGallery();
    
    // Текст бегущей строки с разделителем
    const baseText = 'приглашение на свадьбу • ';
    
    // Функция для обновления бегущей строки
    function updateTicker() {
        if (!container || !tickerElement) return;
        
        const containerWidth = container.offsetWidth;
        
        // Создаем временный элемент для измерения ширины текста
        const temp = document.createElement('span');
        temp.style.visibility = 'hidden';
        temp.style.position = 'absolute';
        temp.style.whiteSpace = 'nowrap';
        temp.style.fontSize = window.getComputedStyle(tickerElement).fontSize;
        temp.style.fontFamily = window.getComputedStyle(tickerElement).fontFamily;
        temp.style.letterSpacing = window.getComputedStyle(tickerElement).letterSpacing;
        temp.style.fontWeight = window.getComputedStyle(tickerElement).fontWeight;
        temp.textContent = baseText;
        document.body.appendChild(temp);
        
        const textWidth = temp.offsetWidth;
        document.body.removeChild(temp);
        
        // Рассчитываем сколько раз нужно повторить текст
        const repeatsNeeded = Math.max(3, Math.ceil((containerWidth * 2) / textWidth) + 1);
        
        // Создаем финальный текст
        let fullText = '';
        for (let i = 0; i < repeatsNeeded; i++) {
            fullText += baseText;
        }
        
        tickerElement.textContent = fullText;
    }
    
    // Добавляем ключевые кадры если их нет
    if (!document.querySelector('#ticker-styles')) {
        const style = document.createElement('style');
        style.id = 'ticker-styles';
        style.textContent = `
            @keyframes ticker {
                0% { transform: translateX(0); }
                100% { transform: translateX(-100%); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Инициализация
    updateTicker();
    
    // Обновляем при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateTicker, 100);
    });
    
    // Обновляем при повороте экрана
    window.addEventListener('orientationchange', function() {
        setTimeout(updateTicker, 150);
    });
    
    // Запускаем таймер
    weddingTimer();
    
    // Инициализация счетчика гостей
    initGuestsCounter();
});

// Таймер обратного отсчета до свадьбы
function weddingTimer() {
    const weddingDate = new Date(2026, 6, 2, 15, 0); // 2 июля 2026, 15:00
    
    function updateTimer() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days < 10 ? '0' + days : days;
        document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// ========== МОДАЛЬНОЕ ОКНО ==========
function showModal(title, message, isError = false) {
    const existingModal = document.getElementById('customModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'customModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    const icon = isError ? '❌' : '✅';
    const btnColor = isError ? '#dc3545' : '#28a745';

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 20px;
            padding: 30px 40px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            animation: slideUp 0.3s ease;
            border-top: 4px solid ${btnColor};
        ">
            <div style="font-size: 4rem; margin-bottom: 15px;">${icon}</div>
            <h3 style="
                font-family: 'Tangerine', 'Great Vibes', cursive;
                font-size: 2rem;
                color: #333;
                margin-bottom: 15px;
            ">${title}</h3>
            <p style="
                font-family: 'Caveat', cursive;
                font-size: 1.3rem;
                color: #666;
                margin-bottom: 25px;
                line-height: 1.4;
            ">${message}</p>
            <button onclick="this.closest('#customModal').remove()" style="
                background: ${btnColor};
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 50px;
                font-family: 'Caveat', cursive;
                font-size: 1.2rem;
                cursor: pointer;
                transition: all 0.3s;
            " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                Закрыть
            </button>
        </div>
    `;

    // Добавляем анимации если нет
    if (!document.querySelector('#modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    if (!isError) {
        setTimeout(() => {
            if (modal.parentElement) modal.remove();
        }, 5000);
    }
}

// ========== GOOGLE SHEETS ==========
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz073B3yg7Xta7VxOO2XawppD-VZocyYKzoyKxqGppN4NcyooZX7NkmKIw2P4YD_0yJ/exec'; // ЗАМЕНИТЕ НА ВАШ URL

// Функция для сбора данных из формы
function collectFormData(form) {
    const nameInput = form.querySelector('#name');
    const name = nameInput ? nameInput.value.trim() : '';
    
    const attendanceRadio = form.querySelector('input[name="attendance"]:checked');
    const attendance = attendanceRadio ? attendanceRadio.value : '';
    
    const guestsInput = document.getElementById('guestsInput');
    const guests = guestsInput ? guestsInput.value : '1';
    
    const alcoholCheckboxes = form.querySelectorAll('input[name="alcohol"]:checked');
    const alcoholValues = Array.from(alcoholCheckboxes).map(cb => cb.value);
    
    return { name, attendance, guests, alcohol: alcoholValues };
}

// Счетчик количества гостей
function initGuestsCounter() {
    const decrementBtn = document.getElementById('decrementGuests');
    const incrementBtn = document.getElementById('incrementGuests');
    const guestsCountSpan = document.getElementById('guestsCount');
    const guestsInput = document.getElementById('guestsInput');
    
    if (!decrementBtn || !incrementBtn || !guestsCountSpan || !guestsInput) return;
    
    let count = 1;
    const maxGuests = 5;
    const minGuests = 1;
    
    function updateCounter() {
        guestsCountSpan.textContent = count;
        guestsInput.value = count;
        
        decrementBtn.disabled = (count <= minGuests);
        decrementBtn.style.opacity = (count <= minGuests) ? '0.5' : '1';
        
        incrementBtn.disabled = (count >= maxGuests);
        incrementBtn.style.opacity = (count >= maxGuests) ? '0.5' : '1';
    }
    
    decrementBtn.addEventListener('click', () => {
        if (count > minGuests) {
            count--;
            updateCounter();
        }
    });
    
    incrementBtn.addEventListener('click', () => {
        if (count < maxGuests) {
            count++;
            updateCounter();
        }
    });
    
    updateCounter();
}

// Основной обработчик формы
function initFormHandler() {
    const form = document.querySelector('.guest-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Показываем загрузку
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        
        // Создаем модальное окно загрузки
        const loadingModal = document.createElement('div');
        loadingModal.id = 'loadingModal';
        loadingModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(3px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        loadingModal.innerHTML = `
            <div style="
                background: white;
                border-radius: 20px;
                padding: 30px 40px;
                text-align: center;
            ">
                <div style="
                    width: 50px;
                    height: 50px;
                    border: 3px solid #e0e0e0;
                    border-top-color: #595b4e;
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    animation: spin 1s linear infinite;
                "></div>
                <p style="
                    font-family: 'Caveat', cursive;
                    font-size: 1.3rem;
                    color: #666;
                ">Отправка ответа...</p>
            </div>
        `;
        document.body.appendChild(loadingModal);
        
        try {
            const formData = collectFormData(form);
            
            if (!formData.name) {
                throw new Error('Пожалуйста, введите ваше имя');
            }
            
            if (!formData.attendance) {
                throw new Error('Пожалуйста, выберите вариант присутствия');
            }
            
            // Отправляем данные
            const formDataToSend = new URLSearchParams();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('attendance', formData.attendance);
            formDataToSend.append('guests', formData.guests);
            
            for (const alcohol of formData.alcohol) {
                formDataToSend.append('alcohol', alcohol);
            }
            
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formDataToSend.toString()
            });
            
            const result = await response.json();
            
            loadingModal.remove();
            
            if (result.result === 'success') {
                showModal(
                    'Спасибо, ' + formData.name + '!',
                    'Ваш ответ успешно отправлен.<br>Ждём вас на нашем торжестве! 🎉',
                    false
                );
                form.reset();
                // Сброс счетчика гостей
                const guestsCountSpan = document.getElementById('guestsCount');
                const guestsInput = document.getElementById('guestsInput');
                if (guestsCountSpan) guestsCountSpan.textContent = '1';
                if (guestsInput) guestsInput.value = '1';
                // Сброс кнопок счетчика
                const decrementBtn = document.getElementById('decrementGuests');
                if (decrementBtn) {
                    decrementBtn.disabled = true;
                    decrementBtn.style.opacity = '0.5';
                }
            } else {
                throw new Error(result.message || 'Ошибка отправки');
            }
        } catch (error) {
            loadingModal.remove();
            showModal(
                'Ошибка',
                error.message || 'Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.',
                true
            );
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Музыка на сайте
function initMusicPlayer() {
    const musicBtn = document.getElementById('musicToggle');
    if (!musicBtn) return;
    
    const audio = new Audio();
    audio.src = '1.mp3';
    audio.loop = true;
    audio.volume = 0.5;
    
    let isPlaying = false;
    
    function updateButtonState() {
        if (isPlaying) {
            musicBtn.classList.add('active');
            musicBtn.innerHTML = `
                <svg class="music-icon" viewBox="0 0 24 24" width="22" height="22">
                    <path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
                <span class="music-text">Выключить музыку</span>
            `;
        } else {
            musicBtn.classList.remove('active');
            musicBtn.innerHTML = `
                <svg class="music-icon" viewBox="0 0 24 24" width="22" height="22">
                    <path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
                <span class="music-text">Включите музыку</span>
            `;
        }
    }
    
    musicBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            localStorage.setItem('musicPlaying', 'false');
        } else {
            audio.play().then(() => {
                isPlaying = true;
                localStorage.setItem('musicPlaying', 'true');
                updateButtonState();
            }).catch(error => {
                console.log('Автовоспроизведение заблокировано');
                isPlaying = true;
                updateButtonState();
                audio.play().catch(e => console.log('Ошибка:', e));
            });
        }
        updateButtonState();
    });
    
    const savedState = localStorage.getItem('musicPlaying');
    if (savedState === 'true') {
        audio.play().then(() => {
            isPlaying = true;
            updateButtonState();
        }).catch(() => {});
    }
    
    updateButtonState();
}

function initSimpleGallery() {
    const track = document.getElementById('galleryTrack');
    const nextBtn = document.getElementById('galleryNext');
    
    if (!track || !nextBtn) return;
    
    let currentIndex = 0;
    const totalSlides = 2;
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    });
}

// Запускаем всё
initMusicPlayer();
initFormHandler();
