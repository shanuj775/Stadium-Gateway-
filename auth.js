// Central Authentication and State
const DB_KEY = 'gateflow_db';

function initTheme() {
    const savedTheme = localStorage.getItem('gateflow_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('gateflow_theme', newTheme);
}

const defaultDb = {
    users: [
        { id: 1, role: 'admin', username: 'admin', password: 'password', balance: 0, history: [] },
        { id: 2, role: 'user', username: 'sahil', password: 'password', balance: 450, history: [
            { match: 'CSK vs MI', date: 'May 01, 2026', gate: 'East Gate', points: '+10' },
            { match: 'RCB vs KKR', date: 'Apr 28, 2026', gate: 'West Gate', points: '+20' }
        ]}
    ],
    currentUser: null
};

function initDB() {
    if(!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify(defaultDb));
    }
}

function login(username, password) {
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    const user = db.users.find(u => u.username === username && u.password === password);
    if(user) {
        db.currentUser = user;
        localStorage.setItem(DB_KEY, JSON.stringify(db));
        return user;
    }
    return null;
}

function register(username, password) {
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    const exists = db.users.find(u => u.username === username);
    if(exists) {
        return { error: 'Username already taken. Please login instead.' };
    }
    const newUser = {
        id: Date.now(),
        role: 'user',
        username: username,
        password: password,
        balance: 0,
        history: []
    };
    db.users.push(newUser);
    db.currentUser = newUser;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return { user: newUser };
}

function logout() {
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    db.currentUser = null;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    window.location.href = 'index.html';
}

function getCurrentUser() {
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    return db ? db.currentUser : null;
}

function requireAuth(role) {
    const user = getCurrentUser();
    if(!user) {
        window.location.href = 'index.html';
    } else if(role && user.role !== role) {
        window.location.href = user.role === 'admin' ? 'admin.html' : 'user.html';
    }
}

// Run init functions
initTheme();
initDB();

// Global Theme Button listener setup
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle-btn');
    if(btn) btn.addEventListener('click', toggleTheme);
});

// Dynamic Navbar update for logged-in users
function updateNavForUser() {
    const user = getCurrentUser();
    if(user) {
        const navControls = document.querySelector('.nav-controls');
        if(navControls) {
            // Find the "Log In" button (using textContent to bypass CSS uppercase transformation)
            const loginBtn = Array.from(navControls.querySelectorAll('button')).find(b => b.textContent.trim().toLowerCase() === 'log in');
            if(loginBtn) {
                // Replace it with the User Profile link
                const profileLink = document.createElement('a');
                profileLink.href = user.role === 'admin' ? 'admin.html' : 'user.html';
                profileLink.className = 'glass-btn glass-btn-outline';
                profileLink.style.cssText = 'text-decoration:none; width:auto; padding:0.4rem 1rem; display:flex; align-items:center; gap:0.5rem; background:rgba(16, 185, 129, 0.1); border: 1px solid var(--color-primary); color: var(--text-primary); margin-left:0.5rem; font-weight: bold;';
                profileLink.innerHTML = `<i class="fa-solid fa-user" style="color:var(--color-primary);"></i> ${user.username.toUpperCase()}`;
                
                navControls.replaceChild(profileLink, loginBtn);
            }
        }
    }
}
updateNavForUser();

// Global Panic Button logic
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('panic-btn-global') && !document.getElementById('panic-btn')) {
        const btn = document.createElement('button');
        btn.id = 'panic-btn-global';
        btn.className = 'glass-btn hover-float';
        btn.style.cssText = 'position:fixed; bottom:30px; right:30px; width:70px; height:70px; border-radius:50%; background:var(--color-danger); color:white; font-size:2rem; z-index:9999; box-shadow: 0 0 25px rgba(239, 68, 68, 0.8); display:flex; justify-content:center; align-items:center; animation: pulseRed 2s infinite; border: 2px solid rgba(255,255,255,0.3);';
        btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
        
        btn.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]);
            
            const confirmed = confirm("🚨 EMERGENCY SOS 🚨\n\nAre you sure you want to trigger a Panic Alert?\nThis will instantly share your live GPS location with stadium security and dispatch an ambulance from the nearest hospital.");
            
            if(confirmed) {
                const stidSelect = document.getElementById('stadium-select');
                const ticketStidSelect = document.getElementById('ticket-stadium-select');
                let loc = "your location";
                if(stidSelect) loc = stidSelect.value;
                if(ticketStidSelect) loc = ticketStidSelect.value;
                
                alert(`✅ SOS TRIGGERED SUCCESSFULLY!\n\n📍 Live Location shared.\n🚑 Ambulance dispatched from City Hospital (ETA: 4 mins).\n👮 Rapid Action Security team is en route to ${loc}. Please stay calm and remain where you are.`);
            }
        });
        
        document.body.appendChild(btn);
    }
});

// Multi-Language Support Engine
const hiTranslations = {
    // Nav & General
    'Live Traffic': 'लाइव ट्रैफ़िक',
    'Tickets': 'टिकट',
    'Fan Zone': 'फैन ज़ोन',
    'Shop': 'दुकान',
    'Log In': 'लॉग इन',
    'Create Account': 'खाता बनाएं',
    'Home': 'होम',
    'Secure Login': 'सुरक्षित लॉगिन',
    'Register Now': 'अभी रजिस्टर करें',
    'Username': 'यूजरनाम',
    'Password': 'पासवर्ड',
    'Enter username': 'यूजरनाम डालें',
    'Enter password': 'पासवर्ड डालें',
    'Don\'t have an account?': 'खाता नहीं है?',
    'Already have an account?': 'पहले से ही खाता है?',
    'Sign Up': 'साइन अप',
    'New Fan? Check out the Live Traffic': 'नए प्रशंसक? लाइव ट्रैफिक देखें',
    'View Public Dashboard': 'पब्लिक डैशबोर्ड देखें',
    'Smart Stadium Advisory': 'स्मार्ट स्टेडियम सलाह',
    'Join the Fan Community': 'फैन समुदाय में शामिल हों',

    // Dashboard
    'Live Match Score': 'लाइव मैच स्कोर',
    'Join the Community': 'समुदाय से जुड़ें',
    'Earn Rewards for Updates': 'इनाम पाएं',
    'Your Live Location': 'आपकी लाइव लोकेशन',
    'Tracking Active': 'ट्रैकिंग सक्रिय',
    'Fetching GPS Coordinates...': 'GPS प्राप्त कर रहा है...',
    'Live Gate Traffic': 'लाइव गेट ट्रैफ़िक',
    'Stadium Layout': 'स्टेडियम लेआउट',
    'Select Stadium': 'स्टेडियम चुनें',
    'Seat Booking': 'सीट बुकिंग',
    'Book Now': 'अभी बुक करें',
    'Available': 'उपलब्ध',
    'Booked': 'बुक',
    'Selected': 'चुना गया',
    'Live Status': 'लाइव स्थिति',
    'Pitch': 'पिच',
    'North': 'उत्तर',
    'South': 'दक्षिण',
    'East': 'पूर्व',
    'West': 'पश्चिम',
    'Eden Gardens': 'ईडन गार्डन्स',
    'Wankhede Stadium': 'वानखेड़े स्टेडियम',
    'Narendra Modi Stadium': 'नरेंद्र मोदी स्टेडियम',
    'VS': 'बनाम',
    'Live Team Updates': 'लाइव टीम अपडेट',
    'Select Venue': 'स्थान चुनें',
    'Live Parking': 'लाइव पार्किंग',
    'Interactive Stadium Map': 'इंटरएक्टिव स्टेडियम मैप',
    'Seating Plan': 'सीटिंग प्लान',
    'Reserve Premium Parking Spot': 'प्रीमियम पार्किंग स्पॉट रिजर्व करें',
    'Tickets Selected': 'चुने गए टिकट',
    'Estimated Total': 'अनुमानित कुल',
    'PROCEED TO CHECKOUT': 'चेकआउट के लिए आगे बढ़ें',
    'Smart Routing Advisory': 'स्मार्ट रूटिंग सलाह',
    'Zone Capacity Breakdown': 'ज़ोन क्षमता विवरण',
    'Emergency Safety Broadcast': 'आपातकालीन सुरक्षा प्रसारण',
    'Live Parking Status': 'लाइव पार्किंग स्थिति',
    'Updating': 'अपडेट हो रहा है',
    'Clear': 'साफ',
    'Busy': 'व्यस्त',
    'Heavy': 'भारी',
    'mins': 'मिनट',
    'Vol': 'क्षमता',
    'CSK are batting': 'CSK बल्लेबाजी कर रहे हैं',
    'Current RR': 'वर्तमान रन रेट',
    'Ready to Book?': 'बुकिंग के लिए तैयार?',
    'Choose your preferred stadium to view live availability.': 'लाइव उपलब्धता देखने के लिए अपना पसंदीदा स्टेडियम चुनें।',
    'Select a stadium above and click on a stand in the map to choose your seats.': 'स्टेडियम चुनें और अपनी सीटें चुनने के लिए मैप में स्टैंड पर क्लिक करें।',
    'Safety Broadcast': 'सुरक्षा प्रसारण',
    'Emergency Advisory': 'आपातकालीन सलाह',
    'Security Notice:': 'सुरक्षा सूचना:',
    'North Gate is currently experiencing severe congestion. Please reroute to East Gate.': 'नॉर्थ गेट पर वर्तमान में भारी भीड़ है। कृपया ईस्ट गेट की ओर जाएं।',
    'Medical:': 'चिकित्सा:',
    'Medical stations at Sector 4 and 9 are fully operational.': 'सेक्टर 4 और 9 के मेडिकल स्टेशन पूरी तरह सक्रिय हैं।',
    'Advisory sent to': 'सलाह भेजी गई:',
    'Near Gate 4, Eden Gardens': 'गेट 4 के पास, ईडन गार्डन्स',
    'Near Gate 2, Wankhede Stadium': 'गेट 2 के पास, वानखेड़े स्टेडियम',
    'Accuracy: 3 Meters': 'सटीकता: 3 मीटर',
    'Location shared with emergency services for safety.': 'सुरक्षा के लिए आपातकालीन सेवाओं के साथ लोकेशन साझा की गई।',
    'ACTIVE': 'सक्रिय',
    'Recommended Path': 'अनुशंसित मार्ग',
    'Est. Time to Seat:': 'सीट तक पहुंचने का समय:',
    'Unlock VIP Fan Perks': 'VIP फैन लाभ अनलॉक करें',
    'Join GateFlow today. Report live crowd levels to earn points for': 'आज ही गेटफ़्लो से जुड़ें। अंक अर्जित करने के लिए लाइव भीड़ के स्तर की रिपोर्ट करें',
    'Free Snacks': 'मुफ्त नाश्ता',
    'Merch': 'मर्च',
    'VIP Upgrades!': 'VIP अपग्रेड!',
    'CREATE FREE ACCOUNT': 'मुफ्त खाता बनाएं',
    'Log in to earn rewards for reporting congestion!': 'भीड़ की रिपोर्ट करने के लिए इनाम पाने के लिए लॉग इन करें!',

    // Shop & Fan Zone
    'Global Fan Chat': 'ग्लोबल फैन चैट',
    'वैश्विक प्रशंसक चैट': 'वैश्विक प्रशंसक चैट',
    'Type your message...': 'अपना संदेश टाइप करें...',
    'Start Game': 'खेल शुरू करें',
    'Score': 'स्कोर',
    'Mini Game: Reflex Catcher': 'मिनी गेम: रिफ्लेक्स कैचर',
    'Stadium Food Menu': 'स्टेडियम फूड मेनू',
    'Team Merchandise': 'टीम मर्चेंडाइज',
    'Cart Total': 'कार्ट टोटल',
    'Official Merchandise': 'आधिकारिक मर्चेंडाइज',
    'Express Food Pickup': 'एक्सप्रेस फूड पिकअप',
    'Prep': 'तैयारी',
    'Add': 'जोड़ें',
    'ADDED!': 'जोड़ा गया!',
    
    // User / Admin
    'My Dashboard': 'मेरा डैशबोर्ड',
    'Total Points': 'कुल अंक',
    'Transaction History': 'लेनदेन का इतिहास',
    'Report Gate Status': 'गेट स्थिति रिपोर्ट करें',
    'Submit Report': 'रिपोर्ट सबमिट करें',
    'Admin Panel': 'एडमिन पैनल',
    'Live Overview': 'लाइव अवलोकन',
    'System Logs': 'सिस्टम लॉग'
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Language Selector into Navbar or Top Right
    const navControls = document.querySelector('.nav-controls');
    const loginBody = document.querySelector('.login-body');
    
    if (!document.getElementById('lang-select')) {
        const langSelect = document.createElement('select');
        langSelect.id = 'lang-select';
        langSelect.className = 'glass-input';
        langSelect.style.cssText = 'width: auto; padding: 0.4rem; margin-right: 10px; cursor: pointer; border-radius:8px; font-weight:bold; z-index:10000;';
        langSelect.innerHTML = `
            <option value="en">EN</option>
            <option value="hi">HI</option>
        `;
        langSelect.value = localStorage.getItem('gateflow_lang') || 'en';
        
        langSelect.addEventListener('change', (e) => {
            localStorage.setItem('gateflow_lang', e.target.value);
            window.location.reload();
        });
        
        if (navControls) {
            const themeBtn = document.getElementById('theme-toggle-btn');
            if (themeBtn) {
                navControls.insertBefore(langSelect, themeBtn);
            } else {
                navControls.prepend(langSelect);
            }
        } else if (loginBody) {
            // Support for login page
            langSelect.style.position = 'fixed';
            langSelect.style.top = '20px';
            langSelect.style.right = '80px';
            document.body.appendChild(langSelect);
        }
    }

    // 2. Apply Translations if needed
    const lang = localStorage.getItem('gateflow_lang');
    if (lang === 'hi') {
        const walkDOM = (node) => {
            if (node.nodeType === 3) {
                // Partial string replacement for dynamic content
                let content = node.nodeValue;
                let changed = false;
                for (let key in hiTranslations) {
                    if (content.includes(key)) {
                        content = content.replace(key, hiTranslations[key]);
                        changed = true;
                    }
                }
                if (changed) node.nodeValue = content;
            } else if (node.nodeType === 1 && node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE") {
                // Translate Placeholders
                if(node.placeholder && hiTranslations[node.placeholder]) {
                    node.placeholder = hiTranslations[node.placeholder];
                }
                // Translate Select options (if static)
                if(node.nodeName === "OPTION" && hiTranslations[node.text]) {
                    node.text = hiTranslations[node.text];
                }
                node.childNodes.forEach(walkDOM);
            }
        };
        
        // Initial pass for static elements
        setTimeout(() => walkDOM(document.body), 100);
        // Second pass for async components (like GPS simulation taking 1.5s)
        setTimeout(() => walkDOM(document.body), 1600);
    }
});
