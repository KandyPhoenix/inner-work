/* Inner Work — the guided dialogue for each session (part 1: foundations to anxiety).
   A session's "work it through" is a list of steps asked one at a time, the way a therapist
   would ask them: each follows from the answer before, and some are only asked if an earlier
   answer calls for them.
     ask / short  a question answered in writing (long / one line)
     rate         a 0–10 scale with named ends
     any / one    pick any / pick one (one decides which questions come next)
     say          the guide speaks: a reflection, or something to know at that point
     breathe      a timed breathing exercise
   Extras: p (a prompt under the question), echo (show an earlier answer above it: "id", or
   "session.id"), when (only ask if this is true of the answers so far), s (label for the
   summing-up and Your map), need (can't be skipped: later questions depend on it), halt (the
   session stops here for today and is not marked complete). */
window.IW = window.IW || {};
(function () {
  const ask = (id, q, x) => Object.assign({ id, k: "ta", q }, x);
  const short = (id, q, x) => Object.assign({ id, k: "tx", q }, x);
  const rate = (id, q, lo, hi, x) => Object.assign({ id, k: "sc", q, lo, hi }, x);
  const any = (id, q, opts, x) => Object.assign({ id, k: "ck", q, opts }, x);
  const one = (id, q, opts, x) => Object.assign({ id, k: "one", q, opts }, x);
  const say = (q, p, x) => Object.assign({ k: "say", q, p }, x);
  const breathe = (q, secs, x) => Object.assign({ k: "br", q, secs }, x);
  const is = (id, ...v) => a => v.includes(a[id]);
  const has = (id, ...v) => a => v.some(x => (a[id] || []).includes(x));
  const wrote = id => a => a[id] != null && String(a[id]).trim() !== "";
  const both = (...fs) => a => fs.every(f => f(a));
  IW.fb = { ask, short, rate, any, one, say, breathe, is, has, wrote, both };
  const F = IW.flows = {};

  /* ================= Foundations ================= */

  F.f1 = [
    ask("why", "What made you start this now? What has been hardest lately?", { p: "Start anywhere. The first thing that comes is usually the right one.", s: "What brought you here" }),
    ask("longest", "How long has it been like this? What was happening in your life when it began, or got worse?", { echo: "why" }),
    ask("costs", "What is it costing you?", { echo: "why", p: "Sleep, work, people, your body, the things you used to enjoy, how you see yourself." }),
    ask("tried", "What have you already tried? Include what helped a little, even if it didn't last.", { p: "This matters. It shows what your mind and body already respond to." }),
    say("You have already been working on this.", "Whatever you just wrote, you have been coping with something hard for a while, using whatever you had. This program adds method to an effort you were already making."),
    ask("miracle", "Suppose you woke up tomorrow and this had worked. What is the first small thing you would notice was different? What would you be doing that you aren't doing now?", { p: "Small and visible: something another person could see you do.", s: "How you'd know it had worked" }),
    ask("others", "Who would notice first, and what would they see?", { echo: "miracle" }),
    ask("goals", "Now turn that into three goals, written as things you would see yourself doing.", { echo: "miracle", p: "For example: 'sleep through most nights', 'say no without days of guilt', 'get through a bad day without it becoming a bad week'.", s: "Your goals" }),
    rate("now", "Where are you today, if 0 is the worst it has been and 10 is where you want to be?", "the worst it's been", "where I want to be", { s: "Where you started (0–10)" }),
    ask("holds", a => a.now >= 1 ? `You said ${a.now}, not 0. What is already in place that keeps it from being lower?` : "Even at 0, you are here, doing this. What has got you through so far?", { p: "People, habits, stubbornness, a reason to keep going. Whatever it is, it is working for you and worth knowing about.", s: "What already holds you up" }),
    ask("plus1", "What would one point higher look like? Just one.", { p: "Not the goal. The next notch.", s: "One point higher looks like" }),
    one("ready", "How confident are you that you can make room for one or two sessions a week?", [["yes", "Confident"], ["some", "I'll try, but life gets in the way"], ["low", "Honestly, not very"]]),
    ask("barrier", "What is most likely to stop you, and what would make it easier?", { when: is("ready", "some", "low"), p: "A fixed time. Somewhere private. Telling one person. Doing half a session and stopping." })
  ];

  F.f2 = [
    say("Pick one recent moment.", "Choose one time in the last week or so when your mood dropped or spiked. Small is fine: a comment, a message, a silence, a look in the mirror. One moment, not the whole problem."),
    ask("situation", "What happened? Just the facts: where, when, who.", { p: "What a camera would have recorded. No interpretation yet.", need: true, s: "The moment" }),
    ask("thoughts", "What went through your mind right then? Words or images.", { echo: "situation", p: "As crude as it really was. 'Here we go again.' 'She thinks I'm useless.'", s: "What went through your mind" }),
    short("feelings", "What did you feel, and how strong was it from 0 to 10?", { echo: "thoughts", s: "What you felt" }),
    short("body", "Where did it show up in your body?", { p: "Chest, throat, stomach, jaw, shoulders, heat, heaviness, going numb." }),
    ask("did", "What did you do next, or not do?", { p: "Went quiet, snapped, scrolled, ate, cancelled, cleaned, apologised, pushed on as if nothing had happened.", s: "What you did" }),
    ask("relief", "What did that give you in the short term?", { echo: "did", p: "There is always something: relief, safety, not having to feel it, not having to risk anything." }),
    ask("cost", "And what did it cost you later that day, or since?", { echo: "did", p: "If it honestly cost nothing, say so. Not every response is a problem.", s: "What it cost" }),
    one("familiar", "Is this a one-off, or a loop you recognise?", [["often", "I do this a lot"], ["some", "Sometimes"], ["once", "It was a one-off"]]),
    ask("pattern", "Where else does the same loop run? Give one other example.", { when: is("familiar", "often", "some"), s: "Where else the loop runs" }),
    ask("early", "How far back does it go? When is the earliest you remember responding this way?", { when: is("familiar", "often", "some"), p: "A rough age is enough. You'll come back to this later in the program." }),
    one("link", "Look at the five parts: the situation, the thought, the feeling, the body, what you did. Which looks most possible to change next time?", [["thought", "What I told myself"], ["body", "What happened in my body"], ["did", "What I did"], ["situation", "The situation itself"], ["none", "None of it looks changeable right now"]]),
    ask("change", "If a friend were in that exact situation, what would you want them to tell themselves?", { when: is("link", "thought"), echo: "thoughts", s: "What you could change next time" }),
    ask("change", "What could you do for your body in that moment?", { when: is("link", "body"), echo: "body", p: "Slow the out-breath. Unclench your jaw and hands. Step outside. Cold water.", s: "What you could change next time" }),
    ask("change", "What could you do instead next time, that would cost you less? Make it small.", { when: is("link", "did"), echo: "did", s: "What you could change next time" }),
    ask("change", "What part of the situation is yours to change, and what is the first step?", { when: is("link", "situation"), echo: "situation", s: "What you could change next time" }),
    say("That is an honest answer.", "Seeing the loop comes first. Changing it comes later, and you don't need to force it. For now the only job is to notice the loop while it is happening.", { when: is("link", "none") })
  ];

  F.f3 = [
    say("Rate each one honestly.", "Low scores are information, not a verdict. Go on gut feeling."),
    rate("sleep", "Sleep: how well is it working?", "badly", "well"),
    rate("move", "Movement: how much is your body getting?", "none", "plenty"),
    rate("food", "Eating: regularly, and enough?", "chaotic", "steady"),
    rate("alcohol", "Alcohol and other substances: how much of a problem are they?", "a real problem", "no problem"),
    rate("light", "Daylight and time outside", "none", "plenty"),
    rate("people", "Real contact with people", "none", "plenty"),
    one("lever", "Which one will you start with? Pick one that is low and that you could actually move this week.", [["sleep", "Sleep"], ["move", "Movement"], ["food", "Eating"], ["alcohol", "Alcohol or other substances"], ["light", "Daylight"], ["people", "Contact with people"]], { s: "The lever you chose" }),
    ask("lnow", "What does it look like at the moment, on an ordinary day?", { p: "Plain description. No shoulds." }),
    say("For sleep, one thing matters more than the rest.", "A fixed getting-up time, seven days a week, whatever kind of night you had. It is the anchor your body clock sets itself by. Bedtime looks after itself once the morning is fixed, and daylight within an hour of waking helps it lock in.", { when: is("lever", "sleep") }),
    say("For movement, the dose is smaller than you think.", "Ten minutes of walking counts, and it changes mood on the day you do it. It works whether or not you enjoy it. The usual mistake is a plan that needs a good day to carry out.", { when: is("lever", "move") }),
    say("For eating, regular beats perfect.", "Long gaps drop your blood sugar, and low blood sugar can feel a lot like anxiety and irritability. Three meals at roughly fixed times, with some protein in the first, steadies more mood than most people expect.", { when: is("lever", "food") }),
    say("For alcohol, look at the next day.", ["It takes the edge off for a couple of hours and tends to put it back, sharper, in the small hours and the next day. You don't have to decide anything permanent. A two-week experiment shows you what it is really doing to your mood and sleep.", "If you drink heavily every day, don't stop suddenly. Talk to a doctor first, because withdrawal can be dangerous."], { when: is("lever", "alcohol") }),
    say("For daylight, timing matters most.", "Ten to twenty minutes outside within an hour or two of waking, even under cloud, does more for mood and sleep than the same time later in the day. Light through a window counts for much less.", { when: is("lever", "light") }),
    say("For contact, small and regular beats big and rare.", "A two-line message. A five-minute call. Staying a minute longer at the counter. Low mood says you would be a burden; treat that as a symptom, not as information.", { when: is("lever", "people") }),
    ask("one", "The one small change you'll make. Make it almost too easy.", { p: "If you wouldn't do it on a bad day, halve it.", s: "Your small change" }),
    short("when", "When and where exactly? 'After I ___, I will ___.'", { echo: "one", s: "When you'll do it" }),
    rate("conf", "How confident are you that you'll do it most days this week?", "not at all", "certain"),
    ask("smaller", "Under 7 usually means it is still too big. What is the version you are 9 out of 10 sure you would do?", { when: a => a.conf != null && a.conf < 7, echo: "one", s: "The smaller version" })
  ];

  const fearWhen = is("family", "fear"), angerWhen = is("family", "anger"), sadWhen = is("family", "sad"), shameWhen = is("family", "shame"), numbWhen = is("family", "numb"), goodWhen = is("family", "good"), hardWhen = a => a.family && a.family !== "good";
  F.f4 = [
    any("felt", "Think back over the last week. Which of these did you feel?", ["sad", "hopeless", "lonely", "hurt", "disappointed", "anxious", "scared", "overwhelmed", "angry", "resentful", "irritable", "guilty", "ashamed", "jealous", "numb", "empty", "tired", "calm", "content", "hopeful", "proud", "loved", "grateful", "interested"]),
    short("strongest", "Which one was strongest, or came up most?", { echo: "felt", need: true, s: "The strongest feeling this week" }),
    ask("moment", "Take one moment when you felt it. What was happening?", { echo: "strongest" }),
    short("where", "Where do you feel it in your body, and what is it like there?", { p: "Tight, hot, heavy, hollow, buzzing, a lump, a weight." }),
    one("family", "Which family does it belong to?", [["fear", "Fear: anxious, scared, dread, overwhelmed"], ["anger", "Anger: angry, resentful, irritable, jealous"], ["sad", "Sadness: sad, hopeless, lonely, hurt, disappointed"], ["shame", "Guilt or shame"], ["numb", "Numb, empty or worn out"], ["good", "A good one: calm, content, hopeful, proud, loved, grateful"]], { echo: "strongest" }),
    ask("message", "Fear says: danger. What was it warning you about? Is that danger real, likely and happening now, or is it a 'what if'?", { when: fearWhen, echo: "moment", s: "What the feeling was telling you" }),
    ask("message", "Anger says: a line was crossed, or a need of yours is being ignored. Which line, or which need?", { when: angerWhen, echo: "moment", s: "What the feeling was telling you" }),
    ask("message", "Sadness says: something was lost, or is missing. What is it?", { when: sadWhen, echo: "moment", s: "What the feeling was telling you" }),
    ask("message", "First tell them apart. Guilt says 'I did something wrong'. Shame says 'there is something wrong with me'. Which is this, and what is it about?", { when: shameWhen, echo: "moment", s: "What the feeling was telling you" }),
    ask("message", "Numbness is your system turning the volume down. If it weren't there, what do you think you would be feeling?", { when: numbWhen, echo: "moment", s: "What the feeling was telling you" }),
    ask("message", "What brought it? Be exact about what you were doing, where, and with whom.", { when: goodWhen, echo: "moment", s: "What brought the good feeling" }),
    ask("urge", "What did it make you want to do? And what did you actually do?", { when: a => ["fear", "anger", "sad"].includes(a.family), p: "Feelings come with an urge attached: get away, hit back, withdraw, reach for someone." }),
    ask("urge", "If it is guilt: what would putting it right look like? If it is shame: whose voice is it, and how old were you when you first heard it?", { when: shameWhen }),
    ask("urge", "What was happening just before you went numb? What might have been too much?", { when: numbWhen }),
    ask("urge", "How could you have a little more of that this week?", { when: goodWhen, s: "How to have more of it" }),
    ask("under", "Is there another feeling underneath it?", { when: hardWhen, p: "Anger often sits over hurt or fear. Anxiety can sit over grief, or over anger you weren't allowed to have. Take a moment before you answer.", s: "What was underneath" }),
    ask("need", "What did that feeling need, from you or from someone else?", { when: hardWhen, p: "Comfort. Rest. A limit. To be taken seriously. To be said out loud. Company.", s: "What it needed" }),
    ask("allowed", "Which feelings were allowed in the house you grew up in, and which were not?", { p: "It shapes which ones you can name easily now, and which ones go underground." })
  ];

  F.f5 = [
    ask("hyper", "How do you know when you've gone above the zone? Your personal signs.", { p: "Body, thoughts and behaviour: racing heart, snapping, can't sit still, talking fast, checking.", s: "Signs you're above the zone" }),
    ask("hypo", "How do you know when you've dropped below it?", { p: "Flat, foggy, heavy, far away, can't start anything, staring at your phone.", s: "Signs you're below it" }),
    one("more", "Which do you go to more often?", [["up", "Above: wound up, anxious, angry"], ["down", "Below: flat, numb, shut down"], ["both", "Both, sometimes in the same day"]]),
    ask("sends", "What tends to send you there?", { p: "People, places, times of day, kinds of situation, being tired or hungry." }),
    rate("before", "Now try it. First: how tense are you right now?", "calm", "very tense"),
    breathe("Slow breathing: in for 4, out for 6. Let the out-breath be long and unforced.", 120),
    rate("after", "And now?", "calm", "very tense"),
    say("It moved.", "You just changed your own state on purpose, through your body, in two minutes. That is the whole principle of this session, and it gets stronger with practice.", { when: a => a.before != null && a.after != null && a.after < a.before }),
    say("It didn't move this time.", "That is common the first few times, especially if watching your breath makes you self-conscious or more anxious. Other doors work as well: cold water on your face, pressing your feet into the floor, a long slow sigh, humming. Try one of those this week instead.", { when: a => a.before != null && a.after != null && a.after >= a.before }),
    ask("calmers", "Three things that reliably bring you down when you're wound up", { s: "What calms you" }),
    ask("lifters", "Three things that reliably wake you up when you're flat", { p: "Movement, cold water, strong tastes, music with a beat, stepping outside.", s: "What lifts you" }),
    ask("early", "What is the earliest sign you could catch, before you are fully out of the zone?", { echo: ["hyper", "hypo"], p: "The earlier you catch it, the less it takes to come back.", s: "Your earliest sign" })
  ];

  /* ================= Menopause and hormone shifts ================= */

  F.m1 = [
    any("symptoms", "What have you noticed?", ["hot flushes", "night sweats", "waking at 3–4am", "new anxiety", "dread on waking", "panic", "palpitations", "low mood", "sudden tears", "rage or irritability", "brain fog", "word-finding trouble", "exhaustion", "loss of confidence", "loss of libido", "aches", "feeling unlike myself"]),
    short("started", "Roughly when did this start?"),
    ask("worst", "Which of these is hardest to live with, and what does it stop you doing?", { echo: "symptoms", s: "The hardest symptoms" }),
    ask("pattern", "Any pattern?", { p: "Time of the month, time of day, after alcohol, after poor sleep, after stress.", s: "Patterns you've noticed" }),
    one("history", "Have you had depression, bad PMS, or low mood after a birth before?", [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]]),
    say("That matters, and it isn't your fault.", "People whose mood has been sensitive to hormone shifts before are more likely to be hit hard by this one. Tell your doctor: it changes what they should offer you.", { when: is("history", "yes") }),
    ask("blame", "What have you been blaming yourself for that might partly be hormonal?", { p: "Snapping. Forgetting. Losing confidence. Not coping the way you used to.", s: "What you've been blaming yourself for" }),
    ask("other", "And what else is going on in your life right now that would weigh on anyone?", { p: "Both can be true. Hormones lower the threshold, and life supplies the load." }),
    one("doctor", "Have you talked to a doctor about this?", [["yes", "Yes, and it helped"], ["dismissed", "Yes, and I was brushed off"], ["no", "Not yet"]]),
    say("Being brushed off is common, and it is not the end of the road.", "You are entitled to ask for a doctor with an interest in menopause, or for a menopause clinic. Going in with a written list of symptoms and what they do to your life, which you are building here, makes it much harder to be dismissed.", { when: is("doctor", "dismissed") }),
    ask("ask", "Questions you want to ask a doctor", { p: "You'll bring these back in session 4.", s: "Questions for the doctor" })
  ];

  const flushYes = is("flush", "yes"), sleepBad = a => a.sleepkind && a.sleepkind !== "fine";
  F.m2 = [
    one("flush", "Do you get hot flushes or night sweats?", [["yes", "Yes"], ["no", "No, or hardly ever"]]),
    ask("triggers", "What tends to set one off?", { when: flushYes, p: "Heat, stress, alcohol, caffeine, spicy food, rushing, a warm room." }),
    ask("thoughts", "What goes through your mind during one?", { when: flushYes, p: "'Everyone can see.' 'I can't cope.' 'Not again.'", s: "What you think during a flush" }),
    ask("calmer", "Read that back. What is a calmer thing to say to yourself that is also true?", { when: flushYes, echo: "thoughts", p: "For example: 'This is a flush. It peaks and passes in a few minutes. Nobody is looking as closely as I think.'", s: "Your calmer line" }),
    one("sleepkind", "Now sleep. Which is closest?", [["onset", "I can't get to sleep"], ["wake", "I wake in the night and can't get back"], ["early", "I wake too early"], ["sweats", "Sweats wake me"], ["fine", "Sleep is mostly fine"]]),
    ask("mind3", "When you're awake in the night, what does your mind do?", { when: sleepBad, p: "What it goes over, and what it tells you about tomorrow." }),
    say("For trouble getting to sleep", "Go to bed only when you're sleepy, not when the clock says. Keep a wind-down hour with dim light and nothing that asks anything of you. If you are still awake after about twenty minutes, get up and do something dull in low light until you're sleepy. The bed has to become the place where sleep happens, not the place where you lie and worry.", { when: is("sleepkind", "onset") }),
    say("For waking in the night", "Don't look at the clock: the arithmetic wakes you further. If you are awake for about twenty minutes, get up, keep the lights low, do something dull, and go back when sleepy. Nothing gets solved at 3am, so write the thought down for the morning and let it wait. Keep your getting-up time fixed even after a bad night. That is what rebuilds the pressure to sleep.", { when: is("sleepkind", "wake", "early") }),
    say("For night sweats", "Keep the room cool, use layers you can throw off, and have a dry top, a cold drink and a towel by the bed. Alcohol in the evening reliably makes them worse. If they wake you most nights, that is a strong reason to have the treatment conversation with a doctor.", { when: is("sleepkind", "sweats") }),
    ask("night", "Your night plan: what's by the bed, and what you'll do if you are awake more than twenty minutes", { when: sleepBad, s: "Your night plan" }),
    ask("evening", "What in your evenings is working against your sleep, and which one thing will you change?", { when: sleepBad, p: "Alcohol. Caffeine after midday. Screens in bed. Working late. A warm bedroom." }),
    short("wake", "Your fixed getting-up time, every day", { s: "Getting-up time" })
  ];

  const pt = (...v) => is("point", ...v);
  F.m3 = [
    say("Use one recent surge.", "A time in the last couple of weeks when rage, tears or dread arrived faster and bigger than the moment seemed to deserve."),
    one("kind", "Which was it?", [["rage", "Rage or snapping"], ["tears", "Sudden tears"], ["dread", "Dread or panic"], ["mix", "A mix"]]),
    ask("surge", "What happened? What set it off, and what did you do?", { need: true, s: "The surge" }),
    ask("after", "What did you feel about yourself afterwards?", { echo: "surge", p: "Guilt, shame, fear that you are losing yourself. Say it plainly." }),
    say("The surge is chemistry. What it lands on is usually real.", "Hormone swings lower the threshold, so things you used to absorb now tip you over. That doesn't make the thing you reacted to imaginary. The next question is about what was underneath."),
    one("point", "Looking back with a cool head, what was it pointing at?", [["load", "Too much on me, for too long"], ["need", "A need of mine that keeps going unmet"], ["limit", "A line someone crossed"], ["loss", "A loss, or something I'm grieving"], ["fear", "A fear about what is coming"], ["none", "Nothing I can find. It felt purely physical"]], { echo: "surge", s: "What it was pointing at" }),

    ask("under", "What have you been carrying? List it, including the things nobody sees you do.", { when: pt("load"), s: "What was underneath" }),
    ask("tolerating", "How long has it been like this, and who knows how much it is?", { when: pt("load"), echo: "under" }),
    ask("drop", "Is there one thing on that list you could put down, share, or do less well? If there truly isn't, say so.", { when: pt("load"), echo: "under", s: "What you could put down" }),

    ask("under", "What is the need? Say it in a plain sentence: 'I need ___.'", { when: pt("need"), s: "What was underneath" }),
    ask("tolerating", "How long have you been going without it, and what have you done instead of asking?", { when: pt("need"), echo: "under" }),
    ask("say", "Who would you have to say it to, and what exact words would you use?", { when: pt("need"), echo: "under", s: "What you want to say" }),

    ask("under", "What was the line, and who crossed it?", { when: pt("limit"), s: "What was underneath" }),
    ask("tolerating", "Had you been putting up with it before this? For how long?", { when: pt("limit"), echo: "under" }),
    ask("say", "What do you want to say about it now that you're calm? One or two sentences, with no apology for having a limit.", { when: pt("limit"), echo: "under", s: "What you want to say" }),

    ask("under", "What is the loss?", { when: pt("loss"), p: "A person, a role, your younger body, the way things were, a future you'd expected.", s: "What was underneath" }),
    ask("tolerating", "Has it had any room, or have you mostly been getting on with things?", { when: pt("loss"), echo: "under" }),
    say("This one isn't a problem to solve.", "Tears that come from nowhere are often grief that hasn't been given a time and a place. It doesn't need fixing, dropping or handing to anyone. It needs room.", { when: pt("loss") }),
    ask("say", "Where and when this week could you give it twenty minutes on purpose? And who could know about it?", { when: pt("loss"), s: "Room for the grief" }),

    ask("under", "What is the fear? Say the worst version.", { when: pt("fear"), s: "What was underneath" }),
    ask("tolerating", "Is there anything in it you can act on now, or is it a 'what if' that no amount of thinking will settle?", { when: pt("fear"), echo: "under" }),
    ask("say", "What would you want someone steady to say to you about it? Write that.", { when: pt("fear"), echo: "under", s: "What a steady voice would say" }),

    say("Sometimes it is just the chemistry.", "Not every surge has a message. If you have looked and found nothing, treat it like weather: name it, breathe, let it pass, and don't make decisions inside it. It is still worth telling your doctor how often it happens.", { when: pt("none") }),

    ask("plan", "Next time a surge starts, what will you do in the first minute?", { p: "Name it ('this is a surge'). Drop your shoulders. Breathe out slowly. Leave the room if you can. Say nothing for twenty minutes.", s: "Your first-minute plan" }),
    ask("repair", "Is there anything from the last surge that needs repairing with someone? What would you say?", { when: is("kind", "rage", "mix"), p: "A repair is short: what you did, that it wasn't okay, and what was really going on. It doesn't cancel the point you were making." }),
    one("fogq", "Separately: is brain fog a problem for you?", [["yes", "Yes"], ["no", "Not really"]]),
    ask("fog", "What will you put in place for it?", { when: is("fogq", "yes"), p: "Lists, phone alarms, one place for keys, one thing at a time. And dropping the idea that you hold everything in your head for everyone.", s: "What you'll do about fog" })
  ];

  F.m4 = [
    say("Two parts today.", "First the bigger picture: what this chapter is taking, and what it might be giving. Then your notes for the doctor."),
    ask("grieving", "What are you grieving in this change?", { p: "Fertility, a familiar body, how the world looked at you, a role, energy, certainty. It counts even if you didn't want more children and don't miss being looked at.", s: "What you're grieving" }),
    ask("room", "Has that grief had any room, or have you mostly got on with things?", { when: wrote("grieving"), echo: "grieving" }),
    ask("done", "What are you done with?", { p: "Things you no longer have the patience to tolerate, explain or apologise for.", s: "What you're done with" }),
    ask("more", "What do you want more of in this next stretch of life?", { s: "What you want more of" }),
    ask("story", "What story were you handed about women your age? Who told it?"),
    ask("mine", "And the story you choose instead?", { echo: "story", s: "The story you choose" }),
    ask("first", "What is one thing you could do this week that belongs to that chapter?", { echo: "mine" }),
    ask("top3", "Now the doctor. Your three most troublesome symptoms, and how each affects daily life.", { echo: "m1.worst", p: "Be concrete. 'I wake at 3am four nights a week and can't work properly the next day' lands better than 'poor sleep'.", s: "For the doctor: top three" }),
    ask("questions", "Your questions for the doctor", { echo: "m1.ask", p: "Include: what are my options, hormonal and non-hormonal? What are the benefits and risks for me in particular? What happens if we do nothing?", s: "For the doctor: questions" }),
    one("booked", "Is the appointment booked?", [["yes", "Yes"], ["no", "Not yet"], ["wont", "I'm not going to, for now"]]),
    ask("stops", "What is in the way of booking it?", { when: is("booked", "no") })
  ];

  /* ================= Intense emotions and personality patterns ================= */

  F.e1 = [
    ask("shows", "How does emotional sensitivity show up for you? Give a recent example.", { s: "How sensitivity shows up" }),
    one("speed", "Which is most true of your feelings?", [["fast", "They arrive fast, before I can think"], ["big", "They hit harder than other people's seem to"], ["long", "They take a long time to settle"], ["all", "All three"]]),
    ask("messages", "What were you told about your feelings when you were growing up?", { p: "'You're overreacting.' 'Stop crying.' 'Don't be so sensitive.' 'You're too much.' Or nothing at all, which is its own message.", s: "What you were told about your feelings" }),
    ask("who", "Who said it, or showed it? And how did you learn to cope with that?", { echo: "messages" }),
    say("That is how a sensitive child learns to distrust their own feelings.", "If your feelings were treated as wrong, nobody taught you what to do with them. You were taught to hide them, doubt them, or hold them in until they burst. None of that was a flaw in you. It was a missing lesson, and it can be learned now."),
    ask("at9", "What do you tend to do when an emotion hits 9 out of 10?", { p: "Explode, shut down, cry, leave, send the message, eat, drink, hurt yourself, go silent for days.", s: "What you do at 9 out of 10" }),
    ask("gives", "What does that do for you in the moment?", { echo: "at9", p: "It does something, or you wouldn't do it. Relief, release, being heard at last, making it stop." }),
    ask("cost", "And what does it cost you afterwards?", { echo: "at9" }),
    ask("valid", "Now validate it. Finish this: 'It makes sense that I ___, because ___.'", { echo: "at9", p: "Validating isn't approving. It is seeing that your reaction has a history.", s: "It makes sense because" }),
    ask("feel", "How is it to read that sentence back?", { echo: "valid" })
  ];

  F.e2 = [
    ask("urges", "When it's unbearable, what do you get the urge to do?", { p: "Write the real list. Nobody reads this but you.", s: "Your urges" }),
    one("harm", "Do any of those urges involve hurting yourself?", [["no", "No"], ["past", "In the past, not now"], ["yes", "Yes, sometimes"]]),
    say("Thank you for saying so.", ["Urges to hurt yourself are a way of managing pain that has got too big. They deserve a real person's attention as well as a plan. Please tell a doctor or therapist, and write your safety plan today.", "Everything in this session applies to those urges too. If you are in danger of acting on one right now, stop here and use Help now."], { when: is("harm", "yes", "past"), links: [["#/safety", "Write my safety plan"], ["#/crisis", "Help now"]] }),
    ask("signs", "What are your early warning signs that a storm is building?", { p: "The earlier you catch it, the more choices you have. Body first, then thoughts, then behaviour.", s: "Early warning signs" }),
    ask("last", "Think of the last storm. At what point could you still have turned it?"),
    any("body", "Which body resets will you use?", ["cold water on face", "ice in hands", "run or stairs", "star jumps", "slow breathing", "tense and release muscles", "cold shower"], { p: "These act on your chemistry directly, in under a minute. Check with a doctor before using cold water on your face if you have a heart condition.", s: "Your body resets" }),
    ask("soothe", "Something soothing for each sense: see, hear, smell, taste, touch", { s: "Soothing for each sense" }),
    short("contact", "Who can you contact, and what would you say?", { p: "It can be as short as: 'Having a bad one. Can you talk for five minutes?'", s: "Who you can contact" }),
    ask("pros", "Take your strongest urge. Acting on it: what does it get you an hour later, and a week later? Riding it out: an hour later, and a week later?", { echo: "urges", s: "Acting on it versus riding it out" }),
    ask("where", "Where will you keep this kit so that you can find it at 9 out of 10?", { p: "A note on your phone's home screen. A card in your wallet. A box by the bed." })
  ];

  const fitNo = is("fit", "no", "big"), fitYes = is("fit", "yes");
  F.e3 = [
    say("Use one emotion from the last few days.", "One that was too big for the moment, or that lasted too long."),
    short("emotion", "Which emotion, and how strong from 0 to 10?", { need: true, s: "The emotion" }),
    ask("facts", "What happened, as a camera would have recorded it?", { p: "Only what could be seen and heard. No motives, no 'always', no adjectives.", s: "The facts" }),
    ask("meaning", "And what did you make it mean?", { echo: "facts", p: "About you, about them, about what happens next.", s: "What you made it mean" }),
    one("fit", "Put the facts beside the feeling. Does the emotion fit the facts?", [["no", "No. It fits what I made it mean, not what happened"], ["big", "The kind of feeling fits, but it's much stronger than the facts warrant"], ["yes", "Yes. It fits, and so does its strength"]], { echo: ["emotion", "facts"] }),
    short("urge", "What did the emotion push you to do?", { s: "What it pushed you to do" }),
    say("Then this is one for opposite action.", "When a feeling doesn't fit the facts, obeying it keeps it alive. Doing the opposite, fully, with your body and face as well as your actions, is what brings it down. It feels wrong at first. That is how you know you're doing it.", { when: fitNo }),
    ask("opposite", "What is the opposite of what it pushed you to do? Describe doing it fully.", { when: fitNo, echo: "urge", p: "Fear says avoid: approach. Sadness says withdraw: get active. Anger says attack: step back and be decent. Unearned shame says hide: stay visible.", s: "The opposite action" }),
    say("Then the feeling is doing its job.", "An emotion that fits the facts is accurate information. Arguing with it, or doing the opposite, would be the wrong move. The question becomes what it is pointing at.", { when: fitYes }),
    one("can", "Can the thing it is pointing at be changed?", [["yes", "Yes, at least partly"], ["no", "No. It is what it is"]], { when: fitYes, echo: "facts" }),
    ask("solve", "What is the problem, and what is the first step toward solving it?", { when: both(fitYes, is("can", "yes")), s: "The problem and the first step" }),
    ask("carry", "Then the feeling has nowhere to go but through. What would help you carry it? Who could know, and what would be kind to yourself while it's here?", { when: both(fitYes, is("can", "no")), p: "A feeling that fits a painful fact you can't change isn't a problem. It is pain, and it needs company and time, not a fix.", s: "How you'll carry it" }),
    ask("next", "When is this emotion likely to come up next, and what will you do then?")
  ];

  F.e4 = [
    ask("situation", "Pick a situation where your mind went to one extreme. What happened?", { need: true }),
    ask("extremes", "What were the two boxes your mind offered?", { echo: "situation", p: "'Either I'm a failure or I'm fine.' 'Either they love me or they don't care.'", s: "The two extremes" }),
    ask("did", "Which box did you end up in, and what did you do from there?", { echo: "extremes" }),
    ask("both", "Now write a 'both… and…' sentence that is truer than either.", { echo: "extremes", p: "'I made a mistake and I'm competent.' 'She hurt me and she loves me.' 'This is hard and I can handle it.'", s: "Both… and…" }),
    ask("loosens", "Read it twice. What loosens? Or what do you want to argue with?", { echo: "both" }),
    breathe("Now find wise mind. Breathe slowly for a minute and let the question 'what do I know to be true here?' sit, without chasing an answer.", 60),
    ask("wise", "What does your wise mind say about this situation?", { echo: "situation", p: "It is usually quiet, short and undramatic.", s: "What wise mind says" }),
    ask("three", "Three more 'and' statements about your life right now", { p: "One about yourself, one about someone close, one about the future.", s: "Three more 'and' statements" })
  ];

  F.e5 = [
    ask("situation", "Pick one real conversation you need to have. With whom, and about what?", { need: true, s: "The conversation" }),
    one("goal", "What matters most in this conversation?", [["get", "Getting what I'm asking for"], ["rel", "Keeping the relationship good"], ["respect", "Keeping my self-respect"]], { echo: "situation", p: "All three matter. Knowing which comes first tells you how hard to push and when to stop." }),
    ask("fear", "What are you afraid will happen if you say it?", { p: "This is usually what has stopped you so far." }),
    ask("describe", "Describe: just the facts, as a camera would have them", { s: "Describe" }),
    ask("express", "Express: 'I feel…'", { p: "A feeling word. Not 'I feel that you…'", s: "Express" }),
    ask("assert", "Assert: 'I would like…' or 'No, I won't…'", { p: "One clear sentence. No hinting.", s: "Assert" }),
    ask("reinforce", "Reinforce: why this is good for them, or for you both", { s: "Reinforce" }),
    ask("no", "What will you do if they say no, change the subject, or get angry?", { echo: "assert", p: "The skill is the broken record: calmly repeat your one sentence, and don't follow them into side arguments." }),
    ask("boundary", "Is there a boundary here? Write it as what you will do: 'If ___, I will ___.'", { p: "A boundary is not a rule for them. It is a statement about you, and you have to be willing to carry it out.", s: "Your boundary" }),
    ask("whenwhere", "When and where will you have it? And what smaller version could you do first, if the full one is too much?", { s: "When you'll have it" })
  ];

  F.e6 = [
    ask("true", "What stays true about you in every mood and with every person?", { p: "Small things count. 'I notice when someone's left out.' 'I can't stand unfairness.'", s: "What stays true about you" }),
    ask("like", "What do you actually like and dislike? Not what you think you should.", { p: "Food, music, places, kinds of people, ways of spending a Sunday." }),
    ask("roles", "Which roles do you play to be accepted?", { p: "The easy one. The strong one. The funny one. The helper. The one with no needs.", s: "Roles you play" }),
    ask("rolecost", "Take the one you play most. What would happen if you put it down with one safe person?", { echo: "roles" }),
    ask("alone", "What happens in you when you are alone, with nothing to do and nobody to be something for?"),
    ask("values", "Five qualities you want to stand for", { p: "Honest, kind, brave, curious, steady, fair, playful, loyal, independent.", s: "What you want to stand for" }),
    ask("act", "Pick one of them. What is one thing you'll do this week because of it?", { echo: "values", s: "How you'll act on it" }),
    say("And the one who has been watching all of this.", "Every mood you've had and every role you've played, something in you noticed it. That noticing part hasn't changed since you were small. When you don't know who you are, you can stand there: 'I am the one who is aware of this.'"),
    ask("observer", "Sit for a moment as the one who notices. What do you see about yourself from there?")
  ];

  /* ================= Low mood and depression ================= */

  F.d1 = [
    ask("stopped", "What have you stopped doing since your mood dropped?", { p: "Hobbies, seeing people, exercise, cooking, looking after things, looking after yourself.", s: "What you've stopped doing" }),
    ask("day", "Describe an ordinary day right now, from waking to sleep.", { p: "Roughly, by the hour. No judgement. This is the baseline." }),
    ask("better", "Is there any part of the day or week that is slightly less bad? What are you doing then?", { echo: "day", s: "When it's slightly less bad" }),
    ask("pleasure", "Small things that used to give you pleasure", { p: "Ten minutes counts. A bath, a particular coffee, a song, the garden, a programme." }),
    ask("mastery", "Small things that give a sense of having done something", { p: "One drawer. One email. Clean sheets. A short walk." }),
    ask("connect", "Small ways to be in contact with people", { p: "A message. A five-minute call. Saying yes to one thing." }),
    ask("plan", "Choose three, one of each kind, and give each a day and a time.", { echo: ["pleasure", "mastery", "connect"], lead: "Your lists", s: "This week's three activities" }),
    rate("predict", "How much do you predict you'll get out of them?", "nothing", "a lot", { s: "Your prediction (0–10)" }),
    say("Hold on to that number.", "A low mood always predicts low. The experiment is to do the three things anyway, rate your mood before and after each one, and compare it with what you predicted. You are testing the depression's forecast. You are not trying to feel wonderful."),
    ask("mind", "What will your mind say to talk you out of it when the time comes?", { p: "'I'm too tired.' 'What's the point.' 'I'll do it when I feel better.'" }),
    ask("answer", "And what will you say back?", { echo: "mind", p: "For example: 'I don't have to want to. I only have to start, and I can stop after five minutes.'", s: "What you'll say back" })
  ];

  F.d2 = [
    ask("situation", "Take the most recent time your mood dropped. What was happening just before?", { need: true, s: "The situation" }),
    short("feeling", "What did you feel, and how strong from 0 to 10?"),
    ask("thoughts", "What was going through your mind? Write the thoughts word for word.", { echo: "situation", p: "As crude as they really were. If it was an image, describe it." }),
    ask("deeper", "If those thoughts were true, what would that say about you, about other people, or about your future?", { echo: "thoughts", p: "The first thoughts are often the surface. The one that hurts is usually underneath." }),
    ask("hot", "Now pick the one thought that carries most of the pain. Write it as a single sentence.", { echo: ["thoughts", "deeper"], need: true, s: "The hot thought" }),
    rate("believe", "How much do you believe it right now?", "not at all", "completely", { echo: "hot" }),
    ask("familiar", "Is this thought new, or an old one? When did you first think it about yourself?", { echo: "hot" }),
    ask("effect", "When you believe it, what do you do, and how do you treat yourself?", { echo: "hot", s: "What believing it does" }),
    say("You don't have to argue with it yet.", "Today's skill is only catching the thought and seeing it written down as a sentence, outside your head. That alone starts to change your relationship with it. Next session puts it on trial.")
  ];

  const isFact = is("type", "fact");
  F.d3 = [
    ask("hot", "The hot thought you want to work on", { echo: "d2.hot", p: "Use the one from last session, or a new one. One sentence.", need: true, s: "The thought on trial" }),
    one("type", "What kind of thought is it?", [["judge", "A judgement about me ('I'm a failure')"], ["predict", "A prediction ('it will go badly', 'it will never change')"], ["mind", "What I think someone else thinks of me"], ["fact", "A plain fact that hurts ('he left', 'she is ill', 'it happened')"]], { echo: "hot" }),
    say("A fact isn't a thinking trap, and you won't be asked to argue with it.", "When what hurts is simply true, the pain fits, and it needs room, not a rebuttal. What can be examined is what you tell yourself the fact means: about you, about your worth, about what is possible now. That part is a thought.", { when: isFact }),
    ask("meaning", "What do you tell yourself that fact means about you, or about your future?", { when: isFact, echo: "hot", p: "'He left, so I'm unlovable.' 'I'm ill, so my life is over.' That sentence is the one that goes on trial.", need: true, s: "What you make the fact mean" }),
    any("traps", "Which thinking traps is it caught in?", ["all-or-nothing", "catastrophising", "mind-reading", "fortune-telling", "emotional reasoning", "shoulds", "labelling", "dismissing the good", "taking the blame", "seeing only the bad"], { echo: ["hot", "meaning"], lead: "On trial" }),
    ask("for", "Evidence for it. Facts only: things a court would accept.", { echo: ["hot", "meaning"], lead: "On trial", s: "Evidence for" }),
    ask("against", "Evidence against it. Include anything you would point out to a friend.", { p: "Times it wasn't true. Things that don't fit. What you would have to ignore to keep believing it.", s: "Evidence against" }),
    ask("friend", "If someone you love had this exact thought, what would you say to them?", { echo: ["hot", "meaning"], lead: "On trial" }),
    ask("balanced", "Now write a balanced thought that takes all the evidence into account.", { echo: ["for", "against"], lead: "The evidence", p: "Not a cheerful one. An accurate one. It often has 'and' in the middle.", s: "The balanced thought" }),
    rate("now", "How much do you believe the original thought now?", "not at all", "completely"),
    say("It hasn't moved much, and that tells you something.", "A thought that survives the evidence is usually an old belief, not a passing thought, and beliefs shift through experience more than through argument. Two places go further: 'Follow it down to the root' under Deeper, and the sessions on shame and self-worth. Acting as if the balanced thought were true, in one small way this week, also counts as evidence.", { when: a => a.now != null && a.now >= 8 }),
    ask("act", "If you believed the balanced thought, what would you do differently this week?", { echo: "balanced", s: "What you'd do differently" })
  ];

  const ab = (...v) => is("about", ...v);
  F.d4 = [
    ask("topics", "What do you go round and round about?", { s: "What you go round about" }),
    ask("when", "When and where does it mostly happen?", { p: "In bed, in the shower, driving, after seeing certain people, when you're alone." }),
    ask("feels", "While you're in it, what does it feel like you are doing?", { p: "Working it out. Preparing. Punishing yourself. Keeping someone close. Trying to make it not have happened." }),
    ask("cost", "What does it cost you?"),
    ask("why", "Write the one 'why' question you ask most.", { p: "'Why am I like this?' 'Why did he do that?' 'Why can't I get over it?'", need: true, s: "The 'why' you keep asking" }),
    one("about", "What is that question about?", [["now", "A problem that exists now, that I could act on"], ["past", "Something that already happened"], ["other", "Someone else: what they did, or why"], ["me", "Something about me that I think is wrong"], ["future", "Something that might happen"]], { echo: "why" }),
    ask("how", "Then turn it into a 'what' question: 'What is one small thing I can do about this?' And answer it.", { when: ab("now"), echo: "why", s: "The question you can answer" }),
    say("No amount of thinking will change this one.", "The loop keeps running because part of you is still trying to get a different ending, or an explanation that would make it bearable. There may not be one. The question that can be answered is about now.", { when: ab("past", "other") }),
    ask("how", "Ask instead: 'Given that it happened, what do I need now?' And answer it.", { when: ab("past", "other"), echo: "why", p: "To grieve it. To be angry on paper. To tell someone. To stop waiting for an apology. To do one thing for the person I am today.", s: "The question you can answer" }),
    ask("how", "Ask instead: 'What was going on for me, and what would help me do it differently next time?' Answer it the way you would for a friend.", { when: ab("me"), echo: "why", s: "The question you can answer" }),
    ask("how", "Ask instead: 'Is there anything I can do about this today?' If yes, what. If no, write the line you'll tell yourself when it comes back.", { when: ab("future"), echo: "why", p: "For example: 'I can't know yet. I'll look at it again on Friday.'", s: "The question you can answer" }),
    ask("signal", "What is your earliest sign that you have entered the loop?", { s: "Your earliest sign of the loop" }),
    ask("exits", "Your three loop-breakers", { p: "One that moves your body, one that absorbs your attention completely, one that involves another person.", s: "Your loop-breakers" }),
    breathe("Try the three-minute breathing space now: notice what is here, narrow your attention to the breath, then widen it to your whole body.", 180),
    ask("space", "What did you notice?")
  ];

  F.d5 = [
    ask("says", "What does your critic say to you? Write it the way it says it.", { need: true, s: "What the critic says" }),
    short("tone", "What is its tone of voice?"),
    ask("loud", "When is it loudest?", { p: "After a mistake. Around certain people. When you rest. When something goes well." }),
    short("whose", "Whose voice does it remind you of?", { p: "A parent, a teacher, a partner, children at school. Or 'nobody: it's mine'.", s: "Whose voice it is" }),
    ask("feel", "When it speaks, what happens in your body, and what do you do?", { echo: "says" }),
    ask("afraid", "Ask the critic directly: what are you afraid would happen if you stopped?", { p: "Write its answer. It usually has one: 'you'd get lazy', 'you'd be humiliated', 'they'd leave'.", s: "What the critic is afraid of" }),
    say("It has been trying to protect you.", "Badly, and at great cost, but that was its job: get in first so that nobody else can, keep you small so you can't fall. You don't have to destroy it. You need a different voice that does the same job better."),
    ask("works", "Honestly: has being hard on yourself worked? What has it produced?"),
    ask("reply", "Now answer it, in the voice of a wise, warm friend who knows the whole story and is on your side.", { echo: "says", lead: "The critic said", p: "Honest about what went wrong. Kind about why. Clear about what next.", s: "The kinder reply" }),
    ask("hard", "How was it to write that? What got in the way?", { p: "Many people feel fake, tearful or irritated. All three mean it touched something." }),
    short("phrase", "A short phrase to keep with you", { p: "'I'm doing what I can with what I've got.' 'This is hard, and I'm on my side.'", s: "Your phrase" })
  ];

  /* ================= Anxiety, worry and panic ================= */

  F.a1 = [
    ask("fear", "What are you afraid will happen? Say the specific thing.", { p: "Not 'it'll be awful'. What exactly, and then what?", need: true, s: "What you fear" }),
    ask("worst", "And if that happened, what would be the worst part of it? What would it mean?", { echo: "fear" }),
    rate("likely", "When you're calm, how likely does it seem?", "impossible", "certain"),
    rate("likely2", "And when you are in the grip of it?", "impossible", "certain"),
    say("That gap is the alarm.", "The danger doesn't change between those two moments. Only your alarm system does. Anxiety overestimates how likely and how bad, and underestimates how well you would cope."),
    ask("avoid", "What do you avoid because of it?", { p: "Places, people, tasks, conversations, feelings, decisions.", s: "What you avoid" }),
    ask("safety", "And when you can't avoid it, what do you do to get through?", { p: "Checking. Asking for reassurance. Over-preparing. An escape plan. A drink first. Staying on your phone.", s: "Your safety behaviours" }),
    ask("payoff", "What do those give you in the short term?", { echo: ["avoid", "safety"] }),
    ask("cost", "What have they cost you over time? How has your life got smaller?", { s: "What it has cost" }),
    ask("learned", "Each time you avoided it, or got through with a prop, what did your brain conclude?", { p: "Usually: 'that was dangerous, and I only just got away with it.'" }),
    ask("without", "What would your life include if anxiety weren't making the decisions?", { s: "Life without anxiety in charge" })
  ];

  F.a2 = [
    ask("list", "Empty your head onto the page. Everything you are worried about, one per line.", { need: true }),
    say("Now sort them. There are three kinds, not one.", "A real problem that exists now and that you can act on. A 'what if': something that hasn't happened and may never. And something that is already true and can't be changed. Each needs something different. Treating all three as problems to solve is what keeps worry running."),
    ask("real", "Which are real problems you can act on now? For each, write the next step and when.", { echo: "list", lead: "Your list", p: "If none are, write 'none'.", s: "Problems you can act on" }),
    ask("whatif", "Which are 'what ifs'?", { echo: "list", lead: "Your list", s: "The 'what ifs'" }),
    ask("given", "Which are things that are already true and can't be changed?", { echo: "list", lead: "Your list", p: "Someone's illness. Something that happened. A decision that can't be unmade. Leave it empty if there are none.", s: "What is already true" }),
    ask("uncertain", "Take the biggest 'what if'. What certainty are you trying to get by worrying about it?", { when: wrote("whatif"), echo: "whatif", p: "'I need to know he'll be all right.' 'I need to know I won't be left.'" }),
    ask("live", "Could you live with not knowing yet? What would you do today if you accepted that you can't know?", { when: wrote("whatif"), echo: "uncertain", s: "Living with not knowing" }),
    say("The third kind isn't worry. It is weight.", "Things that are true and can't be changed don't respond to next steps or to a worry appointment. Underneath them there is usually grief, fear or anger, and that needs to be felt and shared, not solved. The session 'What you can't change' and the Deeper tool 'Change it, or make peace with it?' are made for these.", { when: wrote("given") }),
    ask("feelgiven", "Take the heaviest of those. What is the feeling underneath it, and who knows you are carrying it?", { when: wrote("given"), echo: "given", s: "The feeling under what can't be changed" }),
    ask("believe", "What do you believe worrying does for you?", { p: "Keeps me prepared. Shows I care. Stops bad things happening. Stops me being caught out." }),
    ask("test", "Has it? Think of the last thing you worried about for days. Did the worrying change how it turned out?", { echo: "believe" }),
    short("time", "Your daily worry appointment: time and place", { p: "Twenty minutes, the same time each day. Not in bed, and not just before sleep.", s: "Worry appointment" })
  ];

  F.a3 = [
    ask("goal", "Choose one fear to work on. What do you want to be able to do?", { echo: "a1.avoid", need: true, s: "What you want to be able to do" }),
    ask("why", "Why does it matter? What would it give you back?"),
    ask("ladder", "Build your ladder: eight to ten steps from easiest to hardest, each with a fear rating out of 10.", { echo: "goal", p: "Start around 3 out of 10. Change one thing at a time: distance, time, who is with you, how busy it is.", s: "Your ladder" }),
    ask("props", "Which safety behaviours will you leave out while you do it?", { echo: "a1.safety", p: "The learning only counts if you find out you were all right without them." }),
    short("first", "Your first step, and when you'll do it", { echo: "ladder", s: "Your first step" }),
    ask("predict", "What exactly do you predict will happen? How bad, from 0 to 10, and for how long?", { p: "Be specific enough that you could be proved wrong.", s: "Your prediction" }),
    ask("stay", "What will you say to yourself to stay in it until the fear starts to drop?", { p: "'This is the alarm, not danger. It peaks and falls. I'm staying until it's half what it was.'" }),
    one("done", "Have you done the step yet?", [["no", "Not yet. I'll come back and fill this in"], ["yes", "Yes"]]),
    ask("actual", "What actually happened? Compare it with your prediction.", { when: is("done", "yes"), echo: "predict", lead: "You predicted", s: "What actually happened" }),
    ask("learn", "What did you learn about the fear, and about yourself?", { when: is("done", "yes"), s: "What you learned" })
  ];

  const canDo = is("checked", "yes");
  F.a4 = [
    one("has", "Do you get panic attacks, or sudden waves of physical fear?", [["yes", "Yes"], ["some", "Occasionally"], ["no", "No"]]),
    say("Then take this one lightly.", "The idea is still worth having: the body sensations of anxiety are uncomfortable and harmless. You can do the exercise as a test, or read it through and move on.", { when: is("has", "no") }),
    ask("sensations", "What sensations do you get?", { p: "Pounding heart, tight chest, dizziness, tingling, breathlessness, heat, feeling unreal.", s: "The sensations" }),
    ask("meaning", "In the moment, what do you fear they mean?", { echo: "sensations", p: "Heart attack. Fainting. Going mad. Losing control. Dying. Making a scene.", s: "What you fear they mean" }),
    ask("ever", "Has that ever actually happened, in all the times you have felt this?", { echo: "meaning" }),
    ask("other", "What is another explanation for the same sensations?", { p: "Adrenaline. Over-breathing. Caffeine. A hot room. Hormones. Standing up fast.", s: "Another explanation" }),
    one("checked", "Have these symptoms been checked by a doctor?", [["yes", "Yes, and nothing was found"], ["no", "No"], ["cond", "I have a heart or breathing condition"]]),
    say("Get it checked once.", "New chest pain, breathlessness or palpitations deserve one medical check, so that you know. After that, more checking becomes a safety behaviour. Leave the body exercise until you have been seen.", { when: is("checked", "no") }),
    say("Leave out the body exercise.", "With a heart or breathing condition, don't bring on these sensations without your doctor's say-so. The thinking part of this session still applies to you.", { when: is("checked", "cond") }),
    ask("predict", "Pick one exercise: spinning in a chair, breathing through a straw, or running on the spot, for 30 to 60 seconds. What do you predict will happen?", { when: canDo, s: "Your prediction" }),
    ask("happened", "Now do it. What happened, and how long did the sensations take to settle?", { when: canDo, echo: "predict", lead: "You predicted", s: "What happened" }),
    ask("say", "What will you say to yourself next time panic starts?", { p: "'This is adrenaline. It peaks within ten minutes. I don't have to do anything except let it pass.'", s: "What you'll say next time" }),
    ask("stay", "Where do you usually go, or what do you usually do, when it starts? What would staying put look like?")
  ];
})();
