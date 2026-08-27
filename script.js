const form = document.getElementById("terminalForm");
const input = document.getElementById("commandInput");
const screen = document.getElementById("screen");
const glitch = document.getElementById("glitch");

const commandHistory = [];
let historyIndex = -1;

const commands = {

    help: () => `
        <div class="command-result">
            <p>AVAILABLE COMMANDS</p>
            <br>
            <p><span class="command">help</span> &nbsp;&nbsp;&nbsp; show this message</p>
            <p><span class="command">scan</span> &nbsp;&nbsp;&nbsp; scan the system</p>
            <p><span class="command">echo</span> &nbsp;&nbsp;&nbsp; repeat a message</p>
            <p><span class="command">memory</span> &nbsp; access memory sectors</p>
            <p><span class="command">status</span> &nbsp;&nbsp; system status</p>
            <p><span class="command">clear</span> &nbsp;&nbsp;&nbsp; clear terminal</p>
        </div>
    `,

    scan: () => `
        <div class="command-result">
            <p>Scanning...</p>
            <p>[████████████████████] 100%</p>
            <br>
            <p>Network ........ ONLINE</p>
            <p>Memory ........ 73% CORRUPTED</p>
            <p>Unknown file .. DETECTED</p>
            <p>Location ...... /memory/sector_07</p>
        </div>
    `,

    status: () => `
        <div class="command-result">
            <p>SYSTEM STATUS</p>
            <br>
            <p>Core .............. STABLE</p>
            <p>Memory ............ UNSTABLE</p>
            <p>Connection ........ SECURE</p>
            <p>Unknown Process .. RUNNING</p>
        </div>
    `,

    memory: () => `
        <div class="command-result">
            <p>MEMORY ACCESS</p>
            <br>
            <p>Sector 01 ......... OK</p>
            <p>Sector 02 ......... OK</p>
            <p>Sector 03 ......... OK</p>
            <p>Sector 04 ......... OK</p>
            <p>Sector 05 ......... CORRUPTED</p>
            <p>Sector 06 ......... CORRUPTED</p>
            <p>Sector 07 ......... <span class="secret">LOCKED</span></p>
        </div>
    `,

    clear: () => {
        screen.innerHTML = "";
        return null;
    },

    echo: (args) => {
        if (!args) {
            return `
                <div class="command-result error">
                    Usage: echo [message]
                </div>
            `;
        }

        return `
            <div class="command-result">
                ${escapeHTML(args)}
            </div>
        `;
    }
};


/* Submit command */

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const rawCommand = input.value.trim();

    if (!rawCommand) return;

    commandHistory.push(rawCommand);
    historyIndex = commandHistory.length;

    processCommand(rawCommand);

    input.value = "";

});


/* Process commands */

function processCommand(rawCommand) {

    const parts = rawCommand.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    addCommandLine(rawCommand);

    /* Secret command */

    if (command === "wake") {

        activateGlitch();

        addOutput(`
            <div class="secret">
                <p>...</p>
                <p>YOU SHOULDN'T HAVE FOUND THIS.</p>
                <br>
                <p>THE SYSTEM REMEMBERS YOU.</p>
                <p>ACCESS CODE: 07-19-NULL</p>
            </div>
        `);

        return;
    }

    if (command === "whoami") {

        addOutput(`
            <div class="secret">
                <p>IDENTITY UNKNOWN.</p>
                <p>SESSION OWNER: [REDACTED]</p>
            </div>
        `);

        activateGlitch();

        return;
    }

    if (command === "unlock") {

        if (args === "07-19-NULL") {

            activateGlitch();

            addOutput(`
                <div class="success">
                    <p>ACCESS GRANTED.</p>
                    <br>
                    <p>MEMORY SECTOR 07 UNLOCKED.</p>
                    <p>FILE: <span class="secret">THE_FIRST_ECHO</span></p>
                    <br>
                    <p class="secret">
                        "It wasn't supposed to remember."
                    </p>
                </div>
            `);

        } else {

            addOutput(`
                <div class="error">
                    ACCESS DENIED.
                </div>
            `);

        }

        return;
    }


    /* Normal commands */

    if (commands[command]) {

        const result = commands[command](args);

        if (result) {
            addOutput(result);
        }

    } else {

        addOutput(`
            <div class="error">
                Command not found: ${escapeHTML(command)}
                <br>
                Type <span class="command">help</span> for available commands.
            </div>
        `);

    }

}


/* Add command line */

function addCommandLine(command) {

    const div = document.createElement("div");

    div.className = "output";

    div.innerHTML = `
        <div class="command-line">
            guest@echo-null:~$ ${escapeHTML(command)}
        </div>
    `;

    screen.appendChild(div);

    scrollToBottom();
}


/* Add output */

function addOutput(html) {

    const div = document.createElement("div");

    div.className = "output";

    div.innerHTML = html;

    screen.appendChild(div);

    scrollToBottom();
}


/* Scroll */

function scrollToBottom() {

    screen.scrollTop = screen.scrollHeight;

}


/* Keyboard history */

input.addEventListener("keydown", function(event) {

    if (event.key === "ArrowUp") {

        if (commandHistory.length === 0) return;

        historyIndex--;

        if (historyIndex < 0) {
            historyIndex = 0;
        }

        input.value = commandHistory[historyIndex];

    }


    if (event.key === "ArrowDown") {

        if (commandHistory.length === 0) return;

        historyIndex++;

        if (historyIndex >= commandHistory.length) {

            historyIndex = commandHistory.length;
            input.value = "";

        } else {

            input.value = commandHistory[historyIndex];

        }

    }

});


/* Glitch effect */

function activateGlitch() {

    glitch.classList.remove("glitch-active");

    void glitch.offsetWidth;

    glitch.classList.add("glitch-active");

}


/* Prevent HTML injection */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* Keep input focused */

document.addEventListener("click", function() {

    input.focus();

});