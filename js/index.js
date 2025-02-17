// Importing tweet data from an external file
import { tweetsData } from "./data.js";

// Function to generate a unique UUID using the built-in crypto API
function uuidv4() {
    return crypto.randomUUID();
}

// Function to escape HTML to prevent XSS attacks
function escapeHTML(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Getting the tweet input field from the DOM
const tweetInput = document.getElementById('tweet-input');

// Event listener for handling various click events
// Checks if the clicked element has a dataset attribute and calls the corresponding function
// Handles like, retweet, reply, and tweet button clicks
document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like);
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet);
    }
    else if(e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply);
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick();
    }
});

// Function to handle liking a tweet
// Finds the tweet by its UUID and toggles the like state
function handleLikeClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId;
    })[0];
    if(!targetTweetObj.isLiked){
        targetTweetObj.likes++;
    }
    else {
        targetTweetObj.likes--;
    }
    targetTweetObj.isLiked = !(targetTweetObj.isLiked);
    render(); // Re-renders the feed
}

// Function to handle retweeting a tweet
// Finds the tweet by its UUID and toggles the retweet state
function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId;
    })[0];
    if(!targetTweetObj.isRetweeted){
        targetTweetObj.retweets++;
    }
    else {
        targetTweetObj.retweets--;
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
    render(); // Re-renders the feed
}

// Function to toggle the visibility of replies for a tweet
function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden');
}

// Function to handle tweet submission
// Creates a new tweet object and adds it to the tweetsData array
function handleTweetBtnClick(){
    if(tweetInput.value){
        tweetsData.unshift({
        handle: `@Tweeter`,
        profilePic: `images/scrimbalogo.png`,
        likes: 0,
        retweets: 0,
        tweetText: escapeHTML(tweetInput.value),
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4()
        });
        render();
        tweetInput.value = "";
    }
}

// Function to generate HTML for the tweet feed
function getFeedHtml(){
    let feedHtml = ``;
    tweetsData.forEach(function(tweet){
        let likeClass = tweet.isLiked ? `liked` : ``;
        let retweetClass = tweet.isRetweeted ? `retweeted` : ``;
        let repliesHtml = ``;
        if(tweet.replies.length > 0) {
            tweet.replies.forEach(function(reply){
                repliesHtml +=
                `
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${escapeHTML(reply.tweetText)}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        feedHtml += 
        `
            <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${escapeHTML(tweet.tweetText)}</p>
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
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
            </div>
            </div>
        `;
    });
    return feedHtml;
}

// Function to render the tweets on the page
function render(){
    document.getElementById('feed').innerHTML = getFeedHtml();

}
// Initial render call, tweets page on load
render();
