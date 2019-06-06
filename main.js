"use strict";

// ELEMENTS
var houseWrapperEl = document.getElementById("houseContainer");
var buttonEl = document.getElementById("buttonStart");
var statsEl = document.getElementById("stats");
var simulationSummary = document.getElementById("simulationSummary");
var finalResultsEl = document.getElementById("finalResults");

// VARIABLES
var simulationCounter = 0;
var result = [];

// EVENT LISTENERS
buttonEl.addEventListener("click", prepareSimulation, false);

// FUNCTIONS
function render(zombies, humans, houses) {
    houseWrapperEl.innerHTML = "";

    // Update progress
    statsEl.innerHTML =
        "<span class='iconZombie'>" + zombies.length + "</span>" +
        "<span class='iconHuman'>" + humans + "</span>";

    // Render houses and set their status
    for (var i = 0; i < houses; i++) {
        if (zombies.includes(i)) {
            houseWrapperEl.innerHTML += "<div id='" + i + "' class='house zombie' />";
        } else {
            houseWrapperEl.innerHTML += "<div id='" + i + "' class='house human' />";
        }
    }
}

function prepareSimulation() {
    // Disable inputs
    document.getElementById("buttonStart").disabled = true;
    document.getElementById("inputSpeed").disabled = true;
    document.getElementById("inputHouses").disabled = true;
    document.getElementById("inputSimulations").disabled = true;

    // Set speed, houses and no. of simulations
    var speed = document.getElementById("inputSpeed").value * 100;
    var houses = document.getElementById("inputHouses").value;
    var simulationLimit = document.getElementById("inputSimulations").value;

    // Check user input restrictions
    if (houses > 300) { houses = 300; }
    if (houses < 1) { houses = 1; }
    if (simulationLimit < 1) { simulationLimit = 1; }

    buttonEl.innerHTML = "Simulation running...";

    runSimulation(speed, houses, simulationLimit);
}

function runSimulation(speed, houses, simulationLimit) {
    if (simulationCounter < simulationLimit) {
        // First zombie lives at address -1
        var zombies = [-1];
        var rounds = 0;
        var humans = houses;

        render(zombies, humans, houses);

        setTimeout(function () { loopRounds(); }, speed);

        function loopRounds() {
            // Commit one attack per zombie
            var horde = zombies.length;
            for (var i = 0; i < horde; i++) {
                var target = Math.floor(Math.random() * houses);

                // Determine if attack was a hit
                if (!zombies.includes(target)) {
                    zombies.push(target);
                    humans--;
                }
            }

            // Update graphics
            render(zombies, humans, houses);
            rounds++;

            if (humans > 0) {
                // Repeat
                setTimeout(function () { loopRounds(); }, speed);
            } else {
                // Start next simulation
                simulationSummary.innerHTML += "<p>Simulation " + simulationCounter + ": <span class='rounds'>" + rounds + " rounds</span></p>";
                result.push(rounds);
                setTimeout(function () { runSimulation(speed, houses, simulationLimit) }, 800);
            }
        }
        simulationCounter++;
    } else {
        endSimulation(result);
    }
}

function endSimulation(result) {
    var average = result.reduce((a, b) => a + b, 0) / result.length
    finalResultsEl.innerHTML = "It took the zombies roughly <span class='avgRounds'>" + average + " rounds</span> to find all the houses";
    buttonEl.innerHTML = "Simulation over<br/><a href='index.html'>Try again</a>";
}