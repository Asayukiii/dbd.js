/**
 * A List of Available Functions
 *
 * Functions that are displayed are available to be used for Compiler
 */
export enum FunctionList {
    $addButton = "Adds a Button Interaction to Message Id;$addButton[newRow (yes/no); interactionId or URL; label; style (primary); disabled (yes/no); messageId (optional); channelId (optional)]",
    $addCmdReactions = "Add Reactions to Author Message;$addCmdReactions[...emoji]",
    $addField = "Adds a Field to an Embed;$addField[title; field value; inline (yes/no); embedIndex]",
    $addReactions = "Add Reactions to Message Id;$addReactions[messageId; channelId; ...emoji]",
    $addSelectMenuOption = "Adds an Option for Select Menu;$addSelectMenuOption[interactionId; label; return value; description; default (yes/no); emoji; messageId (optional); channelId (optional)]",
    $addTimestamp = "Adds a Timestamp to an Embed;$addTimestamp of $addTimestamp[ms; embedIndex]",
    $allMembersCount = "Returns the number of Members from Guilds",
    $author = "Sets an Author to an Embed; $author[text; imageURL (optional); embedIndex]",
    $authorAvatar = "Returns the Avatar of Author",
    $authorIcon = "Sets an Author Icon of an Embed;$authorIcon[imageURL]",
    $authorID = "Returns the User ID of Author",
    $ban = "Bans Guild Member of UserID;$ban[userId; reason]",
    $botPing = "Returns the ping of Latency based from Message and Interaction",
    $channelID = "Returns the Channel ID of Channel",
    $channelTopic = "Returns the Topic of Channel Id;$channelTopic or $channelTopic[channelId]",
    $channelType = "Returns the Channel Type of Channel ID;$channelType or $channelType[channelId]",
    $checkCondition = "Returns a boolean if conditions are met;$checkCondition[value1==/!=/>/</>=/<=value2]",
    $color = "Sets the color of an Embed;$color[Color/Hex; embedIndex]",
    $description = "Sets the description of an Embed;$description[text]",
    $discriminator = "Returns the discriminator (#1234) of User Id;$discriminator or $discriminator[userId]",
    $divide = "Returns the division of supplied numbers;$divide[...numbers]",
    $embeddedURL = "Sets the Author URL of an Embed;$embeddedURL[url; embedIndex]",
    $ephemeral = "Identifies wether Interaction reply type is ephemeral",
    $footer = "Sets the footer of an Embed;$footer[text; iconURL (optional); embedIndex]",
    $footerIcon = "Sets the footer icon of an Embed;$footerIcon[iconURL; embedIndex]",
    $getInteractionValues = "Returns the values from Selected Options for Select Menu",
    $guildAvailable = "Whether the guild is available to access. If it is not available, it indicates a server outage",
    $guildID = "Returns the Guild Id of Guild",
    $httpAddHeader = "Sets / Adds a Header key to HeaderConfig;$httpAddHeader[headerName;value]",
    $httpDelete = "Request a DELETE method to URL;$httpDelete[url]",
    $httpGet = "Request a GET method to URL;$httpGet[url]",
    $httpPatch = "Request a PATCH method to URL;$httpPatch[url; data]",
    $httpPost = "Request a POST method to URL;$httpPost[url; data]",
    $httpRemoveHeader = "Removes a Header key from HeaderConfig;$httpRemoveHeader[headerName]",
    $httpResult = "Returns a result from HTTP methods;$httpResult or $httpResult[...keys]",
    $image = "Sets the Image of an Embed;$image[imageURL]",
    $interactionID = "Returns the Id of created interaction",
    $isInteractionType = "Returns the Type of Interaction",
    $isNaN = "Returns a Boolean value that indicates whether a value is the reserved value NaN (not a number);$isNaN[number]",
    $isNSFW = "Returns a Boolean value that indicates whether is channel a NSFW;$isNSFW or $isNSFW[channelId]",
    $isNumber = "Returns a Boolean value that indicates whether a value is a number;$isNumber[number]",
    $isText = "Returns a Boolean value that indicates whether is channel a Text;$isText or $isText[channelId]",
    $kick = "Kicks Guild Member of UserID;$kick[userId; reason]",
    $membersCount = "Returns the amount of Members in Guild;$membersCount or $membersCount[guildId; presenceStatus; countBots]",
    $mentioned = "Returns the mentioned User Id of mention number;$mentioned[number]",
    $mentionedRoles = "Returns the mentioned Role Id of mention number;$mentionedRoles[number]",
    $mentionedChannels = "Returns the mentioned Channel Id of mention number;$mentionedChannels[number]",
    $message = "The message which calls the Command / is a part of Event;$message, $message[arg number] or $message[</>argNumber(-argNumber)</>]",
    $multi = "Returns the multiplications of supplied numbers;$multi[...numbers]",
    $newSelectMenu = "Creates a Select Menu for Components;$newSelectMenu[interactionId; minimum select of values (0-25); maximum select of values (1-25); placeholder; disabled (yes/no); messageId (optional); channelId (optional)]",
    $nickname = "Returns the Nickname of Member Id, can also set their Nickname if field 2 is non-empty;$nickname[memberId; newNickname (optional)]",
    $nomention = "Restricts any kind of mention in Response",
    $onlyIf = "Breaks Loop execution if supplied conditions are not met;$onlyIf[value1==/!=/>/</>=/<=value2;error message]",
    $ping = "Returns a numeric of Client Websocket Ping",
    $replaceText = "Replaces sample in a text;$replaceText[text; sample; new; howMany (-1)]",
    $repliedUser = "Returns the Replied User Id in Message",
    $round = "Returns a supplied numeric expression rounded to the nearest integer;$round[number]",
    $serverBanner = "Returns the Banner URL of Guild Id;$serverBanner or $serverBanner[guildId]",
    $serverIcon = "Returns the Icon URL of Guild Id;$serverIcon or $serverIcon[guildId]",
    $serverName = "Returns the Name of Guild Id;$serverName or $serverName[guildId]",
    $splitText = "Retrieves a substring from supplied index;$splitText[number]",
    $sub = "Returns the subtractions of supplied numbers;$sub[...numbers]",
    $sum = "Returns the sumarized of supplied numbers;$sum[...numbers]",
    $textSplit = "Split a text into substrings using the specified separator;$textSplit[text; separator]",
    $thumbnail = "Sets the Thumbnail of an Embed;$thumbnail[imageURL; embedIndex]",
    $title = "Sets the Title of an Embed;$title[text; embedIndex]",
    $truncate = "Returns the integral part of the a numeric expression, x, removing any fractional digits;$truncate[number]",
    $userAvatar = "Returns the User Avatar of User Id;$userAvatar or $userAvatar[userId]",
    $username = "Returns the Username of User Id;$username or $username[userId]",
    $userTag = "Returns the Tag of User Id;$userTag or $userTag[userId]"
}