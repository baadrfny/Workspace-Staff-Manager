// DOM Elements
const addModal = document.getElementById("addModal");
const workerCard = document.querySelector(".workerCard");
const btnAjouter = document.querySelector(".btnAjouter");
const AnnuleBtn = document.querySelector(".AnnuleBtn");
const EnregistrerBtn = document.querySelector(".EnregistrerBtn");
const infoModal = document.getElementById("infoModal");

// Data
let employees = JSON.parse(localStorage.getItem("employees")) || [];
let assignedWorkers = JSON.parse(localStorage.getItem("assignedWorkers")) || [];
let currentElementToRemove = null;

// Room Configuration
const roomConfig = {
    receptionDiv: { limit: 3, roles: ["Réceptionniste", "Manager"] },
    conferenceDiv: { limit: 10, roles: ["Manager", "Réceptionniste", "Technicien", "Agents de sécurité", "Nettoyage"] },
    serveursDiv: { limit: 2, roles: ["Technicien", "Manager", "Nettoyage"] },
    securiteDiv: { limit: 3, roles: ["Agents de sécurité", "Manager", "Nettoyage"] },
    personnelDiv: { limit: 5, roles: ["Nettoyage", "Manager", "Technicien", "Agents de sécurité", "Réceptionniste"] },
    archivesDiv: { limit: 2, roles: ["Manager", "Technicien", "Agents de sécurité", "Réceptionniste"] }
};

// Validation Patterns
const patterns = {
    name: /^[a-zA-Z\s]{2,30}$/,
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    phone: /^\d{10}$/,
    url: /^https?:\/\/[^\s]+\.(png|jpg|jpeg|gif|svg)(\?.*)?$/
};

// Modal
function openModal() {
    addModal.style.display = "flex";
}
function closeModal() {
    addModal.style.display = "none";
    infoModal.style.display = "none";
    currentElementToRemove = null;
}

// Assignment helpers
function isWorkerAssigned(workerId) {
    return assignedWorkers.includes(workerId.toString());
}


    console.log(assignedWorkers)


function assignWorker(workerId) {
    if (!isWorkerAssigned(workerId)) {
        assignedWorkers.push(workerId.toString());
        localStorage.setItem('assignedWorkers', JSON.stringify(assignedWorkers));
        removeOptionFromAllSelects(workerId);
    }
}



function unassignWorker(workerId) {
    
    assignedWorkers = assignedWorkers.filter(id => id !== workerId.toString());
    localStorage.setItem('assignedWorkers', JSON.stringify(assignedWorkers));
    addOptionToAllSelectsIfAllowed(workerId);


}

// Experience Handler
function setupExperienceHandler() {
    
    const addExpBtn = document.getElementById("addExpBtn");
    const expContainer = document.getElementById("expContainer");

    addExpBtn.addEventListener("click", function() {
        const entreprise = document.querySelector(".inputEntreprise").value;
        const post = document.querySelector(".inputPost").value;
        const dateDebut = document.querySelector(".inputDateDebut").value;
        const dateFin = document.querySelector(".inputDateFin").value;

        if (!dateDebut || !dateFin || new Date(dateDebut) >= new Date(dateFin) || entreprise === "" || post === "") {
            alert("Enter valid experience data");
            return;
        }

        const expDiv = document.createElement("div");
        expDiv.innerHTML = `
            <p>Company: ${entreprise}</p>
            <p>Position: ${post}</p>
            <p>Period: ${dateDebut} to ${dateFin}</p>
        `;
        expDiv.style.cssText = "background-color:#fff; border:1px solid gray; margin:5px; padding:5px; border-radius:5px";
        expContainer.appendChild(expDiv);

        document.querySelector(".inputEntreprise").value = "";
        document.querySelector(".inputPost").value = "";
        document.querySelector(".inputDateDebut").value = "";
        document.querySelector(".inputDateFin").value = "";
    });
}

// Room Border
function updateRoomBorder(room, workerPlace) {
    const hasWorkers = workerPlace.querySelectorAll(".worker-info").length > 0;
    if (hasWorkers) room.classList.remove("box");
    else room.classList.add("box");
}

// Sidebar / select option helpers
function createSidebarCard(employee) {
    const card = document.createElement("div");
    card.className = "sidebar-worker";
    card.dataset.id = employee.id;
    card.innerHTML = `
        <img src="${employee.urlImg}" alt="${employee.name}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;">
        <h3>${employee.name}</h3>
        <p>${employee.special}</p>
    `;
    card.style.cssText = "display:flex; flex-direction:column; align-items:center; justify-content:center; border:1px solid gray; padding:20px; border-radius:10px; margin:10px; cursor:pointer; background:#fff;";

    card.addEventListener("click", function() {
        const emp = employees.find(e => e.id == employee.id);
        currentElementToRemove = card;
        showEmployeeInfo(emp, card);
    });

    workerCard.appendChild(card);
}

function removeSidebarCardById(id) {
    const el = workerCard.querySelector(`.sidebar-worker[data-id="${id}"]`);
    if (el) el.remove();
}

function removeOptionFromAllSelects(workerId) {
    document.querySelectorAll(".userSelect").forEach(select => {
        const opt = select.querySelector(`option[value="${workerId}"]`);
        if (opt) opt.remove();
    });
}

function addOptionToAllSelectsIfAllowed(workerId) {
    const employee = employees.find(e => e.id == workerId);
    if (!employee) return;
    document.querySelectorAll(".userSelect").forEach(select => {
        const room = select.closest("div");
        // determine room key by checking classList against roomConfig keys
        const roomKey = Array.from(room.classList).find(c => Object.keys(roomConfig).includes(c));
        if (!roomKey) return;
        const config = roomConfig[roomKey];
        if (!config) return;
        // only add option if role allowed and not already present and if worker not assigned
        if (config.roles.includes(employee.special) && !isWorkerAssigned(workerId)) {
            // avoid duplicates
            if (!select.querySelector(`option[value="${workerId}"]`)) {
                const option = document.createElement("option");
                option.value = employee.id;
                option.textContent = `${employee.name} - ${employee.special}`;
                select.appendChild(option);
            }
        }
    });
}

// Employee Save
function setupSaveEmployee() {
    EnregistrerBtn.addEventListener("click", function() {
        const name = document.getElementById("workerName").value.trim();
        const email = document.getElementById("workerEmail").value.trim();
        const role = document.getElementById("selectWorker").value;
        const phone = document.getElementById("inputPhone").value.trim();
        const imageUrl = document.getElementById("urlInput").value.trim();

        if (!validateEmployeeData(name, email, role, phone, imageUrl)) return;

        const employeeData = {
            id: Date.now().toString(),
            name,
            email,
            special: role,
            phone,
            urlImg: imageUrl,
            expArray: getExperienceData()
        };

        employees.push(employeeData);
        localStorage.setItem("employees", JSON.stringify(employees));

        createSidebarCard(employeeData);
        addOptionToAllSelectsIfAllowed(employeeData.id);

        closeModal();
        clearFormFields();
    });
}

function validateEmployeeData(name, email, role, phone, imageUrl) {
    if (!patterns.name.test(name)) {
        alert("Invalid name");
        return false;
    }
    if (!patterns.email.test(email)) {
        alert("Invalid email");
        return false;
    }
    if (role === "Selectionner") {
        alert("Select a role");
        return false;
    }
    if (!patterns.phone.test(phone)) {
        alert("Invalid phone");
        return false;
    }
    if (!patterns.url.test(imageUrl)) {
        alert("Invalid image URL");
        return false;
    }
    return true;
}

function getExperienceData() {
    const expContainer = document.getElementById("expContainer");
    const expDivs = expContainer.querySelectorAll('div');
    return Array.from(expDivs).map(expDiv => ({
        entreprise: expDiv.querySelector('p:nth-child(1)').textContent.replace('Company: ', ''),
        post: expDiv.querySelector('p:nth-child(2)').textContent.replace('Position: ', ''),
        periode: expDiv.querySelector('p:nth-child(3)').textContent.replace('Period: ', '')
    }));
}

// Show Info Modal
function showEmployeeInfo(employee, element) {
    currentElementToRemove = element;

    document.getElementById("infoImgModal").src = employee.urlImg || "";
    document.getElementById("infoSpecialModal").textContent = "Role: " + employee.special;
    document.getElementById("infoNumberModal").textContent = "Phone: " + (employee.phone || "");
    document.getElementById("infoNameModal").textContent = "Name: " + employee.name;
    document.getElementById("infoEmailModal").textContent = "Email: " + employee.email;

    // show experiences if any
    const expInfoContainer = document.getElementById("expInfoContainer");
    expInfoContainer.innerHTML = "";
    (employee.expArray || []).forEach(exp => {
        const d = document.createElement("div");
        d.innerHTML = `<p>${exp.entreprise} — ${exp.post} — ${exp.periode}</p>`;
        expInfoContainer.appendChild(d);
    });

    infoModal.style.display = "grid";
}

// Rooms Setup
function setupRooms() {
    Object.keys(roomConfig).forEach(roomId => {
        const room = document.querySelector(`.${roomId}`);
        if (room) {
            setupRoomSelect(room, roomConfig[roomId]);
        }
    });
}

function setupRoomSelect(room, config) {
    const select = room.querySelector(".userSelect");
    const workerPlace = room.querySelector(".workerPlace");
    const emptyP = workerPlace.querySelector(".emptyP");

    // clear then populate options from employees who match role and are not assigned
    select.innerHTML = '<option value="">Select</option>';
    employees.forEach(worker => {
        if (config.roles.includes(worker.special) && !isWorkerAssigned(worker.id)) {
            const option = document.createElement("option");
            option.value = worker.id;
            option.textContent = `${worker.name} - ${worker.special}`;
            select.appendChild(option);
        }
    });

    select.onchange = function() {
        handleRoomSelection(this, room, config, workerPlace, emptyP);
    };

    // update border state on init
    updateRoomBorder(room, workerPlace);
}

function handleRoomSelection(select, room, config, workerPlace, emptyP) {
    const currentCount = workerPlace.querySelectorAll(".worker-info").length;

    if (currentCount >= config.limit) {
        alert(`Limit: ${config.limit}`);
        select.value = "";
        return;
    }

    const selectedUserId = select.value;
    if (!selectedUserId) return;

    if (isWorkerAssigned(selectedUserId)) {
        alert("Worker already assigned");
        select.value = "";
        return;
    }

    const selectedUser = employees.find(u => u.id == selectedUserId);
    if (!selectedUser) return;

    assignWorker(selectedUserId);

    if (emptyP) emptyP.style.display = "none";

    const workerInfo = document.createElement("div");
    workerInfo.className = "worker-info";
    workerInfo.dataset.id = selectedUser.id;
    workerInfo.innerHTML = `
        <h3>${selectedUser.name}</h3>
        <p>${selectedUser.special}</p>
    `;
    workerInfo.style.cursor = "pointer";

    workerInfo.onclick = function() {
        currentElementToRemove = workerInfo;
        showEmployeeInfo(selectedUser, workerInfo);
    };

    workerPlace.appendChild(workerInfo);

    // remove the sidebar card (but keep the employee in storage)
    removeSidebarCardById(selectedUser.id);

    // remove option from every select (already done in assignWorker)
    // but ensure current select resets
    select.value = "";

    updateRoomBorder(room, workerPlace);
}

// Clear Fields
function clearFormFields() {
    document.getElementById("workerName").value = "";
    document.getElementById("workerEmail").value = "";
    document.getElementById("selectWorker").value = "Selectionner";
    document.getElementById("inputPhone").value = "";
    document.getElementById("urlInput").value = "";
    document.getElementById("expContainer").innerHTML = "";
}

// Event Listeners
function setupEventListeners() {
    btnAjouter.addEventListener("click", openModal);
    AnnuleBtn.addEventListener("click", closeModal);
    document.getElementById("closeInfo1").addEventListener("click", closeModal);
    document.getElementById("closeInfo2").addEventListener("click", closeModal);

    document.getElementById("removeCard").addEventListener("click", function() {
        if (!currentElementToRemove) return;

        // if the clicked element is a sidebar card (permanent delete)
        if (currentElementToRemove.classList.contains("sidebar-worker")) {
            const workerId = currentElementToRemove.dataset.id;
            // remove from employees array permanently
            employees = employees.filter(e => e.id != workerId);
            localStorage.setItem("employees", JSON.stringify(employees));

            // unassign if assigned
            if (isWorkerAssigned(workerId)) {
                unassignWorker(workerId);
            }

            // remove any option in selects
            removeOptionFromAllSelects(workerId);

            // remove sidebar element
            currentElementToRemove.remove();
            currentElementToRemove = null;

            closeModal();
            // refresh room selects to reflect deletion
            setupRooms();
            return;
        }

        // else, element is inside a room -> remove from room and return to sidebar
        if (currentElementToRemove.classList.contains("worker-info")) {
            const workerId = currentElementToRemove.dataset.id;
            const worker = employees.find(e => e.id == workerId);
            // unassign
            unassignWorker(workerId);

            // remove element from room
            const workerPlace = currentElementToRemove.closest(".workerPlace");
            const room = workerPlace.closest(".box, .boxCon, .boxPer, .conferenceDiv, .receptionDiv, .serveursDiv, .securiteDiv, .personnelDiv, .archivesDiv");
            currentElementToRemove.remove();
            currentElementToRemove = null;

            // add back to sidebar
            if (worker) {
                createSidebarCard(worker);
            }

            // update selects and border
            setupRooms();
            if (room) updateRoomBorder(room, workerPlace);

            closeModal();
            return;
        }

        
        closeModal();
    });
}

// Init App
function initApp() {
    setupEventListeners();
    setupExperienceHandler();
    setupSaveEmployee();
    setupRooms();

    // render sidebar cards and populate selects
    employees.forEach(employee => {
        // only render sidebar card if not currently assigned
        if (!isWorkerAssigned(employee.id)) {
            createSidebarCard(employee);
        }
    });

    // ensure selects have correct options per room
    setupRooms();
}

initApp();
