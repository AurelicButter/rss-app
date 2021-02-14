const fs = require("fs");
const Parser = require("rss-parser");
const fetcher = require("node-fetch");
const { setIntervalAsync } = require("set-interval-async/dynamic");
const rssFeedDataDir = "./assets"; // Location to store RSS feed data
const rssFeeds = new Map(); // Structure to store data while running

async function checkFeed(RSSParser, fileName) {
    let myFeed = rssFeeds.get(fileName);
    const feed = await RSSParser.parseURL(myFeed.RSSURL);
    let myItem = feed.items[0];

    if (!myFeed.guid || myFeed.guid !== feed.items[0].guid) {
        console.log(`[${new Date().toISOString()}] RSS UPDATE: ${fileName.slice(0, -5)} received new content.`);
        myFeed["guid"] = feed.items[0].guid;

        let myMessage = { 
            content: myFeed.messageTemplate
                .replace("{{title}}", myItem.title)
                .replace("{{link}}", myItem.link)
                .replace("{{date}}", myItem.pubDate)
                .replace("{{content}}", myItem.content)
                .replace("{{content_small}}", myItem.contentSnippet)
                .replace("{{guid}}", myItem.guid)
                .replace("{{isoDate}}", myItem.isoDate)
                .replace("{{author}}", myItem.creator)
        };
    
        await fetcher(myFeed.webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(myMessage)
        });

        fs.writeFileSync(`${rssFeedDataDir}/${fileName}`, JSON.stringify(myFeed));
        console.log(`[${new Date().toISOString()}] RSS UPDATE: ${fileName.slice(0, -5)} finished posting new content.`);
    }
}

(async function rssApp() {
    console.log(`[${new Date().toISOString()}] APPLICATION UPDATE: Initialize startup...`);
    const RSSParser = new Parser();

    if (!fs.existsSync(rssFeedDataDir)) { // Check if location exists.
        fs.mkdirSync(rssFeedDataDir);
    }
    
    fs.readdirSync(rssFeedDataDir).forEach(file => { // Load RSS data into the program.
        let fileData = require(`${rssFeedDataDir}/${file}`);
        rssFeeds.set(file, fileData);
        checkFeed(RSSParser, file);
        setIntervalAsync(() => checkFeed(RSSParser, file), fileData.refreshCheck * 1000);
        console.log(`[${new Date().toISOString()}] APPLICATION UPDATE: Loaded ${file} into application.`);
    });
    console.log(`[${new Date().toISOString()}] APPLICATION UPDATE: Finished startup...`);
})();