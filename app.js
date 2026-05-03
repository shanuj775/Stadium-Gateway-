const stadiumsData = {
    "Eden Gardens": [
        { id: 'EG-1', name: 'North Gate', waitTime: 45, occupancy: 85, status: 'red' },
        { id: 'EG-2', name: 'East Gate', waitTime: 12, occupancy: 30, status: 'green' },
        { id: 'EG-3', name: 'South Gate', waitTime: 25, occupancy: 60, status: 'yellow' },
        { id: 'EG-4', name: 'West Gate', waitTime: 5, occupancy: 15, status: 'green' }
    ],
    "Wankhede": [
        { id: 'WK-1', name: 'Gate 1 (Vinoo Mankad)', waitTime: 10, occupancy: 20, status: 'green' },
        { id: 'WK-2', name: 'Gate 2 (Sunil Gavaskar)', waitTime: 55, occupancy: 92, status: 'red' },
        { id: 'WK-3', name: 'Gate 3 (Sachin Tendulkar)', waitTime: 30, occupancy: 65, status: 'yellow' }
    ]
};

const parkingData = {
    "Eden Gardens": [
        { name: "P1 (VIP)", capacity: 100, filled: 95 },
        { name: "P2 (General)", capacity: 500, filled: 480 },
        { name: "P3 (Maidan)", capacity: 1000, filled: 600 }
    ],
    "Wankhede": [
        { name: "Churchgate P", capacity: 300, filled: 290 },
        { name: "Marine Drive Slot", capacity: 200, filled: 120 }
    ]
};

let currentStadium = "Eden Gardens";
let gates = stadiumsData[currentStadium];
let parkingLots = parkingData[currentStadium];

function renderGates() {
    const container = document.getElementById('gates-container');
    if(!container) return;
    
    // Sort logic
    const sortedGates = [...gates].sort((a, b) => a.waitTime - b.waitTime);
    
    // Make container flex so flex-order works for sorting
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '1rem';
    
    if(container.children.length !== sortedGates.length) {
        container.innerHTML = '';
        sortedGates.forEach((gate, index) => {
            let statusText = gate.status === 'green' ? 'Clear' : gate.status === 'yellow' ? 'Busy' : 'Heavy';
            let colorVar = gate.status === 'green' ? 'primary' : gate.status === 'yellow' ? 'warning' : 'danger';
            const card = document.createElement('div');
            card.className = `gate-card status-${gate.status} animated-element hover-float delay-${(index % 3) + 1}`;
            card.id = `gate-card-${gate.id}`;
            card.style.transition = 'all 0.5s ease';
            card.innerHTML = `
                <div class="gate-info">
                    <h3>${gate.name}</h3>
                    <div class="gate-stats">
                        <span id="wait-${gate.id}"><i class="fa-solid fa-clock"></i> ${gate.waitTime} mins</span>
                        <span id="occ-${gate.id}"><i class="fa-solid fa-users"></i> ${gate.occupancy}% Vol</span>
                    </div>
                    <div class="progress-bg" style="background:rgba(255,255,255,0.05); height:8px; border-radius:4px; margin-top:8px; overflow:hidden;">
                        <div id="bar-${gate.id}" class="progress-bar" style="width: ${gate.occupancy}%; background-color: var(--color-${colorVar}); height:100%; transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease; position:relative; overflow:hidden;">
                            <div style="position:absolute; top:0; left:0; right:0; bottom:0; background:linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); animation: shimmerSlide 2s infinite;"></div>
                        </div>
                    </div>
                </div>
                <div class="gate-action">
                    <span id="badge-${gate.id}" class="badge ${gate.status}">${statusText}</span>
                </div>
            `;
            container.appendChild(card);
        });
    } else {
        sortedGates.forEach((gate, index) => {
            let statusText = gate.status === 'green' ? 'Clear' : gate.status === 'yellow' ? 'Busy' : 'Heavy';
            let colorVar = gate.status === 'green' ? 'primary' : gate.status === 'yellow' ? 'warning' : 'danger';
            
            const card = document.getElementById(`gate-card-${gate.id}`);
            if(card) {
                card.style.order = index; // CSS order for dynamic sorting
                card.className = `gate-card status-${gate.status} hover-float`;
                document.getElementById(`wait-${gate.id}`).innerHTML = `<i class="fa-solid fa-clock"></i> ${gate.waitTime} mins`;
                document.getElementById(`occ-${gate.id}`).innerHTML = `<i class="fa-solid fa-users"></i> ${gate.occupancy}% Vol`;
                
                const bar = document.getElementById(`bar-${gate.id}`);
                bar.style.width = `${gate.occupancy}%`;
                bar.style.backgroundColor = `var(--color-${colorVar})`;
                
                const badge = document.getElementById(`badge-${gate.id}`);
                badge.className = `badge ${gate.status}`;
                badge.innerText = statusText;
            }
        });
    }
}

function updateGateStatus(gate) {
    if(gate.occupancy < 40) gate.status = 'green';
    else if(gate.occupancy < 75) gate.status = 'yellow';
    else gate.status = 'red';
}

function simulateLiveUpdates() {
    setInterval(() => {
        // Gate Simulation
        gates.forEach(gate => {
            const change = Math.floor(Math.random() * 5) - 2;
            gate.occupancy = Math.max(5, Math.min(100, gate.occupancy + change));
            gate.waitTime = Math.floor(gate.occupancy * 0.5);
            updateGateStatus(gate);
        });
        renderGates();
        
        // Parking Simulation
        if(parkingLots) {
            parkingLots.forEach(p => {
                const change = Math.floor(Math.random() * 7) - 3; // Cars entering/leaving
                p.filled = Math.max(0, Math.min(p.capacity, p.filled + change));
            });
            renderParking();
        }
    }, 5000);
}

function renderParking() {
    const container = document.getElementById('parking-container');
    if(!container) return;
    container.innerHTML = '';
    
    if(!parkingLots) return;
    
    parkingLots.forEach(p => {
        const percentage = Math.round((p.filled / p.capacity) * 100);
        const statusColor = percentage > 90 ? 'var(--color-danger)' : percentage > 70 ? 'var(--color-warning)' : 'var(--color-primary)';
        
        container.innerHTML += `
            <div style="margin-bottom:1rem; background:rgba(255,255,255,0.02); padding:1rem; border-radius:12px; border:1px solid var(--glass-border);">
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.9rem;">
                    <span style="color:var(--text-primary);"><i class="fa-solid fa-square-parking" style="color:var(--text-secondary); margin-right:5px;"></i> ${p.name}</span>
                    <span style="color:${statusColor}; font-weight:bold;">${percentage}% Full</span>
                </div>
                <div style="width:100%; height:8px; background:rgba(0,0,0,0.2); border-radius:4px; overflow:hidden;">
                    <div style="width:${percentage}%; background:${statusColor}; height:100%; border-radius:4px; transition:width 1s ease;"></div>
                </div>
                <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:0.5rem; display:flex; justify-content:space-between;">
                    <span>${p.capacity - p.filled} Spots Left</span>
                    <span>Total: ${p.capacity}</span>
                </div>
            </div>
        `;
    });
}

// Live Cricket Match Simulator
let runs = 178;
let balls = 110; // 18.2 overs
let wickets = 4;

function simulateCricketMatch() {
    const scoreEl = document.getElementById('team1-score');
    const oversEl = document.getElementById('team1-overs');
    const statusEl = document.getElementById('match-status-text');
    
    if(!scoreEl) return; // Only runs on public dashboard if scorecard exists

    setInterval(() => {
        // randomly add 0, 1, 2, 4, or 6 runs, or a wicket
        const outcome = Math.random();
        balls++;
        
        let runScored = 0;
        if(outcome > 0.95 && wickets < 10) wickets++;
        else if(outcome > 0.85) runScored = 6;
        else if(outcome > 0.75) runScored = 4;
        else if(outcome > 0.6) runScored = 2;
        else if(outcome > 0.3) runScored = 1;
        
        runs += runScored;
        
        const overCount = Math.floor(balls / 6);
        const ballCount = balls % 6;
        const rr = (runs / (balls/6)).toFixed(1);
        
        scoreEl.innerText = `${runs}/${wickets}`;
        oversEl.innerText = `(${overCount}.${ballCount} ov)`;
        
        if (wickets >= 10) {
            statusEl.innerText = `Innings Break. CSK scored ${runs}.`;
        } else {
            statusEl.innerText = `CSK are batting. Current RR: ${rr}`;
        }
        
        // brief pulse animation on score to show it updated
        scoreEl.style.transform = 'scale(1.2)';
        scoreEl.style.color = 'var(--color-primary)';
        setTimeout(() => {
            scoreEl.style.transform = 'scale(1)';
            scoreEl.style.color = 'var(--color-warning)';
        }, 500);
        
    }, 4500); // every 4.5 seconds a ball is bowled
}

// Support Dynamic Stadium Selection
const stadiumSelector = document.getElementById('stadium-select') || document.getElementById('ticket-stadium-select');
if(stadiumSelector) {
    stadiumSelector.addEventListener('change', (e) => {
        let val = e.target.value;
        // Map 'Modi' to 'Narendra Modi Stadium' if necessary, but here we just need to match app.js keys
        // If ticket-stadium-select has "Modi", we need to map it or update stadiumsData
        currentStadium = val === "Modi" ? "Eden Gardens" : val; // Fallback for demo
        
        if(stadiumsData[currentStadium]) {
            gates = stadiumsData[currentStadium];
        }
        if(parkingData[currentStadium]) {
            parkingLots = parkingData[currentStadium];
        }
        
        const title = document.getElementById('stadium-name');
        if(title) title.innerText = currentStadium;
        
        if(document.getElementById('gates-container')) renderGates();
        if(document.getElementById('parking-container')) renderParking();
    });
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('gates-container')) {
        renderGates();
        simulateCricketMatch();
    }
    
    if(document.getElementById('parking-container')) {
        renderParking();
    }

    if(document.getElementById('gates-container') || document.getElementById('parking-container')) {
        simulateLiveUpdates();
    }
});

// User Portal specific logic
const reportForm = document.getElementById('report-form');
if(reportForm) {
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Add points
        const user = getCurrentUser();
        if(user) {
            user.balance += 10;
            
            // update localstorage db
            const db = JSON.parse(localStorage.getItem(DB_KEY));
            const dbUser = db.users.find(u => u.id === user.id);
            dbUser.balance = user.balance;
            
            // Log history
            const gateSelect = document.getElementById('report-gate');
            const gateName = gateSelect ? gateSelect.options[gateSelect.selectedIndex].text : 'Unknown Gate';
            
            dbUser.history.unshift({
                match: 'Current Match (Live)',
                date: new Date().toLocaleDateString(),
                gate: gateName,
                points: '+10'
            });
            
            db.currentUser = dbUser;
            localStorage.setItem(DB_KEY, JSON.stringify(db));
            
            alert("Report submitted! You earned +10 pts.");
            window.location.reload(); // Reload to show new history
        }
    });
}
