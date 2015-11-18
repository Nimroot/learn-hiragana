Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if(obj.hasOwnProperty(key)) size++;
    }
    return size;
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

var lvl = 0;
var good_answers = 0;
var bad_answers = 0;
var good_ans_in_row = 0;

$(document).ready(function() {
    $("#main-menu li").first().click(function() {
        $("#main-menu").fadeOut(500).delay(500, function() {
            var rand_key_num = Math.floor(Math.random() *
                Object.size(hiragana[lvl]));
            var rand_key = Object.keys(hiragana[lvl])[rand_key_num];

            $("#hiragana-to-romaji").fadeIn(500);
            $('#qchar').text(hiragana[lvl][rand_key]);
            $('#qanswer').focus();
        });
    });

    $(document).on('keypress', '#qanswer', function(e) {
        if(e.keyCode == 13) {
            if($('#qanswer').val() === '') {
                $('#qfeedback').text('Type in something first.');
                $('#qfeedback').fadeIn(400).delay(200).fadeOut(400);

                return false;
            }

            if (!($('#qanswer').val() in hiragana[lvl])) {
                $('#qfeedback').text('Wrong answer. Try again...').fadeIn(500)
                .delay(500).fadeOut(500);
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

                    $('#qfeedback').text('Level up!').fadeIn(500).delay(500)
                    .fadeOut(500);

                } else {
                    $('#qfeedback').text('Correct answer, keep going!')
                    .fadeIn(400).delay(200).fadeOut(400);
                }

                $('#qanswer').prop('disabled', true).addClass('qganswer')
                .removeClass('qanswer').removeClass('qbanswer')
                .fadeOut(1000, function(){
                    $('#qcontinue').show().focus();
                    $('#qanswer').hide().removeClass('qganswer')
                    .addClass('qanswer');
                });

                $('#qscore').text(good_answers + ' | ' + bad_answers);

            } else {
                $('#qfeedback').text('Wrong answer. Try again...').fadeIn(400)
                .delay(300).fadeOut(400);
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
