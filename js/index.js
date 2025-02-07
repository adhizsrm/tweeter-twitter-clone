import { tweetsData } from "./data.js";
const tweetInput = document.getElementById('tweet-input');
const tweetBtn = document.getElementById('tweet-btn');
let likeClass = '';
let retweetClass = '';
tweetBtn.addEventListener('click',function(){
    console.log(tweetInput.value);
})

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like);
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet);
    }
})

function handleLikeClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId;
    })[0];
    if(!targetTweetObj.isLiked){
        targetTweetObj.likes++;
        likeClass = 'liked';
    }
    else {
        targetTweetObj.likes--;
    }
    targetTweetObj.isLiked = !(targetTweetObj.isLiked);
    render();
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId;
    })[0];
    if(!targetTweetObj.isRetweeted){
        targetTweetObj.retweets++;
        retweetClass = 'retweeted';
    }
    else {
        targetTweetObj.retweets--;
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
    render();
}

function getFeedHtml(){
    let feedHtml = ``;
    tweetsData.forEach(function(tweet){
        let likeClass = ``;
        let retweetClass = ``;
        if(tweet.isLiked){
            likeClass = `liked`
        }
        if(tweet.isRetweeted){
            retweetClass = `retweeted`;
        }
        feedHtml += 
        `
            <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeClass}" data-like="${tweet.uuid}"></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetClass}" data-retweet="${tweet.uuid}"></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
            </div>
        `;
    });
    return feedHtml;
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()

}
render();