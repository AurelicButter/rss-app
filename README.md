# rss-app
<a href="https://discord.gg/qKfqsjW"><img src="https://discordapp.com/api/guilds/303253034551476225/widget.png" alt="Support Server" /></a>

A small application to watch RSS feeds with.

## Setup
The app just needs a server running Node v12 or higher. All of your RSS feed configurations should be located in the assets folder and saved as JSON files.

### Sample RSS feed configuration
```
{
    "RSSURL": "", // The RSS feed to ping
    "webhookURL": "", // Webhook URL to send message to
    "refreshCheck": 0, // Time in seconds to refresh
    "messageTemplate": "" // Message template to parse information
}
```

## License and Contact
rss-app is licensed under the [MIT license](LICENSE). 

For issues and bugs, please use the issue tracker on the [GitHub repository](https://github.com/Butterstroke/rss-app/issues). For other needs, either contact me by email [katsurinstudios@protonmail.ch](mailto:katsurinstudios@protonmail.ch) or send me a message in the #misc-repositories channel on my [Discord server](https://discord.gg/qKfqsjW).