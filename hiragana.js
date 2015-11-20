Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if(obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var Page = function(name) {
    this.name = name;
};

Page.prototype.displayMessage = function(message, type) {
    if (!type) type = 'info';
    $('#' + this.name).append('<div class="msgbox-' + type + '">' +
        message + '</div>');
    $('.msgbox-' + type).fadeIn('slow').delay(500).
    fadeOut('slow', function() { $('.msgbox-' + type).remove(); });
};

var hiragana = [
    // Level 0
    { a: 'あ', e: 'え', i: 'い', o: 'お', u: 'う', n: 'ん' },
    // Level I
    { ka: 'か', sa: 'さ', ta: 'た', na: 'な', ha: 'は', ma: 'ま', ya: 'や',
    ra: 'ら', wa: 'わ'},
    // Level II
    { ki: 'き', shi: 'し', chi: 'ち', ni: 'に', hi: 'ひ', mi: 'み',
    ri: 'り' },
    // Level III
    { ku: 'く', su: 'す', tsu: 'つ', nu: 'ぬ', fu: 'ふ', mu: 'む', yu: 'ゆ',
    ru: 'る' },
    // Level IV
    { ke: 'け', se: 'せ', te: 'て', ne: 'ね', he: 'へ', me: 'め', re: 'れ' },
    // Level V
    { ko: 'こ', so: 'そ', to: 'と', no: 'の', ho: 'ほ', mo: 'も', yo: 'よ',
    ro: 'ろ', wo: 'を' },
    // Level VI
    { pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ' },
    // Level VII
    { ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ' },
    // Level VIII
    { da: 'だ', ji: 'ぢ', dzu: 'づ', de: 'で', do: 'ど' },
    // Level IX
    { za: 'ざ', ji: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ' },
    // Level X
    { ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご' }
];

var messages = {
    no_ans: 'Type in something first...',
    bad_ans: 'Wrong answer, try again.'
};

var lvl = 0;
var good_answers = 0;
var bad_answers = 0;
var good_ans_in_row = 0;
var storage_supported = false;
if (typeof(Storage) !== 'undefined') storage_supported = true;

$(document).ready(function() {
    var romaji = new Page('romaji');

    $('#main-menu').fadeIn('slow');
    $('#romaji-btn').click(function() {
        $('#main-menu').fadeOut('slow', function() {
            var rand_key_num = Math.floor(Math.random() *
                Object.size(hiragana[lvl]));
            var rand_key = Object.keys(hiragana[lvl])[rand_key_num];

            $('#romaji').fadeIn('slow');
            $('#qanswer').val('').prop('disabled', false).focus();
            $('#qchar').text(hiragana[lvl][rand_key]);
        });
    });

    $('#options-btn').click(function() {
        $('#main-menu').fadeOut('slow', function() {
            $('#options').fadeIn('slow');
        });
    });

    if (storage_supported) {
        if (localStorage.version !== '0.0.1α') {
            // upgrade code if necessary
            localStorage.version = '0.0.1α';
        }

        $('input[type=checkbox]').first().prop('disabled', false);
        $('#options span').last().text(localStorage.version);
    } else {
        $('input[type=checkbox]').first().prop('disabled', true);
    }

    $('#options input').last().click(function() {
        $('#options').fadeOut('slow', function() {
            $('#main-menu').fadeIn('slow');
        });
    });

    $(document).on('keypress', '#qanswer', function(e) {
        if (e.keyCode == 13) {
            if ($('#qanswer').val() === '') {
                romaji.displayMessage(messages.no_ans, 'warning');
                return false;
            }

            if (!($('#qanswer').val() in hiragana[lvl])) {
                romaji.displayMessage(messages.bad_ans, 'error');
                $('#qanswer').addClass('qbanswer').removeClass('qanswer');

                bad_answers += 1;
                good_ans_in_row = 0;
                $('#qscore').text(good_answers + ' | ' + bad_answers);

                return false;
            }

            if (hiragana[lvl][$('#qanswer').val()] === $('#qchar').text()) {
                good_answers += 1;
                good_ans_in_row += 1;

                if (good_ans_in_row >= 10) {
                    lvl += 1;
                    good_ans_in_row = 0;

                    romaji.displayMessage('Level up! You are now at level ' +
                    lvl.toString() + '.', 'success');

                } else {
                    romaji.displayMessage('Good job, keep going!', 'success');
                }

                $('#qanswer').prop('disabled', true).addClass('qganswer')
                .removeClass('qanswer').removeClass('qbanswer')
                .fadeOut(1800, function(){
                    $('#qcontinue').show().focus();
                    $('#qanswer').hide().removeClass('qganswer')
                    .addClass('qanswer');
                });

                $('#qscore').text(good_answers + ' | ' + bad_answers);

            } else {
                romaji.displayMessage(messages.bad_ans, 'error');
                $('#qanswer').addClass('qbanswer').removeClass('qanswer');

                bad_answers += 1;
                good_ans_in_row = 0;
                $('#qscore').text(good_answers + ' | ' + bad_answers);

                return false;
            }
        }
    });

    $('#qcontinue').click(function() {
        var rand_key_num = Math.floor(Math.random() *
            Object.size(hiragana[lvl]));
        var rand_key = Object.keys(hiragana[lvl])[rand_key_num];

        while (rand_key == $('#qanswer').val()) {
            rand_key_num = Math.floor(Math.random() *
                Object.size(hiragana[lvl]));
            rand_key = Object.keys(hiragana[lvl])[rand_key_num];
        }

        $('#qchar').text(hiragana[lvl][rand_key]);
        $('#qcontinue').hide();
        $('#qanswer').prop('disabled', false).val('').show().focus();
    });
});
