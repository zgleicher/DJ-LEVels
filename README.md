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

### Project URL

https://dj-levels.herokuapp.com (works on Chrome and Firefox)

### Project Outline:

**Outline:**

A group of friends will have the ability to setup a playlist where everyone can contribute and additionally upvote or downvote songs posted by other members of the group. Similar to the interface of Reddit, the most popular posts will be featured at the top. If time permits, the interface could include additional features to allow users to follow the playlists created by other groups. Following another group will not give you the ability to post, upvote, or downvote songs, but it will give you the ability to listen to the playlist. 

**Milestones:**

1) User functionality

	[x] Landing / sign in page

	[x] Users can login with SoundCloud

	[x] Home page basic outline

	[x] REST API functioning

2) Group functionality

	[x] User can create a group
	
	[x] User can be added to a group

	[x] Only contributers can add songs to group


3) Song functionality

	[x] User can add a song to a group (drag and drop?)
	
	[x] User can upvote or downvote a song
	
	[x] Songs play continuously 
	
	[x] Song UI

4) Extras

	[x] Songs show up in real time (socketio)

	[x] User can follow a group
	
	[x] User can find a group (or be invited) 

	[x] Google Drive style responsive drag and drop

	[x] User can like a track on DJ-LEVels that will like a track for them on SC
	
5) Summer Todos

	[ ] Song scrubbing
	
	[ ] Improve UI
	
	[ ] Disable like button for already liked songs
	
	[ ] Works on mobile/small screen
	
	[ ] List most popular playlists listed when searching
	
	[ ] Add a Group Photo
	
	[ ] Clean up code (make directives)
	
	[ ] Fix socket so that it doesnt kick you out of your current group. 
	
	[ ] Error handling for creating a duplicate group name (500 error on server)
	
	[ ] Error handling for only contributors deleting songs
	
	[ ] Add business logic for not being a contributor and a follower at the same time
	
	[ ] Handle errors in console with mixed media types
	
