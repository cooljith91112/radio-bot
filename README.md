<h1 align="center">RADIO BOT</h1>
<p align="center">
  <img src="assets/logo.png" alt="lul-bot-logo" width="120px" height="120px"/>
  <br>
  <i>A Discord Radio bot written for your server</i>
  <br>
</p>
<hr>

## Documentation
- ```main.js``` is the entry file
- ```commands.config.json``` is the main config file which holds the ```command``` & ```command file path```  .
- ```src/commands``` folder contains all the commands that is configured in ```commands.config.json```. A mandatory method ```execute``` should be implemented, that will be the default execution method while triggerring a command

### Prerequisites
- Install Node.js 12.x or higher
- Install ```nodemon``` (this is for development only)

### Setup
Before running this project you must create a ```.env``` file which should contains the following keys (This can be changed in the source code)
<br>
```
RADIO_BOT_TKN=Your_Discord_Bot_token
RADIO_CHANNEL= A Voice Channel ID // this voice channel is used for playing music
NOW_PLAYING_CHANNEL=A Text Channel ID // this channel is used for displaying now playing notifications
ADMIN_ID = Admin User ID // This is the ID of the admin user who has permission to stop and start Radio
```

### Commands
```
!radioStart // Command to start the Radio
!radioStop // Command to stop the radio
```
### Credits
[CodeLyon][codelyon] - For discord.js getting started videos

### Support Me
Support ♥ me via [Ko-Fi][ko-fi]

[ko-fi]: https://ko-fi.com/indrajith
[codelyon]: https://www.youtube.com/c/CodeLyon/
