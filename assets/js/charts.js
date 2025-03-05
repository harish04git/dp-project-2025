class BudgetCharts {
    constructor() {
        this.initializeCharts();
        this.updateChartsWithData();
    }

    initializeCharts() {
        // Initialize charts with empty data
        this.createLineChart();
        this.createPieChart();
        this.createBarChart();
    }

    updateChartsWithData() {
        // Get data from localStorage or your data source
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        
        // Process data for charts
        const monthlyData = this.processMonthlyData(transactions);
        const categoryData = this.processCategoryData(transactions);
        
        // Update charts
        this.updateLineChart(monthlyData);
        this.updatePieChart(categoryData);
        this.updateBarChart(monthlyData);
    }

    processMonthlyData(transactions) {
        // Group transactions by month
        const monthlyData = {};
        
        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const month = date.toLocaleString('default', { month: 'short' });
            
            if (!monthlyData[month]) {
                monthlyData[month] = { income: 0, expenses: 0 };
            }
            
            if (transaction.amount > 0) {
                monthlyData[month].income += transaction.amount;
            } else {
                monthlyData[month].expenses += Math.abs(transaction.amount);
            }
        });
        
        return Object.entries(monthlyData).map(([month, data]) => ({
            month,
            ...data
        }));
    }

    processCategoryData(transactions) {
        // Group expenses by category
        const categoryData = {};
        
        transactions.forEach(transaction => {
            if (transaction.amount < 0) {
                const category = transaction.category;
                if (!categoryData[category]) {
                    categoryData[category] = 0;
                }
                categoryData[category] += Math.abs(transaction.amount);
            }
        });
        
        return Object.entries(categoryData).map(([name, value]) => ({
            name,
            value
        }));
    }

    createLineChart() {
        // Initialize line chart logic here
        // You can use a charting library like Chart.js or D3.js
    }

    createPieChart() {
        // Initialize pie chart logic here
    }

    createBarChart() {
        // Initialize bar chart logic here
    }

    updateLineChart(data) {
        // Update line chart with new data
    }

    updatePieChart(data) {
        // Update pie chart with new data
    }

    updateBarChart(data) {
        // Update bar chart with new data
    }
}

// Initialize charts
const budgetCharts = new BudgetCharts();

// Update charts when transactions change
document.addEventListener('transactionsUpdated', () => {
    budgetCharts.updateChartsWithData();
});