/* Inner Work — the guided dialogue for each session (part 2: self-worth to staying well),
   and for the Deeper tools. See content-flows-a.js for how a step is written. */
(function () {
  const { ask, short, rate, any, one, say, is, has, wrote } = IW.fb;
  const F = IW.flows;

  /* ================= Shame and self-worth ================= */

  F.w1 = [
    short("bottom", "Your bottom line about yourself, in one sentence", { p: "The thing you believe on your worst days. 'I'm not good enough.' 'I'm unlovable.' 'I'm a burden.' 'I'm too much.'", need: true, s: "Your bottom line" }),
    rate("believe", "How true does it feel right now?", "not at all", "completely", { echo: "bottom" }),
    ask("learned", "Where and when did you learn it?", { echo: "bottom", p: "A person, a household, a school, a relationship. A sentence that was said, or a look, or an absence.", s: "Where you learned it" }),
    ask("child", "How old were you? What would any child of that age have concluded in that situation?", { echo: "learned" }),
    ask("rules", "To live with that belief, you made rules. What are yours? 'If I ___, then ___.' 'I must always ___.' 'I must never ___.'", { p: "'If I keep everyone happy, I'm acceptable.' 'I must never need anything.' 'If I'm perfect, nobody will see.'", s: "Your rules" }),
    ask("cost", "What do the rules cost you?", { echo: "rules" }),
    ask("break", "What do you fear would happen if you broke one?", { echo: "rules" }),
    one("carry", "Is there something specific you carry shame about?", [["yes", "Yes"], ["no", "No, it's more general"], ["notnow", "Yes, but I don't want to write it"]]),
    ask("secret", "Write it here. Nobody reads this but you.", { when: is("carry", "yes") }),
    say("That's allowed.", "You don't have to write it down for this to work. Hold it in mind for the next question.", { when: is("carry", "notnow") }),
    ask("friend", "If a friend told you they carried that same shame, or believed that same bottom line about themselves, what would you say to them?", { echo: ["bottom", "secret"], s: "What you'd say to a friend" }),
    ask("gap", "Why is it different for you? What makes you the exception to your own kindness?", { echo: "friend" }),
    short("fair", "A fairer bottom line you're willing to try on", { p: "It doesn't have to feel true yet. 'I'm good enough as I am, and still learning.' 'I'm as worthy as anyone else.'", s: "A fairer bottom line" }),
    ask("rule1", "Which rule will you break this week, in one small way, to test it?", { echo: "rules", s: "The rule you'll test" })
  ];

  F.w2 = [
    say("This will feel awkward. Do it anyway.", "The old belief filters out everything that doesn't fit it. Today you collect what it has been throwing away."),
    ask("strengths", "Ten qualities or strengths you have", { echo: "w1.fair", p: "If you get stuck at four, ask: what would the people who like me say? What do I do for others that I'd admire in someone else?", s: "Your strengths" }),
    ask("hard", "Which ones were hardest to write down, and what did your mind say as you wrote them?"),
    ask("evidence", "Evidence from this week for three of them. Specific moments.", { echo: "strengths", s: "Evidence from this week" }),
    ask("dismiss", "How do you usually explain away a compliment or a success?", { p: "'They're just being nice.' 'Anyone could have.' 'It was luck.' 'They don't know the real me.'" }),
    short("compliment", "What will you say next time someone compliments you?", { p: "Try: 'Thank you.' Nothing after it." }),
    short("promise", "One promise to yourself for this week", { p: "Small enough that you will certainly keep it. Keeping it is the point.", s: "Your promise to yourself" }),
    ask("boundary", "One boundary that would show self-respect", { p: "With whom, about what, and what you will do.", s: "A boundary" }),
    ask("treat", "If you treated yourself as someone whose worth was not in question, what would change in an ordinary day?", { s: "What would change" })
  ];

  /* ================= Relationships ================= */

  F.p1 = [
    ask("inner", "Inner ring: the people you could call at 3am", { p: "If there is nobody, write that. It is important to know.", s: "Inner ring" }),
    ask("middle", "Middle ring: friends and family you see and value"),
    ask("outer", "Outer ring: acquaintances, colleagues, neighbours, people you nod to"),
    ask("energy", "Who gives you energy? Who drains it?", { s: "Who gives and who drains" }),
    ask("real", "With whom can you be fully yourself, including on a bad day?"),
    any("area", "Which of these fits your life now?", ["a loss", "an ongoing conflict", "a change of role", "not enough connection"], { p: "Most low mood is tied to at least one. Tick every one that applies.", s: "What your mood is tied to" }),
    ask("aloss", "The loss: who or what, and when? How much room has it had?", { when: has("area", "a loss"), s: "The loss" }),
    ask("aconflict", "The conflict: with whom, and what is it really about? Is it still being argued, or has it gone silent?", { when: has("area", "an ongoing conflict"), s: "The conflict" }),
    ask("arole", "The change of role: what did you stop being, and what are you now? What do you miss about the old one, and is there anything good in the new one?", { when: has("area", "a change of role"), s: "The change of role" }),
    ask("aconn", "Not enough connection: has it always been like this, or did something change? What gets in the way of closeness for you?", { when: has("area", "not enough connection"), s: "Connection" }),
    ask("change", "One relationship you want to change, and what you would want to be different", { s: "The relationship you want to change" }),
    ask("mine", "What is your part in how it is now, and what is the first move that is yours to make?", { echo: "change" }),
    short("neglected", "Someone you've neglected and miss")
  ];

  F.p2 = [
    ask("conflict", "Pick a conflict that keeps repeating. With whom, and what is it about on the surface?", { need: true, s: "The conflict" }),
    ask("last", "Describe the last time, like a scene: who said what, in what order."),
    ask("mine", "Your usual move", { p: "Criticise, defend, explain at length, go cold, walk out, give in and resent it.", s: "Your usual move" }),
    ask("theirs", "Their usual move", { s: "Their usual move" }),
    ask("cycle", "How does each move trigger the other? Draw the circle in words.", { echo: ["mine", "theirs"], lead: "The two moves", p: "'The more I ___, the more they ___. And the more they ___, the more I ___.'", s: "The cycle" }),
    say("The cycle is the problem, not either of you.", "Once you can see the loop, you can step out of your half of it. Then the other half has nothing to push against."),
    ask("feel", "Underneath your move, what are you feeling that you don't show?", { echo: "mine", p: "Hurt. Fear of not mattering. Loneliness. Shame." }),
    ask("need", "And what do you actually need? Not your position: the need under it.", { p: "To know I matter. To be helped without asking. To be trusted. To not be alone with this.", s: "What you need underneath" }),
    ask("their", "What do you guess they are feeling and needing underneath their move?", { echo: "theirs" }),
    ask("old", "Does this fight remind you of any earlier one, in another relationship or growing up?"),
    ask("start", "Write a soft start: 'I feel ___ about ___, and I need ___.'", { echo: "need", p: "One specific thing. No 'you always', and no verdicts on their character.", s: "Your soft start" }),
    short("repair", "A phrase to de-escalate when it heats up", { p: "'Can we start again?' 'I'm getting flooded. Twenty minutes, then I'll come back.'" })
  ];

  F.p3 = [
    rate("lonely", "How lonely have you been lately?", "not at all", "very"),
    one("kind", "Which is closest?", [["none", "I have very few people"], ["deep", "I have people, but nobody really knows me"], ["lost", "I had people and lost them: a move, a death, a breakup, a falling out"], ["with", "I feel alone even when I'm with them"]], { s: "The kind of loneliness" }),
    ask("story", "What does loneliness tell you about other people, and about you?", { p: "'They're all busy.' 'Nobody wants to hear from me.' 'I'd be a burden.' 'There's something off about me.'", s: "What loneliness tells you" }),
    say("That story is a symptom.", "Long loneliness tilts the brain toward expecting rejection. Neutral faces read as unfriendly, and silences read as dislike. It feels like insight. It is the loneliness talking, and it makes you pull back further."),
    ask("pull", "How do you pull back or protect yourself? What do you do that keeps people at a distance?"),
    ask("known", "What would someone have to know about you to really know you? Who knows any of it?", { when: is("kind", "deep", "with") }),
    ask("grief", "Who do you miss most, and has losing them been grieved, or only got through?", { when: is("kind", "lost") }),
    ask("dormant", "People you've lost touch with and still think about", { p: "Dormant ties are almost always glad to hear from you. Most people are waiting for someone else to go first.", s: "People you've lost touch with" }),
    ask("place", "One place you could show up regularly, at the same time each week", { p: "A class, a group, a volunteer shift, the same café, a faith community, a walking group. Friendship comes from repeated, low-stakes contact.", s: "Your regular place" }),
    short("invite", "One small invitation you'll make this week, and to whom", { s: "Your invitation" }),
    ask("no", "How will you read it if they say no, or don't reply? Write the fair explanation now, before your mind supplies the unfair one.")
  ];

  /* ================= Grief and loss ================= */

  F.g1 = [
    ask("lost", "What or who have you lost? Include the losses nobody acknowledged.", { p: "A person. A marriage. Your health. A pregnancy. Work. A home. The childhood, or the future, you should have had.", need: true, s: "What you've lost" }),
    one("kind", "Take the one that is heaviest now. What kind of loss is it?", [["death", "Someone died"], ["rel", "A relationship ended or changed"], ["health", "Health, body or ability"], ["role", "Work, a role, a home, a way of life"], ["future", "A future or a past I should have had"]], { echo: "lost" }),
    short("when", "How long ago? Or is it still happening?"),
    ask("miss", "What do you miss most?", { p: "Be specific. Not 'everything'. The sound of the key in the door. Being able to run. Being someone's daughter.", s: "What you miss most" }),
    ask("complicated", "What was complicated about it?", { p: "Relief mixed with sorrow. Anger at them. Things unsaid. Guilt. A relationship that was hard. Nobody else seeing it as a loss.", s: "What was complicated" }),
    ask("guilt", "Is there anything you blame yourself for, or keep replaying?"),
    ask("said", "What have people said or done that helped? And what made it worse?"),
    one("mode", "Grieving swings between turning toward the loss and turning toward life. Where are you, mostly?", [["loss", "In the loss: I can't get on with anything"], ["life", "In life: I keep busy and don't go near it"], ["both", "Moving between the two"]]),
    ask("avoiding", "What have you been avoiding?", { p: "Places, objects, photographs, music, conversations, the feeling itself.", s: "What you've been avoiding" }),
    say("Then living needs some room too.", "Doing something ordinary, or even enjoying something, is not a betrayal of what you lost. Grief needs rest from itself to be bearable.", { when: is("mode", "loss") }),
    say("Then the loss needs some room.", "Keeping busy works until it doesn't. Grief with no time set aside for it tends to arrive anyway, at bad moments, as irritability, exhaustion or numbness.", { when: is("mode", "life") }),
    ask("both", "How will you make room this week for both: time to turn toward the loss on purpose, and time that belongs to life?", { s: "Room for both grieving and living" })
  ];

  F.g2 = [
    short("to", "Who or what is this letter to?", { echo: "g1.lost", p: "A person who died or left. Or what you lost: your health, the marriage, the baby, the life you expected.", need: true, s: "The letter is to" }),
    ask("unsaid", "Before you write it: what has gone unsaid? List it roughly.", { p: "Thanks. Anger. An apology you owe. An apology you are owed. A question. 'I miss you.' 'You hurt me.'" }),
    ask("letter", "Now write the letter. Speak to them directly. Hold nothing back; it won't be sent.", { echo: "unsaid", lead: "What has gone unsaid", p: "Start with 'Dear ___' and keep going until there is nothing left to say.", s: "The letter" }),
    ask("hardest", "Which line was hardest to write?"),
    ask("reply", "If they could truly hear you, what do you imagine they would say back?", { p: "If you wrote to something that isn't a person, let it answer anyway. What would your old life, or your body, say to you?", s: "What they would say back" }),
    ask("carry", "What do you carry from them, or from that time, that you want to keep?", { p: "Something they taught you. A way of doing things. A part of yourself they brought out.", s: "What you carry" }),
    ask("ritual", "A small ritual to mark it", { p: "A date, a place, a recipe, a song, a candle, a walk.", s: "Your ritual" }),
    ask("permission", "What permission do you need to give yourself?", { p: "To be angry. To stop being angry. To laugh. To love someone else. To stop visiting. To still be sad after all this time.", s: "The permission you need" })
  ];

  /* ================= Trauma ================= */

  F.t1 = [
    say("You don't need to describe what happened.", "Not today, and not at all unless and until you choose to. This session is only about how it lives in you now."),
    any("shows", "How does it show up?", ["nightmares", "flashbacks", "intrusive memories", "avoiding places or people", "avoiding feelings", "numbness", "always on guard", "jumpy", "anger", "shame", "guilt", "trouble trusting", "feeling unreal or far away", "sleep problems"], { s: "How it shows up" }),
    ask("worst", "Which of those is hardest to live with, and what does it stop you doing?", { echo: "shows" }),
    ask("triggers", "What tends to bring it on?", { p: "Sounds, smells, times of year, kinds of people, being touched, being alone, conflict." }),
    any("response", "Which survival responses do you recognise in yourself, then or now?", ["fight", "flight", "freeze", "appease / fawn"], { p: "Your body chose in a fraction of a second. None of them is a decision, and none is weakness." }),
    ask("judge", "Is there one you have judged yourself for?", { echo: "response", p: "Many people blame themselves for freezing or going along. Freezing is the body's oldest protection. It is not consent." }),
    ask("coped", "How have you coped until now? No judgement.", { p: "Keeping busy. Staying in control. Drinking. Not sleeping. Not trusting. Looking after everyone else.", s: "How you've coped" }),
    say("Every one of those kept you going.", "Some of them cost a great deal now, and you can change them once you have something better. But they were solutions before they were problems."),
    one("safe", "Are you safe now? Is the person or situation that hurt you out of your life?", [["yes", "Yes"], ["mostly", "Mostly"], ["no", "No. It is still happening, or they are still around"]]),
    say("That changes the order of things.", ["Trauma work is for after the danger. If you are still being hurt or threatened, the priority is your safety, not processing, and that needs real people: a domestic violence service, a doctor, the police, someone you trust. In the US the National Domestic Violence Hotline is 1-800-799-7233.", "Use the stabilising skills in session 2 of this track. Leave the memory work until you are safe."], { when: is("safe", "no"), links: [["#/crisis", "Help now"]] }),
    ask("healing", "What would healing look like for you? What would you be doing that you can't do now?", { s: "What healing would look like" }),
    ask("support", "Who and what supports you? Who knows what happened?", { s: "Your support" })
  ];

  const moved = a => a.before != null && a.after != null;
  F.t2 = [
    ask("triggers", "Your triggers: sounds, smells, places, dates, kinds of people, situations", { echo: "t1.triggers", s: "Your triggers" }),
    ask("signs", "What are the first signs that you are being pulled out of the present?", { p: "Vision narrowing. Sounds going far away. Heart racing. Going blank. Feeling small or young.", s: "Early signs" }),
    ask("statement", "Write your grounding statement: 'I am ___. I'm ___ years old. It is ___ [the date]. I'm in ___ [the place]. That is over, and I am safe right now.'", { p: "Write it out in full, in your own words. You'll say it aloud at the first sign.", s: "Your grounding statement" }),
    ask("senses", "Now do it for real. Look around and write: five things you can see, three you can hear, one you can touch."),
    rate("before", "How much distress are you carrying right now?", "none", "the worst"),
    ask("place", "Build your calm place. Somewhere real or invented where you feel settled. Describe what you see, hear, smell, and feel on your skin.", { p: "Not somewhere connected to anyone who hurt you. Take a minute with your eyes closed before you write.", s: "Your calm place" }),
    short("word", "One word that brings it back"),
    ask("container", "Now the container. A strong box, safe or vault. What does it look like, how does it lock, and what are you putting in it for now?", { p: "You aren't getting rid of anything. You are choosing when you look at it.", s: "Your container" }),
    rate("after", "And your distress now?", "none", "the worst"),
    say("Your system can come down when you ask it to.", "That is the foundation the rest of this track stands on. Practise while you are calm, so that it is there when you need it.", { when: a => moved(a) && a.after < a.before }),
    say("It didn't come down this time.", "That happens, especially if being still or closing your eyes feels unsafe. Try grounding with your eyes open and your body moving: walk and name what you see, hold something cold, press your feet into the floor. If nothing brings your distress down reliably, do the rest of this track with a trauma therapist and not alone.", { when: a => moved(a) && a.after >= a.before && a.before > 0 }),
    ask("kit", "Which of these works best for you, and where will you keep your grounding statement?", { s: "What works best" })
  ];

  F.t3 = [
    say("Write about what it means, not what happened.", "You don't need any detail of the event for this session."),
    ask("impact", "Why do you believe it happened? And how did it change how you see yourself, other people and the world?", { p: "Write freely for a few minutes.", s: "What it changed" }),
    ask("stuck", "Read that back and pull out the stuck points: the short, absolute beliefs. One per line.", { echo: "impact", p: "'It was my fault.' 'I should have known.' 'Nobody can be trusted.' 'I'm damaged.' 'If I let my guard down, it will happen again.'", s: "Your stuck points" }),
    short("one", "Pick one to examine today", { echo: "stuck", need: true, s: "The stuck point you examined" }),
    one("about", "What is it about?", [["blame", "What I did or didn't do: blame, 'should have'"], ["safety", "Safety: the world or people being dangerous"], ["trust", "Trust: in other people, or in my own judgement"], ["control", "Power and control"], ["worth", "My worth: being damaged, dirty, less than"], ["close", "Closeness: letting anyone near"]], { echo: "one" }),
    ask("for", "Evidence for it. Facts, not feelings.", { echo: "one" }),
    ask("against", "Evidence against it, or that doesn't fit", { echo: "one" }),
    ask("hindsight", "Are you judging your past self with knowledge you only had afterwards? What did you actually know, feel, and have the power to do at the time?", { when: is("about", "blame"), echo: "one", p: "Hindsight makes the outcome look predictable. It wasn't, to the person you were then." }),
    ask("choice", "Who made the choice to cause harm?", { when: is("about", "blame", "worth"), p: "Being there is not the same as being responsible. Responsibility belongs to whoever chose it." }),
    ask("all", "Is it true of everyone, everywhere, always? Who or what is an exception, even a small one?", { when: is("about", "safety", "trust", "control", "close"), echo: "one", p: "Stuck points use words like 'never', 'nobody' and 'always'. The accurate version is usually 'some' and 'sometimes'." }),
    ask("cost", "What does believing it cost you now? And what did it protect you from?", { echo: "one" }),
    ask("other", "What would you say to someone else this had happened to, who believed this?", { echo: "one" }),
    ask("accurate", "Write a more accurate statement.", { echo: "one", p: "Not the opposite extreme. 'Some people can't be trusted, and some have earned it.' 'I did what I could with what I knew.'", s: "A more accurate statement" }),
    rate("believe", "How much do you believe the new statement?", "not at all", "completely", { echo: "accurate" })
  ];

  const ok = a => !(a.before >= 7);
  F.t4 = [
    say("Check in with yourself first.", "This is the hardest session in the track, and you can stop at any point. Choose a memory that is moderately upsetting, not the worst one. If you dissociate, lose time, or get urges to harm yourself, do this with a therapist and not here."),
    rate("before", "How much distress are you in right now, before starting?", "none", "the worst", { s: "Distress before" }),
    say("Not today.", "Your distress is already high, and writing the memory out now is more likely to overwhelm you than to help. Use your grounding statement and your calm place, or a mood rescue, and come back on a steadier day. This session will be here: when you return, go Back one step and rate your distress again. That is not avoidance. It is pacing, and pacing is how this work is done safely.", { when: a => a.before >= 7, halt: true, links: [["#/rescue/triggered", "Ground myself"], ["#/emdr", "Calm place"]] }),
    any("ready", "Before you begin", ["I've chosen a moderate memory, not the worst", "My grounding statement is ready", "I have time afterwards to look after myself", "I know I can stop at any point"], { when: ok, echo: "t2.statement" }),
    ask("account", "Write what happened, in order, in the past tense: what you saw, heard, felt in your body, and thought.", { when: ok, p: "Don't worry about spelling or style. About half an hour is enough. If you feel yourself leaving the room, stop, say your grounding statement, and look around you." }),
    rate("after", "How much distress now?", "none", "the worst", { when: ok, s: "Distress after" }),
    say("Ground yourself before going on.", "Stand up. Press your feet into the floor. Say today's date, your age, and where you are. Name five things you can see. Stay with that until the number comes down, and use Help now if you need a person.", { when: a => ok(a) && a.after >= 8, links: [["#/rescue/triggered", "Ground myself"], ["#/crisis", "Help now"]] }),
    ask("hot", "Which moment was hardest to write? What were you telling yourself in that moment, back then?", { when: ok, s: "The hardest moment" }),
    ask("noticed", "What did you notice while writing: in your body, and in the memory itself?", { when: ok, p: "Details you had forgotten. A feeling you didn't expect. A part that was less bad than you remembered, or worse." }),
    ask("know", "What do you know now that you didn't know then?", { when: ok, p: "That it ended. That you survived. That you were a child. That it wasn't your fault. That you are not there any more.", s: "What you know now" }),
    ask("care", "What will you do in the next hour to look after yourself?", { when: ok, s: "How you'll look after yourself" })
  ];

  F.t5 = [
    ask("blame", "What do you blame yourself for?", { p: "The things you did, didn't do, should have known, should have said.", s: "What you've blamed yourself for" }),
    ask("gives", "A strange question: what does blaming yourself give you?", { echo: "blame", p: "Usually a sense of control. If it was my fault, I could have stopped it, and I can stop it next time. The alternative, that you were powerless, can feel worse." }),
    ask("pie", "Now the responsibility pie. List everyone and everything that contributed, and give each a percentage. Put yourself last.", { p: "The person who did it. The adults who didn't protect you. The people who looked away. The circumstances. What you could realistically have known and done.", s: "The responsibility pie" }),
    short("share", "What share is left for you?", { echo: "pie" }),
    ask("realistic", "What could a person of that age, in that situation, with what they knew and felt, realistically have done?", { s: "What was realistically possible" }),
    ask("child", "Picture someone else of that age in that exact position. What do you feel toward them?"),
    ask("anger", "Where does the anger belong?", { p: "If you feel none, notice that. It may have gone inward, where it was safer.", s: "Where the anger belongs" }),
    ask("letter", "Write an unsent letter to the person, or to what happened. Say what it did."),
    ask("younger", "What do you want to say to the you who went through it?", { s: "What you'd say to your younger self" }),
    ask("shame", "Is there shame that still clings, even though you can see the facts? Where do you feel it?"),
    say("Shame fades when it is spoken to someone who doesn't flinch.", "You have just said it here. If there is one safe person, or a therapist, saying it aloud to them is the single most powerful thing you can do with it.")
  ];

  F.t6 = [
    ask("took", "What did it take from you? Places, activities, people, parts of yourself.", { s: "What it took" }),
    ask("reclaim", "What do you want back first?", { echo: "took", need: true, s: "What you want back first" }),
    ask("step", "What is the first small step toward that? Build it like the exposure ladder: easy enough to do this week.", { echo: "reclaim", s: "The first step" }),
    ask("trust", "Who has earned some trust, and how could you extend a little more?", { p: "Trust is extended in small amounts and watched. What is one slightly bigger thing you could let that person see or do?" }),
    ask("body", "How is your relationship with your own body now, and what is one way you could be on its side?"),
    ask("strength", "What have you learned about your own strength?", { s: "What you've learned about your strength" }),
    ask("matters", "What matters more to you now than it did before?"),
    ask("not", "What do you refuse to let it decide about the rest of your life?", { s: "What it doesn't get to decide" }),
    short("title", "A title for your next chapter", { s: "The next chapter" })
  ];

  /* ================= Childhood and the roots of your patterns ================= */

  F.r1 = [
    say("Rate how well each need was met when you were a child.", "0 means not at all, 10 means reliably. Go on gut feeling."),
    rate("safety", "Safety, and a bond you could depend on", "not at all", "reliably"),
    rate("autonomy", "Encouragement to be capable and separate", "not at all", "reliably"),
    rate("express", "Freedom to say what you felt and needed", "not at all", "reliably"),
    rate("play", "Play and lightness", "not at all", "reliably"),
    rate("limits", "Fair, consistent limits", "not at all", "reliably"),
    ask("lowest", "Look at your lowest score. What was it actually like? Give one memory, or one typical scene.", { s: "The need that went unmet" }),
    short("home", "What home felt like, in three words", { s: "Home, in three words" }),
    ask("upset", "When you were upset as a child, what happened? Who came, and what did they do?", { p: "If nobody came, or you learned not to show it, write that. What didn't happen counts." }),
    any("role", "The role you played", ["the good one", "the fixer", "the invisible one", "the problem", "the caretaker", "the achiever", "the peacemaker", "the clown"], { s: "Your role" }),
    ask("tobe", "What did you learn you had to be or do, to be loved or left alone?", { echo: "role", s: "What you had to be" }),
    ask("concluded", "What did you conclude about yourself?", { p: "Children nearly always decide the problem is them. It is safer than deciding the adults can't cope.", s: "What you concluded about yourself" }),
    ask("unsaid", "What did you never get to say?", { s: "What you never got to say" }),
    ask("now", "Where does that childhood role still switch on in your life today?", { echo: "role" }),
    say("This is about getting the facts right, not about blame.", "Your parents may have done their best with what they had, and it may still not have been enough. Both can be true.")
  ];

  F.r2 = [
    any("schemas", "Which of these do you recognise?", ["people leave (abandonment)", "people will hurt or use me (mistrust)", "my needs won't be met (emotional deprivation)", "something is wrong with me (defectiveness)", "I don't belong (isolation)", "I can't cope alone (dependence)", "disaster is coming (vulnerability)", "I have no self apart from them (enmeshment)", "I will fail (failure)", "I must give in (subjugation)", "others' needs come first (self-sacrifice)", "I need approval (approval-seeking)", "I must not show feelings (inhibition)", "nothing is ever good enough (unrelenting standards)", "mistakes deserve punishment (punitiveness)", "expect the worst (pessimism)"], { p: "Tick any that ring true. Go on feeling, not logic." }),
    short("top", "Your top two", { echo: "schemas", need: true, s: "Your main life-traps" }),
    ask("trigger", "Think of the last time one of them was triggered. What happened, and how old did you feel?", { echo: "top" }),
    ask("origin", "Where did each come from? Your earliest memory of the feeling.", { echo: "top", s: "Where they came from" }),
    ask("today", "How does each show up in your life now?", { p: "In who you choose, what you avoid, how you react, what you assume.", s: "How they show up now" }),
    one("cope", "With the stronger one, what do you mostly do?", [["surrender", "Surrender: I end up in situations that confirm it"], ["avoid", "Avoid: I stay away from anything that might trigger it"], ["over", "Overcompensate: I do the extreme opposite"], ["mix", "A mix"]], { echo: "top" }),
    ask("copehow", "How exactly? Give an example."),
    say("All three keep the belief from ever being tested.", "Surrendering proves it. Avoiding means you never find out. Overcompensating wears you out, and people respond to the armour, not to you. The way out is small experiments in which you act as if it weren't true, and see what happens."),
    ask("then", "What makes it a conclusion from then, and not a fact about now? What is different about your life, your power and your choices today?", { echo: "origin", s: "Why it's a conclusion from then" }),
    ask("exception", "When has life contradicted it, even once?"),
    ask("experiment", "One small experiment this week that tests it", { p: "If the trap is 'my needs won't be met': ask one person for one small thing. If it is 'nothing is good enough': hand something in at 80 percent.", s: "Your experiment" })
  ];

  const TOWARD = [["curious", "Curious, or some warmth"], ["annoyed", "Irritated. I want it gone"], ["ashamed", "Ashamed of it"], ["afraid", "Afraid of it"], ["nothing", "Nothing much"]];
  const notCurious = a => a.toward && a.toward !== "curious";
  const otherPart = ["That reaction is another part.", "The irritation, shame or fear belongs to a different part, one with its own opinion about this one. Ask it, kindly, to step back for a few minutes so that you can listen. You are not taking sides. Wait and see whether a little curiosity comes."];
  F.r3 = [
    ask("parts", "Name three parts of you and what each one does.", { p: "The perfectionist. The pleaser. The critic. The one who numbs out. The one who rages. The frightened one. The one who holds it all together.", s: "Your parts" }),
    short("one", "Choose one protector to get to know today", { echo: "parts", need: true, s: "The part you got to know" }),
    short("where", "Where do you sense it, in or around your body?", { echo: "one" }),
    one("toward", "How do you feel toward it right now?", TOWARD, { echo: "one" }),
    say(otherPart[0], otherPart[1], { when: notCurious }),
    ask("job", "Ask it: what is your job? Write what it answers.", { echo: "one", p: "Don't think up the answer. Ask inside, wait, and write what comes, even if it is strange.", s: "Its job" }),
    ask("since", "Ask it: how long have you been doing this? When did you start?"),
    ask("age", "Ask it: how old do you think I am?", { p: "Protectors often still think you are the age you were when they took the job." }),
    ask("fear", "Ask it: what are you afraid would happen if you stopped?", { s: "What it's afraid of" }),
    ask("protects", "What younger feeling, or younger part, is it protecting?", { echo: "fear", s: "What it protects" }),
    ask("thanks", "What do you want to say to it, now that you know this?"),
    ask("update", "Tell it how old you are now, and what you can do now that you couldn't then. What does it say?"),
    ask("needs", "And the younger part underneath: what does it need?", { echo: "protects", s: "What the younger part needs" })
  ];

  F.r4 = [
    say("Choose carefully.", "A memory that is sad or painful, but not overwhelming. Close your eyes for each step before you write."),
    ask("memory", "A time you needed someone and nobody came. Where are you, how old, and what is happening?", { echo: "r1.upset", p: "Write it in the present tense, as if you are there. 'I'm seven. I'm on the stairs.'", need: true, s: "The memory" }),
    ask("child", "Look at the child. What are they feeling, and what do they need?", { echo: "memory", s: "What the child needed" }),
    ask("believes", "What is the child deciding about themselves in that moment?", { s: "What the child decided" }),
    ask("rescript", "Now you walk in, as the adult you are today. What do you do, and what do you say? To the child, and to anyone else who is there.", { echo: "child", p: "You can be as fierce and as tender as the moment needed. You can stop it. You can pick the child up and take them out of there.", s: "What you did when you walked in" }),
    ask("now", "What does the child feel now? What do they do?"),
    ask("more", "Does the child need anything else from you before you go? Give it."),
    one("how", "How was that?", [["moved", "It moved me"], ["flat", "I couldn't feel much"], ["hard", "I couldn't be kind to the child"], ["much", "It was too much"]]),
    say("That is common the first time.", "The feeling often arrives later, or on the second or third attempt. Try it again in a few days with a different, smaller memory.", { when: is("how", "flat") }),
    say("A part of you is standing in the way.", "Often it is the critic, who agrees with whoever blamed the child, or a protector who thinks tenderness is dangerous. That is worth meeting directly: try 'Talk with a part of you' under Deeper.", { when: is("how", "hard") }),
    say("Then stop there, and ground yourself.", "Feet on the floor. Today's date. Five things you can see. This kind of imagery can go deep quickly. Use smaller memories, or do it with a therapist.", { when: is("how", "much"), links: [["#/rescue/triggered", "Ground myself"]] }),
    ask("letter", "Write a letter to your younger self", { echo: "believes", lead: "What the child decided", s: "Letter to your younger self" }),
    short("daily", "One daily act of reparenting", { p: "Asking 'what do I need?' and answering it. A proper lunch. Bed at a kind time. Saying 'that was hard' to yourself after something hard.", s: "Your daily act" })
  ];

  const gone = is("alive", "dead"), here = is("alive", "yes", "distant");
  F.r5 = [
    short("who", "Who is this about?", { p: "A parent, both, a step-parent, a grandparent: whoever was supposed to look after you.", need: true, s: "Who this is about" }),
    one("alive", "Are they still in your life?", [["yes", "Yes"], ["distant", "Alive, but we have little or no contact"], ["dead", "They've died"]]),
    ask("didnt", "What didn't you get from them?", { echo: "r1.lowest", p: "Protection. Being noticed. Comfort. Praise. An apology. Interest in who you actually were.", s: "What you didn't get" }),
    ask("angry", "What are you angry about?", { p: "Let it be unfair and uncensored. Nobody is reading this.", s: "What you're angry about" }),
    ask("love", "What do you miss, or still love?", { p: "Both can be true. Leave it empty if there is nothing." }),
    ask("understand", "What do you understand about why they were the way they were? And does understanding it make it enough?"),
    ask("hoping", "What are you still hoping they will do or say?", { when: here, s: "What you're still hoping for" }),
    ask("hoping", "What did you go on hoping for, right up until they died? What will now never be said?", { when: gone, s: "What you were still hoping for" }),
    ask("wait", "Where else do you wait for it? From whom do you keep trying to get what they didn't give?", { p: "Partners, bosses, friends, your own children." }),
    say("The grief is for what will not come.", "Accepting that the childhood you deserved is not coming is one of the hardest things in therapy, and one of the most freeing. It doesn't require forgiving them or cutting them off. It means you stop waiting."),
    ask("feel", "If you let that be true for a moment, what do you feel?"),
    ask("energy", "If you stopped waiting, what would you do with that energy?", { s: "What you'd do with the energy" }),
    ask("now", "What relationship do you choose with them now, and what are your limits?", { when: here, s: "The relationship you choose now" }),
    ask("now", "What relationship do you choose with their memory? What do you keep, and what do you hand back?", { when: gone, s: "The relationship you choose with their memory" }),
    ask("give", "What is one thing they didn't give you that you could start giving yourself?", { echo: "didnt", s: "What you'll give yourself" })
  ];

  F.r6 = [
    ask("pattern", "Think about your closest relationships, past and present. What do you tend to do as someone gets close?", { s: "What you do as someone gets close" }),
    one("style", "Which is most like you?", [["anxious", "I fear being left, and need reassurance"], ["avoidant", "I need space, and shut down when it gets close"], ["both", "I want closeness and fear it at the same time"], ["secure", "Mostly comfortable both close and apart"]], { s: "Your pattern" }),
    ask("trigger", "What sets off your alarm in closeness?", { p: "A slow reply. A change of tone. Being needed. Being asked what's wrong. Them being happy without you." }),
    ask("do", "What do you do then?", { echo: "trigger", p: "Cling, check, test, protest, accuse, withdraw, go cold, get busy, end it first.", s: "What you do when the alarm goes" }),
    ask("gets", "What does that get you in the moment, and what does it do to the relationship over time?", { echo: "do" }),
    ask("afraid", "What are you really afraid of in that moment?", { s: "What you're really afraid of" }),
    ask("echo", "Who does this feeling remind you of? When did you first feel it?", { echo: "afraid" }),
    ask("choose", "What kind of person do you tend to be drawn to, and how do they fit the old pattern?"),
    ask("secure", "The secure move is the opposite of the old one. What would it be for you?", { echo: "do", lead: "The old move", p: "If you chase: soothe yourself first, then say the need once, plainly. If you withdraw: stay, and say 'I need a minute. I'm not leaving.'", s: "The secure move" }),
    ask("ask", "What do you need to ask for, in plain words?", { s: "What you need to ask for" })
  ];

  /* ================= Acceptance, values and meaning ================= */

  F.c1 = [
    ask("what", "Pick the thing that isn't changing. What is it?", { p: "Another person. The past. A diagnosis. A loss. Something about your own nature or your circumstances.", need: true, s: "What isn't changing" }),
    short("long", "How long have you been up against it?"),
    ask("fight", "Everything you've done to fight it, fix it, or get away from it", { echo: "what", p: "Arguing, pleading, researching, trying harder, avoiding, numbing, replaying, waiting.", s: "How you've fought it" }),
    ask("cost", "What has the fight cost you?", { p: "Energy, sleep, health, other relationships, years.", s: "What the fight has cost" }),
    ask("control", "Sort it into three. First: what part is in your control?", { echo: "what", p: "Usually: what you do, what you say, where you put your time, how you treat yourself." }),
    ask("influence", "What part can you influence, but not control?"),
    ask("outside", "And what part is outside your control altogether?", { s: "What is outside your control" }),
    say("Stopping the fight is not agreeing with it.", "Acceptance doesn't mean liking it, approving of it or giving up. It means you stop spending yourself on a fight with what is already so. And it is usually blocked by a feeling you would have to feel if you stopped."),
    ask("feel", "If you stopped fighting the part that is outside your control, what would you have to feel?", { echo: "outside", p: "Grief. Rage. Fear. Helplessness. Take your time. This is the centre of the session.", s: "What you'd have to feel" }),
    ask("room", "Has that feeling ever been given room? What would it need: to be said to someone, written, cried, raged about?", { echo: "feel" }),
    one("really", "Be honest with yourself. Is it truly unchangeable, or is there a choice you have and don't want to make, because every option costs something?", [["cant", "It truly can't be changed"], ["choice", "There is a choice I've been avoiding"], ["unsure", "I'm not sure"]], { echo: "what" }),
    ask("choice", "What is the choice, and what does each option cost?", { when: is("really", "choice", "unsure"), s: "The choice you've been avoiding" }),
    ask("free", "If you stopped fighting what can't be changed, what would that free up?", { s: "What it would free up" }),
    ask("willing", "Finish this: 'I don't like it, I didn't choose it, and I'm willing to ___.'", { s: "What you're willing to do" })
  ];

  F.c2 = [
    ask("thought", "Use a thought that has hooked you for years. Write it.", { p: "'I'm not good enough.' 'It's too late.' 'People always leave.'", need: true, s: "The thought that hooks you" }),
    short("old", "How old is it? When did it first show up?"),
    ask("hooked", "When you're hooked by it, what do you do? What do you stop doing?", { echo: "thought", s: "What you do when hooked" }),
    ask("fought", "What have you tried, to get rid of it? Arguing, positive thinking, distraction, proving it wrong. How has that worked over the years?"),
    say("So try something different: don't get rid of it. Step back from it.", "You don't have to win the argument with a thought to be free of it. You only have to see it as a thought: words your mind produces, not a window onto the truth."),
    ask("having", "Write it again, starting with 'I'm having the thought that…'", { echo: "thought" }),
    ask("noticing", "And again: 'I notice I'm having the thought that…' What changes between the three versions?"),
    short("story", "Give the whole story a name", { p: "'The Not Good Enough story.' 'The Too Late story.' So that you can greet it when it turns up.", s: "The name of the story" }),
    ask("voice", "Now say the thought aloud, slowly, in a silly voice, ten times. What happened to it?", { p: "It feels ridiculous. That is the point: the words stay the same, and their grip changes." }),
    ask("free", "If this thought were just words passing through, what would you do this week that you've been putting off?", { echo: "hooked", lead: "When hooked, you", s: "What you'd do if it were just words" })
  ];

  F.c3 = [
    say("Write what you want to stand for, not what you think you should.", "A value is a direction, not a destination. You can act on it today, whatever your mood."),
    ask("relationships", "Relationships: what kind of partner, parent, friend or relative do you want to be?"),
    ask("work", "Work and contribution: what do you want to give?"),
    ask("health", "Body and mind: how do you want to treat yourself?"),
    ask("growth", "Growth, play, spirit: what makes you feel alive?"),
    ask("core", "Which three or four words sum up what you most want to stand for?", { echo: ["relationships", "work", "health", "growth"], lead: "What you wrote", s: "Your values" }),
    rate("living", "Overall, how closely are you living by these right now?", "not at all", "fully"),
    ask("gap", "Where is the biggest gap between what you value and how you are living?", { echo: "core", s: "The biggest gap" }),
    ask("way", "What gets in the way there? Is it circumstances, or a feeling you would have to face?", { echo: "gap" }),
    ask("pain", "Now turn your pain over. What does the thing that hurts most tell you about what you care about?", { p: "You hurt where you care. Loneliness points to connection. Shame about work points to wanting to contribute.", s: "What your pain says you care about" }),
    ask("small", "One small thing you could do in the next two days, in the direction of the biggest gap", { echo: "gap", s: "One small step" })
  ];

  F.c4 = [
    ask("eighty", "Imagine your eightieth birthday. Someone who knows you well stands up to say what your life was about. What do you want them to be able to say?", { echo: "c3.core", s: "What you want said at eighty" }),
    ask("today", "If they gave that speech about the last year only, what would they say?", { echo: "eighty" }),
    ask("goal", "One goal for the next thirty days that moves you toward the first speech", { s: "Your thirty-day goal" }),
    short("step", "The first step, small enough to do in the next 24 hours", { echo: "goal", s: "The first step" }),
    ask("room", "What feelings will you have to make room for, in order to do it?", { p: "Anxiety, doubt, grief, the fear of looking foolish, the fear that it's too late." }),
    one("willing", "Are you willing to feel that, in order to do what matters?", [["yes", "Yes"], ["some", "Some of it"], ["no", "Not yet"]], { echo: "room" }),
    ask("smaller", "Then what is the version of the step you are willing to do?", { when: is("willing", "some", "no"), echo: "step", s: "The step you're willing to take" }),
    ask("suffer", "One source of meaning is the stance you take toward suffering you can't avoid. Is there something like that in your life? What stance do you want to take toward it?", { echo: "c1.what", s: "Your stance toward what can't be avoided" }),
    ask("quit", "What will you say to yourself when you want to quit?", { s: "What you'll say when you want to quit" })
  ];

  /* ================= Staying well ================= */

  F.s1 = [
    say("Before you answer, look back.", "Open Your map and read through what you wrote in your early sessions. Then come back here.", { links: [["#/map", "Open your map"]] }),
    ask("started", "Where you started, in your own words", { echo: ["f1.why", "f1.goals"], s: "Where you started" }),
    ask("different", "What is different now? Be specific: what do you do, think or feel that you didn't before?", { s: "What is different" }),
    ask("others", "What have other people noticed? Or what would they notice, if they were paying attention?"),
    ask("goals", "Look at the goals you set at the start. Where are you with each?", { echo: "f1.goals" }),
    ask("caused", "What caused the change? Not 'time'. What did you actually do?", { p: "People who can explain their own improvement keep it.", s: "What caused the change" }),
    ask("tools", "The five tools that helped most", { s: "Your five best tools" }),
    ask("why", "What do you now understand about why you struggled?", { p: "Your map in a paragraph: where it came from, and what kept it going.", s: "Why you struggled" }),
    ask("unfinished", "What still needs work?", { s: "What still needs work" }),
    one("next", "What does the unfinished part need?", [["practice", "More practice of what I already know"], ["deeper", "Going deeper, here"], ["person", "A person: a therapist, a doctor, a group"], ["time", "Only time"]], { echo: "unfinished" }),
    say("That is a good conclusion, not a failure.", "Knowing what you can do alone and what needs another person is exactly what a course of therapy should leave you with. Take your map with you. It will save weeks.", { when: is("next", "person") })
  ];

  F.s2 = [
    ask("last", "Think of your last bad patch. Looking back, what were the very first signs, before you knew you were slipping?"),
    ask("signs", "Your early signs, under three headings: thoughts, behaviour, body", { echo: "last", p: "Sleeping badly. Cancelling. More wine. Snapping. Not opening post. The old thoughts coming back.", s: "Your early signs" }),
    ask("risk", "Situations and times of year that put you at risk", { p: "Anniversaries, winter, illness, conflict, overwork, being alone too long, hormone shifts.", s: "What puts you at risk" }),
    ask("green", "Green: what keeps you well, week in, week out?", { echo: "s1.tools", s: "Green: what keeps you well" }),
    ask("amber", "Amber: what you'll do in the first week of slipping. Be exact.", { echo: "signs", lead: "Your early signs", p: "Which tools, which people, what you'll cut back on, and what you'll put back in.", s: "Amber plan" }),
    ask("say", "When it starts, your mind will say 'I'm back to square one, nothing worked'. What will you say back?"),
    ask("red", "Red: who you'll contact, and at exactly what point you'll see a professional", { p: "Set the line now, while you're well: 'if I've been low for two weeks', 'if I stop sleeping', 'if I think about dying'.", s: "Red plan" }),
    ask("others", "What should the people close to you watch for, and what do you want them to say?"),
    ask("note", "Write a note to yourself for a bad day.", { p: "From the you who is well, to the you who can't remember being well.", s: "Your note for a bad day" }),
    short("share", "Who will you share this plan with?")
  ];

  F.s3 = [
    ask("daily", "Your daily and weekly non-negotiables", { p: "Sleep, movement, people, something that matters, time that is yours.", s: "Your non-negotiables" }),
    ask("first", "Which of those goes first when life gets busy, and how will you protect it?", { echo: "daily" }),
    ask("close", "People to keep close", { s: "People to keep close" }),
    ask("out", "What to keep out of your life, or limit", { p: "People, habits, substances, kinds of work, kinds of scrolling.", s: "What to limit" }),
    ask("good", "Three good moments from the last week. What made each one good?", { p: "Lingering on a good moment for twenty seconds is one of the practices with steady evidence behind it." }),
    ask("strength", "One of your strengths, and a new way to use it this month", { echo: "w2.strengths" }),
    short("review", "Your weekly review: day and time", { p: "Ten minutes. How am I? What do I need? What am I neglecting?", s: "Weekly review" }),
    ask("forward", "Something you're building, or looking forward to", { s: "What you're looking forward to" })
  ];

  F.s4 = [
    say("Last piece of writing.", "Endings matter. Take your time with this one."),
    ask("proud", "What are you proud of?", { echo: "s1.different", s: "What you're proud of" }),
    ask("hardest", "What was the hardest part, and how did you get through it?"),
    ask("thank", "Who or what helped? Is there someone to thank?"),
    ask("letter", "Write a letter to yourself to read on a hard day.", { echo: "s2.note", p: "What you know now. What works. What you would want to be reminded of.", s: "Your letter for a hard day" }),
    ask("booster", "How will you know you need a booster, and what will you do first?", { echo: "s2.signs", s: "How you'll know you need a booster" }),
    ask("commit", "Your commitment to yourself", { s: "Your commitment" })
  ];

  /* ================= Deeper tools ================= */

  const T = {};
  T.stuck = {
    notfor: "If the thing itself can't be changed (another person, a loss, an illness, the past), use “Change it, or make peace with it?”. This one is for problems that could move and haven't.",
    f: [
      ask("problem", "The problem, in a sentence or two", { need: true, s: "The problem" }),
      one("kind", "Before going further: can this, in principle, be changed by something you do?", [["yes", "Yes, at least partly"], ["no", "No. It is another person, the past, or a fact I can't alter"], ["unsure", "I don't know"]], { echo: "problem" }),
      say("Then this isn't a problem to untangle. It is a weight to carry differently.", "The questions that follow look for what you could do differently, and they will feel wrong for something that can't be changed. “Change it, or make peace with it?” is built for exactly this. You can carry on here if part of it is yours to move: your own response to it usually is.", { when: is("kind", "no"), links: [["#/explore", "Back to the tools"]] }),
      ask("began", "How long has it been going on? What was happening in your life when it started?"),
      ask("tried", "What have you tried? What helped a little, and what made no difference?", { s: "What you've tried" }),
      ask("more", "Is there anything you keep doing more of, even though it hasn't worked?", { echo: "tried", p: "Trying harder at the same solution is often what holds a problem in place." }),
      ask("keeps", "What keeps it going? Things you do, avoid or tell yourself; things other people do.", { s: "What keeps it going" }),
      ask("protects", "Honestly, and with no blame: is there anything this problem gets you out of, or protects you from?", { p: "A risk you would have to take. A conversation. A decision. Being seen. Finding out. If the answer is 'nothing', write that.", s: "What it protects you from" }),
      ask("without", "If it vanished overnight, what would you then have to face, or do?"),
      ask("exceptions", "When is it absent, or weaker? What is different at those times?", { s: "When it's weaker" }),
      ask("ten", "If it were 10 percent better, what would you be doing differently?", { echo: "exceptions" }),
      ask("experiment", "One small experiment for this week", { p: "Something different from what you have already tried, and small enough to be safe. You are collecting information, not fixing it.", s: "Your experiment" })
    ] };
  T.immunity = {
    f: [
      ask("want", "The change you really want to make", { need: true, s: "The change you want" }),
      ask("matters", "Why does it matter to you? What would it give you?", { echo: "want" }),
      ask("instead", "What do you actually do, or not do, that works against it? Be thorough and unsparing.", { echo: "want", s: "What you do instead" }),
      ask("fear", "Imagine doing the opposite of each of those. What worry, dread or discomfort comes up?", { echo: "instead", p: "Don't reason. Picture yourself doing it, and notice the flinch.", s: "The fear underneath" }),
      ask("hidden", "So part of you is also committed to something else. Finish this: 'I am also committed to never ___.'", { echo: "fear", p: "Never being rejected. Never looking foolish. Never losing control. Never being a burden. Never outshining someone.", s: "Your hidden commitment" }),
      say("One foot on the accelerator, one on the brake.", "You aren't weak or lazy. You have two commitments pulling in opposite directions, and the hidden one has been winning because it protects you from something that feels dangerous."),
      ask("assume", "The big assumption underneath: 'I assume that if I ___, then ___.'", { echo: "hidden", s: "The big assumption" }),
      ask("learned", "Where did you learn that? Whose rule was it?"),
      rate("true", "How true does it feel?", "not at all", "completely", { echo: "assume" }),
      ask("counter", "Has there ever been a time it wasn't true: you did the thing, and the disaster didn't follow?", { echo: "assume" }),
      ask("test", "A small, safe way to test whether it is still true", { p: "Not the big change. A tiny experiment whose only purpose is to find out what really happens.", s: "Your test" })
    ] };
  T.root = {
    f: [
      ask("situation", "What set it off?", { p: "A recent reaction that was bigger than the situation deserved.", need: true, s: "What set it off" }),
      short("feeling", "What did you feel, and how strong from 0 to 10?"),
      ask("thought", "What went through your mind?", { need: true, s: "The first thought" }),
      ask("mean1", "If that were true, what would it mean about you?", { echo: "thought" }),
      ask("mean2", "And if that were true, what would that mean?", { echo: "mean1" }),
      ask("mean3", "And what is the worst part of that?", { echo: "mean2" }),
      short("core", "You have reached the bottom. Write the belief in a few words.", { echo: "mean3", p: "It usually starts with 'I am…', 'People are…' or 'The world is…'.", s: "The belief at the bottom" }),
      short("age", "When you feel it fully, how old do you feel?"),
      ask("earliest", "The earliest time you remember feeling this", { s: "The earliest memory of it" }),
      ask("taught", "Who or what taught it to you?"),
      ask("child", "What couldn't a child have known or understood back then?", { p: "That the adults were struggling. That it wasn't about them. That it would end. That they had no real choice." }),
      ask("served", "How did believing it help you get through at the time?"),
      ask("doesntfit", "What in your adult life doesn't fit this belief?", { echo: "core", s: "What doesn't fit it" }),
      short("updated", "A belief you're willing to try on instead", { s: "A belief to try on" }),
      ask("next", "Next time the reaction comes, what will you say to the younger you who is having it?")
    ] };
  T.pattern = {
    f: [
      ask("happens", "What keeps happening?", { need: true, s: "What keeps happening" }),
      ask("times", "Three times it has happened, earliest first"),
      ask("common", "What do they have in common? The kind of person, the part you played, how it ended.", { echo: "times", s: "What they have in common" }),
      ask("felt", "What did you feel each time, at the worst point?"),
      ask("first", "What was the first relationship in which you felt that?", { echo: "felt", s: "Where you first felt it" }),
      ask("hoping", "What do you keep hoping will turn out differently this time?", { p: "Repetition is usually an old hope looking for a new ending.", s: "What you keep hoping for" }),
      ask("signs", "Looking back, what were the early signs each time, and what did you tell yourself about them?"),
      ask("mypart", "What do you do, without meaning to, that helps it happen again?", { p: "No blame. This is the part you have power over.", s: "Your part" }),
      ask("choice", "Where is the choice point, the moment it could go another way? What is a different move?", { s: "The choice point" }),
      short("title", "A title for the new version of this story")
    ] };
  T.part = {
    f: [
      short("which", "Which part? Give it a name.", { p: "The critic. The one who shuts down. The one who can't say no. The angry one.", need: true, s: "The part" }),
      ask("when", "When does it take over?", { echo: "which" }),
      short("where", "Where do you feel it, in or around your body?"),
      one("toward", "How do you feel toward it right now?", TOWARD, { echo: "which" }),
      say(otherPart[0], otherPart[1], { when: notCurious }),
      ask("job", "Ask it: what is your job? Write what it says.", { echo: "which", p: "Ask inside, wait, and write what comes.", s: "Its job" }),
      ask("since", "Ask it: how long have you been doing this? And how old do you think I am?"),
      ask("fear", "Ask it: what are you afraid would happen if you stopped?", { s: "What it's afraid of" }),
      ask("protect", "Ask it: who or what are you protecting?", { s: "What it protects" }),
      ask("tired", "Ask it: what is this job like for you? Would you rather be doing something else?"),
      ask("need", "Ask it: what do you need from me?", { s: "What it needs from you" }),
      ask("say", "Now you speak. What do you want to say to it?"),
      ask("after", "How do you feel toward it now, compared with when you started?")
    ] };
  T.accept = {
    f: [
      ask("what", "The situation", { need: true, s: "The situation" }),
      ask("tried", "What have you tried, and for how long?", { echo: "what" }),
      ask("control", "What part of it is in your control?"),
      ask("influence", "What part can you influence, but not control?"),
      ask("outside", "What part is outside your control?", { s: "What is outside your control" }),
      ask("cost", "What does fighting that part cost you?", { echo: "outside", s: "What the fight costs" }),
      ask("feel", "If you stopped fighting it, what would you have to feel?", { echo: "outside", p: "Grief, rage, fear, helplessness. This is usually what the fight is keeping away.", s: "What you'd have to feel" }),
      ask("room", "What would give that feeling room? Who could hear it?", { echo: "feel" }),
      ask("meaning", "What have you been telling yourself it means about you, or about your life, that this is so?", { p: "'I failed.' 'My life is ruined.' 'I'm being punished.' The fact can't change. That sentence can." }),
      ask("possible", "Given how things are, what is still possible?", { s: "What is still possible" }),
      ask("willing", "'I don't like it, I didn't choose it, and I am willing to ___.'", { s: "What you're willing to do" })
    ] };
  T.letter = {
    f: [
      short("to", "Who is it to?", { p: "Someone living or dead. Someone who hurt you. Someone you hurt. A part of your own past.", need: true, s: "To" }),
      ask("why", "Why now? What has brought them to mind?"),
      ask("letter", "Write the letter. It will not be sent, so hold nothing back.", { p: "Say what happened, what it did to you, what you needed and didn't get, what you wish you had said.", s: "The letter" }),
      ask("left", "Read it through. Is anything still unsaid? Add it here."),
      ask("reply", "If they could truly hear you, with no defences, what would they say?", { s: "What they would say" }),
      one("feel", "How do you feel now that it's out?", [["lighter", "Lighter"], ["sad", "Sad"], ["angry", "Angrier"], ["raw", "Raw or shaky"], ["same", "Much the same"]]),
      ask("now", "What do you need now?", { s: "What you need now" }),
      ask("do", "What will you do with the letter? Keep it, read it aloud, burn it, bring it to someone?")
    ] };

  /* ---- attach the dialogues to the sessions and tools ---- */
  IW.tracks.forEach(t => t.sessions.forEach(s => { s.f = F[s.id] || []; }));
  IW.tools.forEach(t => Object.assign(t, T[t.id] || { f: [] }));
})();
