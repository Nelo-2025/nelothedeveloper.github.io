/**
 * Admin Dashboard Management
 * Handles admin authentication and dashboard functionality
 */

class AdminDashboard {
    constructor() {
        this.currentUser = this.loadUser();
        this.loginForm = document.getElementById('login-form');
        this.logoutBtn = document.getElementById('logout-btn');
        this.init();
    }

    /**
     * Initialize the dashboard
     */
    init() {
        this.checkLoginStatus();
        this.setupEventListeners();
    }

    /**
     * Setup event listeners for forms and buttons
     */
    setupEventListeners() {
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }

        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    /**
     * Load user from localStorage
     */
    loadUser() {
        const user = localStorage.getItem('stayPlayUser');
        return user ? JSON.parse(user) : null;
    }

    /**
     * Save user to localStorage
     */
    saveUser(user) {
        localStorage.setItem('stayPlayUser', JSON.stringify(user));
    }

    /**
     * Handle admin login
     */
    login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Demo admin credentials
        const adminCredentials = {
            'admin': 'admin123'
        };

        if (adminCredentials[username] && adminCredentials[username] === password) {
            this.currentUser = { username, role: 'admin' };
            this.saveUser(this.currentUser);
            this.checkLoginStatus();
        } else {
            alert('Invalid admin credentials. Please try again.\nDemo account: admin / admin123');
            document.getElementById('password').value = '';
        }
    }

    /**
     * Handle admin logout
     */
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            this.currentUser = null;
            localStorage.removeItem('stayPlayUser');
            this.checkLoginStatus();
        }
    }

    /**
     * Check and display login status
     */
    checkLoginStatus() {
        const loginSection = document.getElementById('login-section');
        const adminContent = document.getElementById('admin-content');
        const currentUserSpan = document.getElementById('current-user');

        if (this.currentUser && this.currentUser.role === 'admin') {
            if (loginSection) loginSection.style.display = 'none';
            if (adminContent) adminContent.style.display = 'block';
            if (currentUserSpan) {
                currentUserSpan.textContent = this.currentUser.username;
            }
        } else {
            if (loginSection) loginSection.style.display = 'block';
            if (adminContent) adminContent.style.display = 'none';
        }
    }
}

/**
 * Initialize admin dashboard when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    new AdminDashboard();
});