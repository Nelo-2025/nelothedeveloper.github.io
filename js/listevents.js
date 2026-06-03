// Event management for Stay N' Play
class EventManager {
    constructor() {
        this.events = this.loadEvents();
        this.eventsList = document.getElementById('events-list');
        this.eventForm = document.getElementById('event-form');
        this.categoryFilter = document.getElementById('category-filter');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.displayEvents();
    }

    setupEventListeners() {
        if (this.eventForm) {
            this.eventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addEvent();
            });
        }

        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', () => {
                this.displayEvents();
            });
        }
    }

    loadEvents() {
        const events = localStorage.getItem('stayPlayEvents');
        if (events) {
            return JSON.parse(events);
        } else {
            // Add some sample events
            const sampleEvents = [
                {
                    id: 1,
                    title: "Playdate at Central Park",
                    description: "Join us for a fun playdate with games and activities for kids aged 2-5.",
                    category: "Playdate",
                    date: "2026-12-15T10:00",
                    location: "Central Park, Main Area",
                    likes: 5,
                    booked: false
                },
                {
                    id: 2,
                    title: "Story Time and Crafts",
                    description: "A creative session with storytelling and hands-on crafts.",
                    category: "Story Time",
                    date: "2026-12-20T14:00",
                    location: "Community Center, Room 101",
                    likes: 3,
                    booked: true
                }
            ];
            localStorage.setItem('stayPlayEvents', JSON.stringify(sampleEvents));
            return sampleEvents;
        }
    }

    saveEvents() {
        localStorage.setItem('stayPlayEvents', JSON.stringify(this.events));
    }

    addEvent() {
        if (this.currentUser?.role !== 'admin') {
            alert('Only admins can add events.');
            return;
        }

        const title = document.getElementById('event-title').value;
        const description = document.getElementById('event-description').value;
        const category = document.getElementById('event-category').value;
        const date = document.getElementById('event-date').value;
        const location = document.getElementById('event-location').value;

        const newEvent = {
            id: Date.now(),
            title,
            description,
            category,
            date,
            location,
            likes: 0,
            booked: false
        };

        this.events.push(newEvent);
        this.saveEvents();
        this.displayEvents();
        this.eventForm.reset();
    }

    displayEvents() {
        const selectedCategory = this.categoryFilter.value;
        const filteredEvents = selectedCategory
            ? this.events.filter(event => event.category === selectedCategory)
            : this.events;

        this.eventsList.innerHTML = '';
        filteredEvents.forEach(event => {
            const eventItem = this.createEventElement(event);
            this.eventsList.appendChild(eventItem);
        });
    }

    createEventElement(event) {
        const li = document.createElement('li');
        li.className = 'event-item';

        const eventDate = new Date(event.date).toLocaleString();

        li.innerHTML = `
            <div class="event-title">${event.title}</div>
            <div class="event-details">
                <p><strong>Description:</strong> ${event.description}</p>
                <p><strong>Category:</strong> ${event.category}</p>
                <p><strong>Date:</strong> ${eventDate}</p>
                <p><strong>Location:</strong> ${event.location}</p>
            </div>
            <div class="event-actions">
                <button class="like-btn" data-id="${event.id}">
                    👍 Like (${event.likes})
                </button>
                <button class="book-btn ${event.booked ? 'booked' : ''}" data-id="${event.id}">
                    ${event.booked ? 'Booked' : 'Book Event'}
                </button>
            </div>
        `;

        // Add event listeners
        const likeBtn = li.querySelector('.like-btn');
        const bookBtn = li.querySelector('.book-btn');

        likeBtn.addEventListener('click', () => this.likeEvent(event.id));
        bookBtn.addEventListener('click', () => this.bookEvent(event.id));

        return li;
    }

    likeEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            event.likes++;
            this.saveEvents();
            this.displayEvents();
        }
    }

    bookEvent(eventId) {
        if (this.currentUser?.role !== 'parent') {
            alert('Only parents can book events.');
            return;
        }

        const event = this.events.find(e => e.id === eventId);
        if (event) {
            if (event.booked) {
                alert('You have already booked this event.');
                return;
            }

            event.booked = true;
            this.saveEvents();
            this.displayEvents();

            // Email notification simulation
            this.showNotification(`Booking confirmed for "${event.title}"! A confirmation email has been sent to your registered email address.`);
        }
    }

    showNotification(message) {
        // Simple notification - in a real app, this would send an email
        alert(message);
    }
}

// Initialize the event manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EventManager();
});