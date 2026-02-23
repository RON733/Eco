import { GoogleGenerativeAI as GoogleGenAI } from "https://esm.run/@google/generative-ai";

/**
 * G'SHOT AI Consultant - Official SDK Integration (Gemini 3 Preview)
 * Using the key you provided: AIzaSyDoLj3ItsOAjZV5H-zCEfcE058As-B07uc
 */
const API_KEY = "AIzaSyDoLj3ItsOAjZV5H-zCEfcE058As-B07uc";
const ai = new GoogleGenAI(API_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Create and Inject the Widget
    const widget = document.createElement('div');
    widget.className = 'ai-chat-widget';
    widget.innerHTML = `
        <button class="ai-chat-button" id="aiChatBtn" title="Talk to G'SHOT AI">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2 22l5-1.338c1.47.851 3.179 1.338 5 1.338 5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.474 0-2.85-.4-4.022-1.097l-.274-.163-1.55.414.414-1.55-.163-.274A7.957 7.957 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/></svg>
        </button>
        <div class="ai-chat-window" id="aiChatWindow">
            <div class="ai-chat-header">
                <div class="ai-avatar">G</div>
                <div class="ai-info">
                    <h3>G'SHOT Assistant</h3>
                    <p>● Powered by Gemini 3 Flash</p>
                </div>
                <button id="closeAiChat" style="background:transparent; border:none; color:white; cursor:pointer; font-size:1.2rem; margin-left:auto;">✕</button>
            </div>
            <div class="ai-chat-messages" id="aiMessages">
                <div class="message ai">Hello there! 👋 Welcome to <strong>G'SHOT TEAS</strong>, home of "The Ultimate Bite"!<br><br>I'm your AI consultant. What are you in the mood for today? Choose a category below or ask me about our specialties!</div>
            </div>
            <div class="ai-suggestions" id="aiSuggestions">
                <div class="suggestion-pill">View Menu 📋</div>
                <div class="suggestion-pill">Event Packages ☕</div>
                <div class="suggestion-pill">Best Sellers 🌟</div>
                <div class="suggestion-pill">How to Book? 📅</div>
            </div>
            <div class="ai-chat-input-area">
                <input type="text" id="aiInput" placeholder="Ask me anything..." autocomplete="off">
                <button class="ai-send-btn" id="aiSendBtn">
                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    const chatBtn = document.getElementById('aiChatBtn');
    const chatWindow = document.getElementById('aiChatWindow');
    const aiInput = document.getElementById('aiInput');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiMessages = document.getElementById('aiMessages');
    const closeAiBtn = document.getElementById('closeAiChat');

    // Toggle Chat Window
    chatBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            aiInput.focus();
        }
    });

    closeAiBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Handle Sending Messages (Using your requested snippet logic)
    async function handleSend() {
        const text = aiInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        aiInput.value = '';

        const typingId = showTyping();

        try {
            const menuContext = typeof defaultMenuData !== 'undefined' ? JSON.stringify(defaultMenuData) : "Snacks: Burgers, MilkTea, Pizza, Coffee, Rice Meals.";

            const model = ai.getGenerativeModel({
                model: "gemini-3-flash-preview",
                systemInstruction: `You are a helpful and energetic assistant for "G'SHOT TEAS".
                Context:
                - Brand: G'SHOT TEAS "The Ultimate Bite"
                - Menu: ${menuContext}
                - Packages: Coffee (₱3,500), Fruity Float (₱3,500).
                
                Instructions:
                - Use [GOTO:category_name] to suggest a category (milkteas, coffee, pizza, burgers, ricemeals).
                - Use emojis and keep it professional but friendly.`
            });

            const result = await model.generateContent(text);
            const response = await result.response;
            let aiText = response.text();

            hideTyping(typingId);

            // Process Tags
            if (aiText.includes('[GOTO:')) {
                const match = aiText.match(/\[GOTO:(\w+)\]/);
                if (match && match[1]) {
                    executeCommand('goto', match[1]);
                    aiText = aiText.replace(/\[GOTO:\w+\]/, "Showing you the requested menu!");
                }
            }
            addMessage(aiText, 'ai');

        } catch (error) {
            hideTyping(typingId);
            console.error("SDK Error:", error);
            if (error.message.includes("quota")) {
                addMessage("Quota exceeded. Please wait 60 seconds. ⏳", 'ai');
            } else {
                addMessage(`❌ SDK Error: ${error.message}`, 'ai');
            }
        }
    }

    function executeCommand(cmd, value) {
        if (cmd === 'goto') {
            const navItem = document.querySelector(`li[data-category="${value}"]`);
            if (navItem) navItem.click();
        }
    }

    function addMessage(text, sender, isHTML = false) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        if (isHTML) {
            div.innerHTML = text;
        } else {
            div.textContent = text;
        }
        aiMessages.appendChild(div);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    function showTyping() {
        const id = Date.now();
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.id = `typing-${id}`;
        div.innerHTML = '<span></span><span></span><span></span>';
        aiMessages.appendChild(div);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        return id;
    }

    function hideTyping(id) {
        const el = document.getElementById(`typing-${id}`);
        if (el) el.remove();
    }

    aiSendBtn.addEventListener('click', handleSend);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Helper for specialized AI responses
    function showSpecialResponse(text, buttons = []) {
        const typingId = showTyping();
        setTimeout(() => {
            hideTyping(typingId);
            addMessage(text, 'ai', true);
            if (buttons.length > 0) {
                const btnContainer = document.createElement('div');
                btnContainer.className = 'choice-btns';
                buttons.forEach(btnInfo => {
                    const btn = document.createElement('button');
                    btn.className = `choice-btn ${btnInfo.primary ? 'primary' : ''}`;
                    btn.textContent = btnInfo.text;
                    btn.onclick = btnInfo.action;
                    btnContainer.appendChild(btn);
                });
                aiMessages.appendChild(btnContainer);
                aiMessages.scrollTop = aiMessages.scrollHeight;
            }
        }, 600);
    }

    // Handle Suggestions
    document.getElementById('aiSuggestions').addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-pill')) {
            const pillText = e.target.textContent;

            // 1. View Menu - Redirect to menu page
            if (pillText.includes('View Menu')) {
                window.location.href = '../view menu/menu.html';
                return;
            }

            // 2. Event Packages - AI response + Button
            if (pillText.includes('Event Packages')) {
                addMessage(pillText, 'user');
                showSpecialResponse(
                    "We have amazing event packages for your celebrations! ☕<br><br>• <strong>Coffee Package:</strong> ₱3,500 (50 pax)<br>• <strong>Fruity Float Package:</strong> ₱3,500 (50 pax)<br><br>Our team handles the setup and service so you can enjoy the party!",
                    [{
                        text: 'View Event Packages 📋',
                        primary: true,
                        action: () => {
                            window.location.href = '../main/index.html#booking';
                            chatWindow.classList.remove('active');
                        }
                    }]
                );
                return;
            }

            // 3. Best Sellers - Filter and show best sellers
            if (pillText.includes('Best Sellers')) {
                addMessage(pillText, 'user');
                let bestSellersList = "";

                // If defaultMenuData is available (from menu.js), use it
                if (typeof defaultMenuData !== 'undefined') {
                    const allItems = Object.values(defaultMenuData).flat();
                    const bestSellers = allItems.filter(item => item.bestSeller).slice(0, 5);
                    bestSellersList = bestSellers.map(item => `• <strong>${item.name}</strong> - ${item.price}`).join('<br>');
                } else {
                    bestSellersList = "• Classic Pearl Milk Tea<br>• Double Smash Burger<br>• Pepperoni Passion Pizza<br>• Velvet Latte";
                }

                showSpecialResponse(
                    `Here are our crowd favorites! 🌟 These are the most ordered items at G'SHOT TEAS:<br><br>${bestSellersList}<br><br>Would you like to order any of these?`,
                    [{
                        text: 'Go to Menu 🛒',
                        primary: true,
                        action: () => window.location.href = '../view menu/menu.html'
                    }]
                );
                return;
            }

            // 4. How to Book? - Direction with Choice
            if (pillText.includes('How to Book?')) {
                addMessage(pillText, 'user');
                showSpecialResponse(
                    "Booking with us is easy! You can reserve our services for events, catering, or bulk orders. 📅<br><br>Would you like to go to the booking section now to see the requirements and fill out the form?",
                    [
                        {
                            text: 'Yes, take me there! ✨',
                            primary: true,
                            action: () => {
                                window.location.href = '../main/index.html#booking';
                                chatWindow.classList.remove('active');
                            }
                        },
                        {
                            text: 'Maybe later',
                            primary: false,
                            action: () => addMessage("No problem! Let me know if you need anything else. 😊", 'ai')
                        }
                    ]
                );
                return;
            }

            // Fallback to normal AI processing for other suggestions
            const query = e.target.textContent.replace(/[^\w\s\?]/g, '').trim();
            aiInput.value = query;
            handleSend();
        }
    });
});
