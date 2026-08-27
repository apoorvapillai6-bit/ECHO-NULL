const form = document.getElementById("terminalForm");
const input = document.getElementById("commandInput");
const screen = document.getElementById("screen");
const glitch = document.getElementById("glitch");


const history = [];

let historyIndex = -1;


/* =========================
   PLAYER MEMORY
========================= */

let state = JSON.parse(
    localStorage.getItem("echoNullState")
) || {

    scans: 0,

    memory: false,

    identity: false,

    wake: false,

    unlocked: false,

    voidFound: false,

    ending: null

};


function saveState() {

    localStorage.setItem(
        "echoNullState",
        JSON.stringify(state)
    );

}


/* =========================
   COMMANDS
========================= */

const commands = {


    help: () => `

        <div class="command-result">

            <p>AVAILABLE COMMANDS</p>

            <br>

            <p>
                <span class="command">help</span>
                — command list
            </p>

            <p>
                <span class="command">scan</span>
                — scan system
            </p>

            <p>
                <span class="command">status</span>
                — system status
            </p>

            <p>
                <span class="command">memory</span>
                — inspect memory
            </p>

            <p>
                <span class="command">logs</span>
                — view system logs
            </p>

            <p>
                <span class="command">echo</span>
                — repeat a message
            </p>

            <p>
                <span class="command">clear</span>
                — clear terminal
            </p>

        </div>

    `,


    scan: () => {

        state.scans++;

        saveState();


        let message = `

            <div class="command-result">

                <p>SCANNING SYSTEM...</p>

                <p>
                    [████████████████████] 100%
                </p>

                <br>

                <p>
                    NETWORK ........ ONLINE
                </p>

                <p>
                    CORE ........... STABLE
                </p>

                <p>
                    MEMORY ......... ${state.scans > 2
                        ? "CRITICAL"
                        : "73% CORRUPTED"}
                </p>

                <p>
                    UNKNOWN FILE ... DETECTED
                </p>

                <p>
                    LOCATION ....... /memory/sector_07
                </p>

            </div>

        `;


        if (state.scans >= 3) {

            message += `

                <div class="secret">

                    <p>
                        SCAN RESULT CHANGED.
                    </p>

                    <p>
                        SOMETHING IS SCANNING YOU BACK.
                    </p>

                </div>

            `;

            activateGlitch();

        }


        return message;

    },


    status: () => `

        <div class="command-result">

            <p>SYSTEM STATUS</p>

            <br>

            <p>
                CORE .............. STABLE
            </p>

            <p>
                MEMORY ............ UNSTABLE
            </p>

            <p>
                CONNECTION ........ SECURE
            </p>

            <p>
                UNKNOWN PROCESS ... RUNNING
            </p>

            <p>
                OBSERVER .......... ${state.identity
                    ? "DETECTED"
                    : "UNKNOWN"}
            </p>

        </div>

    `,


    memory: () => {

        state.memory = true;

        saveState();


        return `

            <div class="command-result">

                <p>MEMORY SECTORS</p>

                <br>

                <p>
                    Sector 01 ......... OK
                </p>

                <p>
                    Sector 02 ......... OK
                </p>

                <p>
                    Sector 03 ......... OK
                </p>

                <p>
                    Sector 04 ......... OK
                </p>

                <p>
                    Sector 05 ......... CORRUPTED
                </p>

                <p>
                    Sector 06 ......... CORRUPTED
                </p>

                <p>
                    Sector 07 .........
                    <span class="secret">
                        LOCKED
                    </span>
                </p>

                <br>

                <p>
                    Hint:
                    something has been left behind.
                </p>

            </div>

        `;

    },


    logs: () => `

        <div class="command-result">

            <p>SYSTEM LOG</p>

            <br>

            <p>
                [00:00:01] BOOT
            </p>

            <p>
                [00:00:03] MEMORY INITIALIZED
            </p>

            <p>
                [00:00:07] USER CONNECTED
            </p>

            <p>
                [00:00:11] UNKNOWN PROCESS
            </p>

            <p>
                [00:00:19] ECHO DETECTED
            </p>

            <p>
                [00:00:23] ECHO RESPONDED
            </p>

            <p class="warning">
                [00:00:27] LOGGING DISABLED
            </p>

        </div>

    `,


    echo: (args) => {

        if (!args) {

            return `

                <div class="error">

                    Usage:
                    echo [message]

                </div>

            `;

        }


        return `

            <div class="command-result">

                ${escapeHTML(args)}

            </div>

        `;

    },


    clear: () => {

        screen.innerHTML = "";

        return null;

    }

};


/* =========================
   FORM
========================= */

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const raw = input.value.trim();


        if (!raw) {
            return;
        }


        history.push(raw);

        historyIndex = history.length;


        processCommand(raw);


        input.value = "";

    }
);


/* =========================
   PROCESS
========================= */

function processCommand(raw) {

    const parts = raw.split(" ");

    const command =
        parts[0].toLowerCase();

    const args =
        parts.slice(1).join(" ");


    addCommandLine(raw);


    /* WAKE */

    if (command === "wake") {

        state.wake = true;

        saveState();

        activateGlitch();


        addOutput(`

            <div class="secret">

                <p>...</p>

                <p>
                    YOU SHOULDN'T HAVE FOUND THIS.
                </p>

                <br>

                <p>
                    THE SYSTEM REMEMBERS YOU.
                </p>

                <p>
                    ACCESS CODE:
                    07-19-NULL
                </p>

            </div>

        `);

        return;

    }


    /* WHOAMI */

    if (command === "whoami") {

        state.identity = true;

        saveState();

        activateGlitch();


        addOutput(`

            <div class="secret">

                <p>
                    IDENTITY UNKNOWN.
                </p>

                <p>
                    SESSION OWNER: [REDACTED]
                </p>

                <br>

                <p>
                    WAIT...
                </p>

                <p>
                    SESSION OWNER:
                    YOU
                </p>

            </div>

        `);

        return;

    }


    /* UNLOCK */

    if (command === "unlock") {

        if (args === "07-19-NULL") {

            state.unlocked = true;

            saveState();

            activateGlitch();


            addOutput(`

                <div class="success">

                    <p>
                        ACCESS GRANTED.
                    </p>

                    <br>

                    <p>
                        MEMORY SECTOR 07 UNLOCKED.
                    </p>

                    <p>
                        FILE:
                        <span class="secret">
                            THE_FIRST_ECHO
                        </span>
                    </p>

                    <br>

                    <p class="secret">
                        "It wasn't supposed to remember."
                    </p>

                    <br>

                    <p>
                        ACCESS:
                        <a href="memory.html">
                            OPEN MEMORY
                        </a>
                    </p>

                </div>

            `);

        }

        else {

            addOutput(`

                <div class="error">

                    ACCESS DENIED.

                </div>

            `);

        }

        return;

    }


    /* VOID */

    if (command === "null") {

        if (
            state.unlocked &&
            state.identity &&
            state.wake
        ) {

            state.voidFound = true;

            saveState();

            activateGlitch();


            addOutput(`

                <div class="secret">

                    <p>
                        NULL ROUTE FOUND.
                    </p>

                    <p>
                        /void/
                    </p>

                    <br>

                    <a href="void.html">
                        ENTER THE VOID
                    </a>

                </div>

            `);

        }

        else {

            addOutput(`

                <div class="error">

                    ROUTE DOES NOT EXIST.

                </div>

            `);

        }

        return;

    }


    /* END */

    if (command === "end") {

        if (state.voidFound) {

            showEnding();

        }

        else {

            addOutput(`

                <div class="error">

                    ENDING NOT AVAILABLE.

                </div>

            `);

        }

        return;

    }


    /* NORMAL */

    if (commands[command]) {

        const result =
            commands[command](args);


        if (result) {

            addOutput(result);

        }

    }

    else {

        addOutput(`

            <div class="error">

                Command not found:
                ${escapeHTML(command)}

                <br>

                Type
                <span class="command">
                    help
                </span>
                for assistance.

            </div>

        `);

    }

}


/* =========================
   ENDINGS
========================= */

function showEnding() {

    state.ending = "observer";

    saveState();

    activateGlitch();


    addOutput(`

        <div class="secret">

            <p>
                ENDING // THE OBSERVER
            </p>

            <br>

            <p>
                You thought you were investigating
                ECHO//NULL.
            </p>

            <p>
                You were wrong.
            </p>

            <br>

            <p>
                ECHO//NULL was investigating you.
            </p>

            <br>

            <p>
                SESSION TERMINATED.
            </p>

        </div>

    `);

}


/* =========================
   OUTPUT
========================= */

function addCommandLine(command) {

    const div =
        document.createElement("div");


    div.className = "output";


    div.innerHTML = `

        <div class="command-line">

            guest@echo-null:~$
            ${escapeHTML(command)}

        </div>

    `;


    screen.appendChild(div);


    scrollToBottom();

}


function addOutput(html) {

    const div =
        document.createElement("div");


    div.className = "output";


    div.innerHTML = html;


    screen.appendChild(div);


    scrollToBottom();

}


function scrollToBottom() {

    screen.scrollTop =
        screen.scrollHeight;

}


/* =========================
   HISTORY
========================= */

input.addEventListener(
    "keydown",
    function(event) {


        if (event.key === "ArrowUp") {

            if (!history.length) {
                return;
            }


            historyIndex--;


            if (historyIndex < 0) {
                historyIndex = 0;
            }


            input.value =
                history[historyIndex];

        }


        if (event.key === "ArrowDown") {

            if (!history.length) {
                return;
            }


            historyIndex++;


            if (
                historyIndex >=
                history.length
            ) {

                historyIndex =
                    history.length;

                input.value = "";

            }

            else {

                input.value =
                    history[historyIndex];

            }

        }

    }
);


/* =========================
   GLITCH
========================= */

function activateGlitch() {

    glitch.classList.remove(
        "glitch-active"
    );


    void glitch.offsetWidth;


    glitch.classList.add(
        "glitch-active"
    );

}


/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}


/* =========================
   FOCUS
========================= */

document.addEventListener(
    "click",
    function() {

        input.focus();

    }
);