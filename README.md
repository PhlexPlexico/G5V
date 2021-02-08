# Get5Vue - Front-end website for G5API
_**Status: Under active development.**_

Get5Vue (G5V) is going to be a replacement for the get5-webpanel. _Currently_ this is an implementation for the extent of [G5API](https://github.com/phlexplexico/G5API) and is going to focus on basic features of presenting data.


## Features
- Add teams
- Add seasons/tournaments to track specific stats.
- Add servers to play on.
- Create matches that load on selected servers.
- Control matches with RCON Commands through the match panel.
- Dark mode
- Translations
- Leaderboards
- Individual User Stats

## Issues?
Please report any *match* issues to the [API](https://github.com/phlexplexico/G5API). Display issues, or loading data, please report them here. If it's something to do with the API, the issue will be transferred.

## Why?
[Get5-webpanel](https://github.com/phlexplexico/get5-webpanel) is a now out-dated webpanel, with python2.7 being officially EOL. Being built all on Flask, with ORM (SQLAlchemy), and Jinja2, its tech spans more than a few years old. While it works really well for now, it is becoming increasingly harder to deploy to more modern hardware/software (such as Ubuntu 19) to ensure easy setup.

The intent will to be provide similar functionality with the use of [G5API](https://github.com/phlexplexico/G5API) and Vue (with vuetify!), so it is a more responsive, mobile-friendly website, as opposed to the old one. 

## Building
In order to build this application, I've opted to use [Yarn](https://yarnpkg.com/lang/en/).

You will also need a working instance of G5API. The setup can be found at that repos [configuration](https://github.com/PhlexPlexico/G5API/wiki/Configuration).

### Build and run development server: 
```yarn serve``` 

Spins up a development server where you can make all your calls, and run it like the current website that is in the sidebar!

### Production: 
```yarn build```

This will generate a minified and buildable version of the website in the `dist` folder to use on a web server. In order to use history, you must have a proxy enabled, and reverse proxy enabled for the API calls. There is some setup involved, depending on your flavour of web servers, but some setup configs can be found [here](https://github.com/PhlexPlexico/G5V/wiki).

## Contribution
Sure! If you have a knack for APIs and a penchant for JavaScript, I could always use help! Create a fork of this application, make your changes, and submit a PR. I will be using the [Issues](https://github.com/G5V/issues) page to track what calls still need to be completed.

### Special Thanks
- [Shugo "FlowingSPDG" Kawamura](https://github.com/FlowingSPDG) for letting me pester him with questions and get5-web-go, and the initial translations!
- [Sean Lewis](https://github.com/splewis) for the creation of get5.
- Smimabo for helping me test endlessly for the match API to ensure stats record as they should.
- ebuttonsdude for letting me host an instance for testing on his server.

### Screenshots  
![](./screenshots/MainPage.png)  
![](./screenshots/MainPageLoggedIn.png)  
![](./screenshots/SideMenuLoggedOut.png)  
![](./screenshots/SideMenuLoggedIn.png)  
![](./screenshots/TeamPage.png)
![](./screenshots/TeamSpecificPage.png)
![](./screenshots/MatchInfo.png)
![](./screenshots/ProfilePage.png)
![](./screenshots/ServersPage.png)

# Used By
Here are a few organizations that have used this webpanel for tournaments/pugs/seasons:

 - [Irish Challenger League](https://www.iclhub.ie/)
 - [PixlWalk](https://discord.gg/R7VRhtzhj8)

Want your org to be here? Shoot me a DM on Twitter or email and I can add it to the list!

# License
This project is licensed under [MIT License](http://opensource.org/licenses/MIT). A copy of this license **must be included with the software**.
