// Choraindo Blood Donation Application Logic

// LocalStorage key names
const DONORS_KEY = 'choraindo_donors';
const REQUESTS_KEY = 'choraindo_requests';

// Default Mock Data for rich visual design and realistic initial states
const defaultDonors = [
    { id: 1, name: "Arjun Mehta", age: 21, blood: "O+", college: "St. Thomas College, Cochin", phone: "9876543210", email: "arjun.m@stthomas.edu", lastDate: "2026-05-10" },
    { id: 2, name: "Sneha Kurian", age: 20, blood: "A-", college: "Model Engineering College, Cochin", phone: "9447123456", email: "sneha.k@mec.ac.in", lastDate: "" },
    { id: 3, name: "Jithin Raj", age: 22, blood: "B+", college: "Sacred Heart College, Cochin", phone: "9061122334", email: "jithin.r@sh.edu", lastDate: "2026-03-01" },
    { id: 4, name: "Fathima N.", age: 19, blood: "O-", college: "Government Law College, Cochin", phone: "9895012345", email: "fathima.n@glc.edu", lastDate: "" }
];

const defaultRequests = [
    { id: 1, patient: "Balakrishnan Pillai (Father)", blood: "B+", units: 2, hospital: "General Hospital, Room 304, Cochin", urgency: "Urgent", contact: "Amit Pillai (Son)", phone: "9495765432" },
    { id: 2, patient: "Baby Meenakshi (Sister)", blood: "AB-", units: 1, hospital: "Lissie Hospital, Pediatrics ICU, Cochin", urgency: "Urgent", contact: "Vineeth Vijayan (Brother)", phone: "9048321456" }
];

const collegeLeaderboard = [
    { name: "St. Thomas College", units: 148 },
    { name: "Model Engineering College", units: 124 },
    { name: "Sacred Heart College", units: 98 },
    { name: "Government Law College", units: 76 }
];

const clubLeaderboard = [
    { name: "NSS Campus Unit", units: 92 },
    { name: "Men's Hostel Block A", units: 81 },
    { name: "Red Cross Youth", units: 74 },
    { name: "Ladies' Hostel Block C", units: 52 }
];

// App State
let donors = [];
let requests = [];

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    // Load lists from LocalStorage or seed with defaults
    if (!localStorage.getItem(DONORS_KEY)) {
        localStorage.setItem(DONORS_KEY, JSON.stringify(defaultDonors));
    }
    if (!localStorage.getItem(REQUESTS_KEY)) {
        localStorage.setItem(REQUESTS_KEY, JSON.stringify(defaultRequests));
    }
    
    donors = JSON.parse(localStorage.getItem(DONORS_KEY));
    requests = JSON.parse(localStorage.getItem(REQUESTS_KEY));
    
    // Setup views and static page features
    loadLeaderboards();
    renderHub();
});

// --- SCREEN NAVIGATION & TAB SWITCHING ---
function switchTab(tabId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // Remove active style from links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show target page
    const activePage = document.getElementById(`page-${tabId}`);
    if (activePage) {
        activePage.classList.add('active');
    }
    
    // Highlight correct link
    const activeLink = document.getElementById(`link-${tabId}`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- STORIES CAROUSEL LOGIC ---
let activeStoryIndex = 0;
const storyCount = 3;

function nextStory() {
    document.getElementById(`story-${activeStoryIndex + 1}`).classList.remove('active');
    activeStoryIndex = (activeStoryIndex + 1) % storyCount;
    document.getElementById(`story-${activeStoryIndex + 1}`).classList.add('active');
}

function prevStory() {
    document.getElementById(`story-${activeStoryIndex + 1}`).classList.remove('active');
    activeStoryIndex = (activeStoryIndex - 1 + storyCount) % storyCount;
    document.getElementById(`story-${activeStoryIndex + 1}`).classList.add('active');
}

// --- POPULATE LEADERBOARDS ---
function loadLeaderboards() {
    const collegeList = document.getElementById('college-list');
    const clubList = document.getElementById('club-list');
    
    collegeList.innerHTML = collegeLeaderboard.map((item, index) => `
        <div class="leaderboard-item">
            <div class="rank-details">
                <span class="rank-number rank-${index + 1}">${index + 1}</span>
                <span class="college-name">${item.name}</span>
            </div>
            <span class="donation-count">${item.units} Units</span>
        </div>
    `).join('');

    clubList.innerHTML = clubLeaderboard.map((item, index) => `
        <div class="leaderboard-item">
            <div class="rank-details">
                <span class="rank-number rank-${index + 1}">${index + 1}</span>
                <span class="college-name">${item.name}</span>
            </div>
            <span class="donation-count">${item.units} Units</span>
        </div>
    `).join('');
}

// --- SUBMIT DONOR DETAILS ---
function handleDonorSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('d-name').value.trim();
    const age = parseInt(document.getElementById('d-age').value);
    const blood = document.getElementById('d-blood').value;
    const college = document.getElementById('d-college').value.trim();
    const phone = document.getElementById('d-phone').value.trim();
    const email = document.getElementById('d-email').value.trim();
    const lastDate = document.getElementById('d-lastdate').value;
    
    // Simple Validation
    if (age < 18 || age > 65) {
        document.getElementById('err-d-age').style.display = 'block';
        return;
    } else {
        document.getElementById('err-d-age').style.display = 'none';
    }
    
    if (phone.length !== 10 || isNaN(phone)) {
        document.getElementById('err-d-phone').style.display = 'block';
        return;
    } else {
        document.getElementById('err-d-phone').style.display = 'none';
    }

    const newDonor = {
        id: Date.now(),
        name,
        age,
        blood,
        college,
        phone,
        email,
        lastDate
    };
    
    // Add to Local Storage and State
    donors.unshift(newDonor);
    localStorage.setItem(DONORS_KEY, JSON.stringify(donors));
    
    // Update matching board and counts
    renderHub();
    
    // Show success dialog
    openModal("Registration Successful!", `Thank you, ${name}! Your profile is now added to our search network. Families and coordinators looking for blood can contact you directly.`);
    document.getElementById('donor-form').reset();
}

// --- SUBMIT REQUEST DETAILS ---
function handleRequestSubmit(event) {
    event.preventDefault();
    
    const patient = document.getElementById('r-patient').value.trim();
    const blood = document.getElementById('r-blood').value;
    const units = parseInt(document.getElementById('r-units').value);
    const hospital = document.getElementById('r-hospital').value.trim();
    const urgency = document.getElementById('r-urgency').value;
    const contact = document.getElementById('r-contact').value.trim();
    const phone = document.getElementById('r-phone').value.trim();
    
    // Phone validation
    if (phone.length !== 10 || isNaN(phone)) {
        document.getElementById('err-r-phone').style.display = 'block';
        return;
    } else {
        document.getElementById('err-r-phone').style.display = 'none';
    }
    
    const newRequest = {
        id: Date.now(),
        patient,
        blood,
        units,
        hospital,
        urgency,
        contact,
        phone
    };
    
    // Save
    requests.unshift(newRequest);
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    
    renderHub();
    
    openModal("Blood Request Published!", `Your request for ${blood} blood is now live. Youngsters and student volunteers on our matching board can see and respond to your request immediately.`);
    document.getElementById('request-form').reset();
}

// --- RENDER MATCHING HUB ---
function renderHub() {
    const seekerList = document.getElementById('seeker-list');
    const donorList = document.getElementById('donor-list');
    
    const selectedBlood = document.getElementById('filter-blood').value;
    const selectedType = document.getElementById('filter-type').value;
    const searchVal = document.getElementById('search-input').value.toLowerCase().trim();
    
    // Filter Seekers (Requests)
    let filteredSeekers = requests.filter(item => {
        const matchesBlood = selectedBlood === 'ALL' || item.blood === selectedBlood;
        const matchesSearch = searchVal === '' || 
            item.hospital.toLowerCase().includes(searchVal) || 
            item.patient.toLowerCase().includes(searchVal) ||
            item.contact.toLowerCase().includes(searchVal);
        return matchesBlood && matchesSearch && (selectedType === 'ALL' || selectedType === 'SEEKERS');
    });
    
    // Filter Donors
    let filteredDonors = donors.filter(item => {
        const matchesBlood = selectedBlood === 'ALL' || item.blood === selectedBlood;
        const matchesSearch = searchVal === '' || 
            item.college.toLowerCase().includes(searchVal) || 
            item.name.toLowerCase().includes(searchVal);
        return matchesBlood && matchesSearch && (selectedType === 'ALL' || selectedType === 'DONORS');
    });
    
    // Update Badge counts
    document.getElementById('seeker-count').innerText = filteredSeekers.length;
    document.getElementById('donor-count').innerText = filteredDonors.length;
    
    // Render Seekers Column
    if (filteredSeekers.length === 0) {
        seekerList.innerHTML = `<div class="empty-state">No matching blood requests found.</div>`;
    } else {
        seekerList.innerHTML = filteredSeekers.map(item => `
            <div class="hub-card">
                <div class="card-top">
                    <div class="card-details">
                        <h4>Patient: ${item.patient}</h4>
                        <p class="sub"><i class="fa-solid fa-hospital" style="color: var(--red-main); margin-right: 5px;"></i> ${item.hospital}</p>
                    </div>
                    <div class="blood-badge">${item.blood}</div>
                </div>
                <div class="card-meta">
                    <div><i class="fa-solid fa-droplet"></i> Units Required: <strong>${item.units}</strong></div>
                    <div><i class="fa-solid fa-user-tag"></i> Coordinator: ${item.contact}</div>
                </div>
                <div class="card-actions">
                    <span class="card-urgency urgency-${item.urgency.toLowerCase()}">${item.urgency}</span>
                    <button class="btn btn-primary" onclick="openContactModal('${item.contact}', '${item.phone}', 'Requires ${item.units} Unit(s) of ${item.blood} at ${item.hospital}')" style="padding: 6px 14px; font-size: 13px; border-radius: 6px;">Help Now</button>
                </div>
            </div>
        `).join('');
    }
    
    // Render Donors Column
    if (filteredDonors.length === 0) {
        donorList.innerHTML = `<div class="empty-state">No matching volunteer donors found.</div>`;
    } else {
        donorList.innerHTML = filteredDonors.map(item => `
            <div class="hub-card">
                <div class="card-top">
                    <div class="card-details">
                        <h4>${item.name} (${item.age} Yrs)</h4>
                        <p class="sub"><i class="fa-solid fa-graduation-cap" style="color: var(--red-main); margin-right: 5px;"></i> ${item.college}</p>
                    </div>
                    <div class="blood-badge" style="background-color: var(--text-dark);">${item.blood}</div>
                </div>
                <div class="card-meta">
                    <div><i class="fa-solid fa-calendar-day"></i> Last Donated: ${item.lastDate ? item.lastDate : 'Never / First Time'}</div>
                </div>
                <div class="card-actions">
                    <span class="card-urgency urgency-standard" style="background-color: #dcfce7; color: #15803d;"><i class="fa-solid fa-check" style="margin-right: 3px;"></i> Available</span>
                    <button class="btn btn-secondary" onclick="openContactModal('${item.name}', '${item.phone}', 'Volunteer Donor from ${item.college} (${item.blood})')" style="padding: 6px 14px; font-size: 13px; border-radius: 6px;">Contact Donor</button>
                </div>
            </div>
        `).join('');
    }
}

// Triggered by onchange/onkeyup
function filterHub() {
    renderHub();
}

// --- SYSTEM DIALOGS & MODALS ---
function openModal(title, desc) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-desc').innerText = desc;
    document.getElementById('success-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('success-modal').style.display = 'none';
    switchTab('hub');
}

function openContactModal(name, phone, details) {
    document.querySelector('#contact-name span').innerText = name;
    document.querySelector('#contact-phone span').innerText = phone;
    document.querySelector('#contact-detail span').innerText = details;
    
    const callBtn = document.getElementById('btn-call-direct');
    callBtn.onclick = () => {
        window.location.href = `tel:${phone}`;
    };
    
    document.getElementById('contact-modal').style.display = 'flex';
}

function closeContactModal() {
    document.getElementById('contact-modal').style.display = 'none';
}
