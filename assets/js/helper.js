var clickTimes = [];
var timerTimes = [];
var points = 0;
var pointsPerSecond = 0;
var pointsPerClick = 1;

class Upgrade {
    constructor(id, cost, hotkey, description, incrementFunction, costMultiplier = 1.8) {
        this.id = id;
        this.cost = cost;
        this.hotkey = hotkey;
        this.upgradeElementId = `#${id}Button`;
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
                <h5 class="card-title font-bunny" style="font-size: 32px;">[${this.hotkey}] ${this.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} <span style="font-size: 24px;">x<span id="${this.id}Level">${this.level}</span></span></h5>
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
function floatText(element, text) {
    // Create a new span element
    let span = $("<span>").text(text);

    // Get a random variation for the starting position
    let randomLeft = getRandomRange(-75, 75);
    let randomTop = getRandomRange(-25, 25);

    span.css({
        position: "absolute",
        left: element.offset().left + randomLeft + 50,
        top: element.offset().top + randomTop,
        fontSize: 16,
        color: "#7f6b63",
        fontWeight: "bold",
        userSelect: 'none',
        pointerEvents: 'none'
    });

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