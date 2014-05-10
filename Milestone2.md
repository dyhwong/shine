#Milestone Two#
<br></br>
## Question One: Changes from Milestone One?##
###User Research #2, MVP #1 and 2:###
We decided to leave out the map and global rankings. We thought that having global rankings would encourage people to hack to get the best score, but we wanted the goal to be for the user to improve themself. Along the same lines, the map seemed a little superfluous if you couldn't see the other users' scores; it might just make people curious! Instead, we're hoping a more comprehensive personal dashboard for users that tracks their personal high scores and time logged in game. 
<br></br>
## Question Two: Which features are implemented? ##
We have a login system in the homepage; the skeleton format and a demo are working. However, we need to edit the content and css it up. 
<br></br>
We also have a game page with a functional game, but we need to implement song selection. Right now, users can only play the same song over and over again. 
<br/><br>
We have account validation, and users can access their account tab, but the other account details such as time logged aren't implemented yet. 
<br></br>
##Question Three: Which parts did you plan to implement but haven't? ##
Our data retrieval isn't as sophisticated as we thought it would be, but we can retrieve account information and high scores still.
<br></br>
##Question Four: What do you still need to implement?##
We have some more data retrieval for the accounts page such as time logged. Since playing the game tracks time lapsed, we have the raw data and just need to post and get it. 
<br></br>
We also need to implement the music selection portion of the game. We have many mp3 files in the library. All we have to do is make a drop down menu that shows the user options and changes some variables in the javascript file. We also want to make a customize option where no audio plays at all, and the user manually fills out the variables song_length and bpm in an online form. This is just using user input as javascript variable vlues. 
<br> </br>
Also, our homepage is supposed to double as an about/introduction page, so we need to edit the content. 
<br></br>
##Question Five: Back-End Technologies?
MongoDb, Mongoose, Node, Express
<br></br>
##Question Six: Front-End Technologies?
Handlebars, jQuery
<br></br>
##Question Seven: Targeted Browser?
Chrome (and only Chrome -- Firefox will prompt for webcam and stop there)
<br></br>
##Question Eight: Unknown Risks?
Security -- we're hoping by only letting users compare their progress with themselves, they won't be motivated to hack, but who knows. 
<br></br>
Validation -- people can cheat in the game by standing really close to the light, so somehow implementing a check to make sure they're not cheating will be a challenge. (Or maybe deciding to leave that option open, since they're not being compared to global scores anyways.)
<br></br>
##Optional Question One
we would like to move to the main division :O