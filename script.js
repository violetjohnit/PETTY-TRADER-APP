document.addEventListener('DOMContentLoaded', () => {
    const tradeForm = document.getElementById('trade-form');
    const tradeList = document.getElementById('trade-list');
    const totalProfitLossEl = document.getElementById('total-profit-loss');

    // Load trades from localStorage
    let trades = JSON.parse(localStorage.getItem('trades')) || [];

    // Initialize application
    function init() {
        renderTrades();
        updateTotalSummary();
    }

    // Render trades in the table
    function renderTrades() {
        tradeList.innerHTML = '';
        trades.forEach((trade, index) => {
            const tr = document.createElement('tr');
            
            const profitLoss = (trade.sellPrice - trade.buyPrice) * trade.quantity;
            const profitLossClass = profitLoss >= 0 ? 'profit' : 'loss';
            const sign = profitLoss >= 0 ? '+' : '';

            tr.innerHTML = `
                <td>${trade.stockName}</td>
                <td>$${Number(trade.buyPrice).toFixed(2)}</td>
                <td>$${Number(trade.sellPrice).toFixed(2)}</td>
                <td>${trade.quantity}</td>
                <td class="${profitLossClass}">${sign}$${profitLoss.toFixed(2)}</td>
                <td><button class="delete-btn" onclick="deleteTrade(${index})">Delete</button></td>
            `;
            tradeList.appendChild(tr);
        });
    }

    // Update total profit/loss summary
    function updateTotalSummary() {
        const total = trades.reduce((acc, trade) => {
            return acc + ((trade.sellPrice - trade.buyPrice) * trade.quantity);
        }, 0);

        totalProfitLossEl.textContent = `${total >= 0 ? '+' : ''}$${total.toFixed(2)}`;
        totalProfitLossEl.className = total >= 0 ? 'profit' : 'loss';
    }

    // Add a new trade
    tradeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const stockName = document.getElementById('stockName').value.trim();
        const buyPrice = parseFloat(document.getElementById('buyPrice').value);
        const sellPrice = parseFloat(document.getElementById('sellPrice').value);
        const quantity = parseInt(document.getElementById('quantity').value);

        if (stockName && !isNaN(buyPrice) && !isNaN(sellPrice) && !isNaN(quantity)) {
            const newTrade = {
                stockName,
                buyPrice,
                sellPrice,
                quantity
            };

            trades.push(newTrade);
            saveData();
            renderTrades();
            updateTotalSummary();
            tradeForm.reset();
            document.getElementById('stockName').focus();
        }
    });

    // Delete a trade
    window.deleteTrade = function(index) {
        if (confirm('Are you sure you want to delete this trade?')) {
            trades.splice(index, 1);
            saveData();
            renderTrades();
            updateTotalSummary();
        }
    }

    // Save trades to localStorage
    function saveData() {
        localStorage.setItem('trades', JSON.stringify(trades));
    }

    init();
});
