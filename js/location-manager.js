const LocationManager = {
    currentStep: 1,
    map: null,
    marker: null,

    init() {
        this.injectModal();
        this.bindEvents();
    },

    injectModal() {
        const modalHTML = `
            <div class="location-overlay" id="location-modal-overlay">
                <div class="location-modal">
                    <!-- Header -->
                    <div class="location-modal-header">
                        <div class="header-left">
                            <button class="btn-back" id="location-back-btn">←</button>
                            <h2>Add New Location</h2>
                        </div>
                        <div class="step-indicator">
                            <span>Step <span id="current-step-num">1</span> of 3</span>
                            <div class="progress-bar">
                                <div class="progress-fill" id="location-progress"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Stepper -->
                    <div class="location-stepper">
                        <div class="step-item active" data-step="1">
                            <div class="step-number">1</div>
                            <div class="step-text">Details</div>
                        </div>
                        <div class="step-line"></div>
                        <div class="step-item" data-step="2">
                            <div class="step-number">2</div>
                            <div class="step-text">Contact</div>
                        </div>
                        <div class="step-line"></div>
                        <div class="step-item" data-step="3">
                            <div class="step-number">3</div>
                            <div class="step-text">Hours</div>
                        </div>
                    </div>

                    <!-- Body -->
                    <div class="location-modal-body">
                        <!-- Step 1: Details -->
                        <div class="step-content active" id="location-step-1">
                            <div class="location-card">
                                <div class="card-title">
                                    <span class="icon">📍</span> Location Information
                                </div>
                                <div class="input-group">
                                    <label>Location Name</label>
                                    <input type="text" placeholder="e.g. Downtown Central" id="loc-name">
                                </div>
                                <div class="input-group">
                                    <label>Full Address</label>
                                    <textarea placeholder="Enter street name, building number..." id="loc-address"></textarea>
                                </div>
                                <div class="input-group">
                                    <label>City</label>
                                    <input type="text" placeholder="Select or type city" id="loc-city">
                                </div>
                            </div>

                            <div class="map-container">
                                <div class="map-header">
                                    <div class="card-title" style="margin-bottom: 0;">
                                        <span class="icon">🗺️</span> Pin Exact Location
                                    </div>
                                    <button class="btn-autodetect" id="btn-autodetect">Auto-Detect</button>
                                </div>
                                <div class="map-canvas" id="map-canvas" style="min-height: 350px;">
                                    <!-- Leaflet Map will inject here -->
                                </div>
                                <div class="map-coords" id="map-coords">
                                    Move the pin to set coordinates
                                </div>
                            </div>
                        </div>

                        <!-- Step 2: Contact -->
                        <div class="step-content" id="location-step-2">
                            <div class="location-card" style="grid-column: span 2;">
                                <div class="card-title">Contact Information</div>
                                <div class="input-group">
                                    <label>Phone Number</label>
                                    <input type="tel" placeholder="e.g. +63 912 345 6789">
                                </div>
                                <div class="input-group">
                                    <label>Email Address</label>
                                    <input type="email" placeholder="e.g. branch@gshotteas.com">
                                </div>
                            </div>
                        </div>

                        <!-- Step 3: Hours -->
                        <div class="step-content" id="location-step-3">
                             <div class="location-card" style="grid-column: span 2;">
                                <div class="card-title">Opening Hours</div>
                                <p style="color: rgba(255,255,255,0.6);">Work in progress: Schedule management</p>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="location-modal-footer">
                        <div class="footer-left">
                            <button class="btn-outline">Save Draft</button>
                        </div>
                        <div class="footer-right">
                            <button class="btn-cancel" id="location-cancel-btn">Cancel</button>
                            <button class="btn-next" id="location-next-step">Next Step →</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    bindEvents() {
        const overlay = document.getElementById('location-modal-overlay');
        const cancelBtn = document.getElementById('location-cancel-btn');
        const nextBtn = document.getElementById('location-next-step');
        const backBtn = document.getElementById('location-back-btn');
        const detectBtn = document.getElementById('btn-autodetect');
        const addressInput = document.getElementById('loc-address');
        let typingTimer;

        cancelBtn.addEventListener('click', () => this.close());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) this.close(); });

        nextBtn.addEventListener('click', () => {
            if (this.currentStep < 3) this.goToStep(this.currentStep + 1);
            else {
                // Save data to localStorage
                const details = {
                    address: document.getElementById('loc-address').value,
                    city: document.getElementById('loc-city').value,
                    phone: document.querySelector('#location-step-2 input[type="tel"]').value,
                    email: document.querySelector('#location-step-2 input[type="email"]').value
                };

                const user = JSON.parse(localStorage.getItem('gshot-user')) || {};
                const updatedUser = { ...user, ...details };
                localStorage.setItem('gshot-user', JSON.stringify(updatedUser));

                alert('Location details saved successfully!');
                this.close();
            }
        });

        backBtn.addEventListener('click', () => {
            if (this.currentStep > 1) this.goToStep(this.currentStep - 1);
            else this.close();
        });

        detectBtn.addEventListener('click', () => this.autoDetectLocation());

        // Forward Geocoding: Type address -> Move pointer
        addressInput.addEventListener('input', () => {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                const query = addressInput.value.trim();
                if (query.length > 5) {
                    this.forwardGeocode(query);
                }
            }, 800); // 800ms debounce
        });
    },

    initMap() {
        // Manila Default
        const defaultLat = 14.5995;
        const defaultLng = 120.9842;

        if (!this.map) {
            this.map = L.map('map-canvas').setView([defaultLat, defaultLng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);

            this.marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(this.map);

            this.marker.on('dragend', () => {
                const pos = this.marker.getLatLng();
                this.updateCoords(pos.lat, pos.lng);
                this.reverseGeocode(pos.lat, pos.lng);
            });
        } else {
            // Recenter and fix gray area bug
            setTimeout(() => {
                this.map.invalidateSize();
                this.map.setView([defaultLat, defaultLng], 13);
                this.marker.setLatLng([defaultLat, defaultLng]);
            }, 100);
        }
    },

    autoDetectLocation() {
        const detectBtn = document.getElementById('btn-autodetect');
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        detectBtn.textContent = "Detecting...";
        detectBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.map.setView([latitude, longitude], 16);
                this.marker.setLatLng([latitude, longitude]);
                this.updateCoords(latitude, longitude);
                this.reverseGeocode(latitude, longitude);
                detectBtn.textContent = "Auto-Detect";
                detectBtn.disabled = false;
            },
            () => {
                alert("Please enable location permissions in your browser.");
                detectBtn.textContent = "Auto-Detect";
                detectBtn.disabled = false;
            }
        );
    },

    reverseGeocode(lat, lng) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
            .then(res => res.json())
            .then(data => {
                if (data.display_name) {
                    document.getElementById('loc-address').value = data.display_name;
                    document.getElementById('loc-city').value = data.address.city || data.address.town || data.address.province || "";
                }
            })
            .catch(err => console.error("Geocoding failed:", err));
    },

    forwardGeocode(address) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    const latitude = parseFloat(lat);
                    const longitude = parseFloat(lon);

                    this.map.setView([latitude, longitude], 16);
                    this.marker.setLatLng([latitude, longitude]);
                    this.updateCoords(latitude, longitude);

                    // Update city field if possible from display_name
                    const parts = data[0].display_name.split(',');
                    if (parts.length > 2) {
                        document.getElementById('loc-city').value = parts[parts.length - 3].trim();
                    }
                }
            })
            .catch(err => console.error("Forward geocoding failed:", err));
    },

    updateCoords(lat, lng) {
        document.getElementById('map-coords').textContent = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    },

    open() {
        document.getElementById('location-modal-overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => this.initMap(), 100);
    },

    close() {
        document.getElementById('location-modal-overlay').classList.remove('active');
        document.body.style.overflow = '';
    },

    goToStep(step) {
        this.currentStep = step;
        document.querySelectorAll('.step-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`location-step-${step}`).classList.add('active');
        document.querySelectorAll('.step-item').forEach((item, idx) => {
            idx + 1 <= step ? item.classList.add('active') : item.classList.remove('active');
        });
        document.getElementById('current-step-num').textContent = step;
        document.getElementById('location-progress').style.width = `${(step / 3) * 100}%`;
        document.getElementById('location-next-step').textContent = step === 3 ? 'Complete & Save' : 'Next Step →';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    LocationManager.init();
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-open-location]')) {
            e.preventDefault();
            LocationManager.open();
        }
    });
});
