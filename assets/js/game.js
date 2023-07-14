var canClick = true; // Track if a click is allowed
var mochi_button = $("#poundMochiBtn");

// Define global variables for cursor's position
var cursorX = 0;
var cursorY = 0;

// Add mousemove event to document to update cursor's position
$(document).mousemove(function(e) {
    cursorX = e.pageX;
    cursorY = e.pageY;
});

function poundMochi(isKey = false) {
    if (!isKey && canClick) {
        let additionalPoints = doublePoundAction(); // get the critical hit from doublePoundAction
        let basePoints = additionalPoints ? additionalPoints : pointsPerClick;

        // If we're in fever mode, gain 2x more points
        if (feverMode) {
            basePoints *= 2;
        }

        points += basePoints;

        if (additionalPoints) { // If the critical hit was activated
            floatText(mochi_button, `+${basePoints}`, true); // Display the critical hit floating text
            spawnTexts(basePoints);

            crit_sound.currentTime = 0; // Reset the sound to the beginning
            crit_sound.volume = 0.3;
            crit_sound.play();
            updatePerfectMeter(10);
        } else { // If the critical hit was not activated
            floatText(mochi_button, `+${basePoints}`); // Display the regular floating text
            click_mochi_sound.currentTime = 0; // Reset the sound to the beginning
            click_mochi_sound.volume = 0.2;
            click_mochi_sound.play();
        }

        $("#points").text(points);
        animatePointsAndImage();
        mochi_button.addClass('btn-danger').removeClass('btn-primary');
        mochi_button.effect("shake", { times: 1, distance: 4, direction: "left", duration: 120 }); // Shake horizontally
        clickTimes.push(Date.now());
        updatePPS();
        updatePerfectMeter(5);

        canClick = false; // Disallow further clicks until spacebar is pressed
    } else if (isKey && !canClick) {
        mochi_button.addClass('btn-primary').removeClass('btn-danger');
        mochi_button.effect("shake", { times: 1, distance: 4, direction: "up", duration: 120 }); // Shake vertically
        key_mochi_sound.currentTime = 0; // Reset the sound to the beginning
        key_mochi_sound.volume = 0.2;
        key_mochi_sound.play();
        canClick = true; // Allow clicking again
    }
}
mochi_button.click(function () {
    poundMochi();
});

// Add keydown event to document
$(document).keydown(function (e) {
    // If the pressed key is spacebar (keyCode 32)
    if (e.keyCode === 32) {
        e.preventDefault(); // Prevent the default action of the spacebar
        poundMochi(true);
    }
});

// Initialize a variable for the perfect meter value
let perfectMeterValue = 0;
let feverMode = false;

function updatePerfectMeter(addValue) {
    // Check if we're in fever mode
    if (feverMode) {
        // In fever mode, only allow the meter to decrease
        if (addValue < 0) {
            perfectMeterValue = Math.max(0, perfectMeterValue + addValue);
        }
    } else {
        perfectMeterValue = Math.max(0, Math.min(100, perfectMeterValue + addValue));

        // Check if we've reached 100%
        if (perfectMeterValue === 100) {
            // If so, start fever mode
            feverMode = true;

            // Change the page's body background color to #d9b0db
            $("body").animate({
                backgroundColor: "#d9b0db"
            }, 1000); // Transition over 1000ms (1 second)

            // Also change the perfect meter color to match
            $(".perfect-meter").animate({
                backgroundColor: "#d9b0db"
            }, 1000);
        }
    }

    // Update the progress bar's 'height' and 'aria-valuenow' attributes
    $(".perfect-meter").css("height", `${perfectMeterValue}%`).attr("aria-valuenow", perfectMeterValue);

    // If we're in fever mode and the meter has dropped to 0, end fever mode
    if (feverMode && perfectMeterValue === 0) {
        feverMode = false;
        
        // Return the background color to its original state
        $("body").animate({
            backgroundColor: "#ffe7da"
        }, 1000); // Transition over 1000ms (1 second)

        // Also return the perfect meter color to its original state
        $(".perfect-meter").animate({
            backgroundColor: "#ffc26b"
        }, 1000);
    }
}

// Set the decrement per second
let decrementPerSecond = 20;

// Call this function on document ready to start decreasing the meter gradually
function startDecreasingMeter() {
    // Decrease the meter every 200ms for a smooth animation
    setInterval(() => {
        // Check if we're in fever mode
        if (feverMode) {
            // In fever mode, decrease the meter 2.5x faster
            updatePerfectMeter(-2 * decrementPerSecond / 20);
        } else {
            // Here we calculate a decrement value proportional to the time elapsed, for a total of decrementPerSecond per second
            updatePerfectMeter(-decrementPerSecond / 20);
        }
    }, 50);
}