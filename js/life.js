/* Vision Board, Manifestation Journal and Shadow Work — moved here from the Synthesis app (premium-features.js). */
// ============================================
// LIFESTYLE FEATURES — Vision Board, Manifestation Journal,
// Shadow Work. The "premium-features" filename is historical:
// there is no paywall and no gating; every feature in this module
// is freely available to every user. (Workout tracking lives in
// fitness-tracker.js, which fully supersedes this file's old
// Workout Tracker section.)
// ============================================

// Helper function to parse MM/DD/YYYY to ISO format (YYYY-MM-DD)
function parseDateMMDDYYYY(dateStr) {
    if (!dateStr) return null;
    // Handle if already in ISO format
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
        return dateStr;
    }
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const month = parts[0].padStart(2, '0');
        const day = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }
    return dateStr; // Return as-is if can't parse
}

// Helper function to format a date string for display (Month Day, Year)
function formatDateForDisplay(dateStr) {
    if (!dateStr) return 'No date set';
    // Parse the date - handle both ISO format and MM/DD/YYYY
    let date;
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
        // ISO format: YYYY-MM-DD - parse manually to avoid timezone issues
        const parts = dateStr.split('-');
        date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    } else if (dateStr.includes('/')) {
        // MM/DD/YYYY format - parse manually
        const parts = dateStr.split('/');
        date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
    } else {
        date = new Date(dateStr);
    }

    if (isNaN(date.getTime())) return dateStr;

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Helper function to normalize an affirmation entry: legacy saves stored a
// plain string, current saves store {text, spoken} so the "spoken" checkmark
// can persist across reloads.
function normalizeAffirmation(a) {
    return typeof a === 'string' ? { text: a, spoken: false } : a;
}

// Helper function to safely inject text into an HTML attribute or text node
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

class PremiumFeatures {
    constructor(app) {
        this.app = app;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Back buttons — return to wherever the user came from
        document.getElementById('vision-board-back-btn')?.addEventListener('click', () => {
            this.app.goBack();
        });

        document.getElementById('manifestation-back-btn')?.addEventListener('click', () => {
            this.app.goBack();
        });

        document.getElementById('shadow-work-back-btn')?.addEventListener('click', () => {
            this.app.goBack();
        });

        document.getElementById('workout-back-btn')?.addEventListener('click', () => {
            this.app.goBack();
        });
    }

    // ============================================
    // VISION BOARD
    // ============================================

    renderVisionBoard() {
        const container = document.getElementById('vision-board-content');
        const moonPhase = APP_DATA.moonPhases.current;
        const visions = APP_DATA.user.visionBoard || [];

        const html = `
            <div class="moon-phase-tracker">
                <h2>🌙 Current Moon Phase</h2>
                <div class="current-moon">${moonPhase.emoji}</div>
                <div class="moon-phase-name">${moonPhase.phase}</div>
                <div class="moon-phase-description">${moonPhase.description}</div>
                <div style="margin-top: 1rem; color: var(--color-primary-light);">
                    <strong>Manifestation Focus:</strong> ${moonPhase.manifestationFocus}
                </div>
                <div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--color-text-tertiary);">
                    ${moonPhase.nextPhase} in ${moonPhase.daysUntilNext} days
                </div>

                <div class="moon-phases-list">
                    ${APP_DATA.moonPhases.phases.map((phase, index) => `
                        <div class="moon-phase-item ${phase.name === moonPhase.phase ? 'active' : ''}">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${phase.emoji}</div>
                            <div style="font-size: 0.75rem; font-weight: 600;">${phase.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            ${(() => {
                const achievedCount = visions.filter(v => v.achieved).length;
                return achievedCount > 0 ? `
                    <div style="margin-top: 1.5rem; padding: 0.75rem 1rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15)); border-radius: 0.75rem; color: var(--color-text-secondary); font-size: 0.9rem;">
                        🏆 ${achievedCount} vision${achievedCount === 1 ? '' : 's'} achieved
                    </div>
                ` : '';
            })()}

            <h2 style="margin: 2rem 0 1rem;">Your Vision Board</h2>
            <div class="vision-board-grid">
                ${visions.slice().sort((a, b) => (a.achieved === b.achieved) ? 0 : (a.achieved ? 1 : -1)).map(vision => `
                    <div class="vision-card ${vision.achieved ? 'vision-achieved' : ''}" onclick="window.premiumFeatures.editVision(${vision.id})">
                        <div class="vision-card-image" style="background: linear-gradient(135deg, ${this.getCategoryGradient(vision.category)}); ${vision.achieved ? 'opacity: 0.6;' : ''}">
                            <span style="font-size: 4rem;">${vision.icon}</span>
                            ${vision.achieved ? '<div class="vision-achieved-badge">🏆 Achieved</div>' : ''}
                        </div>
                        <div class="vision-card-title">${escapeHtml(vision.title)}</div>
                        <div class="vision-card-description">${escapeHtml(vision.description)}</div>
                        <div class="vision-card-date">${vision.achieved ? `✅ Achieved ${formatDateForDisplay(vision.achievedDate)}` : `🎯 Target: ${formatDateForDisplay(vision.targetDate)}`}</div>
                        <button class="vision-achieve-btn" onclick="event.stopPropagation(); window.premiumFeatures.toggleVisionAchieved(${vision.id})">
                            ${vision.achieved ? '↩️ Mark Not Yet Achieved' : '🏆 Mark as Achieved'}
                        </button>
                    </div>
                `).join('')}

                <div class="add-vision-btn" onclick="window.premiumFeatures.addVision()">
                    <div class="add-vision-icon">➕</div>
                    <div style="font-weight: 600; font-size: 1.125rem;">Add New Vision</div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    toggleVisionAchieved(visionId) {
        const vision = APP_DATA.user.visionBoard.find(v => v.id === visionId);
        if (!vision) return;

        vision.achieved = !vision.achieved;
        vision.achievedDate = vision.achieved ? new Date().toISOString().split('T')[0] : null;
        saveProgress();

        if (vision.achieved) {
            toast(`🏆 "${vision.title}" achieved! Manifestation in action.`, 'success');
            if (window.gamification) window.gamification.awardXP(15, 'Vision Achieved');
        }

        this.renderVisionBoard();
    }

    getCategoryGradient(category) {
        const gradients = {
            business: '#6366f1 0%, #4f46e5 100%',
            health: '#10b981 0%, #059669 100%',
            personal: '#ec4899 0%, #db2777 100%',
            relationships: '#f59e0b 0%, #d97706 100%',
            spiritual: '#8b5cf6 0%, #7c3aed 100%'
        };
        return gradients[category] || '#6366f1 0%, #4f46e5 100%';
    }

    addVision() {
        this.openVisionModal(null);
    }

    editVision(visionId) {
        const vision = APP_DATA.user.visionBoard.find(v => v.id === visionId);
        if (!vision) return;
        this.openVisionModal(vision);
    }

    openVisionModal(vision) {
        const isEdit = !!vision;
        const categories = [
            { key: 'business', label: '💼 Business' },
            { key: 'health', label: '💪 Health' },
            { key: 'personal', label: '✨ Personal' },
            { key: 'relationships', label: '❤️ Relationships' },
            { key: 'spiritual', label: '🧘 Spiritual' }
        ];
        const icons = ['✨', '💼', '💪', '❤️', '🧘', '🏠', '💰', '🎓', '🌱', '🎯', '🚀', '📚', '🎨', '✈️', '🏆'];
        let pickedCategory = vision ? vision.category : 'personal';
        let pickedIcon = vision ? vision.icon : '✨';

        const modal = document.createElement('div');
        modal.className = 'premium-modal-overlay';
        modal.innerHTML = `
            <div class="premium-modal">
                <h3>${isEdit ? 'Edit Vision' : 'Add New Vision'}</h3>
                <div class="premium-form">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" id="vision-title-input" class="fitness-input" value="${escapeHtml(vision ? vision.title : '')}" placeholder="e.g., Launch a woodworking business">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="vision-description-input" class="fitness-input" placeholder="Describe your vision in detail...">${escapeHtml(vision ? vision.description : '')}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Target Date</label>
                        <input type="date" id="vision-date-input" class="fitness-input" value="${vision && vision.targetDate ? parseDateMMDDYYYY(vision.targetDate) : ''}">
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <div class="category-picker" id="vision-category-picker">
                            ${categories.map(c => `<div class="category-picker-option ${c.key === pickedCategory ? 'selected' : ''}" data-category="${c.key}" style="background: linear-gradient(135deg, ${this.getCategoryGradient(c.key)})">${c.label}</div>`).join('')}
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Icon</label>
                        <div class="icon-picker" id="vision-icon-picker">
                            ${icons.map(i => `<div class="icon-picker-option ${i === pickedIcon ? 'selected' : ''}" data-icon="${i}">${i}</div>`).join('')}
                        </div>
                    </div>
                    <div class="modal-buttons">
                        ${isEdit ? '<button class="btn-secondary" id="vision-delete-btn" style="border-color:#ef4444;color:#ef4444;">Delete</button>' : ''}
                        <button class="btn-secondary" id="vision-cancel-btn">Cancel</button>
                        <button class="btn-primary" id="vision-save-btn">Save</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelectorAll('.category-picker-option').forEach(el => {
            el.onclick = () => {
                modal.querySelectorAll('.category-picker-option').forEach(o => o.classList.remove('selected'));
                el.classList.add('selected');
                pickedCategory = el.dataset.category;
            };
        });
        modal.querySelectorAll('.icon-picker-option').forEach(el => {
            el.onclick = () => {
                modal.querySelectorAll('.icon-picker-option').forEach(o => o.classList.remove('selected'));
                el.classList.add('selected');
                pickedIcon = el.dataset.icon;
            };
        });

        modal.querySelector('#vision-cancel-btn').onclick = () => modal.remove();

        const deleteBtn = modal.querySelector('#vision-delete-btn');
        if (deleteBtn) {
            deleteBtn.onclick = () => {
                if (confirm(`Are you sure you want to delete "${vision.title}"?`)) {
                    APP_DATA.user.visionBoard = APP_DATA.user.visionBoard.filter(v => v.id !== vision.id);
                    saveProgress();
                    modal.remove();
                    this.renderVisionBoard();
                    toast('Vision deleted.', 'info');
                }
            };
        }

        modal.querySelector('#vision-save-btn').onclick = () => {
            const title = modal.querySelector('#vision-title-input').value.trim();
            const description = modal.querySelector('#vision-description-input').value.trim();
            const targetDate = modal.querySelector('#vision-date-input').value;
            if (!title) {
                toast('Please enter a title for your vision.', 'error');
                return;
            }

            if (isEdit) {
                vision.title = title;
                vision.description = description;
                vision.targetDate = targetDate || vision.targetDate;
                vision.category = pickedCategory;
                vision.icon = pickedIcon;
                saveProgress();
                modal.remove();
                this.renderVisionBoard();
                toast('Vision updated!', 'info');
            } else {
                const newVision = {
                    id: Date.now(),
                    title,
                    description,
                    targetDate: targetDate || null,
                    category: pickedCategory,
                    icon: pickedIcon,
                    created: new Date().toISOString().split('T')[0]
                };
                APP_DATA.user.visionBoard.push(newVision);
                saveProgress();
                if (window.gamification) window.gamification.updateChallengeProgress('vision');
                modal.remove();
                this.renderVisionBoard();
                toast('Vision added!', 'info');
            }
        };
    }

    // ============================================
    // MANIFESTATION JOURNAL
    // ============================================

    renderManifestation() {
        const container = document.getElementById('manifestation-content');
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = APP_DATA.user.manifestationJournal?.find(e => e.date === today) || {
            date: today,
            gratitude: [],
            affirmations: [],
            goals: [],
            notes: ""
        };

        const affirmationStreak = this.getAffirmationStreak();
        const allEntries = APP_DATA.user.manifestationJournal || [];
        const totalEntries = allEntries.length;
        const totalSpoken = allEntries.reduce((sum, e) => sum + (e.affirmations || []).map(normalizeAffirmation).filter(a => a.spoken).length, 0);

        const html = `
            <div class="manifestation-header">
                <h2>🌙 Today's Manifestation Practice</h2>
                <p style="opacity: 0.9; margin-top: 0.5rem;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                ${affirmationStreak > 0 ? `<p style="margin-top: 0.5rem; font-weight: 600;">🔥 ${affirmationStreak}-day affirmation streak</p>` : ''}
                ${totalEntries > 0 ? `<p style="margin-top: 0.5rem; opacity: 0.85; font-size: 0.85rem;">📖 ${totalEntries} journal ${totalEntries === 1 ? 'entry' : 'entries'} · ✨ ${totalSpoken} affirmation${totalSpoken === 1 ? '' : 's'} spoken all-time</p>` : ''}
            </div>

            <div class="gratitude-section">
                <div class="section-title">
                    <span>🙏</span>
                    <span>Gratitude</span>
                </div>
                <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">What are you grateful for today?</p>
                <textarea 
                    class="journal-textarea" 
                    id="gratitude-input" 
                    placeholder="I am grateful for..."
                    rows="4"
                >${todayEntry.gratitude?.join('\n') || ''}</textarea>
            </div>

            <div class="affirmation-section">
                <div class="section-title">
                    <span>✨</span>
                    <span>Affirmations</span>
                </div>
                <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">Powerful statements that shape your reality. Click to mark as spoken!</p>
                <div class="affirmation-list" id="affirmation-list">
                    ${todayEntry.affirmations && todayEntry.affirmations.length > 0 ? todayEntry.affirmations.map(normalizeAffirmation).map((aff, index) => `
                        <div class="affirmation-item" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--color-bg-secondary); border-radius: 0.75rem; margin-bottom: 0.75rem; cursor: pointer;" onclick="window.premiumFeatures.toggleAffirmation(${index})">
                            <div class="affirmation-checkbox ${aff.spoken ? 'checked' : ''}" style="width: 24px; height: 24px; border: 2px solid var(--color-primary); border-radius: 50%; transition: all 0.3s;"></div>
                            <div class="affirmation-text ${aff.spoken ? 'spoken' : ''}" style="flex: 1;">${escapeHtml(aff.text)}</div>
                            <button onclick="event.stopPropagation(); window.premiumFeatures.deleteAffirmation(${index})" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 0.25rem;">✕</button>
                        </div>
                    `).join('') : '<p style="color: var(--color-text-tertiary);">No affirmations yet. Add one below!</p>'}
                </div>
                <button class="add-affirmation-btn" onclick="window.premiumFeatures.addAffirmation()" style="width: 100%; padding: 1rem; background: var(--color-bg-tertiary); border: 2px dashed var(--color-primary); border-radius: 0.75rem; color: var(--color-primary); cursor: pointer; font-weight: 600;">➕ Add Your Own Affirmation</button>

                <div class="suggested-affirmations" style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1)); border-radius: 0.75rem;">
                    <h4 style="color: var(--color-primary); margin-bottom: 0.75rem; font-size: 0.9rem;">💡 Today's Suggested Affirmations</h4>
                    <p style="color: var(--color-text-tertiary); font-size: 0.8rem; margin-bottom: 1rem;">Tap any to add it to your list!</p>
                    ${this.getSuggestedAffirmations().map(aff => `
                        <div class="suggested-aff-item" onclick="window.premiumFeatures.addSuggestedAffirmation('${aff.replace(/'/g, "\\'")}')" style="padding: 0.75rem 1rem; background: var(--color-bg-secondary); border-radius: 0.5rem; margin-bottom: 0.5rem; cursor: pointer; border-left: 3px solid var(--color-primary); transition: all 0.2s;">
                            <span style="color: var(--color-text-primary); font-size: 0.9rem;">${aff}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="goals-section">
                <div class="section-title">
                    <span>🎯</span>
                    <span>Today's Intentions</span>
                </div>
                <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">What do you intend to manifest today?</p>
                <textarea 
                    class="journal-textarea" 
                    id="intentions-input" 
                    placeholder="Today I will..."
                    rows="4"
                >${todayEntry.goals?.join('\n') || ''}</textarea>
            </div>

            <div class="goals-section">
                <div class="section-title">
                    <span>📝</span>
                    <span>Journal Entry</span>
                </div>
                <textarea 
                    class="journal-textarea" 
                    id="journal-notes-input" 
                    placeholder="How are you feeling? What insights came to you today?"
                    rows="6"
                >${todayEntry.notes || ''}</textarea>
            </div>

            <button class="save-journal-btn" style="width: 100%; margin-top: 1rem;" onclick="window.premiumFeatures.saveJournalEntry()">
                💾 Save Today's Entry
            </button>

            <div class="journal-entries">
                <h2 style="margin-bottom: 1rem;">All Journal Entries</h2>
                ${APP_DATA.user.manifestationJournal && APP_DATA.user.manifestationJournal.length > 0 ?
                    APP_DATA.user.manifestationJournal.slice().reverse().map(entry => `
                        <div class="journal-entry" style="background: var(--color-bg-secondary); padding: 1.5rem; border-radius: 1rem; margin-bottom: 1rem;">
                            <div class="entry-date" style="color: var(--color-primary-light); font-weight: 600; margin-bottom: 0.75rem;">${new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            <div class="entry-content">
                                ${entry.gratitude?.length ? `<p style="margin-bottom: 0.5rem;"><strong>🙏 Grateful for:</strong> ${entry.gratitude.join(', ')}</p>` : ''}
                                ${entry.affirmations?.length ? `<p style="margin-bottom: 0.5rem;"><strong>✨ Affirmations:</strong> ${entry.affirmations.map(normalizeAffirmation).map(a => a.spoken ? `✓ ${escapeHtml(a.text)}` : escapeHtml(a.text)).join(' • ')}</p>` : ''}
                                ${entry.goals?.length ? `<p style="margin-bottom: 0.5rem;"><strong>🎯 Intentions:</strong> ${entry.goals.join(', ')}</p>` : ''}
                                ${entry.notes ? `<p style="margin-top: 0.75rem; font-style: italic; color: var(--color-text-secondary);">"${entry.notes}"</p>` : ''}
                            </div>
                        </div>
                    `).join('')
                : '<p style="color: var(--color-text-tertiary); text-align: center; padding: 2rem;">No entries yet. Start journaling today!</p>'}
            </div>
        `;

        container.innerHTML = html;
    }

    getSuggestedAffirmations() {
        const allAffirmations = [
            // Self-Worth & Confidence
            "I am worthy of love, success, and happiness.",
            "I believe in myself and my abilities.",
            "I am confident in who I am becoming.",
            "I trust myself to make the right decisions.",
            "I am enough, just as I am.",
            "I radiate confidence and self-assurance.",
            "I am proud of who I am and who I am becoming.",

            // Health & Wellness
            "My body is strong, healthy, and full of energy.",
            "I nourish my body with healthy choices.",
            "I am grateful for my body and all it does for me.",
            "Every cell in my body vibrates with health.",
            "I choose foods that fuel my body and mind.",
            "I am getting stronger and healthier every day.",
            "My mind is calm, my body is relaxed.",

            // Abundance & Success
            "I am a magnet for abundance and prosperity.",
            "Wealth flows to me easily and effortlessly.",
            "I am open to receiving all the good life has to offer.",
            "Success is my natural state of being.",
            "I attract opportunities that create abundance.",
            "Money comes to me in expected and unexpected ways.",
            "I am financially free and secure.",

            // Growth & Learning
            "I embrace challenges as opportunities to grow.",
            "Every day I am learning and evolving.",
            "I am open to new ideas and perspectives.",
            "My potential is unlimited.",
            "I learn from every experience.",
            "Growth is my constant companion.",

            // Peace & Happiness
            "I choose peace and joy in every moment.",
            "I release what no longer serves me.",
            "I am surrounded by love and support.",
            "Happiness is my birthright.",
            "I create my own happiness.",
            "I am at peace with my past, present, and future.",
            "Joy flows through me effortlessly.",

            // Relationships
            "I attract loving and supportive relationships.",
            "I am worthy of deep, meaningful connections.",
            "I give and receive love freely.",
            "I communicate my needs with clarity and kindness.",
            "I am surrounded by people who lift me up.",

            // Purpose & Meaning
            "I am living my purpose with passion.",
            "My life has meaning and significance.",
            "I make a positive difference in the world.",
            "I am exactly where I need to be.",
            "I trust the journey of my life.",

            // Courage & Strength
            "I face my fears with courage and grace.",
            "I am brave enough to chase my dreams.",
            "Challenges make me stronger.",
            "I have the power to create change.",
            "I am resilient and can overcome anything."
        ];

        // Get 3 affirmations based on the day
        const now = new Date();
        const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

        const selectedAffirmations = [];
        for (let i = 0; i < 3; i++) {
            const index = (dayOfYear + i * 17) % allAffirmations.length;
            selectedAffirmations.push(allAffirmations[index]);
        }

        return selectedAffirmations;
    }

    addSuggestedAffirmation(affirmation) {
        const today = new Date().toISOString().split('T')[0];
        let todayEntry = APP_DATA.user.manifestationJournal?.find(e => e.date === today);

        if (!todayEntry) {
            todayEntry = {
                date: today,
                gratitude: [],
                affirmations: [],
                goals: [],
                notes: ""
            };
            APP_DATA.user.manifestationJournal = APP_DATA.user.manifestationJournal || [];
            APP_DATA.user.manifestationJournal.push(todayEntry);
        }

        // Check if already added
        if (todayEntry.affirmations.map(normalizeAffirmation).some(a => a.text === affirmation)) {
            toast('This affirmation is already in your list!', 'info');
            return;
        }

        todayEntry.affirmations.push({ text: affirmation, spoken: false });
        saveProgress();
        this.renderManifestation();

        if (window.gamification) {
            window.gamification.awardXP(5, 'Added Affirmation');
        }
    }

    addAffirmation() {
        const affirmation = prompt("Enter your affirmation:\n\n(Start with 'I am...' or 'I have...' for powerful declarations)");
        if (!affirmation) return;

        const today = new Date().toISOString().split('T')[0];
        let todayEntry = APP_DATA.user.manifestationJournal?.find(e => e.date === today);
        
        if (!todayEntry) {
            todayEntry = {
                date: today,
                gratitude: [],
                affirmations: [],
                goals: [],
                notes: ""
            };
            APP_DATA.user.manifestationJournal = APP_DATA.user.manifestationJournal || [];
            APP_DATA.user.manifestationJournal.push(todayEntry);
        }

        todayEntry.affirmations.push({ text: affirmation, spoken: false });
        saveProgress();
        this.renderManifestation();
    }

    toggleAffirmation(index) {
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = APP_DATA.user.manifestationJournal?.find(e => e.date === today);
        if (!todayEntry || !todayEntry.affirmations || !todayEntry.affirmations[index]) return;

        todayEntry.affirmations[index] = normalizeAffirmation(todayEntry.affirmations[index]);
        todayEntry.affirmations[index].spoken = !todayEntry.affirmations[index].spoken;
        saveProgress();
        this.renderManifestation();
    }

    // Consecutive days (ending today or yesterday) with at least one affirmation marked spoken
    getAffirmationStreak() {
        const entries = APP_DATA.user.manifestationJournal || [];
        const spokenDates = new Set(
            entries
                .filter(e => (e.affirmations || []).map(normalizeAffirmation).some(a => a.spoken))
                .map(e => e.date)
        );
        if (spokenDates.size === 0) return 0;

        let streak = 0;
        const cursor = new Date();
        cursor.setHours(0, 0, 0, 0);
        // If today hasn't been done yet, start counting from yesterday so an
        // in-progress day doesn't zero out an existing streak.
        if (!spokenDates.has(cursor.toISOString().split('T')[0])) {
            cursor.setDate(cursor.getDate() - 1);
        }
        while (spokenDates.has(cursor.toISOString().split('T')[0])) {
            streak++;
            cursor.setDate(cursor.getDate() - 1);
        }
        return streak;
    }

    deleteAffirmation(index) {
        const today = new Date().toISOString().split('T')[0];
        let todayEntry = APP_DATA.user.manifestationJournal?.find(e => e.date === today);
        if (todayEntry && todayEntry.affirmations) {
            todayEntry.affirmations.splice(index, 1);
            saveProgress();
            this.renderManifestation();
        }
    }

    saveJournalEntry() {
        const today = new Date().toISOString().split('T')[0];
        const gratitude = document.getElementById('gratitude-input').value.split('\n').filter(g => g.trim());
        const intentions = document.getElementById('intentions-input').value.split('\n').filter(i => i.trim());
        const notes = document.getElementById('journal-notes-input').value;

        let todayEntry = APP_DATA.user.manifestationJournal?.find(e => e.date === today);

        if (!todayEntry) {
            todayEntry = {
                date: today,
                gratitude: [],
                affirmations: [],
                goals: [],
                notes: ""
            };
            APP_DATA.user.manifestationJournal = APP_DATA.user.manifestationJournal || [];
            APP_DATA.user.manifestationJournal.push(todayEntry);
        }

        todayEntry.gratitude = gratitude;
        todayEntry.goals = intentions;
        todayEntry.notes = notes;

        saveProgress();
        if (window.gamification) window.gamification.updateChallengeProgress('journal');
        toast('✨ Journal entry saved! Your manifestations are taking root.', 'success');
        this.renderManifestation(); // Refresh to show saved data
    }

    // ============================================
    // SHADOW WORK
    // ============================================

    renderShadowWork() {
        const container = document.getElementById('shadow-work-content');
        const exercises = APP_DATA.shadowWorkExercises;
        const userProgress = APP_DATA.user.shadowWork;

        // Group exercises by phase
        const beginnerExercises = exercises.filter(e => e.phase === 'beginner');
        const intermediateExercises = exercises.filter(e => e.phase === 'intermediate');
        const advancedExercises = exercises.filter(e => e.phase === 'advanced');

        const html = `
            <div class="shadow-intro">
                <h3>🌑 Jungian Shadow Work</h3>
                <p style="color: var(--color-text-secondary); line-height: 1.8;">
                    "Until you make the unconscious conscious, it will direct your life and you will call it fate." - Carl Jung
                </p>
                <p style="color: var(--color-text-secondary); line-height: 1.8; margin-top: 1rem;">
                    Shadow work is the practice of exploring the unconscious parts of yourself that you've hidden, denied, or disowned.
                    Integrating your shadow leads to wholeness, authenticity, and personal power - what Jung called <em>individuation</em>.
                </p>
            </div>

            <div class="archetype-quiz">
                <h2 style="margin-bottom: 1rem;">Jung's 12 Archetypes - Your Profile</h2>
                <p style="color: var(--color-text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">
                    Each archetype has light and shadow aspects. Click an archetype to see its shadow side.
                </p>
                <div class="archetype-results" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;">
                    ${Object.entries(userProgress.archetypes).map(([archetype, data]) => `
                        <div class="archetype-card" onclick="window.premiumFeatures.showArchetypeShadow('${archetype}')" style="cursor: pointer; padding: 0.75rem; text-align: center;">
                            <div class="archetype-icon" style="font-size: 1.5rem;">${this.getArchetypeIcon(archetype)}</div>
                            <div class="archetype-name" style="font-size: 0.75rem; font-weight: 600;">${archetype.charAt(0).toUpperCase() + archetype.slice(1)}</div>
                            <div class="archetype-percentage" style="font-size: 0.875rem; color: var(--color-primary-light);">${typeof data === 'object' ? data.score : data}%</div>
                        </div>
                    `).join('')}
                </div>
                ${userProgress.quizInProgress && Object.keys(userProgress.quizInProgress.answers || {}).length > 0 ? `
                    <button class="btn-primary" style="width: 100%; margin-top: 1.5rem;" onclick="window.premiumFeatures.resumeArchetypeQuiz()">
                        ▶️ Resume Assessment (${Object.keys(userProgress.quizInProgress.answers).length}/${userProgress.quizInProgress.totalQuestions || 48} answered)
                    </button>
                    <button class="btn-secondary" style="width: 100%; margin-top: 0.75rem;" onclick="window.premiumFeatures.takeArchetypeQuiz()">
                        🔍 Start New Assessment
                    </button>
                ` : `
                    <button class="btn-primary" style="width: 100%; margin-top: 1.5rem;" onclick="window.premiumFeatures.takeArchetypeQuiz()">
                        🔍 Take Archetype Assessment
                    </button>
                `}
            </div>

            <div style="margin: 2rem 0; padding: 1.5rem; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1)); border-radius: 1rem;">
                <h3 style="margin-bottom: 0.5rem;">🗺️ Your Individuation Journey</h3>
                <p style="color: var(--color-text-secondary); font-size: 0.9rem;">Current Phase: <strong style="color: var(--color-primary-light);">${userProgress.currentPhase.charAt(0).toUpperCase() + userProgress.currentPhase.slice(1)}</strong></p>
                <p style="color: var(--color-text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">Exercises Completed: <strong style="color: var(--color-primary-light);">${userProgress.completedExercises.length} / ${exercises.length}</strong></p>
                ${userProgress.quizHistory && userProgress.quizHistory.length > 0 ? `
                    <p style="color: var(--color-text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">Archetype Assessments Taken: <strong style="color: var(--color-primary-light);">${userProgress.quizHistory.length}</strong> (last: ${formatDateForDisplay(userProgress.quizHistory[userProgress.quizHistory.length - 1].date)})</p>
                ` : ''}
            </div>

            <h2 style="margin: 2rem 0 1rem;">🌱 Beginner Exercises</h2>
            <p style="color: var(--color-text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">Start here to begin meeting your shadow</p>
            <div class="shadow-exercises">
                ${beginnerExercises.map((exercise, index) => this.renderExerciseCard(exercise, index)).join('')}
            </div>

            <h2 style="margin: 2rem 0 1rem;">🌿 Intermediate Exercises</h2>
            <p style="color: var(--color-text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">Deeper exploration of complexes and dreams</p>
            <div class="shadow-exercises">
                ${intermediateExercises.map((exercise, index) => this.renderExerciseCard(exercise, index + beginnerExercises.length)).join('')}
            </div>

            <h2 style="margin: 2rem 0 1rem;">🌳 Advanced Exercises</h2>
            <p style="color: var(--color-text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">Integration work for the individuation journey</p>
            <div class="shadow-exercises">
                ${advancedExercises.map((exercise, index) => this.renderExerciseCard(exercise, index + beginnerExercises.length + intermediateExercises.length)).join('')}
            </div>

            <h2 style="margin: 2rem 0 1rem;">📜 Your Shadow Work Journal</h2>
            <p style="color: var(--color-text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">Your saved reflections and insights</p>
            <div class="reflections-journal">
                ${userProgress.reflections && userProgress.reflections.length > 0 ?
                    userProgress.reflections.slice().reverse().map(reflection => {
                        const exercise = exercises.find(e => e.id === reflection.exerciseId);
                        const date = new Date(reflection.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                        return `
                            <div style="background: var(--color-bg-secondary); padding: 1.5rem; border-radius: 1rem; margin-bottom: 1rem; border-left: 4px solid var(--color-primary);">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                                    <div>
                                        <span style="font-size: 1.25rem;">${exercise ? exercise.icon : '📝'}</span>
                                        <strong style="margin-left: 0.5rem;">${exercise ? exercise.title : 'Reflection'}</strong>
                                    </div>
                                    <button onclick="window.premiumFeatures.deleteReflection('${reflection.date}')" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.8rem;">Delete</button>
                                </div>
                                <p style="color: var(--color-text-secondary); font-size: 0.8rem; margin-bottom: 0.75rem;">${date}</p>
                                <p style="color: var(--color-text-primary); line-height: 1.7; white-space: pre-wrap;">${reflection.content}</p>
                            </div>
                        `;
                    }).join('')
                : '<p style="color: var(--color-text-tertiary); text-align: center; padding: 2rem;">No reflections yet. Complete an exercise above to start your shadow work journal.</p>'}
            </div>
        `;

        container.innerHTML = html;
    }

    getArchetypeIcon(archetype) {
        const icons = {
            innocent: '👼',
            orphan: '🥀',
            hero: '⚔️',
            caregiver: '🤲',
            explorer: '🧭',
            rebel: '🔥',
            lover: '💕',
            creator: '🎨',
            jester: '🃏',
            sage: '📚',
            magician: '🔮',
            ruler: '👑'
        };
        return icons[archetype] || '✨';
    }

    renderExerciseCard(exercise, index) {
        const isCompleted = APP_DATA.user.shadowWork.completedExercises.includes(exercise.id);
        return `
            <div class="shadow-exercise ${isCompleted ? 'completed' : ''}">
                <div class="exercise-header" onclick="window.premiumFeatures.toggleExercise(${index})">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span class="exercise-icon">${exercise.icon}</span>
                        <div>
                            <span class="exercise-title">${exercise.title}</span>
                            ${isCompleted ? '<span style="color: #10b981; font-size: 0.75rem; margin-left: 0.5rem;">✓ Completed</span>' : ''}
                        </div>
                    </div>
                    <span style="font-size: 1.5rem; transition: transform 0.3s;">›</span>
                </div>
                <div class="exercise-content" id="exercise-${index}">
                    <div style="background: rgba(139, 92, 246, 0.1); padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem;">
                        <strong style="color: var(--color-primary-light); font-size: 0.8rem;">💡 Jungian Concept:</strong>
                        <p style="color: var(--color-text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">${exercise.jungianConcept}</p>
                    </div>

                    <div class="exercise-prompt">${exercise.prompt}</div>

                    <div style="margin-bottom: 1.5rem;">
                        <strong style="color: var(--color-primary-light); display: block; margin-bottom: 0.5rem;">Reflection Questions:</strong>
                        <ul style="margin-left: 1.5rem; color: var(--color-text-secondary);">
                            ${exercise.questions.map(q => '<li style="margin-bottom: 0.5rem;">' + q + '</li>').join('')}
                        </ul>
                    </div>

                    <textarea
                        class="reflection-input"
                        id="reflection-${exercise.id}"
                        placeholder="Write your reflections here... Be honest and compassionate with yourself."
                        rows="6"
                    ></textarea>

                    <button class="btn-primary" onclick="window.premiumFeatures.saveReflection(${exercise.id})" style="width: 100%;">
                        💾 Save Reflection
                    </button>
                </div>
            </div>
        `;
    }

    showArchetypeShadow(archetype) {
        const archetypeData = APP_DATA.user.shadowWork.archetypes[archetype];
        const shadowDescription = typeof archetypeData === 'object' ? archetypeData.shadow : 'Unknown shadow aspect';

        const archetypeInfo = {
            innocent: { light: "Optimism, faith, purity, trust", shadow: "Naivety, denial, weakness, inability to grow" },
            orphan: { light: "Realism, empathy, resilience, street smarts", shadow: "Victim mentality, cynicism, chronic complaining" },
            hero: { light: "Courage, discipline, mastery, determination", shadow: "Arrogance, ruthlessness, need to always win" },
            caregiver: { light: "Compassion, generosity, nurturing", shadow: "Martyrdom, enabling, manipulation through guilt" },
            explorer: { light: "Freedom, authenticity, ambition", shadow: "Restlessness, aimlessness, inability to commit" },
            rebel: { light: "Liberation, radical freedom, revolution", shadow: "Self-destruction, criminality, chaos for its own sake" },
            lover: { light: "Passion, commitment, appreciation of beauty", shadow: "Obsession, jealousy, loss of identity in others" },
            creator: { light: "Innovation, imagination, artistic vision", shadow: "Perfectionism, creative blocks, drama" },
            jester: { light: "Joy, humor, living in the moment", shadow: "Cruelty, irresponsibility, using humor to avoid depth" },
            sage: { light: "Wisdom, truth, understanding", shadow: "Dogmatism, disconnection from reality, judgment" },
            magician: { light: "Transformation, catalyzing change, vision", shadow: "Manipulation, ego inflation, 'evil wizard'" },
            ruler: { light: "Leadership, responsibility, control", shadow: "Tyranny, being controlling, entitlement" }
        };

        const info = archetypeInfo[archetype] || { light: "Unknown", shadow: "Unknown" };

        toast(`${this.getArchetypeIcon(archetype)} THE ${archetype.toUpperCase()}\n\n` +
            `✨ Light Side:\n${info.light}\n\n` +
            `🌑 Shadow Side:\n${info.shadow}\n\n` +
            `Your Score: ${typeof archetypeData === 'object' ? archetypeData.score : archetypeData}%`, 'success');
    }

    toggleExercise(index) {
        const content = document.getElementById(`exercise-${index}`);
        content.classList.toggle('active');
    }

    saveReflection(exerciseId) {
        const textarea = document.getElementById(`reflection-${exerciseId}`);
        const reflection = textarea.value;

        if (!reflection.trim()) {
            toast('Please write your reflection before saving.', 'info');
            return;
        }

        const reflectionEntry = {
            exerciseId,
            date: new Date().toISOString(),
            content: reflection
        };

        APP_DATA.user.shadowWork.reflections = APP_DATA.user.shadowWork.reflections || [];
        APP_DATA.user.shadowWork.reflections.push(reflectionEntry);

        if (!APP_DATA.user.shadowWork.completedExercises.includes(exerciseId)) {
            APP_DATA.user.shadowWork.completedExercises.push(exerciseId);
        }

        saveProgress();
        toast('✨ Reflection saved. This is brave work you\'re doing. Scroll down to see your journal.', 'success');
        textarea.value = '';
        this.renderShadowWork(); // Refresh to show new reflection
    }

    deleteReflection(dateStr) {
        if (!confirm('Are you sure you want to delete this reflection?')) return;

        APP_DATA.user.shadowWork.reflections = APP_DATA.user.shadowWork.reflections.filter(
            r => r.date !== dateStr
        );
        saveProgress();
        this.renderShadowWork(); // Refresh
        toast('Reflection deleted.', 'info');
    }

    takeArchetypeQuiz() {
        const inProgress = APP_DATA.user.shadowWork.quizInProgress;
        if (inProgress && Object.keys(inProgress.answers || {}).length > 0) {
            if (!confirm('You have an assessment in progress. Starting a new one will discard your saved answers. Continue?')) {
                return;
            }
        }

        this.archetypeQuizData = {
            currentQuestion: 0,
            answers: {},
            archetypeScores: {
                innocent: 0, orphan: 0, hero: 0, caregiver: 0,
                explorer: 0, rebel: 0, lover: 0, creator: 0,
                jester: 0, sage: 0, magician: 0, ruler: 0
            }
        };
        APP_DATA.user.shadowWork.quizInProgress = null;
        saveProgress();

        this.quizQuestions = this.buildQuizQuestions();
        this.renderArchetypeQuiz();
    }

    resumeArchetypeQuiz() {
        const inProgress = APP_DATA.user.shadowWork.quizInProgress;
        if (!inProgress) {
            this.takeArchetypeQuiz();
            return;
        }
        this.archetypeQuizData = {
            currentQuestion: inProgress.currentQuestion || 0,
            answers: inProgress.answers || {},
            archetypeScores: inProgress.archetypeScores || {
                innocent: 0, orphan: 0, hero: 0, caregiver: 0,
                explorer: 0, rebel: 0, lover: 0, creator: 0,
                jester: 0, sage: 0, magician: 0, ruler: 0
            }
        };
        this.quizQuestions = this.buildQuizQuestions();
        this.renderArchetypeQuiz();
    }

    // 48 Deep psychological questions - 4 per archetype
    buildQuizQuestions() {
        return [
            // INNOCENT (Questions 1-4)
            {
                id: 1,
                archetype: "innocent",
                text: "When facing a difficult situation, I genuinely believe that everything will work out for the best.",
                depth: "This reflects your capacity for hope and trust in life's fundamental goodness - the Innocent's core gift.",
                shadowWarning: "Excessive agreement may indicate denial or avoidance of life's darker realities."
            },
            {
                id: 2,
                archetype: "innocent",
                text: "I often feel nostalgic for a simpler time, whether from my childhood or an imagined past.",
                depth: "The Innocent yearns for paradise - a state of wholeness before the 'fall' into complexity.",
                shadowWarning: "This longing, when extreme, can prevent engagement with present reality."
            },
            {
                id: 3,
                archetype: "innocent",
                text: "I prefer to see the good in people, even when others warn me about them.",
                depth: "This reflects the Innocent's faith in human nature and redemption.",
                shadowWarning: "Shadow: vulnerability to manipulation and betrayal through excessive trust."
            },
            {
                id: 4,
                archetype: "innocent",
                text: "I feel uncomfortable with moral ambiguity - I prefer clear distinctions between right and wrong.",
                depth: "The Innocent seeks moral clarity and purity in an ambiguous world.",
                shadowWarning: "Shadow: black-and-white thinking that denies life's complexity."
            },

            // ORPHAN/EVERYMAN (Questions 5-8)
            {
                id: 5,
                archetype: "orphan",
                text: "I've experienced significant disappointment or abandonment that shaped who I am today.",
                depth: "The Orphan is born from the loss of innocence - a necessary but painful awakening.",
                shadowWarning: "Unprocessed wounds can lead to chronic victimhood or cynicism."
            },
            {
                id: 6,
                archetype: "orphan",
                text: "I value belonging to a group and feel uncomfortable standing out too much.",
                depth: "The Orphan seeks the safety of the tribe after learning the world can be harsh.",
                shadowWarning: "Shadow: losing yourself in conformity, fear of authentic self-expression."
            },
            {
                id: 7,
                archetype: "orphan",
                text: "I'm highly attuned to unfairness and injustice - it deeply bothers me when people are mistreated.",
                depth: "Having suffered, the Orphan develops empathy and awareness of others' pain.",
                shadowWarning: "This sensitivity can become hypervigilance or chronic resentment."
            },
            {
                id: 8,
                archetype: "orphan",
                text: "I sometimes feel like life has dealt me a harder hand than others.",
                depth: "The Orphan knows life's hardships intimately - this is both wound and wisdom.",
                shadowWarning: "Shadow: victim mentality that prevents taking responsibility for one's life."
            },

            // HERO (Questions 9-12)
            {
                id: 9,
                archetype: "hero",
                text: "I feel compelled to prove myself through challenges, achievements, or overcoming obstacles.",
                depth: "The Hero's journey is about discovering strength through adversity.",
                shadowWarning: "Shadow: compulsive achievement, inability to rest or show vulnerability."
            },
            {
                id: 10,
                archetype: "hero",
                text: "When I see wrongdoing, I feel a strong urge to intervene and make things right.",
                depth: "The Hero is called to battle injustice and protect the vulnerable.",
                shadowWarning: "Shadow: savior complex, fighting battles that aren't yours to fight."
            },
            {
                id: 11,
                archetype: "hero",
                text: "I'd rather face a difficult challenge head-on than avoid it or find an easier path.",
                depth: "The Hero's courage transforms fear into fuel for growth.",
                shadowWarning: "Shadow: recklessness, seeking conflict, inability to choose peace."
            },
            {
                id: 12,
                archetype: "hero",
                text: "Competition motivates me - I want to be the best at what I do.",
                depth: "The Hero's drive for excellence pushes humanity forward.",
                shadowWarning: "Shadow: ruthlessness, winning at any cost, crushing others to succeed."
            },

            // CAREGIVER (Questions 13-16)
            {
                id: 13,
                archetype: "caregiver",
                text: "I naturally put others' needs before my own, sometimes to my own detriment.",
                depth: "The Caregiver's gift is unconditional love and nurturing presence.",
                shadowWarning: "Shadow: martyrdom, enabling, losing yourself in others' needs."
            },
            {
                id: 14,
                archetype: "caregiver",
                text: "I feel most fulfilled when I'm helping, supporting, or taking care of someone.",
                depth: "The Caregiver finds meaning through service and compassion.",
                shadowWarning: "Shadow: needing to be needed, controlling through caretaking."
            },
            {
                id: 15,
                archetype: "caregiver",
                text: "It's hard for me to say no when someone asks for help, even when I'm exhausted.",
                depth: "The Caregiver's generosity flows from a deep well of empathy.",
                shadowWarning: "Shadow: boundary issues, resentment from over-giving, burnout."
            },
            {
                id: 16,
                archetype: "caregiver",
                text: "I often worry about the wellbeing of people in my life, even when they're fine.",
                depth: "The Caregiver's love expresses through protective concern.",
                shadowWarning: "Shadow: anxiety, helicopter parenting, smothering love."
            },

            // EXPLORER (Questions 17-20)
            {
                id: 17,
                archetype: "explorer",
                text: "I feel restless when my life becomes too routine or predictable.",
                depth: "The Explorer's soul craves discovery and new horizons.",
                shadowWarning: "Shadow: inability to commit, running from intimacy or responsibility."
            },
            {
                id: 18,
                archetype: "explorer",
                text: "I'd rather forge my own path than follow an established route to success.",
                depth: "The Explorer values authenticity over conformity.",
                shadowWarning: "Shadow: aimless wandering, rejection of all structure or guidance."
            },
            {
                id: 19,
                archetype: "explorer",
                text: "I'm drawn to experiences that push me outside my comfort zone.",
                depth: "The Explorer grows through encountering the unknown.",
                shadowWarning: "Shadow: thrill-seeking as escape, addiction to novelty."
            },
            {
                id: 20,
                archetype: "explorer",
                text: "The idea of being 'trapped' in one place, job, or relationship is deeply unsettling to me.",
                depth: "The Explorer's freedom is sacred - constraint feels like death.",
                shadowWarning: "Shadow: fear of commitment, inability to build lasting foundations."
            },

            // REBEL/OUTLAW (Questions 21-24)
            {
                id: 21,
                archetype: "rebel",
                text: "I question authority and social norms - I don't accept rules just because they exist.",
                depth: "The Rebel sees through society's masks and demands authenticity.",
                shadowWarning: "Shadow: destructiveness, chaos for its own sake, self-sabotage."
            },
            {
                id: 22,
                archetype: "rebel",
                text: "I feel a sense of pride in being different from the mainstream.",
                depth: "The Rebel's individuality is a form of integrity and courage.",
                shadowWarning: "Shadow: contrarianism, defining yourself only in opposition to others."
            },
            {
                id: 23,
                archetype: "rebel",
                text: "I believe some systems are so broken they need to be torn down, not reformed.",
                depth: "The Rebel is the revolutionary energy that transforms stagnant structures.",
                shadowWarning: "Shadow: nihilism, destruction without vision for what comes after."
            },
            {
                id: 24,
                archetype: "rebel",
                text: "I've often felt like an outsider who doesn't fit into conventional society.",
                depth: "The Rebel's alienation is the price of seeing what others ignore.",
                shadowWarning: "Shadow: self-isolation, inability to connect, criminal behavior."
            },

            // LOVER (Questions 25-28)
            {
                id: 25,
                archetype: "lover",
                text: "I experience emotions intensely - both joy and pain feel overwhelming at times.",
                depth: "The Lover's sensitivity is their gift - feeling life fully.",
                shadowWarning: "Shadow: emotional flooding, inability to regulate intense feelings."
            },
            {
                id: 26,
                archetype: "lover",
                text: "Physical beauty, sensory experiences, and aesthetics are very important to me.",
                depth: "The Lover appreciates the world through embodied experience.",
                shadowWarning: "Shadow: hedonism, addiction to pleasure, superficiality."
            },
            {
                id: 27,
                archetype: "lover",
                text: "I crave deep intimacy and connection - surface-level relationships feel empty.",
                depth: "The Lover seeks union and merger with the beloved (person, work, or cause).",
                shadowWarning: "Shadow: obsession, jealousy, loss of self in relationships."
            },
            {
                id: 28,
                archetype: "lover",
                text: "I've made significant sacrifices or taken risks for love or passion.",
                depth: "The Lover commits fully - holding nothing back from what they love.",
                shadowWarning: "Shadow: poor boundaries, loving what harms you, drama addiction."
            },

            // CREATOR (Questions 29-32)
            {
                id: 29,
                archetype: "creator",
                text: "I have a strong inner drive to create, build, or bring new things into existence.",
                depth: "The Creator channels divine creative energy into material form.",
                shadowWarning: "Shadow: perfectionism that prevents completion, creative blocks."
            },
            {
                id: 30,
                archetype: "creator",
                text: "I'm never fully satisfied with my work - I always see how it could be better.",
                depth: "The Creator's vision exceeds their execution - this drives improvement.",
                shadowWarning: "Shadow: chronic dissatisfaction, self-criticism, imposter syndrome."
            },
            {
                id: 31,
                archetype: "creator",
                text: "I need to express myself authentically, even if others don't understand or appreciate it.",
                depth: "The Creator's integrity lies in following their unique vision.",
                shadowWarning: "Shadow: artistic ego, inability to collaborate or accept feedback."
            },
            {
                id: 32,
                archetype: "creator",
                text: "I often lose track of time when absorbed in creative or imaginative work.",
                depth: "The Creator enters flow states - temporary ego dissolution in service of creation.",
                shadowWarning: "Shadow: using creation to escape life, neglecting responsibilities."
            },

            // JESTER (Questions 33-36)
            {
                id: 33,
                archetype: "jester",
                text: "I use humor to cope with difficult situations and lighten heavy moments.",
                depth: "The Jester's laughter is medicine - transforming pain through play.",
                shadowWarning: "Shadow: using humor to deflect, inability to take anything seriously."
            },
            {
                id: 34,
                archetype: "jester",
                text: "I enjoy breaking tension, challenging pretentiousness, or pointing out absurdity.",
                depth: "The Jester speaks truth through comedy - the fool who sees what kings cannot.",
                shadowWarning: "Shadow: cruelty disguised as humor, mockery that wounds."
            },
            {
                id: 35,
                archetype: "jester",
                text: "I believe life should be enjoyed - taking things too seriously is a mistake.",
                depth: "The Jester embodies the wisdom of living fully in the present moment.",
                shadowWarning: "Shadow: irresponsibility, inability to plan for the future."
            },
            {
                id: 36,
                archetype: "jester",
                text: "I'm drawn to experiences that are fun, playful, or entertaining.",
                depth: "The Jester reminds us that joy is not frivolous but essential.",
                shadowWarning: "Shadow: addiction to stimulation, avoiding depth or commitment."
            },

            // SAGE (Questions 37-40)
            {
                id: 37,
                archetype: "sage",
                text: "I have a deep desire to understand how things really work beneath the surface.",
                depth: "The Sage seeks truth as the highest value - understanding liberates.",
                shadowWarning: "Shadow: analysis paralysis, knowing without doing, intellectual arrogance."
            },
            {
                id: 38,
                archetype: "sage",
                text: "I question my own beliefs and assumptions regularly - certainty feels dangerous.",
                depth: "The Sage knows that wisdom begins with knowing what you don't know.",
                shadowWarning: "Shadow: endless doubt, inability to commit to any position."
            },
            {
                id: 39,
                archetype: "sage",
                text: "I prefer to observe and analyze situations before taking action.",
                depth: "The Sage values understanding - acting from wisdom rather than impulse.",
                shadowWarning: "Shadow: detachment from life, using thinking to avoid feeling."
            },
            {
                id: 40,
                archetype: "sage",
                text: "Learning and expanding my understanding is one of life's greatest pleasures.",
                depth: "The Sage experiences intellectual discovery as a form of spiritual practice.",
                shadowWarning: "Shadow: accumulating knowledge as substitute for living."
            },

            // MAGICIAN (Questions 41-44)
            {
                id: 41,
                archetype: "magician",
                text: "I believe in the power of consciousness and intention to shape reality.",
                depth: "The Magician understands that inner transformation creates outer change.",
                shadowWarning: "Shadow: manipulation, using spiritual concepts for ego purposes."
            },
            {
                id: 42,
                archetype: "magician",
                text: "I'm fascinated by transformation - how things (and people) can fundamentally change.",
                depth: "The Magician serves as catalyst for metamorphosis.",
                shadowWarning: "Shadow: forcing change on others, playing god, ego inflation."
            },
            {
                id: 43,
                archetype: "magician",
                text: "I see connections and patterns that others often miss.",
                depth: "The Magician perceives the hidden web connecting all things.",
                shadowWarning: "Shadow: paranoia, seeing conspiracies everywhere, magical thinking."
            },
            {
                id: 44,
                archetype: "magician",
                text: "I feel called to help others transform or realize their potential.",
                depth: "The Magician's highest calling is to facilitate others' awakening.",
                shadowWarning: "Shadow: guru complex, manipulating others' development for ego."
            },

            // RULER (Questions 45-48)
            {
                id: 45,
                archetype: "ruler",
                text: "I naturally take charge in group situations and feel comfortable leading others.",
                depth: "The Ruler's gift is the ability to create order and provide direction.",
                shadowWarning: "Shadow: controlling behavior, authoritarianism, power hunger."
            },
            {
                id: 46,
                archetype: "ruler",
                text: "I have high standards and expectations - for myself and for others.",
                depth: "The Ruler's standards elevate everyone in their domain.",
                shadowWarning: "Shadow: perfectionism that crushes, impossible demands."
            },
            {
                id: 47,
                archetype: "ruler",
                text: "I feel responsible for the success and wellbeing of groups I'm part of.",
                depth: "The Ruler carries the weight of collective responsibility willingly.",
                shadowWarning: "Shadow: burden of constant responsibility, inability to let go."
            },
            {
                id: 48,
                archetype: "ruler",
                text: "I believe that with power comes responsibility - and I take both seriously.",
                depth: "The mature Ruler uses power in service of the greater good.",
                shadowWarning: "Shadow: using responsibility to justify control, entitled leadership."
            }
        ];
    }

    renderArchetypeQuiz() {
        const container = document.getElementById('shadow-work-content');
        const data = this.archetypeQuizData;
        const totalQuestions = this.quizQuestions.length;
        const progress = ((data.currentQuestion) / totalQuestions) * 100;

        if (data.currentQuestion >= totalQuestions) {
            this.showArchetypeResults();
            return;
        }

        const question = this.quizQuestions[data.currentQuestion];
        const previousAnswer = data.answers[question.id];

        const html = `
            <div class="archetype-quiz-container" style="max-width: 700px; margin: 0 auto; padding: 1rem;">

                <div class="quiz-header" style="text-align: center; margin-bottom: 2rem;">
                    <h2 style="margin-bottom: 0.5rem;">🔮 Jungian Archetype Assessment</h2>
                    <p style="color: var(--color-text-secondary); font-size: 0.9rem;">
                        Discover your dominant archetypal patterns and shadow aspects
                    </p>
                </div>

                <div class="quiz-progress" style="margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.85rem; color: var(--color-text-secondary);">Question ${data.currentQuestion + 1} of ${totalQuestions}</span>
                        <span style="font-size: 0.85rem; color: var(--color-primary-light);">${Math.round(progress)}% Complete</span>
                    </div>
                    <div style="background: var(--color-bg-tertiary); border-radius: 1rem; height: 8px; overflow: hidden;">
                        <div style="background: linear-gradient(90deg, #8b5cf6, #ec4899); height: 100%; width: ${progress}%; transition: width 0.5s ease;"></div>
                    </div>
                </div>

                <div class="question-card" style="background: var(--color-bg-secondary); border-radius: 1.5rem; padding: 2rem; margin-bottom: 1.5rem;">
                    <div class="archetype-badge" style="display: inline-block; background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2)); padding: 0.5rem 1rem; border-radius: 2rem; font-size: 0.8rem; color: var(--color-primary-light); margin-bottom: 1rem;">
                        ${this.getArchetypeIcon(question.archetype)} The ${question.archetype.charAt(0).toUpperCase() + question.archetype.slice(1)}
                    </div>

                    <h3 style="font-size: 1.25rem; line-height: 1.6; margin-bottom: 1.5rem; color: var(--color-text-primary);">
                        "${question.text}"
                    </h3>

                    <div class="answer-scale" style="display: flex; flex-direction: column; gap: 0.75rem;">
                        ${[
                            { value: 5, label: "Strongly Agree", desc: "This deeply resonates with who I am" },
                            { value: 4, label: "Agree", desc: "This is often true for me" },
                            { value: 3, label: "Neutral", desc: "Sometimes true, sometimes not" },
                            { value: 2, label: "Disagree", desc: "This is rarely true for me" },
                            { value: 1, label: "Strongly Disagree", desc: "This doesn't describe me at all" }
                        ].map(option => `
                            <button
                                class="answer-option ${previousAnswer === option.value ? 'selected' : ''}"
                                onclick="window.premiumFeatures.selectArchetypeAnswer(${question.id}, ${option.value}, '${question.archetype}')"
                                style="
                                    display: flex;
                                    align-items: center;
                                    gap: 1rem;
                                    padding: 1rem 1.25rem;
                                    background: ${previousAnswer === option.value ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))' : 'var(--color-bg-tertiary)'};
                                    border: 2px solid ${previousAnswer === option.value ? 'var(--color-primary)' : 'transparent'};
                                    border-radius: 1rem;
                                    cursor: pointer;
                                    transition: all 0.3s ease;
                                    text-align: left;
                                    width: 100%;
                                "
                            >
                                <div style="
                                    width: 24px;
                                    height: 24px;
                                    border-radius: 50%;
                                    border: 2px solid ${previousAnswer === option.value ? 'var(--color-primary)' : 'var(--color-text-tertiary)'};
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    flex-shrink: 0;
                                    background: ${previousAnswer === option.value ? 'var(--color-primary)' : 'transparent'};
                                ">
                                    ${previousAnswer === option.value ? '<span style="color: white;">✓</span>' : ''}
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: var(--color-text-primary);">${option.label}</div>
                                    <div style="font-size: 0.8rem; color: var(--color-text-secondary);">${option.desc}</div>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="depth-insight" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1)); border-radius: 1rem; padding: 1.25rem; margin-bottom: 1.5rem; border-left: 4px solid var(--color-primary);">
                    <div style="font-size: 0.8rem; color: var(--color-primary-light); font-weight: 600; margin-bottom: 0.5rem;">🔍 PSYCHOLOGICAL DEPTH</div>
                    <p style="color: var(--color-text-secondary); font-size: 0.9rem; line-height: 1.6; margin-bottom: 0.75rem;">${question.depth}</p>
                    <p style="color: #f59e0b; font-size: 0.85rem; font-style: italic;">⚠️ ${question.shadowWarning}</p>
                </div>

                <div class="quiz-navigation" style="display: flex; gap: 1rem; justify-content: space-between;">
                    <button
                        onclick="window.premiumFeatures.previousArchetypeQuestion()"
                        style="
                            flex: 1;
                            padding: 1rem;
                            background: var(--color-bg-tertiary);
                            border: none;
                            border-radius: 0.75rem;
                            color: var(--color-text-secondary);
                            font-weight: 600;
                            cursor: pointer;
                            ${data.currentQuestion === 0 ? 'opacity: 0.5; pointer-events: none;' : ''}
                        "
                    >
                        ← Previous
                    </button>
                    <button
                        onclick="window.premiumFeatures.nextArchetypeQuestion()"
                        style="
                            flex: 1;
                            padding: 1rem;
                            background: linear-gradient(135deg, #8b5cf6, #ec4899);
                            border: none;
                            border-radius: 0.75rem;
                            color: white;
                            font-weight: 600;
                            cursor: pointer;
                            ${!previousAnswer ? 'opacity: 0.5;' : ''}
                        "
                    >
                        ${data.currentQuestion === totalQuestions - 1 ? 'See Results →' : 'Next →'}
                    </button>
                </div>

                <button
                    onclick="window.premiumFeatures.exitArchetypeQuiz()"
                    style="
                        width: 100%;
                        margin-top: 1rem;
                        padding: 0.75rem;
                        background: transparent;
                        border: 1px solid var(--color-text-tertiary);
                        border-radius: 0.75rem;
                        color: var(--color-text-tertiary);
                        font-size: 0.85rem;
                        cursor: pointer;
                    "
                >
                    Save & Exit Quiz (Progress will be kept)
                </button>
            </div>
        `;

        container.innerHTML = html;
    }

    selectArchetypeAnswer(questionId, value, archetype) {
        this.archetypeQuizData.answers[questionId] = value;
        this.saveArchetypeQuizProgress();
        this.renderArchetypeQuiz();
    }

    previousArchetypeQuestion() {
        if (this.archetypeQuizData.currentQuestion > 0) {
            this.archetypeQuizData.currentQuestion--;
            this.saveArchetypeQuizProgress();
            this.renderArchetypeQuiz();
        }
    }

    nextArchetypeQuestion() {
        const currentQ = this.quizQuestions[this.archetypeQuizData.currentQuestion];
        if (!this.archetypeQuizData.answers[currentQ.id]) {
            toast('Please select an answer before continuing.', 'info');
            return;
        }

        this.archetypeQuizData.currentQuestion++;
        this.saveArchetypeQuizProgress();
        this.renderArchetypeQuiz();
    }

    // Persists in-progress quiz answers so exiting mid-assessment doesn't lose them
    saveArchetypeQuizProgress() {
        APP_DATA.user.shadowWork.quizInProgress = {
            currentQuestion: this.archetypeQuizData.currentQuestion,
            answers: this.archetypeQuizData.answers,
            archetypeScores: this.archetypeQuizData.archetypeScores,
            totalQuestions: this.quizQuestions.length
        };
        saveProgress();
    }

    exitArchetypeQuiz() {
        const answeredCount = Object.keys(this.archetypeQuizData.answers || {}).length;
        const message = answeredCount > 0
            ? 'Your progress has been saved. Return to Shadow Work?'
            : 'Return to Shadow Work?';
        if (confirm(message)) {
            this.renderShadowWork();
        }
    }

    showArchetypeResults() {
        // Calculate scores
        const scores = {
            innocent: 0, orphan: 0, hero: 0, caregiver: 0,
            explorer: 0, rebel: 0, lover: 0, creator: 0,
            jester: 0, sage: 0, magician: 0, ruler: 0
        };

        const maxPerArchetype = 20; // 4 questions × 5 max points

        this.quizQuestions.forEach(q => {
            const answer = this.archetypeQuizData.answers[q.id] || 3;
            scores[q.archetype] += answer;
        });

        // Convert to percentages
        Object.keys(scores).forEach(key => {
            scores[key] = Math.round((scores[key] / maxPerArchetype) * 100);
        });

        // Find dominant and shadow archetypes
        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const dominant = sorted.slice(0, 3);
        const suppressed = sorted.slice(-3).reverse();

        // Capture the previous attempt's scores (if any) before overwriting, so
        // the results screen can show how each archetype has shifted over time.
        const quizHistory = APP_DATA.user.shadowWork.quizHistory || [];
        const previousScores = quizHistory.length > 0 ? quizHistory[quizHistory.length - 1].scores : null;

        quizHistory.push({ date: new Date().toISOString().split('T')[0], scores });
        APP_DATA.user.shadowWork.quizHistory = quizHistory;

        // Save to user data
        Object.keys(scores).forEach(key => {
            APP_DATA.user.shadowWork.archetypes[key] = {
                score: scores[key],
                shadow: this.getArchetypeShadowDescription(key)
            };
        });
        APP_DATA.user.shadowWork.quizInProgress = null;
        saveProgress();

        const archetypeDetails = {
            innocent: {
                title: "The Innocent",
                motto: "Free to be you and me",
                core: "Safety, optimism, faith",
                gift: "Trust, hope, and the ability to inspire others with your genuine belief in goodness",
                shadow: "Denial of problems, naivety, inability to grow up, passive-aggressive behavior when paradise is threatened",
                integration: "Honor your capacity for hope while developing discernment. Learn to hold both the light and dark of human nature without losing faith.",
                famous: "Forrest Gump, Buddy the Elf, Mr. Rogers"
            },
            orphan: {
                title: "The Orphan / Everyman",
                motto: "All people are created equal",
                core: "Belonging, realism, empathy",
                gift: "Resilience, street smarts, and the ability to connect with anyone through shared humanity",
                shadow: "Victim mentality, chronic complaining, cynicism, playing the wound for sympathy, learned helplessness",
                integration: "Transform your wounds into wisdom. Your suffering has given you empathy - use it to help others without drowning in victimhood.",
                famous: "Frodo Baggins, Luke Skywalker (early), Cinderella"
            },
            hero: {
                title: "The Hero",
                motto: "Where there's a will, there's a way",
                core: "Mastery, courage, achievement",
                gift: "Courage, discipline, and the ability to overcome any obstacle through sheer determination",
                shadow: "Arrogance, ruthlessness, chronic fighting, inability to rest or be vulnerable, need to always have an enemy",
                integration: "Learn that true strength includes the ability to be soft. Not every situation requires a warrior. Sometimes the heroic act is surrender.",
                famous: "Wonder Woman, Hercules, Katniss Everdeen"
            },
            caregiver: {
                title: "The Caregiver",
                motto: "Love your neighbor as yourself",
                core: "Compassion, generosity, nurturing",
                gift: "Unconditional love, the ability to make others feel safe and cared for, creating family wherever you go",
                shadow: "Martyrdom, enabling destructive behavior, guilt-tripping, caretaking as control, inability to receive",
                integration: "Learn that self-care is not selfish. You cannot pour from an empty cup. Set boundaries with love - it's the highest form of care.",
                famous: "Mary Poppins, Samwise Gamgee, Mother Teresa"
            },
            explorer: {
                title: "The Explorer",
                motto: "Don't fence me in",
                core: "Freedom, authenticity, discovery",
                gift: "Independence, courage to chart new territory, ability to find yourself through the journey",
                shadow: "Chronic dissatisfaction, inability to commit, running from intimacy, perfectionist wandering, alienation",
                integration: "True freedom includes the freedom to stay. Learn that commitment can be an adventure, not a cage. Find the unexplored territories within.",
                famous: "Indiana Jones, Amelia Earhart, Into the Wild's Chris McCandless"
            },
            rebel: {
                title: "The Rebel / Outlaw",
                motto: "Rules are made to be broken",
                core: "Liberation, revolution, radical change",
                gift: "Courage to challenge injustice, ability to see through social masks, catalyst for necessary change",
                shadow: "Self-destruction, crime, nihilism, chaos for its own sake, addiction, inability to follow any rules even beneficial ones",
                integration: "Channel your revolutionary energy toward building, not just destroying. True rebellion is creating a better alternative, not just burning it all down.",
                famous: "Robin Hood, Tyler Durden, V for Vendetta"
            },
            lover: {
                title: "The Lover",
                motto: "You're the only one",
                core: "Passion, intimacy, commitment",
                gift: "Deep capacity for love, appreciation of beauty, ability to make others feel special and desired",
                shadow: "Obsession, jealousy, loss of identity in relationships, addiction to love/sex, manipulation through seduction",
                integration: "Learn that you are whole without the beloved. The deepest love flows from fullness, not need. Love yourself as devotedly as you love others.",
                famous: "Romeo & Juliet, Don Juan, Aphrodite"
            },
            creator: {
                title: "The Creator",
                motto: "If it can be imagined, it can be created",
                core: "Innovation, imagination, expression",
                gift: "Vision, ability to bring new things into being, seeing possibilities where others see nothing",
                shadow: "Perfectionism, creative blocks, using drama to feel alive, inability to finish, dismissing practical concerns",
                integration: "Done is better than perfect. Your vision serves no one trapped in your head. Create imperfectly and iterate. Trust the process.",
                famous: "Da Vinci, Steve Jobs, Willy Wonka"
            },
            jester: {
                title: "The Jester",
                motto: "You only live once",
                core: "Joy, humor, living in the moment",
                gift: "Ability to lighten any situation, speaking truth through humor, reminding others not to take life too seriously",
                shadow: "Cruelty disguised as humor, irresponsibility, using jokes to avoid depth, addiction to fun, wasting potential",
                integration: "Learn when to be serious. Your humor is medicine, but some wounds need attention, not distraction. Depth and play can coexist.",
                famous: "The Joker (light version), Deadpool, Jim Carrey"
            },
            sage: {
                title: "The Sage",
                motto: "The truth will set you free",
                core: "Wisdom, understanding, truth",
                gift: "Ability to see clearly, provide guidance based on deep understanding, value truth above comfort",
                shadow: "Dogmatism, ivory tower detachment, analysis paralysis, using knowledge to feel superior, missing life while studying it",
                integration: "Wisdom without compassion is incomplete. Come down from the mountain and engage with messy human reality. Knowledge must be lived to become wisdom.",
                famous: "Gandalf, Yoda, Dumbledore"
            },
            magician: {
                title: "The Magician",
                motto: "I make things happen",
                core: "Transformation, catalyzing change, vision",
                gift: "Ability to transform situations and people, see hidden connections, make the impossible possible",
                shadow: "Manipulation, cultish behavior, ego inflation, using spiritual concepts for power, disconnection from ordinary reality",
                integration: "True magic serves life, not ego. Use your transformative gifts with humility. The greatest magicians make others powerful, not dependent.",
                famous: "Merlin, Morpheus (Matrix), Dr. Strange"
            },
            ruler: {
                title: "The Ruler",
                motto: "Power isn't everything, it's the only thing",
                core: "Control, leadership, responsibility",
                gift: "Natural authority, ability to create order from chaos, taking responsibility for the collective good",
                shadow: "Tyranny, controlling behavior, inability to delegate, entitlement, using position for personal gain not service",
                integration: "True leadership is servant leadership. The greatest rulers make themselves unnecessary by empowering others. Let go of control to gain true influence.",
                famous: "King Arthur, Miranda Priestly, Game of Thrones' various rulers"
            }
        };

        const container = document.getElementById('shadow-work-content');

        const html = `
            <div class="results-container" style="max-width: 800px; margin: 0 auto; padding: 1rem;">

                <div class="results-header" style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🔮</div>
                    <h2 style="margin-bottom: 0.5rem;">Your Archetypal Profile</h2>
                    <p style="color: var(--color-text-secondary);">Based on your responses, here is your unique psychological blueprint</p>
                </div>

                <div class="dominant-archetypes" style="margin-bottom: 2rem;">
                    <h3 style="color: var(--color-primary-light); margin-bottom: 1rem;">✨ Your Dominant Archetypes</h3>
                    <p style="color: var(--color-text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">
                        These are the archetypal energies most active in your psyche. They shape how you see the world and respond to it.
                    </p>

                    ${dominant.map(([archetype, score], index) => {
                        const details = archetypeDetails[archetype];
                        return `
                            <div class="archetype-result-card" style="
                                background: linear-gradient(135deg, rgba(139, 92, 246, ${0.2 - index * 0.05}), rgba(236, 72, 153, ${0.2 - index * 0.05}));
                                border-radius: 1.5rem;
                                padding: 1.5rem;
                                margin-bottom: 1rem;
                                border-left: 4px solid ${index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : '#b45309'};
                            ">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                                    <div style="display: flex; align-items: center; gap: 1rem;">
                                        <span style="font-size: 2.5rem;">${this.getArchetypeIcon(archetype)}</span>
                                        <div>
                                            <div style="font-size: 0.75rem; color: ${index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : '#b45309'}; font-weight: 600;">
                                                ${index === 0 ? '🥇 PRIMARY' : index === 1 ? '🥈 SECONDARY' : '🥉 TERTIARY'}
                                            </div>
                                            <h3 style="margin: 0;">${details.title}</h3>
                                            <p style="color: var(--color-text-secondary); font-style: italic; font-size: 0.9rem;">"${details.motto}"</p>
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary-light);">${score}%</div>
                                    </div>
                                </div>

                                <div style="margin-bottom: 1rem;">
                                    <div style="font-size: 0.8rem; color: var(--color-primary-light); font-weight: 600; margin-bottom: 0.25rem;">CORE DRIVE</div>
                                    <p style="color: var(--color-text-secondary);">${details.core}</p>
                                </div>

                                <div style="margin-bottom: 1rem;">
                                    <div style="font-size: 0.8rem; color: #10b981; font-weight: 600; margin-bottom: 0.25rem;">✨ YOUR GIFT</div>
                                    <p style="color: var(--color-text-secondary);">${details.gift}</p>
                                </div>

                                <div style="margin-bottom: 1rem;">
                                    <div style="font-size: 0.8rem; color: #ef4444; font-weight: 600; margin-bottom: 0.25rem;">🌑 SHADOW WARNING</div>
                                    <p style="color: var(--color-text-secondary);">${details.shadow}</p>
                                </div>

                                <div style="background: rgba(0,0,0,0.2); border-radius: 0.75rem; padding: 1rem;">
                                    <div style="font-size: 0.8rem; color: #60a5fa; font-weight: 600; margin-bottom: 0.25rem;">🌟 PATH TO INTEGRATION</div>
                                    <p style="color: var(--color-text-secondary); font-size: 0.9rem;">${details.integration}</p>
                                </div>

                                <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--color-text-tertiary);">
                                    <strong>Famous Examples:</strong> ${details.famous}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="shadow-archetypes" style="margin-bottom: 2rem;">
                    <h3 style="color: #f59e0b; margin-bottom: 1rem;">🌑 Your Shadow Archetypes</h3>
                    <p style="color: var(--color-text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">
                        These archetypes scored lowest - they may be suppressed or undeveloped parts of your psyche.
                        Jung taught that integrating these shadows is essential for wholeness.
                    </p>

                    ${suppressed.map(([archetype, score]) => {
                        const details = archetypeDetails[archetype];
                        return `
                            <div class="shadow-result-card" style="
                                background: var(--color-bg-secondary);
                                border-radius: 1rem;
                                padding: 1.25rem;
                                margin-bottom: 0.75rem;
                                border-left: 4px solid #6b7280;
                            ">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="display: flex; align-items: center; gap: 1rem;">
                                        <span style="font-size: 1.5rem; opacity: 0.6;">${this.getArchetypeIcon(archetype)}</span>
                                        <div>
                                            <h4 style="margin: 0;">${details.title}</h4>
                                            <p style="color: var(--color-text-tertiary); font-size: 0.8rem; margin: 0;">Consider: What gifts might this archetype offer you?</p>
                                        </div>
                                    </div>
                                    <div style="font-size: 1.25rem; font-weight: 600; color: var(--color-text-tertiary);">${score}%</div>
                                </div>
                                <p style="color: var(--color-text-secondary); font-size: 0.85rem; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--color-bg-tertiary);">
                                    <strong>Gift you may be missing:</strong> ${details.gift.split(',')[0]}
                                </p>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="all-scores" style="margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1rem;">📊 Complete Archetype Map</h3>
                    ${previousScores ? `<p style="color: var(--color-text-tertiary); font-size: 0.8rem; margin-bottom: 1rem;">Change vs. your previous assessment (${quizHistory[quizHistory.length - 2].date})</p>` : ''}
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;">
                        ${sorted.map(([archetype, score]) => {
                            const delta = previousScores ? score - previousScores[archetype] : null;
                            const deltaLabel = delta === null || delta === 0 ? '' :
                                `<span style="font-size: 0.7rem; font-weight: 700; color: ${delta > 0 ? '#10b981' : '#ef4444'};">${delta > 0 ? '▲' : '▼'} ${Math.abs(delta)}</span>`;
                            return `
                            <div style="
                                background: var(--color-bg-secondary);
                                border-radius: 1rem;
                                padding: 1rem;
                                text-align: center;
                            ">
                                <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">${this.getArchetypeIcon(archetype)}</div>
                                <div style="font-size: 0.7rem; color: var(--color-text-tertiary); text-transform: uppercase;">${archetype}</div>
                                <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary-light);">${score}% ${deltaLabel}</div>
                                <div style="
                                    height: 4px;
                                    background: var(--color-bg-tertiary);
                                    border-radius: 2px;
                                    margin-top: 0.5rem;
                                    overflow: hidden;
                                ">
                                    <div style="
                                        height: 100%;
                                        width: ${score}%;
                                        background: linear-gradient(90deg, #8b5cf6, #ec4899);
                                    "></div>
                                </div>
                            </div>
                        `;
                        }).join('')}
                    </div>
                </div>

                <div class="jung-quote" style="
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1));
                    border-radius: 1.5rem;
                    padding: 2rem;
                    text-align: center;
                    margin-bottom: 2rem;
                ">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🌓</div>
                    <blockquote style="font-size: 1.1rem; font-style: italic; color: var(--color-text-primary); line-height: 1.8; margin-bottom: 1rem;">
                        "One does not become enlightened by imagining figures of light, but by making the darkness conscious.
                        The latter procedure, however, is disagreeable and therefore not popular."
                    </blockquote>
                    <cite style="color: var(--color-text-secondary);">— Carl Gustav Jung</cite>
                </div>

                <div class="next-steps" style="
                    background: var(--color-bg-secondary);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                ">
                    <h3 style="margin-bottom: 1rem;">🧭 Your Integration Path</h3>
                    <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">
                        Understanding your archetypes is just the beginning. True growth comes from:
                    </p>
                    <ul style="color: var(--color-text-secondary); padding-left: 1.5rem; line-height: 2;">
                        <li><strong>Owning your shadow:</strong> Notice when your dominant archetypes' shadows emerge</li>
                        <li><strong>Developing your suppressed archetypes:</strong> They hold gifts you need</li>
                        <li><strong>Dream work:</strong> Your unconscious speaks through symbols and archetypes</li>
                        <li><strong>Active imagination:</strong> Dialogue with your inner figures</li>
                        <li><strong>Complete the shadow exercises below</strong> to deepen your integration</li>
                    </ul>
                </div>

                <button
                    onclick="window.premiumFeatures.renderShadowWork()"
                    class="btn-primary"
                    style="width: 100%; padding: 1rem; font-size: 1rem;"
                >
                    Return to Shadow Work Exercises
                </button>

                <button
                    onclick="window.premiumFeatures.takeArchetypeQuiz()"
                    style="
                        width: 100%;
                        margin-top: 1rem;
                        padding: 1rem;
                        background: transparent;
                        border: 1px solid var(--color-text-tertiary);
                        border-radius: 0.75rem;
                        color: var(--color-text-secondary);
                        cursor: pointer;
                    "
                >
                    Retake Assessment
                </button>
            </div>
        `;

        container.innerHTML = html;
    }

    getArchetypeShadowDescription(archetype) {
        const shadows = {
            innocent: "Naivety, denial, weakness, inability to grow",
            orphan: "Victim mentality, cynicism, chronic complaining",
            hero: "Arrogance, ruthlessness, need to always win",
            caregiver: "Martyrdom, enabling, manipulation through guilt",
            explorer: "Restlessness, aimlessness, inability to commit",
            rebel: "Self-destruction, criminality, chaos for its own sake",
            lover: "Obsession, jealousy, loss of identity in others",
            creator: "Perfectionism, creative blocks, drama",
            jester: "Cruelty, irresponsibility, avoiding depth",
            sage: "Dogmatism, disconnection from reality, judgment",
            magician: "Manipulation, ego inflation, 'evil wizard'",
            ruler: "Tyranny, being controlling, entitlement"
        };
        return shadows[archetype] || "Unknown shadow aspect";
    }

}


// Inner Work creates the instance in app.js.
window.PremiumFeatures = PremiumFeatures;
