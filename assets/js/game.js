var canClick = true; // Track if a click is allowed
var mochi_button = $("#poundMochiBtn");

function poundMochi(isKey=false) {
    if (!isKey && canClick) {
        // points++;
        points += pointsPerClick;
        $("#points").text(points);
        mochi_button.addClass('btn-danger').removeClass('btn-primary');
        mochi_button.effect("shake", { times: 1, distance: 4, direction: "left", duration: 120 }); // Shake horizontally

        floatText(mochi_button, `+${pointsPerClick}`); // Display the floating text
        clickTimes.push(Date.now());
        updatePPS();

        click_mochi_sound.currentTime = 0; // Reset the sound to the beginning
        click_mochi_sound.volume = 0.2;
        click_mochi_sound.play();
        canClick = false; // Disallow further clicks until spacebar is pressed
    } else if(isKey && !canClick) {
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