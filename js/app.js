showPassword();
var stories = ['You see, but you do not observe. The distinction is clear.',
    'Nguyễn Khánh Hòa mãi yêu Phạm Thị Thương .',
    'London, that great cesspool into which all the loungers...',
    ' They were the footprints of a gigantic hound!.',
    'Never trust to general impressions, my boy, but concentrate yourself updon details.',
    'I trust that age doth not wither nor custom stale my infinite variety.'
]
showStory(stories);

//Bấm vào icon để hiện thị PassWord
function showPassword() {
    var showPasses = document.querySelectorAll('.form-field img');
    console.log(showPasses);
    Array.from(showPasses).forEach(function(icon) {
        var input = icon.parentElement.querySelector('input');
        var typePassword = true;

        icon.onclick = function() {

            if (typePassword) {
                input.type = 'text';
                typePassword = false;
            } else {
                input.type = 'password';
                typePassword = true;
            }
        }
    })
}

// Animation Hiển thị dòng story tell
function showStory(stories) {
    var textElement = document.getElementById('text');
    var story = stories[Math.floor(Math.random() * stories.length)];
    var newText = '';
    var animationDelay = 6;

    for (let i = 0; i < story.length; i++) {
        newText += '<span class="char">' + (story[i] == ' ' ? '&nbsp;' : story[i]) + '</span>';
    }

    textElement.innerHTML = newText;
    var length = textElement.children.length;

    for (let i = 0; i < length; i++) {
        textElement.children[i].style['animation-delay'] = animationDelay * i + 'ms';
    }


}
//Sau 10s đổi random anothor story
var randomShow = setInterval(function() {
    showStory(stories);
    setTimeout(function() {
        clearInterval(randomShow);
    }, 50000)
}, 10000);