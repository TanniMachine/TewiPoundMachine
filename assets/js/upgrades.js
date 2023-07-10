// let upgrade_name = new Upgrade(
//     id_and_name = '',
//     cost = 0,
//     hotkey = 'A',
//     description = '',
//     related_function = function() {
//         points++;
//     }
// )


// ================
// SET UPGRADES
// ================


let automaticPounding = new Upgrade(
    'kinematics', 
    10,
    'Q',
    'Automatically pounds every second.',
    function() { 
        increasePointsPerSecond();
        key_mochi_sound.currentTime = 0; // Reset the sound to the beginning
        key_mochi_sound.volume = 0.2;
        key_mochi_sound.play();
    }
);

let poundUpgrade = new Upgrade(
    'poundUpgrade',
    20,
    'W',
    'Increases pounds per click by +1.',
    function () {
        increasePointsPerClick();
        key_mochi_sound.currentTime = 0; // Reset the sound to the beginning
        key_mochi_sound.volume = 0.2;
        key_mochi_sound.play();
    }
);

// ================
// RELATED FUNCTIONS
// ================

let per_second_timer;
let image_fall_timer;


function increasePointsPerSecond() {
    // Increment pointsPerSecond.
    pointsPerSecond++; 

    // Clear the existing timer if it exists.
    if (per_second_timer) {
        clearInterval(per_second_timer);
    }

    if (image_fall_timer) {
        clearInterval(image_fall_timer);
    }

    // Start a new timer with an interval that gets halved each level.
    let interval = 1000 / pointsPerSecond;
    per_second_timer = setInterval(() => {
        points += 1;
        $('#points').text(points);
        floatText($("#poundMochiBtn"), "+1");
    }, interval);

    // Image fall timer.
    let imageFallInterval = 3000 / pointsPerSecond;
    image_fall_timer = setInterval(() => {
        let img = $('<img class="falling-image" src="assets/images/IngredientIconStickyRice.png" width="64" height="64">');
        let leftPos = Math.random() * ($(window).width() - img.width());
        img.css({ 'left': leftPos + 'px', 'top': '-64px' });  // Image initially outside of the screen
        $(document.body).append(img);
        img.animate({ 'top': $(window).height() + 'px' }, 5000, 'easeOutQuad', function() {
            $(this).remove();
        });
    }, imageFallInterval);
}

function increasePointsPerClick() {
    pointsPerClick++;
}