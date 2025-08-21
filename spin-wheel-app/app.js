class WheelSpinner {
    constructor() {
        this.canvas = document.getElementById('wheelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.items = [];
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
        this.rotation = 0;
        this.isSpinning = false;

        // 다국어 지원 초기화
        this.initializeLocalization();
        this.loadDefaultItems();
        this.initializeEventListeners();
        this.drawWheel();
        this.updateItemsList();
        this.updateItemCount();
        this.clearResult();
    }

    // 다국어 지원 초기화
    initializeLocalization() {
        // 모든 data-i18n 속성을 가진 요소들 번역
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = chrome.i18n.getMessage(key) || element.textContent;
        });

        // placeholder 번역
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = chrome.i18n.getMessage(key) || element.placeholder;
        });

        // 제목 업데이트
        document.title = chrome.i18n.getMessage('appName') || document.title;
    }

    // 기본 아이템 로드 (언어별)
    loadDefaultItems() {
        this.items = [
            chrome.i18n.getMessage('defaultItem1') || 'Pizza',
            chrome.i18n.getMessage('defaultItem2') || 'Chicken',
            chrome.i18n.getMessage('defaultItem3') || 'Burger'
        ];
    }

    initializeEventListeners() {
        document.getElementById('addBtn').addEventListener('click', () => this.addItem());
        document.getElementById('itemInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addItem();
        });
        document.getElementById('spinBtn').addEventListener('click', () => this.spin());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('itemsList').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                this.removeItem(e.target.dataset.item);
            }
        });

        // 화면 크기 변경 시 캔버스 조정
        window.addEventListener('resize', () => this.adjustCanvasSize());
        this.adjustCanvasSize();
    }

    // 화면 크기에 따른 캔버스 조정
    adjustCanvasSize() {
        const container = document.querySelector('.wheel-container');
        const maxSize = Math.min(
            container.offsetWidth - 40,
            window.innerHeight * 0.6,
            500
        );

        this.canvas.style.width = maxSize + 'px';
        this.canvas.style.height = maxSize + 'px';

        // 실제 캔버스 크기는 고정
        this.canvas.width = 500;
        this.canvas.height = 500;

        this.drawWheel();
    }

    addItem() {
        const input = document.getElementById('itemInput');
        const item = input.value.trim();

        if (item && !this.items.includes(item) && this.items.length < 8) {
            this.items.push(item);
            input.value = '';
            this.drawWheel();
            this.updateItemsList();
            this.updateItemCount();
            this.clearResult();
        } else if (this.items.length >= 8) {
            alert(chrome.i18n.getMessage('maxItemsAlert') || 'Maximum 8 items allowed!');
        } else if (this.items.includes(item)) {
            alert(chrome.i18n.getMessage('duplicateAlert') || 'Item already exists!');
        }
    }

    removeItem(item) {
        this.items = this.items.filter(i => i !== item);
        if (this.items.length === 0) {
            this.loadDefaultItems();
        }
        this.drawWheel();
        this.updateItemsList();
        this.updateItemCount();
        this.clearResult();
    }

    updateItemsList() {
        const itemsList = document.getElementById('itemsList');
        itemsList.innerHTML = this.items.map(item => `
            <div class="item-chip">
                <span>${item}</span>
                <button class="remove-btn" data-item="${item}">×</button>
            </div>
        `).join('');
    }

    updateItemCount() {
        const itemCount = document.getElementById('itemCount');
        itemCount.textContent = `(${this.items.length})`;
    }

    drawWheel() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 230;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.items.length === 0) return;

        const anglePerSection = (2 * Math.PI) / this.items.length;

        this.items.forEach((item, index) => {
            const startAngle = index * anglePerSection - Math.PI / 2 + this.rotation;
            const endAngle = startAngle + anglePerSection;

            // 섹션 그리기
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            this.ctx.fillStyle = this.colors[index % this.colors.length];
            this.ctx.fill();
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 5;
            this.ctx.stroke();

            // 텍스트 그리기
            const textAngle = startAngle + anglePerSection / 2;
            const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
            const textY = centerY + Math.sin(textAngle) * (radius * 0.7);

            this.ctx.save();
            this.ctx.translate(textX, textY);
            this.ctx.rotate(textAngle + Math.PI / 2);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 22px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
            this.ctx.shadowBlur = 3;
            this.ctx.fillText(item, 0, 0);
            this.ctx.restore();
        });

        // 중심 원
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#333';
        this.ctx.fill();
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 5;
        this.ctx.stroke();

        // 중심원 하이라이트
        this.ctx.beginPath();
        this.ctx.arc(centerX - 8, centerY - 8, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
        this.ctx.fill();
    }

    spin() {
        if (this.isSpinning || this.items.length === 0) return;

        this.isSpinning = true;
        document.getElementById('spinBtn').disabled = true;
        document.querySelector('.container').classList.add('spinning');

        const spinDuration = 3500 + Math.random() * 2000; // 3.5-5.5초
        const totalRotation = 2 * Math.PI * (6 + Math.random() * 4); // 6-10바퀴
        const startRotation = this.rotation;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);

            // easeOut 효과 강화
            const easeOut = 1 - Math.pow(1 - progress, 4);
            this.rotation = startRotation + totalRotation * easeOut;

            this.drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.finishSpin();
            }
        };

        this.clearResult();
        animate();
    }

    finishSpin() {
        this.isSpinning = false;
        document.getElementById('spinBtn').disabled = false;
        document.querySelector('.container').classList.remove('spinning');

        // 결과 계산
        const anglePerSection = (2 * Math.PI) / this.items.length;

        let normalizedRotation = this.rotation % (2 * Math.PI);
        if (normalizedRotation < 0) {
            normalizedRotation += 2 * Math.PI;
        }

        const effectiveAngle = (2 * Math.PI - normalizedRotation) % (2 * Math.PI);
        const selectedIndex = Math.floor(effectiveAngle / anglePerSection) % this.items.length;

        const selectedItem = this.items[selectedIndex];
        this.showResult(selectedItem);
    }

    showResult(item) {
        const resultElement = document.getElementById('result');
        resultElement.textContent = `🎉 ${item} 🎉`;
        resultElement.classList.add('show');

        // 축하 효과
        this.createConfetti();

        setTimeout(() => {
            resultElement.classList.remove('show');
        }, 800);
    }

    // 간단한 축하 효과
    createConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffeaa7'];

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    top: 20%;
                    left: ${Math.random() * 100}%;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    animation: confetti-fall 2s ease-out forwards;
                `;

                document.body.appendChild(confetti);

                setTimeout(() => {
                    confetti.remove();
                }, 2000);
            }, i * 50);
        }

        // CSS 애니메이션 추가
        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes confetti-fall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    clearResult() {
        const resultElement = document.getElementById('result');
        const placeholderText = chrome.i18n.getMessage('resultPlaceholder') ||
            'Click "Spin the Wheel!" to get your result';
        resultElement.textContent = placeholderText;
    }

    reset() {
        this.loadDefaultItems();
        this.rotation = 0;
        this.drawWheel();
        this.updateItemsList();
        this.updateItemCount();
        this.clearResult();
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new WheelSpinner();

    // 키보드 단축키
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !e.target.matches('input')) {
            e.preventDefault();
            document.getElementById('spinBtn').click();
        }
    });
});
