var clickTimes = [];
var timerTimes = [];
var points = 0;
var pointsPerSecond = 0;
var pointsPerClick = 1;

class Upgrade {
    constructor(id, cost, hotkey, description, incrementFunction, costMultiplier = 1.8) {
        this.id = id.replace('\'', '-');
        this.cost = cost;
        this.hotkey = hotkey;
        this.upgradeElementId = `#${this.id}Button`;
        this.description = description;
        this.incrementFunction = incrementFunction;
        this.costMultiplier = costMultiplier;
        this.level = 0;

        this.createHTML();
        this.registerUpgrade();
        this.registerHotkey();
    }

    createHTML() {
        let html = `
        <div id="${this.id}" class="card upgrade-card ms-2 mb-2" style="width: 20rem;">
            <div class="card-body">
                <h5 class="card-title font-bunny" style="font-size: 32px;">[${this.hotkey}] ${this.id.replace(/([A-Z])/g, ' $1').replace(/-n/g, ' \'n ').replace(/^./, str => str.toUpperCase())} <span style="font-size: 24px;">x<span id="${this.id}Level">${this.level}</span></span></h5>
                <p class="upgrade-cost" style="font-size: 18px; font-weight: bold;">
                    <img src="assets/images/CuisineIconMochi.png" width="24" height="24"> <span id="${this.id}Cost">${this.cost}</span>
                </p>
                <p class="card-text">${this.description}</p>
                <button id="${this.id}Button" class="btn btn-success w-100">Buy</button>
            </div>
        </div>
        `;
        $('#upgrades').append(html);
    }

    registerUpgrade() {
        const self = this;
        $(this.upgradeElementId).click(function () {
            if (points >= self.cost) {
                animateShine($(this).parent());
                points -= self.cost;
                self.level++;
                self.incrementFunction();
                $('#points').text(points);
                self.cost *= self.costMultiplier;
                self.cost = Math.round(self.cost);
                $(self.upgradeElementId).html(`Level Up`);
                $(`#${self.id}Cost`).text(self.cost);
                $(`#${self.id}Level`).text(self.level);
            } else {
                $(this).parent().effect("shake", { times: 1, distance: 8, direction: "left", duration: 240 }); // Shake horizontally
            }
        });
    }

    registerHotkey() {
        const self = this;
        $(document).on('keydown', function (e) {
            if (String.fromCharCode(e.which) === self.hotkey.toUpperCase()) {
                $(self.upgradeElementId).click();
            }
        });
    }
}

function animateShine(selector, duration = 400, delay = 0) {
    setTimeout(function () {
        // Calculate dimensions and offset of the target element
        let targetElement = $(selector);
        let width = targetElement.outerWidth();
        let height = targetElement.outerHeight();
        let offset = targetElement.offset();

        // Calculate the diagonal length of the target element
        let diagonalLength = Math.sqrt(width * width + height * height);

        // Normalize the duration based on the diagonal length
        let normalizedDuration = (duration * diagonalLength) / (width + height);

        // Make the target element's position relative
        targetElement.css("position", "relative");

        // Create a wrapper element and set its style
        let shineWrapper = $("<div>")
            .css({
                position: "absolute",
                top: 0,
                left: 0,
                overflow: "hidden",
                width: width,
                height: height,
                pointerEvents: "none",
            })
            .appendTo(targetElement);

        let shine = $("<div>")
            .css({
                position: "absolute",
                top: -diagonalLength / 2, // Adjust top position based on diagonal length
                left: -diagonalLength, // Adjust left position to ensure off-screen start
                width: diagonalLength * 2, // Adjust width based on the diagonal length
                height: diagonalLength, // Adjust height based on the diagonal length
                background:
                    "linear-gradient(225deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%)",
                transform: "rotate(45deg)",
                pointerEvents: "none",
            })
            .appendTo(shineWrapper);

        shine.animate(
            {
                left: diagonalLength, // Adjust left position for the animation based on diagonal length
            },
            normalizedDuration,
            function () {
                shine.remove();
                shineWrapper.remove();
            }
        );
    }, delay);
}
function getRandomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function floatText(element, text, is_crit = false) {
    // Create a new span element
    let span = $("<span>").text(text);

    // Get a random variation for the starting position
    let randomLeft = getRandomRange(-75, 75);
    let randomTop = getRandomRange(-25, 25);

    if (is_crit) {
        span.css({
            position: "absolute",
            left: element.offset().left + randomLeft + 50,
            top: element.offset().top + randomTop,
            fontSize: 48,
            color: "rgb(200,168,121)",
            fontWeight: "bold",
            userSelect: 'none',
            pointerEvents: 'none'
        });
    } else {
        span.css({
            position: "absolute",
            left: element.offset().left + randomLeft + 50,
            top: element.offset().top + randomTop,
            fontSize: 16,
            color: "#7f6b638e",
            fontWeight: "bold",
            userSelect: 'none',
            pointerEvents: 'none'
        });
    }

    // Add the span to the body
    $("body").append(span);

    // Animate the span
    span.animate({top: "-=50", opacity: 0}, 2000, function() {
        $(this).remove(); // Remove the span after the animation is done
    });
}
function updatePPS() {
    // Get the current time
    var currentTime = Date.now();

    // Filter out events that happened more than one second ago
    clickTimes = clickTimes.filter(time => currentTime - time <= 1000);
    timerTimes = timerTimes.filter(time => currentTime - time <= 1000);

    // The length of clickTimes and timerTimes now represents the total PPS
    var PPS = clickTimes.length + timerTimes.length;

    // Update the PPS display
    $("#ppsDisplay").text(PPS);
}
function startTimer(duration, onFinish) {
    let timer = duration, minutes, seconds;
    let progressBarWidth = 100;
    let widthDecrement = 100 / (duration); // progress bar decrement based on the duration

    let interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        $('#timer').text(minutes + ":" + seconds); // Update the timer text
        progressBarWidth -= widthDecrement;
        $('#progressBar').css('width', progressBarWidth + '%').attr('aria-valuenow', progressBarWidth);

        if (--timer < 0) {
            timer = duration;
            clearInterval(interval);
            if(onFinish) onFinish();
        }
    }, 1000);
}
function startStream(phrases) {
    var phrase = phrases[Math.floor(Math.random() * phrases.length)];
    var fontSize = getRandomRange(16, 32);
    var speed = getRandomRange(2000, 7000);
    var opacity = getRandomRange(0.25, 0.5);

    var chatLine = $('<div class="chatText">' + phrase + '</div>').css('font-size', fontSize + 'px').css('opacity', opacity);
    
    $("#chatStream").append(chatLine);
    
    var startY = Math.random() * ($("#chatStream").height() - chatLine.height());

    chatLine.css({
        "right": -chatLine.width(),
        "top": startY
    });

    chatLine.animate({
        "right": $("#chatStream").width()
    }, {
        duration: speed,
        complete: function () {
            $(this).remove();
        }
    });
}

function spawnTexts(crit_amount) {
    var texts = getRandomRange(18, 32); // Random number of texts between 1 and 20
    var phrases = [
        `${crit_amount}！！！！！！！ WOW！！！！！！！！`, 
        "すごい！！", 
        "ワオ！", 
        "なんてことだ！", 
        "キター！", 
        "面白い！", 
        "やばい！", 
        "大変なことになったね！", 
        "きれい！", 
        `${crit_amount}ポイントダメージ！`,
        `${crit_amount}ヒット！`,
        "大勝利！",
        "すごい効果！",
        "それは予想外！",
        `${crit_amount}倍楽しい！！！！！！！`,
        "ものすごいパワー！",
        "かごめ、かごめ。",
        "何が起こったの？！！！",
        "衝撃的な結果！",
        `${crit_amount}点満点！`,
        "うさ、うさ、うさ、うさ！！！",
        "てゐ！てゐ！てゐ！てゐ！てゐ！てゐ！！！！"
    ];
    for (var i = 0; i < texts; i++) {
        setTimeout(function() {
            startStream(phrases);
        }, i * 100); // Rapid succession with delay between each text spawn
    }
}
// Define a function to animate your points and image
function animatePointsAndImage() {
    // Select the points span and the image
    let pointsSpan = $("#points");
    let image = $(".card-title img");

    // Select the progress bar, the image and the text from your new elements
    let progressImage = $(".perfect-meter-contanier");
    let progressText = $(".perfect-meter-text");

    // Save the initial scale (assuming it's 1)
    let initialScale = 1;

    // Calculate the target scale (you may need to adjust this value)
    let targetScale = 24 / parseInt(pointsSpan.css('font-size'));

    pointsSpan.css('display', 'inline-block'); // Make sure the span behaves like a block-level element

    // Stop any ongoing animations, and instantly reset to initial scale
    pointsSpan.add(image).add(progressImage).add(progressText)
        .stop().css('transform', `scale(${initialScale})`);

    // Animate to the target scale
    pointsSpan.add(image).add(progressImage).add(progressText)
        .css('transform', `scale(${initialScale})`).animate({ transformScale: targetScale }, {
        duration: 200, 
        step: function(now, fx) {
            $(this).css('transform', `scale(${now})`);
        },
        complete: function() {
            // Animate back to the initial scale
            $(this).animate({ transformScale: initialScale }, {
                duration: 200, 
                step: function(now, fx) {
                    $(this).css('transform', `scale(${now})`);
                },
                complete: function() {
                    pointsSpan.css('display', ''); // Revert the display property back to its original state
                }
            });
        }
    });
}
function fadeOutMusic(audioElement) {
    let fadeInterval = setInterval(function() {
        // Only fade if not at zero already
        if (audioElement.volume != 0) {
            audioElement.volume -= 0.01;  // decrease volume in smaller steps
            if (audioElement.volume <= 0.01) {
                clearInterval(fadeInterval);
                audioElement.volume = 0; // Ensure volume is set to 0 at the end
            }
        }
    }, 50);  // run interval in shorter time frames
}
function makeItRain() {
    animateShine(document.body, 300);

    let totalDuration = 10000; // 10 seconds total

    // Ensure numImages is between 40 and 60
    let numImages = getRandomRange(40, 60);

    let imageFallInterval = totalDuration / numImages; // Divide total duration by number of images

    let intervalId = setInterval(() => {
        let img = $('<img class="falling-image" src="assets/images/CuisineIconMochi.png" width="64" height="64">');
        let leftPos = Math.random() * ($(window).width() - img.width());
        img.css({ 'left': leftPos + 'px', 'top': '-64px' });  // Image initially outside of the screen
        $(document.body).append(img);
        img.animate({ 'top': $(window).height() + 'px' }, 5000, 'easeOutQuad', function() {
            $(this).remove();
        });

        if (--numImages <= 0) {
            clearInterval(intervalId);
        }
    }, imageFallInterval);
}
function convertText(elementClass, newText, duration) {
    var $element = $('.' + elementClass);
    var originalText = $element.text();
    var timePerLetter = duration / Math.max(originalText.length, newText.length);

    // Create an array of character indices for the new text
    var newCharIndices = Array.from(newText, (_, i) => i);

    // Pad or trim the original text to match the new text length
    var paddedText = originalText.padEnd(newText.length, ' ').substring(0, newText.length);

    function replaceLetter() {
        // Pick a random index from the new text character indices
        var randomIndex = newCharIndices.splice(Math.floor(Math.random() * newCharIndices.length), 1)[0];
        
        // Replace the character in the padded text with the character from the new text at the picked index
        paddedText = paddedText.substring(0, randomIndex) + newText[randomIndex] + paddedText.substring(randomIndex + 1);
        
        // Update the text in the element
        $element.text(paddedText);

        // If there are still characters left to replace, schedule the next replacement
        if (newCharIndices.length > 0) {
            setTimeout(replaceLetter, timePerLetter);
        }
    }

    replaceLetter();
}
function teletype(elementClass, newText, duration) {
    var $element = $('.' + elementClass);
    $element.html('|'); // clear the existing text and start with a cursor

    var timePerLetter = duration / newText.length;
    var i = 0;

    function typeLetter() {
        $element.html(newText.substring(0, i+1) + '|');
        i++;
        if (i < newText.length) {
            setTimeout(typeLetter, timePerLetter);
        } else {
            // If all letters have been typed, remove the cursor after a delay
            setTimeout(function() {
                $element.html(newText.substring(0, i));
            }, timePerLetter);
        }
    }

    typeLetter();
}
function animateDimensions(elementClass, width, height, duration) {
    var $element = $('.' + elementClass);

    // First animate the width
    $element.animate({
        width: width
    }, duration, function() {
        // This function is called when the width animation is complete

        // Then animate the height
        $element.animate({
            height: height
        }, duration);
    });
}