const passwordInput =
    document.getElementById("password");

const message =
    document.getElementById("accessMessage");


function attemptAccess() {

    const password =
        passwordInput.value.trim();


    if (password === "07-19-NULL") {

        localStorage.setItem(
            "echoNullUnlocked",
            "true"
        );


        message.innerHTML = `

            <span class="success">

                ACCESS GRANTED.

                <br><br>

                Redirecting...

            </span>

        `;


        setTimeout(
            function() {

                window.location.href =
                    "memory.html";

            },
            1000
        );

    }

    else {

        message.innerHTML = `

            <span class="error">

                ACCESS DENIED.

                <br>

                INVALID CREDENTIAL.

            </span>

        `;

    }

}


passwordInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            attemptAccess();

        }

    }
);