// Shree Jagdamba Daily Attendance Helper - App Logic

// 1. Hardcoded Class and Student Database
const CLASS_DATA = [
  {
    id: "nursery-lkg",
    title: "Nursery / LKG",
    students: [
      "Aarav Sharma", "Ananya Patel", "Advik Gupta", "Diya Iyer", "Kabir Singh",
      "Myra Verma", "Reyansh Joshi", "Saanvi Rao", "Vivaan Mehta", "Ishaan Choudhury",
      "Kiara Shah", "Atharv Nair", "Riya Trivedi", "Aarush Saxena", "Kavya Mishra",
      "Devansh Bhatt", "Avni Kulkarni", "Krishna Prasad", "Shanaya Kapoor", "Veer Malhotra"
    ]
  },
  {
    id: "ukg-first",
    title: "UKG / First",
    students: [
      "Rohan Das", "Aisha Sen", "Arjun Mukherjee", "Shruti Bose", "Aditya Roy",
      "Pooja Banerjee", "Ishan Chatterjee", "Sneha Dutta", "Vikram Ghosal", "Tanvi Mitra",
      "Siddharth Ghosh", "Riddhi Sarkar", "Yash Ganguly", "Neha Guha", "Rahul Chakraborty",
      "Meera Paul", "Neil Samanta", "Aditi Kundu", "Pritam De", "Riya Naskar"
    ]
  },
  {
    id: "class-2",
    title: "2nd",
    students: [
      "Amit Kumar", "Priya Sharma", "Rajesh Patel", "Sunita Gupta", "Anil Verma",
      "Kiran Yadav", "Sanjay Mishra", "Jyoti Singh", "Vijay Prasad", "Babita Rao",
      "Manoj Joshi", "Anita Choudhary", "Ramesh Reddi", "Lalita Nair", "Suresh Kulkarni",
      "Geeta Bhat", "Harish Mehta", "Rekha Shah", "Dinesh Saxena", "Poonam Kapoor"
    ]
  },
  {
    id: "class-3",
    title: "3rd",
    students: [
      "Devendra", "Gajanand", "Riyansh Pal", "Aryan", "Ishika",
      "Tanishq", "Ansh", "Khushi", "Yash", "Prachi",
      "Mayank", "Gunjan", "Harsh", "Sneha", "Vivek",
      "Rashi", "Gaurav", "Tanvi", "Piyush", "Shruti"
    ]
  },
  {
    id: "class-4-5",
    title: "4th / 5th",
    students: [
      "Abhishek Singh", "Divya Raj", "Sandeep Yadav", "Ritu Sharma", "Deepak Kumar",
      "Preeti Patel", "Vikrant Gupta", "Shalini Verma", "Alok Mishra", "Garima Singh",
      "Pankaj Prasad", "Renu Rao", "Vikas Joshi", "Swati Choudhary", "Nitin Reddi",
      "Monica Nair", "Rajat Kulkarni", "Archana Bhat", "Mohit Mehta", "Neetu Shah"
    ]
  }
];

// 2. Application State (In-Memory Only)
const appState = {};

// Initialize state for each class
CLASS_DATA.forEach(cls => {
  appState[cls.id] = {
    absentStudents: new Set(),
    includeGoodMorning: true,
    numbering: true,
    searchQuery: ""
  };
});

// 3. Initialization on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Set dynamic date in header
  updateHeaderDate();

  // Render the class sections
  renderSections();

  // Initialize Scroll-to-Top
  initScrollToTop();

  // Initialize IntersectionObserver for active navigation highlighting
  initNavigationObserver();
});

// 4. Update Header Date
function updateHeaderDate() {
  const dateElement = document.getElementById("current-date");
  if (!dateElement) return;

  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  const today = new Date();
  
  // Format current date, e.g., "Wednesday, Jul 1"
  dateElement.textContent = today.toLocaleDateString('en-US', options);
}

// 5. Render Sections & Hook Events
function renderSections() {
  const container = document.getElementById("sections-container");
  if (!container) return;

  container.innerHTML = ""; // Clear loader

  CLASS_DATA.forEach(cls => {
    const classId = cls.id;
    const classTitle = cls.title;
    
    // Create card element
    const card = document.createElement("section");
    card.className = "class-card";
    card.id = classId;

    // Build the inside HTML
    card.innerHTML = `
      <div class="card-header">
        <div class="card-title-area">
          <div class="class-badge">${classTitle.charAt(0)}</div>
          <h2 class="class-title">${classTitle}</h2>
        </div>
        <span class="status-badge" id="badge-${classId}">0 Absent</span>
      </div>

      <div class="card-controls">
        <label class="toggle-label">
          <input type="checkbox" class="toggle-input" id="gm-${classId}" checked>
          Include "Good morning"
        </label>
        <label class="toggle-label">
          <input type="checkbox" class="toggle-input" id="num-${classId}" checked>
          Numbering
        </label>
      </div>

      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" class="search-input" id="search-${classId}" placeholder="Search student name...">
        <button class="clear-search-btn" id="search-clear-${classId}" aria-label="Clear search">✕</button>
      </div>

      <div class="student-list-container">
        <ul class="student-list" id="list-${classId}"></ul>
      </div>

      <div class="card-actions">
        <button class="btn-copy" id="btn-copy-${classId}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          Copy WhatsApp Message
        </button>
        <button class="btn-clear" id="btn-clear-${classId}">Clear All Selection</button>
      </div>
    `;

    container.appendChild(card);

    // Initial render of the students inside this card
    renderStudentList(cls);

    // Bind event listeners for this section
    bindCardEvents(cls);
  });
}

// 6. Render Student List for a Class
function renderStudentList(cls) {
  const classId = cls.id;
  const listElement = document.getElementById(`list-${classId}`);
  if (!listElement) return;

  const state = appState[classId];
  const query = state.searchQuery.toLowerCase().trim();

  // Filter students based on query
  const filteredStudents = cls.students.filter(student => 
    student.toLowerCase().includes(query)
  );

  // Clear list
  listElement.innerHTML = "";

  if (filteredStudents.length === 0) {
    listElement.innerHTML = `<li class="empty-list-message">No matching students found</li>`;
    return;
  }

  // Populate list
  filteredStudents.forEach(studentName => {
    const isAbsent = state.absentStudents.has(studentName);
    const li = document.createElement("li");
    li.className = `student-item ${isAbsent ? 'is-absent' : ''}`;
    
    // Set direct internal state toggler
    li.innerHTML = `
      <div class="student-checkbox-col">
        <input type="checkbox" class="student-checkbox" aria-label="Mark ${studentName} absent" ${isAbsent ? 'checked' : ''}>
      </div>
      <div class="student-info-col">
        <span class="student-name">${studentName}</span>
        <span class="student-status-text">${isAbsent ? 'Absent' : 'Present'}</span>
      </div>
    `;

    // Prevent default checkbox toggle behavior to handle click on entire row smoothly
    li.querySelector('.student-checkbox').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleStudentSelection(cls, studentName);
    });

    li.addEventListener("click", () => {
      toggleStudentSelection(cls, studentName);
    });

    listElement.appendChild(li);
  });
}

// 7. Toggle Student Selection State
function toggleStudentSelection(cls, studentName) {
  const classId = cls.id;
  const state = appState[classId];

  if (state.absentStudents.has(studentName)) {
    state.absentStudents.delete(studentName);
  } else {
    state.absentStudents.add(studentName);
  }

  // Update Section Header Stats badge
  updateStatsBadge(classId);

  // Re-render only the student list to reflect visual active states without resetting focus
  renderStudentList(cls);
}

// 8. Update stats badge in card header
function updateStatsBadge(classId) {
  const badge = document.getElementById(`badge-${classId}`);
  if (!badge) return;

  const count = appState[classId].absentStudents.size;
  badge.textContent = `${count} Absent`;

  if (count > 0) {
    badge.classList.add("active-absent");
  } else {
    badge.classList.remove("active-absent");
  }
}

// 9. Bind all interaction event listeners to a Card
function bindCardEvents(cls) {
  const classId = cls.id;

  // Good morning toggle
  const gmToggle = document.getElementById(`gm-${classId}`);
  gmToggle.addEventListener("change", (e) => {
    appState[classId].includeGoodMorning = e.target.checked;
  });

  // Numbering toggle
  const numToggle = document.getElementById(`num-${classId}`);
  numToggle.addEventListener("change", (e) => {
    appState[classId].numbering = e.target.checked;
  });

  // Search input interaction
  const searchInput = document.getElementById(`search-${classId}`);
  const clearSearchBtn = document.getElementById(`search-clear-${classId}`);

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    appState[classId].searchQuery = query;

    // Show/hide clear search button
    if (query.length > 0) {
      clearSearchBtn.style.display = "flex";
    } else {
      clearSearchBtn.style.display = "none";
    }

    renderStudentList(cls);
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    appState[classId].searchQuery = "";
    clearSearchBtn.style.display = "none";
    renderStudentList(cls);
    searchInput.focus();
  });

  // Copy WhatsApp Message Action
  const copyBtn = document.getElementById(`btn-copy-${classId}`);
  copyBtn.addEventListener("click", () => {
    copyWhatsAppMessage(cls);
  });

  // Clear Selection Action
  const clearBtn = document.getElementById(`btn-clear-${classId}`);
  clearBtn.addEventListener("click", () => {
    clearAllSelection(cls);
  });
}

// 10. Clear Selections for a Section
function clearAllSelection(cls) {
  const classId = cls.id;
  
  // Clear Set
  appState[classId].absentStudents.clear();

  // Reset stats badge
  updateStatsBadge(classId);

  // Re-render list
  renderStudentList(cls);

  // Show Toast confirmation
  showToast(`Cleared selections for ${cls.title}`);
}

// 11. Format and copy WhatsApp Message
function copyWhatsAppMessage(cls) {
  const classId = cls.id;
  const state = appState[classId];
  const classTitle = cls.title;

  // Build message
  let messageParts = [];

  if (state.includeGoodMorning) {
    messageParts.push("Good morning Everyone 🙏\n");
  }

  messageParts.push(`${classTitle} class absent students list:\n`);

  if (state.absentStudents.size === 0) {
    messageParts.push("No absent students.");
  } else {
    // Keep absolute ordering of dummy list (as written in Javascript array) to avoid index jitter
    const sortedAbsentees = cls.students.filter(student => 
      state.absentStudents.has(student)
    );

    if (state.numbering) {
      const numberedList = sortedAbsentees.map((name, index) => 
        `${index + 1}. ${name}`
      ).join("\n");
      messageParts.push(numberedList);
    } else {
      messageParts.push(sortedAbsentees.join("\n"));
    }
  }

  const finalMessage = messageParts.join("\n");

  // Copy to clipboard
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(finalMessage)
      .then(() => {
        showToast(`Copied ${classTitle} list!`);
      })
      .catch(err => {
        console.error("Clipboard copy failed, using fallback:", err);
        fallbackCopyToClipboard(finalMessage, classTitle);
      });
  } else {
    fallbackCopyToClipboard(finalMessage, classTitle);
  }
}

// Fallback clipboard copying for non-HTTPS or older mobile browsers
function fallbackCopyToClipboard(text, classTitle) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Prevent scrolling to bottom of screen
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showToast(`Copied ${classTitle} list!`);
    } else {
      showToast("Unable to copy. Please try again.");
    }
  } catch (err) {
    console.error("Fallback copy execution failed:", err);
    showToast("Copy failed. Please copy manually.");
  }

  document.body.removeChild(textArea);
}

// 12. Display Toast Message
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-msg");
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  
  // Clear any existing timeout
  clearTimeout(toastTimeout);

  // Show Toast
  toast.classList.add("show");

  // Auto Hide Toast
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// 13. Back to Top Button Logic
function initScrollToTop() {
  const scrollBtn = document.getElementById("scroll-btn");
  if (!scrollBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// 14. Active Navigation Indicator Hooked to Scroll Position
function initNavigationObserver() {
  const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll(".class-card");
  
  if (!navItems.length || !sections.length) return;

  // Track page scroll to set active nav tab
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px", // Adjust boundaries to match mobile viewport center
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        
        // Remove active class from all nav links
        navItems.forEach(nav => nav.classList.remove("active"));
        
        // Add active to matching tab
        const activeNav = document.querySelector(`.nav-item[href="#${id}"]`);
        if (activeNav) {
          activeNav.classList.add("active");
          
          // Scroll the tab container horizontally if nav item is out of view
          const navContainer = document.querySelector(".quick-nav");
          if (navContainer) {
            const leftOffset = activeNav.offsetLeft - navContainer.clientWidth / 2 + activeNav.clientWidth / 2;
            navContainer.scrollTo({
              left: leftOffset,
              behavior: 'smooth'
            });
          }
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Add click scrolling override
  navItems.forEach(nav => {
    nav.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = nav.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Remove active state and temporarily block scroll observer trigger
        navItems.forEach(n => n.classList.remove("active"));
        nav.classList.add("active");

        targetSection.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });
}
