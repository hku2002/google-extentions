class GroupRandomizer {
    constructor() {
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
            '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
        ];

        this.initializeElements();
        this.setupEventListeners();
        this.initializeLocalization();
    }

    initializeElements() {
        this.itemsInput = document.getElementById('items-input');
        this.groupsInput = document.getElementById('groups-input');
        this.randomizeBtn = document.getElementById('randomize-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.groupsContainer = document.getElementById('groups-container');
        this.confettiContainer = document.getElementById('confetti-container');
    }

    setupEventListeners() {
        this.randomizeBtn.addEventListener('click', () => this.randomizeGroups());
        this.clearBtn.addEventListener('click', () => this.clearAll());

        // Enter key support
        this.groupsInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.randomizeGroups();
        });

        // Auto-resize textarea
        this.itemsInput.addEventListener('input', () => this.autoResizeTextarea());
    }

    initializeLocalization() {
        if (typeof chrome !== 'undefined' && chrome.i18n) {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const messageKey = element.getAttribute('data-i18n');
                element.textContent = chrome.i18n.getMessage(messageKey) || element.textContent;
            });

            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const messageKey = element.getAttribute('data-i18n-placeholder');
                element.placeholder = chrome.i18n.getMessage(messageKey) || element.placeholder;
            });
        }
    }

    getLocalizedText(messageKey, fallbackText) {
        if (typeof chrome !== 'undefined' && chrome.i18n) {
            return chrome.i18n.getMessage(messageKey) || fallbackText;
        }
        return fallbackText;
    }

    autoResizeTextarea() {
        this.itemsInput.style.height = 'auto';
        this.itemsInput.style.height = Math.max(this.itemsInput.scrollHeight, 120) + 'px';
    }

    parseItems() {
        const text = this.itemsInput.value.trim();
        if (!text) return [];

        return text.split('\n')
            .map(item => item.trim())
            .filter(item => item.length > 0);
    }

    findDuplicates(items) {
        const itemCount = {};
        const duplicates = [];

        // Count occurrences of each item
        items.forEach(item => {
            const lowerItem = item.toLowerCase();
            itemCount[lowerItem] = (itemCount[lowerItem] || 0) + 1;
        });

        // Find items that appear more than once
        for (const [item, count] of Object.entries(itemCount)) {
            if (count > 1) {
                duplicates.push({ item, count });
            }
        }

        return duplicates;
    }

    validateInput() {
        const items = this.parseItems();
        const groupCount = parseInt(this.groupsInput.value);

        if (items.length === 0) {
            this.showError(this.getLocalizedText('errorNoItems', 'Please enter at least one item'));
            return false;
        }

        // Check for duplicates
        const duplicates = this.findDuplicates(items);
        if (duplicates.length > 0) {
            this.showDuplicateError(duplicates);
            return false;
        }

        if (groupCount < 2) {
            this.showError(this.getLocalizedText('errorMinGroups', 'Number of groups must be at least 2'));
            return false;
        }

        if (groupCount > items.length) {
            this.showError(this.getLocalizedText('errorTooManyGroups', 'Number of groups cannot exceed number of items'));
            return false;
        }

        return true;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    distributeItemsEvenly(items, groupCount) {
        const shuffledItems = this.shuffleArray(items);
        const groups = Array.from({ length: groupCount }, () => []);

        // Calculate base size and remainder
        const baseSize = Math.floor(shuffledItems.length / groupCount);
        const remainder = shuffledItems.length % groupCount;

        let itemIndex = 0;

        // Distribute items to each group
        for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
            // Each group gets baseSize items, plus one extra if it's among the first 'remainder' groups
            const groupSize = baseSize + (groupIndex < remainder ? 1 : 0);

            for (let i = 0; i < groupSize; i++) {
                groups[groupIndex].push(shuffledItems[itemIndex++]);
            }
        }

        return groups;
    }

    createGroupElement(group, index) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group';
        groupDiv.style.setProperty('--group-color', this.colors[index % this.colors.length]);

        const header = document.createElement('div');
        header.className = 'group-header';
        header.innerHTML = `
            <h3>Group ${index + 1}</h3>
            <span class="group-count">${group.length} items</span>
        `;

        const itemsList = document.createElement('ul');
        itemsList.className = 'group-items';

        group.forEach((item, itemIndex) => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            listItem.style.animationDelay = `${itemIndex * 0.1}s`;
            itemsList.appendChild(listItem);
        });

        groupDiv.appendChild(header);
        groupDiv.appendChild(itemsList);

        return groupDiv;
    }

    animateGroupsIn() {
        const groups = this.groupsContainer.querySelectorAll('.group');
        groups.forEach((group, index) => {
            group.style.animationDelay = `${index * 0.2}s`;
            group.classList.add('animate-in');
        });
    }

    createConfetti() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';

            this.confettiContainer.appendChild(confetti);

            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }
    }

    showError(message) {
        this.groupsContainer.innerHTML = `
            <div class="error-message">
                <span class="error-icon">⚠️</span>
                <p>${message}</p>
            </div>
        `;
    }

    showDuplicateError(duplicates) {
        const duplicateList = duplicates.map(dup => 
            `<li>"${dup.item}" (${dup.count}${this.getLocalizedText('timesText', ' times')})</li>`
        ).join('');
        
        this.groupsContainer.innerHTML = `
            <div class="error-message">
                <span class="error-icon">⚠️</span>
                <p>${this.getLocalizedText('duplicateError', 'Duplicate items found:')}</p>
                <ul class="duplicate-list">
                    ${duplicateList}
                </ul>
                <p class="error-note">${this.getLocalizedText('duplicateNote', 'Please remove duplicates before creating groups.')}</p>
            </div>
        `;
    }

    randomizeGroups() {
        if (!this.validateInput()) return;

        const items = this.parseItems();
        const groupCount = parseInt(this.groupsInput.value);

        // Add loading state
        this.randomizeBtn.disabled = true;
        this.randomizeBtn.textContent = this.getLocalizedText('randomizingText', 'Randomizing...');

        // Clear previous results
        this.groupsContainer.innerHTML = '';

        setTimeout(() => {
            try {
                const groups = this.distributeItemsEvenly(items, groupCount);

                // Create and display groups
                groups.forEach((group, index) => {
                    const groupElement = this.createGroupElement(group, index);
                    this.groupsContainer.appendChild(groupElement);
                });

                // Animate groups in
                setTimeout(() => this.animateGroupsIn(), 100);

                // Show confetti
                this.createConfetti();

                // Show summary
                this.showSummary(groups);

            } catch (error) {
                this.showError('An error occurred while creating groups');
                console.error(error);
            }

            // Reset button
            this.randomizeBtn.disabled = false;
            this.randomizeBtn.innerHTML = this.getLocalizedText('randomizeBtn', '🎲 Randomize Groups');
        }, 500);
    }

    showSummary(groups) {
        const summary = document.createElement('div');
        summary.className = 'summary';
        summary.innerHTML = `
            <h3>Summary</h3>
            <p>Groups created: ${groups.length}</p>
            <p>Group sizes: ${groups.map(g => g.length).join(', ')}</p>
        `;
        this.groupsContainer.appendChild(summary);
    }

    clearAll() {
        this.itemsInput.value = '';
        this.groupsInput.value = '2';
        this.groupsContainer.innerHTML = `
            <div class="placeholder" data-i18n="placeholder">
                ${this.getLocalizedText('placeholder', 'Enter items and click "Randomize Groups" to see the results')}
            </div>
        `;
        this.autoResizeTextarea();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GroupRandomizer();
});
