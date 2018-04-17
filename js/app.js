//List of all the cards
let icons = [
        'bicycle',
        'bicycle',
        'leaf',
        'leaf',
        'cube',
        'cube',
        'anchor',
        'anchor',
        'paper-plane-o',
        'paper-plane-o',
        'bolt',
        'bolt',
        'bomb',
        'bomb',
        'diamond',
        'diamond'
    ],

//Non-Card Variables

    allOpen = [],
    flowingTimer,
    match = 0,
    moves = 0,
    second = 0,
    stars3 = 12,
    stars2 = 16,
    stars1 = 20,
    delay = 400,
    totalCard = icons.length / 2,
    $deck = $('.deck'),
    $scorePanel = $('#score-panel'),
    $moveNum = $('.moves'),
    $ratingStars = $('.fa-star'),
    $restart = $('.restart'),
    $timer = $('.timer');


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// The function initGame() enables the game to begin
function initGame() {
    // The shuffle function shuffles the icons array
    var cards = shuffle(icons);
    $deck.empty();
    // Set start game with no matching cards and zero moves
    match = 0;
    moves = 0;
    $moveNum.text('0');
    $ratingStars.removeClass('fa-star-o').addClass('fa-star');
    for (var i = 0; i < cards.length; i++) {
        $deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
    }
    addCardListener();

    // Enables the timer to reset to 0 when the game is restarted
    resetTimer(flowingTimer);
    second = 0;
    $timer.text(`${second}`)
    initTime();
};

// Set Rating and final Score from 1 to 3 stars depending on number of moves
function setRating(moves) {
    var rating = 3;
    if (moves > stars3 && moves < stars2) {
        $ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
        rating = 2;
    } else if (moves > stars2) {
        $ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
        rating = 1;
    }
    return {
        score: rating
    };
};

// End Game, stop the timer and alert window showing time, moves, score.
function endGame(moves, score) {
    stopTimer(flowingTimer);
    swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        title: 'Congratulations! You Won!',
        text: 'With ' + moves + ' Moves and ' + score + ' Stars in ' + second + ' Seconds.\n Hooray!',
        type: 'success',
        confirmButtonColor: '#02ccba',
        confirmButtonText: 'Play again!'
    }).then(function(isConfirm) {
        if (isConfirm) {
            initGame();
        }
    })
}

// Restart the game
$restart.on('click', function() {
    swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        title: 'Are you sure?',
        text: "Your progress will be lost!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#B2E647',
        cancelButtonColor: '#FF427B',
        confirmButtonText: 'Yes, Restart Game!'
    }).then(function(isConfirm) {
        if (isConfirm) {
          match = 0,
          moves = 0,
          initGame();
        }
    });
});

// This function compares two cards and if they match they stay open
// If cards don't match, they are flipped back over.
let addCardListener = function() {

    // Card clicked on is flipped
    $deck.find('.card').bind('click', function() {
        var $this = $(this)

        if ($this.hasClass('show') || $this.hasClass('match')) {
            return true;
        }

        var card = $this.context.innerHTML;
        $this.addClass('open show');
        allOpen.push(card);

        // Compare cards to verify it they matched
        if (allOpen.length > 1) {
            if (card === allOpen[0]) {
                $deck.find('.open').addClass('match animated infinite rubberBand');
                setTimeout(function() {
                    $deck.find('.match').removeClass('open show animated infinite rubberBand');
                }, delay);
                match++;
                //If cards have no match, they will turn back cover up.
            } else {
                $deck.find('.open').addClass('notmatch animated infinite wobble');
                setTimeout(function() {
                    $deck.find('.open').removeClass('animated infinite wobble');
                }, delay / 1.5);
                setTimeout(function() {
                    $deck.find('.open').removeClass('open show notmatch animated infinite wobble');
                }, delay);
            }
            //All added cards facing up
            allOpen = [];
            // Increments the number of moves by one only when two cards are clicked
            moves++;
            // The number of moves is added to the setRating() function
            setRating(moves);
            // The number of moves are added to the alert
            $moveNum.html(moves);
        }

        // End the game when all cards match
        if (totalCard === match) {
            setRating(moves);
            var score = setRating(moves).score;
            setTimeout(function() {
                endGame(moves, score);
            }, 500);
        }
    });
};

// Initiates the timer when the game is loaded
function initTime() {
    flowingTimer = setInterval(function() {
        $timer.text(`${second}`);
        second = second + 1;
    }, 1000);
}

// Stop the timer when the game ends
function stopTimer(timer) {
    if (timer) {
        var time = $timer.text();
        clearInterval(timer);
        $timer.text(time);
    }
}

// Resets the timer when the game is restarted
function resetTimer(timer) {
    if (timer) {
        clearInterval(timer);
    }
}

initGame();
