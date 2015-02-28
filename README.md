### TEAM NAME: DJ_LEVels

### TEAM MEMBERS:

| UNI | Github username  | Full Name | School | Year |
|-----|------------------|-----------|--------|------|
|  kbh2120   |       kbh2120      |     Kristen Howard      |    SEAS    |   2015   |
|  jgv2108   |       jessvalarezo           |    Jessica Valarezo       |    SEAS    |   2016   |
|  sj2564   |        sam-jay          |    Samurdha Jayasinghe    |   CC   |     2016      |
|  zjg2102   |       zgleicher           |      Zachary Gleicher     |    CC    |   2016   |

### PROJECT DESCRIPTION:

Web app for building collaborative SoundCloud playlists with groups of friends.


### Project Outline:

**Outline:**

A group of friends will have the ability to setup a playlist where everyone can contribute and additionally upvote or downvote songs posted by other members of the group. Similar to the interface of Reddit, the most popular posts will be featured at the top. If time permits, the interface could include additional features to allow users to follow the playlists created by other groups. Following another group will not give you the ability to post, upvote, or downvote songs, but it will give you the ability to listen to the playlist. 

**Milestones:**

1) User functionality
- Landing / sign in page
- Users can login with SoundCloud
- Home page basic outline
- REST API functioning

2) Group functionality
- User can create a group
- User can join a group (when provided a link)
- Group can be open or closed
- 

3) Song functionality
- User can add a song to a group (drag and drop?)
- User can upvote or downvote a song
- Songs play continuously 


4) Extras
- Songs show up in real time (socketio)
- User can follow a group
- User can find a group (or be invited) - group search
- Google Drive style responsive drag and drop

**Design:**

Looking into drag and drop interfaces.
Angular Material Design

ui-view / ui-router

**Data Model:**

//groups have tracks, followers, and contributers 

Group
- Followers: [ User ]
- Contributers: [ User ], will automatically be followers
- Tracks [ {
	Track: {type: ObjectID, ref:'Track'},
	Upvotes: [ User ],
	Downvotes: [ User ]
} ]

//1-1 correspondence with SoundCloud users, using SoundCloud API authentication

User
- Username

//all from SoundCloud, will be a URL or track ID

Track




# LEVELS
