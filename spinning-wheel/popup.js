class WheelSpinner {
    constructor() {
        this.canvas = document.getElementById('wheelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.items = ['Pizza', 'Chicken', 'Burger'];
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
        this.rotation = 0;
        this.isSpinning = false;

        this.initializeEventListeners();
        this.drawWheel();
        this.updateItemsList();
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
    }

    addItem() {
        const input = document.getElementById('itemInput');
        const item = input.value.trim();

        if (item && !this.items.includes(item) && this.items.length < 8) {
            this.items.push(item);
            input.value = '';
            this.drawWheel();
            this.updateItemsList();
            this.clearResult();
        }
    }

    removeItem(item) {
        this.items = this.items.filter(i => i !== item);
        if (this.items.length === 0) {
            this.items = ['Item1', 'Item2', 'Item3'];
        }
        this.drawWheel();
        this.updateItemsList();
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

    drawWheel() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 120;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const anglePerSection = (2 * Math.PI) / this.items.length;

        this.items.forEach((item, index) => {
            // Place sections clockwise starting from 12 o'clock
            const startAngle = index * anglePerSection - Math.PI / 2 + this.rotation;
            const endAngle = startAngle + anglePerSection;

            // Draw section
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            this.ctx.fillStyle = this.colors[index % this.colors.length];
            this.ctx.fill();
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();

            // Draw text
            const textAngle = startAngle + anglePerSection / 2;
            const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
            const textY = centerY + Math.sin(textAngle) * (radius * 0.7);

            this.ctx.save();
            this.ctx.translate(textX, textY);
            this.ctx.rotate(textAngle + Math.PI / 2);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item, 0, 0);
            this.ctx.restore();
        });

        // Center circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#333';
        this.ctx.fill();
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }

    spin() {
        if (this.isSpinning || this.items.length === 0) return;

        this.isSpinning = true;
        document.getElementById('spinBtn').disabled = true;
        document.querySelector('.container').classList.add('spinning');

        const spinDuration = 3000 + Math.random() * 2000; // 3-5 seconds
        const totalRotation = 2 * Math.PI * (5 + Math.random() * 5); // 5-10 rotations
        const startRotation = this.rotation;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);

            // easeOut effect
            const easeOut = 1 - Math.pow(1 - progress, 3);
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

        // Calculate result - simple and accurate method
        const anglePerSection = (2 * Math.PI) / this.items.length;

        // Normalize current rotation to 0~2π range
        let normalizedRotation = this.rotation % (2 * Math.PI);
        if (normalizedRotation < 0) {
            normalizedRotation += 2 * Math.PI;
        }

        // Pointer is fixed at 12 o'clock position
        // Calculate in reverse since rotation is clockwise to determine which section touches the pointer
        const effectiveAngle = (2 * Math.PI - normalizedRotation) % (2 * Math.PI);
        const selectedIndex = Math.floor(effectiveAngle / anglePerSection) % this.items.length;

        const selectedItem = this.items[selectedIndex];
        this.showResult(selectedItem);
    }

    showResult(item) {
        const resultElement = document.getElementById('result');
        resultElement.textContent = `🎉 ${item} 🎉`;
        resultElement.classList.add('show');

        setTimeout(() => {
            resultElement.classList.remove('show');
        }, 600);
    }

    clearResult() {
        document.getElementById('result').textContent = '';
    }

    reset() {
        this.items = ['Pizza', 'Chicken', 'Burger'];
        this.rotation = 0;
        this.drawWheel();
        this.updateItemsList();
        this.clearResult();
    }
}

// Initialize when extension loads
document.addEventListener('DOMContentLoaded', () => {
    new WheelSpinner();
});
