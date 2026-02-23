import { GoogleGenerativeAI as GoogleGenAI } from "https://esm.run/@google/generative-ai";

/**
 * G'SHOT ADMIN INSIGHTS - Underperforming Products Analysis
 */
const API_KEY = "AIzaSyDoLj3ItsOAjZV5H-zCEfcE058As-B07uc";
const ai = new GoogleGenAI(API_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const lowSalesList = document.getElementById('low-sales-list');
    const aiSuggestionText = document.getElementById('ai-suggestion-text');

    async function analyzeBusinessPerformance() {
        try {
            // 1. Get all menu items from localStorage
            const menuData = JSON.parse(localStorage.getItem('gshot-menu'));
            if (!menuData) {
                lowSalesList.innerHTML = '<li>Set up your menu first.</li>';
                return;
            }

            const allProducts = [];
            Object.values(menuData).flat().forEach(item => {
                allProducts.push({ name: item.name, category: item.category || 'Food' });
            });

            // 2. Fetch sales from Supabase
            const { data: sales, error } = await window.supabase
                .from('orders')
                .select('items, created_at')
                .neq('status', 'cancelled');

            if (error) throw error;

            // 3. Calculate sales counts
            const salesCounts = {};
            allProducts.forEach(p => salesCounts[p.name] = 0);

            sales.forEach(order => {
                if (order.items) {
                    const itemsList = order.items.split(', ');
                    itemsList.forEach(itemStr => {
                        const match = itemStr.match(/(\d+)x\s+(.+)/);
                        if (match) {
                            const qty = parseInt(match[1]);
                            const productName = match[2].trim();
                            if (salesCounts.hasOwnProperty(productName)) {
                                salesCounts[productName] += qty;
                            }
                        }
                    });
                }
            });

            // 4. Identify Underperforming Products (sales < 2)
            const underperforming = Object.entries(salesCounts)
                .map(([name, sales]) => ({ name, sales }))
                .filter(item => item.sales < 2)
                .sort((a, b) => a.sales - b.sales);

            // 5. Render list
            if (underperforming.length > 0) {
                lowSalesList.innerHTML = '';
                underperforming.slice(0, 5).forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `${item.name} <span>${item.sales} SOLD</span>`;
                    lowSalesList.appendChild(li);
                });

                // 6. Get AI Suggestion
                generateAISolution(underperforming);
            } else {
                lowSalesList.innerHTML = '<li>Healthy sales across all items!</li>';
                aiSuggestionText.innerHTML = "All your products are performing well. Keep up the great work and consider introducing new seasonal items!";
            }

        } catch (err) {
            console.error("Performance Analysis Error:", err);
            lowSalesList.innerHTML = '<li>Error loading data.</li>';
        }
    }

    async function generateAISolution(underperformingItems) {
        try {
            const model = ai.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: `You are a Business Growth Expert for "G'SHOT TEAS". 
                Your task is to provide a single, powerful, and actionable marketing or operational solution 
                specifically for products that are NOT selling well. 
                
                Keep your response VERY CONCISE (max 3 sentences). 
                Focus on creative solutions like: 
                - Bundle deals
                - Naming improvements
                - Limited time discounts
                - Content/Photography updates
                
                Tone: Expert, encouraging, and direct.`
            });

            const itemsStr = underperformingItems.map(i => `${i.name} (${i.sales} sales)`).join(', ');
            const prompt = `The following products are underperforming: ${itemsStr}. Provide one specific strategy to boost their sales immediately.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            aiSuggestionText.innerHTML = response.text();

        } catch (error) {
            console.error("AI Solution Error:", error);
            aiSuggestionText.innerHTML = "Consider creating a 'Taste Test Bundle' featuring your low-sales items with a best-seller to increase exposure.";
        }
    }

    analyzeBusinessPerformance();
});
