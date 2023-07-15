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
    'mochiKinematics', 
    10,
    'Q',
    'Automatically pounds every second.',
    function() { 
        increasePointsPerSecond();
        key_mochi_sound.currentTime = 0; // Reset the sound to the beginning
        key_mochi_sound.volume = 0.2;
        key_mochi_sound.play();
    },
    1.18
);

let poundUpgrade = new Upgrade(
    'bunnyBash',
    20,
    'W',
    'Increases pounds per click.',
    function () {
        increasePointsPerClick();
        key_mochi_sound.currentTime = 0; // Reset the sound to the beginning
        key_mochi_sound.volume = 0.2;
        key_mochi_sound.play();
    }
);

let doublePoundUpgrade = new Upgrade(
    'hop\'nSquash',
    30,
    'E',
    '10% chance to land critical pounds.',
    function () {
        key_mochi_sound.currentTime = 0;
        key_mochi_sound.volume = 0.2;
        key_mochi_sound.play();
    }
);

// ================
// RELATED FUNCTIONS
// ================

let per_second_timer;
let image_fall_timer;
let bunny_fall_timer;

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
        $('#points').text(points.toLocaleString());
        
        floatText($("#poundMochiBtn"), "+1");
        timerTimes.push(Date.now());
        updatePPS();
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

    if (bunny_fall_timer) {
        clearInterval(bunny_fall_timer);
    }

    // Image fall timer.
    let bunnyFallInterval = 7000 / pointsPerClick;
    bunny_fall_timer = setInterval(() => {
        let img = $('<img class="falling-image" src="assets/images/ItemIconLuckyRabbit.png" width="64" height="64">');
        let leftPos = Math.random() * ($(window).width() - img.width());
        img.css({ 'left': leftPos + 'px', 'top': '-64px' });  // Image initially outside of the screen
        $(document.body).append(img);
        img.animate({ 'top': $(window).height() + 'px' }, 5000, 'easeOutQuad', function() {
            $(this).remove();
        });
    }, bunnyFallInterval);
}

function doublePoundAction() {
    if (doublePoundUpgrade.level <= 0) {
        return false; // return false if not purchased
    }

    if (Math.random() >= 0.1) { // 10% chance
        return false;
    }

    // Calculate diminishing return multiplier with base 2
    // This will yield a multiplier that starts at 2 for level 1 and grows logarithmically for each subsequent level
    let doublePound = 2 + Math.log(doublePoundUpgrade.level);

    // Check if the user has upgraded the poundUpgrade and adjust doublePound accordingly.
    if (poundUpgrade.level >= 1) {
        doublePound *= (poundUpgrade.level + 1);
        console.log('after poundUpgrade - doublePound: ' + doublePound);
    } else {
        console.log('before poundUpgrade - doublePound: ' + doublePound);
    }

    return Math.round(doublePound); // Return the critical hit value
}