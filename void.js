const message =
    document.getElementById("voidMessage");


const messages = [

    "IT HAS BEEN WAITING.",

    "YOU WERE ALWAYS GOING TO FIND THIS.",

    "MEMORY IS NOT STORAGE.",

    "MEMORY IS OBSERVATION.",

    "THE ECHO KNOWS."

];


let index = 0;


setInterval(
    function() {

        message.textContent =
            messages[index];

        index++;

        if (index >= messages.length) {

            index = 0;

        }

    },
    3000
);


/* Developer console clue */

console.log(
    "%cNULL",
    "font-size:40px;color:#d9a7ff"
);

console.log(
    "%cThe observer is the observed.",
    "color:#68e3f0"
);