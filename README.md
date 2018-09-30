# codechef-virtual-contest

Frontend for the Codechef Virtual Contest creator.

**This app was developed to participate in the [CodeChef API Hackathon powered by Alibaba Cloud](https://www.codechef.com/CAH1801)**

## Form to submission
- **Application name**: *Codechef Virtual Contest Creator*
- **Application description**: *This app allows you to take part of past contests in virtual mode. You can start the contest in any time and the standings will be automatically merged according to your starting time*
- **Tag line**: Don't miss up any Codechef contest, take part of past contests in virtual mode and improve your programming skills.

#### Presentation about your application which should include
  - **Introduction of your app**
  
  *This app is designed to simulate Codechef contests in virtual mode, is an hybrid between a2oj where you can create virtual contests and codeforces Gym when you can start the contest at any time, but specially for Codechef. Here the basic usage:*
  
  *You can log in using your account of Codechef (OAuth2), once logged, you can show virtual contests created by any user, also you are available to create your own contests. You can register in any contest. In registration process you can setup the time in minutes before contest starts. After registration, you can go to the contest page and wait until contest start, after contest starts you are avaible to submit your solutions (only submissions made in time of contest are shown in standings).*
  
- **Instructions on how to run the app**

This is a web application, so the only thing you need to do is go to [http://149.129.139.145/](http://149.129.139.145/) and enjoy. 

- **Function descriptions**
  - Login with Codechef: *Using your codechef account you can authorize this app to use the API (with PUBLIC permission is enough)*
  - Create virtual contest: *You can search a past contest and select it to create a new virtual contest*
  - Registration: *You can take part of a virtual contest already created by any user*
  - Show standings: *Once contest is running you can show the standings with people registered in that contest. The submissions' time will be based on your registration time.*
 
- **App architecture (images showing the architecture would be preferred)**

This application uses 4 components:

- Frontend
- Backend
- Codechef API
- MongoDB instance

- **Screenshots of the app** (@jhonber)
- **What Alibaba Cloud services have you used to develop and host the app? What are these services used for?**

*Elastic Compute Service ECS*

- **What do you think was the biggest advantage of developing and hosting your app with cloud computing services?**

Is really easy to use/setup and you can always be sure that your services are up and running.

- **Conclude your learning from the contest.**
  My teammate and I really enjoyed taking part of this marathon (Thanks codechef for making this kind of contests possible!! :P).
  We learned a lot of topics including:
    - How to manage cloud services using Alibaba
    - How to use Codechef API
    - How to interact with OAuth authentication
    - How to make data persistent using MongoDB
    - How to create a reactjs app
    
- **What difficulties did you face while making the app?**
  - At the beggining it was difficult to get the OAuth working since there were problems with some public nodejs-modules, but
    after that we ended writing our own middlewere for the authentication with codechef. We will release it as an npm module once the contest ends.
    
- **Public URL of application (hosted on alibaba cloud)**: [http://149.129.139.145/](http://149.129.139.145/)
- **Code Repository link**

  - [backend](https://github.com/pin3da/virtual-chef/)
  - [front](https://github.com/jhonber/codechef-virtual-contest/)
  
------
  
## Deploy

Detailed description was added to [/deploy](./deploy/)

--------

[Jhon Jimenez](https://github.com/jhonber/) & [Manuel Pineda](https://github.com/pin3da/)
