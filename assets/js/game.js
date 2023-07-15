var canClick = true; // Track if a click is allowed
var game_sequence = 0;
var mochi_buttons = {
    "button0": { canClick: true, button: $(`.tutorial-button[data-button_sequence="0"]`) },
    "button1": { canClick: true, button: $(`.tutorial-button[data-button_sequence="1"]`) },
    "mochi_button": { canClick: true, button: $(`#poundMochiBtn`) },
    "normal_mode": { canClick: true, mode: 'normal', button: $(`.start-btn[data-mode="normal"]`) },
    "zen_mode": { canClick: true, mode: 'zen', button: $(`.start-btn[data-mode="zen"]`) }
};

// Define global variables for cursor's position
var cursorX = 0;
var cursorY = 0;

// Add mousemove event to document to update cursor's position
$(document).mousemove(function(e) {
    cursorX = e.pageX;
    cursorY = e.pageY;
});

let lastPoundTime = null;
let perfectMeterVisible = false;

function poundMochi(button, isKey = false) {
    console.log('button', button);
    console.log('isKey', isKey);
    console.log('game_sequence', game_sequence)
    switch(game_sequence) {
        case 0:
            // tutorial part 1
            if (!isKey && button.canClick) {
                click_mochi_sound.currentTime = 0; // Reset the sound to the beginning
                click_mochi_sound.volume = 0.2;
                click_mochi_sound.play();

                button.button.addClass('btn-danger').removeClass('btn-primary');
                button.button.effect("shake", { times: 1, distance: 4, direction: "left", duration: 120 }); // Shake horizontally

                setTimeout(function() {
                    $('.tutorial-text[data-sequence="4"]').fadeIn();
                    teletype('tutorial-text[data-sequence="4"]', `Great! But pounding mochis take effort...`, 2250);
                }, 500);
                setTimeout(function() {
                    $('.tutorial-text[data-sequence="4"]').text('');
                    teletype('tutorial-text[data-sequence="4"]', `So you'll have to press spacebar as well!`, 2250);
                }, 3250);

                button.canClick = false; // Disallow further clicks until spacebar is pressed
            } else {
                button.button.addClass('disabled').removeClass('btn-danger').prop('disabled', true);
                button.button.effect("shake", { times: 1, distance: 4, direction: "up", duration: 120 }); // Shake vertically
                key_mochi_sound.currentTime = 0; // Reset the sound to the beginning
                key_mochi_sound.volume = 0.2;
                key_mochi_sound.play();

                $('.tutorial-text[data-sequence="4"]').text('');
                setTimeout(function() {
                    teletype('tutorial-text[data-sequence="4"]', `Good job! By clicking and using spacebar, you create a rhythm!`, 2250);
                }, 500);
                setTimeout(function() {
                    $('.tutorial-text[data-sequence="5"]').fadeIn();
                    teletype('tutorial-text[data-sequence="5"]', `With a rhythm, you can pound mochis now!`, 2250);
                    $(`.tutorial-button[data-button_sequence="0"]`).fadeOut();
                }, 3250);

                game_sequence = 1;
                button.canClick = true; // Allow clicking again

                setTimeout(function() {
                    $('.tutorial-text[data-sequence="6"]').fadeIn();
                }, 5500);
            }
            break;
        case 1:
            // tutorial part 2
            if (!isKey && button.canClick) {
                click_mochi_sound.currentTime = 0; // Reset the sound to the beginning
                click_mochi_sound.volume = 0.2;
                click_mochi_sound.play();

                button.button.addClass('btn-danger').removeClass('btn-primary');
                button.button.effect("shake", { times: 1, distance: 4, direction: "left", duration: 120 }); // Shake horizontally

                button.canClick = false; // Disallow further clicks until spacebar is pressed
            } else {
                button.button.addClass('btn-primary').removeClass('btn-danger');
                button.button.effect("shake", { times: 1, distance: 4, direction: "up", duration: 120 }); // Shake vertically
                key_mochi_sound.currentTime = 0; // Reset the sound to the beginning
                key_mochi_sound.volume = 0.2;
                key_mochi_sound.play();

                $('.intro-group').removeClass('d-flex').hide();
                $('.game-group').fadeIn();

                game_sequence = 100;
                button.canClick = true; // Allow clicking again

                localStorage.setItem('has_viewed_tutorial', true);
            }
            break;
        case 100:
            // main menu!
            switch(button.mode) {
                case 'normal':
                    if (!isKey && button.canClick) {
                        click_mochi_sound.currentTime = 0; // Reset the sound to the beginning
                        click_mochi_sound.volume = 0.2;
                        click_mochi_sound.play();

                        button.button.addClass('btn-danger').removeClass('btn-primary');
                        button.button.effect("shake", { times: 1, distance: 4, direction: "left", duration: 120 }); // Shake horizontally

                        button.canClick = false; // Disallow further clicks until spacebar is pressed
                    } else {
                        button.button.addClass('btn-success').removeClass('btn-danger');
                        button.button.effect("shake", { times: 1, distance: 4, direction: "up", duration: 120 }); // Shake vertically
                        key_mochi_sound.currentTime = 0; // Reset the sound to the beginning
                        key_mochi_sound.volume = 0.2;
                        key_mochi_sound.play();

                        startDecreasingMeter();

                        // Starts the game
                        $(".start-btn").parent().removeClass('d-flex').hide();
                        $("#poundMochiBtn").show();
                        $(".upgrades-group").fadeIn();

                        $(".title-group").hide();
                        $(".timer-group").fadeIn();

                        ice_milk_tei.currentTime = 0;
                        ice_milk_tei.volume = 0.25;
                        ice_milk_tei.play();

                        game_sequence = 200;

                        // Timer
                        startTimer(180, function() {
                            // What to do when the timer finishes goes here
                            console.log('Timer finished!');
                            fadeOutMusic(ice_milk_tei);

                            setTimeout(function() {
                                muse_end.currentTime = 0;
                                muse_end.volume = 0.7;
                                muse_end.play();
                            }, 500);

                            setTimeout(function() {
                                animateShine(document.body)
                                $('.tewi-image').attr('src', 'assets/images/end_screen.jpg');
                                $('.tewi-image').hide();
                                $('.tewi-image').fadeIn();
                                
                                if (per_second_timer) {
                                    clearInterval(per_second_timer);
                                }
                                // if (image_fall_timer) {
                                //     clearInterval(image_fall_timer);
                                // }
                                // if (bunny_fall_timer) {
                                //     clearInterval(bunny_fall_timer);
                                // }

                                // // Image fall timer.
                                // let cloverFallInterval = 333;
                                // clover_fall_timer = setInterval(() => {
                                //     let img = $('<img class="falling-image" src="assets/images/ItemIconLuckyClover.png" width="64" height="64">');
                                //     let leftPos = Math.random() * ($(window).width() - img.width());
                                //     img.css({ 'left': leftPos + 'px', 'top': '-64px' });  // Image initially outside of the screen
                                //     $(document.body).append(img);
                                //     img.animate({ 'top': $(window).height() + 'px' }, 5000, 'easeOutQuad', function() {
                                //         $(this).remove();
                                //     });
                                // }, cloverFallInterval);

                                $('.perfect-meter-card').animate({
                                    left: '150px'
                                }, 500);
                                $('.credits-card').animate({
                                    left: '138px'
                                }, 500);
                                $('.upgrades-container').animate({
                                    marginTop: '50rem'
                                }, 750);

                                let has_played_before = localStorage.getItem('has_played_before');
                                if (!has_played_before) {
                                    $('.medals-card').animate({
                                        left: '0px'
                                    }, 500);
                                    $('.achievements-card').animate({
                                        left: '0px'
                                    }, 500);

                                    setTimeout(function() {
                                        $('.medals-card').css('z-index', 0);
                                        $('.achievements-card').css('z-index', 0);
                                    }, 500);
                                }

                                localStorage.setItem('has_played_before', true);

                                $("#poundMochiBtn").prop('disabled', true);
                                $(".upgrades-group").prop('disabled', true);
                            }, 1000);

                            setTimeout(function() {
                                if (points >= 2000) {
                                    animateShine('.medals[data-medal="bronze"]', 400);
                                    $('.medals[data-medal="bronze"] span i').addClass('bi-check2-circle').removeClass('bi-circle');
                                    localStorage.setItem('medal_bronze', true);
                                }
                            }, 2500);
                            setTimeout(function() {
                                if (points >= 3000) {
                                    animateShine('.medals[data-medal="silver"]', 400);
                                    $('.medals[data-medal="silver"] span i').addClass('bi-check2-circle').removeClass('bi-circle');
                                    localStorage.setItem('medal_silver', true);
                                }
                            }, 3500);
                            setTimeout(function() {
                                if (points >= 5000) {
                                    animateShine('.medals[data-medal="gold"]', 400);
                                    $('.medals[data-medal="gold"] span i').addClass('bi-check2-circle').removeClass('bi-circle');
                                    localStorage.setItem('medal_gold', true);
                                }
                            }, 4500);
                        });

                        button.canClick = true; // Allow clicking again
                    }
                    break;
                case 'zen':
                    if (!isKey && button.canClick) {
                        click_mochi_sound.currentTime = 0; // Reset the sound to the beginning
                        click_mochi_sound.volume = 0.2;
                        click_mochi_sound.play();

                        button.button.addClass('btn-danger').removeClass('btn-primary');
                        button.button.effect("shake", { times: 1, distance: 4, direction: "left", duration: 120 }); // Shake horizontally

                        button.canClick = false; // Disallow further clicks until spacebar is pressed
                    } else {
                        button.button.addClass('btn-success').removeClass('btn-danger');
                        button.button.effect("shake", { times: 1, distance: 4, direction: "up", duration: 120 }); // Shake vertically
                        key_mochi_sound.currentTime = 0; // Reset the sound to the beginning
                        key_mochi_sound.volume = 0.2;
                        key_mochi_sound.play();

                        startDecreasingMeter();

                        // Starts the game
                        $(".start-btn").parent().removeClass('d-flex').hide();
                        $("#poundMochiBtn").show();
                        $(".upgrades-group").fadeIn();

                        $(".title-group").hide();
                        $(".timer-group").fadeIn();

                        game_sequence = 200;

                        heaven.currentTime = 0;
                        heaven.volume = 0.55;

                        // Event listener to trigger loop and pause when the song ends
                        heaven.addEventListener('ended', handleLoopAndPause);

                        // Start playing the song
                        heaven.play();

                        animateShine($('.tewi-image'));
                        $('.tewi-image').attr('src', 'assets/images/zen.jpg');
                        $('.tewi-image').hide();
                        $('.tewi-image').fadeIn();

                        $("#progressBar").css('background-color', '#198754');
                        $("#timer").text('えーマジ 初月！？[ZEN MODE] キャハハハハハハ');

                        button.canClick = true; // Allow clicking again
                    }
                    break;
                default:
                    console.log(`Missing game mode for button!`);
                    break;
            }
            break;
        case 200:
            // main game!
            if (!isKey && button.canClick) {
                let additionalPoints = doublePoundAction(); // get the critical hit from doublePoundAction
                let basePoints = additionalPoints ? additionalPoints : pointsPerClick;

                lastPoundTime = Date.now();  // record the time of the pound

                // If we're in fever mode, gain 2x more points
                if (feverMode) {
                    basePoints *= 2;
                }

                points += basePoints;

                if (additionalPoints) { // If the critical hit was activated
                    floatText(button.button, `+${basePoints}`, true); // Display the critical hit floating text
                    spawnTexts(basePoints);

                    // // Create image
                    // var img = $('<img id="dynamic">'); 
                    // img.attr('src', 'assets/images/ItemIconLuckyRabbit.png');
                    // img.css({
                    //     'position': 'absolute',
                    //     'top': cursorY + 'px',
                    //     'left': cursorX + 'px',
                    //     'width': '32px',
                    //     'height': '32px',
                    //     'pointer-events': 'none' // make it unselectable
                    // });
                    // img.appendTo('body').hide().fadeIn(100).fadeOut(200, function() {
                    //     $(this).remove();
                    // });

                    crit_sound.currentTime = 0; // Reset the sound to the beginning
                    crit_sound.volume = 0.3;
                    crit_sound.play();
                    updatePerfectMeter(2);
                } else { // If the critical hit was not activated
                    floatText(button.button, `+${basePoints}`); // Display the regular floating text
                    click_mochi_sound.currentTime = 0; // Reset the sound to the beginning
                    click_mochi_sound.volume = 0.2;
                    click_mochi_sound.play();
                }

                $("#points").text(points.toLocaleString());
                animatePointsAndImage();
                button.button.addClass('btn-danger').removeClass('btn-primary');
                button.button.effect("shake", { times: 1, distance: 4, direction: "left", duration: 120 }); // Shake horizontally
                clickTimes.push(Date.now());
                updatePPS();
                perfectMeterComboNumber++;
                $('.perfect-meter-text-number').text(perfectMeterComboNumber);
                updatePerfectMeter(1);

                button.canClick = false; // Disallow further clicks until spacebar is pressed
            } else if (isKey && !button.canClick) {
                button.button.addClass('btn-primary').removeClass('btn-danger');
                button.button.effect("shake", { times: 1, distance: 4, direction: "up", duration: 120 }); // Shake vertically
                key_mochi_sound.currentTime = 0; // Reset the sound to the beginning
                key_mochi_sound.volume = 0.2;
                key_mochi_sound.play();
                button.canClick = true; // Allow clicking again
            }
            break;
        default:
            console.log(`Missing game sequence! Current game sequence: ${game_sequence}`);
            break;
    }
}

// Add click event to each button
for (let buttonKey in mochi_buttons) {
    let button = mochi_buttons[buttonKey];
    button.button.click(function () {
        poundMochi(button);
        lastClickedButton = button; // Update the last clicked button
    });
}

// Add keydown event to document
$(document).keydown(function (e) {
    // If the pressed key is spacebar (keyCode 32)
    if (e.keyCode === 32) {
        e.preventDefault(); // Prevent the default action of the spacebar
        for (let buttonKey in mochi_buttons) {
            let button = mochi_buttons[buttonKey];
            if (!button.canClick) {
                button.canClick = true; // Allow clicking again
                button.button.addClass('btn-primary').removeClass('btn-danger'); // Adjust the button class
            }
        }
        console.log(lastClickedButton);
        if (lastClickedButton !== null) {
            poundMochi(lastClickedButton, true);
        }
    }
});

// Initialize a variable for the perfect meter value
let perfectMeterComboNumber = 0;
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
            fever.currentTime = 0; // Reset the sound to the beginning
            fever.volume = 0.8;
            fever.play();
            makeItRain();

            $('.perfect-meter-text-main').hide();
            $('.perfect-meter-text-sub').hide();
            $('.perfect-meter-text-fever').show();

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

    if (!perfectMeterVisible && perfectMeterValue >= 25) {
        perfectMeterVisible = true;
        $('.perfect-meter-card').animate({
            left: '0px'
        }, 500)
    }

    // Update the progress bar's 'height' and 'aria-valuenow' attributes
    $(".perfect-meter").css("height", `${perfectMeterValue}%`).attr("aria-valuenow", perfectMeterValue);

    // If we're in fever mode and the meter has dropped to 0, end fever mode
    if (feverMode && perfectMeterValue === 0) {
        feverMode = false;

        $('.perfect-meter-text-main').show();
        $('.perfect-meter-text-sub').show();
        $('.perfect-meter-text-fever').hide();
        
        // Return the background color to its original state
        $("body").animate({
            backgroundColor: "#ffe7da"
        }, 1000); // Transition over 1000ms (1 second)

        // Also return the perfect meter color to its original state
        $(".perfect-meter").animate({
            backgroundColor: "#ffe7da"
        }, 1000);
    }
}

// Set the decrement per second
let decrementPerSecond = 5;

function startDecreasingMeter() {
    setInterval(() => {
        // If the last pound was more than 0.25 seconds ago or we're in fever mode, decrease the meter
        if (!lastPoundTime || Date.now() - lastPoundTime >= 250 || feverMode) {
            perfectMeterComboNumber = 0;
            $('.perfect-meter-text-number').text(perfectMeterComboNumber);
            let decrement = feverMode ? decrementPerSecond * 2.5 / 20 : decrementPerSecond / 20;
            updatePerfectMeter(-decrement);
        }
    }, 50);
}

// Define the last action performed, initially set as null
let lastAction = null;

// Listen for keydown events (spacebar press)
$(document).keydown(function(e) {
    if (e.keyCode == 32) {  // check if the key pressed was the space bar
        if (lastAction === 'keydown') { // check if the last action was also a keydown
            perfectMeterComboNumber = 0;
            $('.perfect-meter-text-number').text(perfectMeterComboNumber);
        }

        lastAction = 'keydown';  // update the last action
    }
});

// Listen for mousedown events (mouse click)
$(document).mousedown(function() {
    if (lastAction === 'mousedown') {  // check if the last action was also a mousedown
        perfectMeterComboNumber = 0;
        $('.perfect-meter-text-number').text(perfectMeterComboNumber);
    }

    lastAction = 'mousedown';  // update the last action
});