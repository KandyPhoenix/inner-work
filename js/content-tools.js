/* Inner Work — measures, mood rescues, deep-work tools, safety plan, guide prompt. */
window.IW = window.IW || {};

/* ---------- Check-in questionnaires (PHQ-9 and GAD-7, both free to use) ---------- */
IW.scaleOptions = ["Not at all", "Several days", "More than half the days", "Nearly every day"];
IW.phq = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself, or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite: being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way"
];
IW.gad = [
  "Feeling nervous, anxious or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen"
];
IW.band = function (kind, n) {
  if (kind === "phq") return n < 5 ? "minimal" : n < 10 ? "mild" : n < 15 ? "moderate" : n < 20 ? "moderately severe" : "severe";
  return n < 5 ? "minimal" : n < 10 ? "mild" : n < 15 ? "moderate" : "severe";
};

/* ---------- What the person wants to work on, mapped to tracks ---------- */
IW.concerns = [
  ["mood", "Low mood, flatness, depression", "mood"],
  ["anxiety", "Anxiety, worry or panic", "anxiety"],
  ["menopause", "Menopause or hormone-related mood changes", "menopause"],
  ["emotions", "Emotions that feel too big, or patterns in my personality I want to change", "emotions"],
  ["trauma", "Something traumatic that happened to me", "trauma"],
  ["childhood", "My childhood and how it still affects me", "roots"],
  ["relationships", "Relationships, conflict or loneliness", "relationships"],
  ["grief", "Grief or loss", "grief"],
  ["worth", "Shame, self-criticism or low self-worth", "worth"]
];

/* ---------- Mood rescues: short guided sequences for right now ----------
   Step kinds: say (read), breathe (timer), ask (write), pick (choose one or more). */
IW.rescues = [
  { id: "down", name: "Low, flat or heavy", line: "Move the dial one point.",
    steps: [
      { k: "say", h: "This is a low. It will lift.", p: "Low mood tells you it has always been like this and always will be. That is the mood talking. You are not trying to feel good in the next ten minutes, only one point better." },
      { k: "pick", h: "Change your body first. Pick one and do it now, then come back.", opts: ["Stand up and stretch", "Cold water on my face", "Step outside for five minutes", "Have a shower", "Walk for ten minutes", "Put on music and move"] },
      { k: "ask", id: "weight", h: "What is weighing on you most? One sentence." },
      { k: "kind", item: "weight" },
      { k: "work", item: "weight" },
      { k: "pick", h: "One small kindness to yourself in the next hour.", opts: ["Something warm to eat or drink", "Message someone", "Sit in daylight", "Ten minutes of something I used to enjoy", "Lie down for twenty minutes", "Tidy one small surface"] }
    ] },
  { id: "anxious", name: "Anxious, wound up or panicky", line: "Bring the alarm down, then think.",
    steps: [
      { k: "breathe", h: "Breathe out longer than you breathe in.", secs: 90 },
      { k: "say", h: "Come into the room.", p: "Name five things you can see. Four you can touch. Three you can hear. Two you can smell. One you can taste. Go slowly." },
      { k: "ask", id: "predict", h: "What is your mind predicting will happen?" },
      { k: "ask", id: "likely", echo: "predict", h: "What is most likely to happen? And if the worst did, how would you cope?" },
      { k: "pick", h: "What does this need?", opts: ["There's a step I can take now", "It can wait for my worry time", "It's a 'what if': I'll let it be"] }
    ] },
  { id: "overwhelmed", name: "Too much on my mind", line: "Get it out, then take it one piece at a time.",
    steps: [
      { k: "breathe", h: "One minute first.", secs: 60 },
      { k: "list", id: "items", h: "What is on your mind?", p: "Put each thing on its own line. Feelings, worries, things you can't change, things to do: all of it counts. Don't sort it yet." },
      { k: "focus", list: "items", h: "Which one is heaviest right now?" },
      { k: "kind", list: "items" },
      { k: "work", list: "items" }
    ] },
  { id: "angry", name: "Angry, irritable or raging", line: "Discharge it before you reply.",
    steps: [
      { k: "say", h: "Stop. Don't send, say or decide anything yet.", p: "Anger narrows your thinking to attack. Whatever needs saying will come out better in twenty minutes." },
      { k: "pick", h: "Burn off the charge. Pick one and do it now.", opts: ["Cold water on face and wrists", "Fast walk or stairs", "Push hard against a wall", "Shake out arms and legs", "Ten long slow out-breaths"] },
      { k: "breathe", h: "Slow it down.", secs: 60 },
      { k: "ask", id: "line", h: "What line was crossed, or what need of yours is being ignored?" },
      { k: "ask", id: "want", echo: "line", h: "What do you actually want to happen? What response would get you there?" }
    ] },
  { id: "shame", name: "Ashamed, attacking myself", line: "Turn toward yourself.",
    steps: [
      { k: "say", h: "Shame tells you to hide. Stay.", p: "Put a hand on your chest. Feel the warmth of it. Breathe slowly. You are a person having a painful moment, like every person has had." },
      { k: "ask", id: "critic", h: "What is the critic saying?" },
      { k: "ask", id: "facts", h: "What happened, in plain facts with no adjectives?" },
      { k: "ask", id: "love", echo: "facts", h: "What would you say to someone you love if this had happened to them?" },
      { k: "pick", h: "What does this need?", opts: ["Something to repair: I'll apologise or fix one thing", "Nothing to fix: this is old shame", "To be said aloud to one safe person"] }
    ] },
  { id: "lonely", name: "Lonely", line: "One small reach.",
    steps: [
      { k: "say", h: "Loneliness is a signal, like hunger.", p: "It means you need contact. It does not mean nobody wants you. It also makes the mind expect rejection, so discount that prediction." },
      { k: "ask", id: "who", h: "Who has crossed your mind lately?" },
      { k: "pick", h: "Pick one small reach and do it now.", opts: ["Text someone 'thinking of you'", "Send a voice note", "Go somewhere there are people", "Phone someone", "Reply to a message I've left"] },
      { k: "ask", id: "self", h: "And something that helps you feel like good company for yourself tonight?" }
    ] },
  { id: "numb", name: "Numb, shut down or far away", line: "Wake the body up gently.",
    steps: [
      { k: "say", h: "Your system has pulled the plug to protect you.", p: "Numbness is the nervous system's shutdown mode. Thinking won't shift it. Sensation and movement will." },
      { k: "pick", h: "Pick one and do it now.", opts: ["Cold water or ice in my hands", "A strong taste: mint, lemon, ginger", "Stamp my feet and press my palms together", "Name five things by colour", "Music with a beat, and move"] },
      { k: "say", h: "Say it out loud.", p: "Today's date. Where you are. Three things you can see. 'I am here.'" },
      { k: "ask", id: "feel", h: "One thing you can feel right now, however faint." },
      { k: "pick", h: "A gentle next step.", opts: ["A warm drink", "Go outside", "Message someone", "A slow walk"] }
    ] },
  { id: "sleepless", name: "Awake in the night", line: "Rest instead of solving.",
    steps: [
      { k: "say", h: "Nothing gets solved at 3am.", p: "Your threat system is running and everything looks twice its size. Turn the clock away. The job right now is rest, even without sleep." },
      { k: "breathe", h: "Slow breathing.", secs: 120 },
      { k: "ask", id: "park", h: "Park it. Write what is circling, and when tomorrow you'll look at it." },
      { k: "say", h: "If you're still awake in twenty minutes", p: "Get up. Keep the lights low. Do something dull and quiet. Go back to bed when you feel sleepy. Get up at your usual time whatever happens." }
    ] },
  { id: "surge", name: "Hot flush or hormone surge", line: "It peaks and passes in minutes.",
    steps: [
      { k: "say", h: "This is a surge. It is not danger.", p: "Your body's thermostat has misfired, or your hormones have lurched. It will pass in a few minutes. Drop your shoulders." },
      { k: "breathe", h: "Slow breaths into your belly.", secs: 90 },
      { k: "pick", h: "Cool down.", opts: ["Cold water on wrists", "Fan or open window", "Take a layer off", "Step outside", "Cold drink"] },
      { k: "ask", id: "thought", h: "What thought came with it?" },
      { k: "say", h: "A truer line", p: "'This is my body adjusting. It passes. I don't have to decide or reply to anything for the next twenty minutes.'" }
    ] },
  { id: "triggered", name: "Triggered or reliving something", line: "That was then. This is now.",
    steps: [
      { k: "say", h: "You are having a memory.", p: "It feels like it is happening now. It isn't. Your body is reacting to something that is over. Look around the room you are actually in." },
      { k: "ask", id: "orient", h: "Write: today's date, where you are, how old you are, and three things you can see that prove it is now." },
      { k: "pick", h: "Ground your body. Pick one and do it.", opts: ["Press my feet hard into the floor", "Hold something cold", "Name five colours I can see", "Cross my arms and tap my shoulders slowly", "Smell something strong"] },
      { k: "breathe", h: "Long out-breaths.", secs: 60 },
      { k: "ask", id: "need", h: "What do you need for the next hour?" }
    ] }
];

/* ---------- What kind of weight is it? ----------
   Not everything on a person's mind is a task. A rescue asks which of these four a thing is,
   then asks the questions that fit: problem-solving for what can be acted on, worry work for
   what-ifs, emotion-focused questions for feelings, and acceptance work for what can't be changed. */
IW.weightKinds = [
  ["feel", "A feeling I'm carrying"],
  ["worry", "A worry about what might happen"],
  ["cant", "Something I can't change"],
  ["do", "Something I can actually do something about"]
];
IW.work = {
  feel: [
    { k: "ask", h: "Stay with it for a moment. What is the feeling, as exactly as you can name it?", p: "Hurt, grief, dread, resentment, loneliness, shame, exhaustion… there may be more than one." },
    { k: "ask", h: "Where do you feel it in your body, and what is it like there?" },
    { k: "ask", h: "What is this feeling asking for?", p: "Comfort, rest, to be said out loud, to be taken seriously, a limit, company." },
    { k: "ask", h: "What would you say to someone you love who felt exactly this?" },
    { k: "say", h: "A feeling doesn't need fixing.", p: "It needs to be felt and heard, and you have just done that. You don't have to solve it tonight. Feelings move on their own once they've been given room." }
  ],
  worry: [
    { k: "ask", h: "What exactly are you afraid will happen? Say the worst version." },
    { k: "ask", h: "What is most likely to happen instead?" },
    { k: "ask", h: "If the worst did happen, what would you do, and who would help you?" },
    { k: "pick", h: "Is there anything you can do about it today?", opts: ["Yes, one small thing", "No. It's a what-if, and nothing I do tonight changes it"] },
    { k: "ask", h: "Write the one small thing. Or, if there's nothing to do, a line to tell yourself when it comes back.", p: "For example: “I've looked at this. I can't know yet. I'll look again on Friday.”" }
  ],
  cant: [
    { k: "ask", h: "What part of it hurts the most?" },
    { k: "ask", h: "How have you been fighting it, fixing it, or arguing with it in your head? What does that cost you?" },
    { k: "ask", h: "If you stopped fighting it just for today, what would you have to feel?", p: "Grief, anger, fear, helplessness. Stopping the fight is not the same as saying it's okay." },
    { k: "ask", h: "It stays true, and some things are still yours. What is one thing you get to choose today, alongside it?" },
    { k: "ask", h: "Finish this: “I don't like it, I didn't choose it, and today I will ___.”" }
  ],
  do: [
    { k: "ask", h: "What is the very next step? Small enough to do in ten minutes." },
    { k: "ask", h: "When will you do it? Name a day and a time, or decide it can wait and say until when." },
    { k: "say", h: "That one has somewhere to live now.", p: "It's written down with a time on it, so you don't have to keep holding it in your head until then." }
  ]
};

/* ---------- Deep-work tools: for what isn't shifting, and for finding answers ----------
   The guided dialogue for each tool is in content-flows-b.js. */
IW.tools = [
  { id: "stuck", name: "Untangle something that isn't getting better", m: "Formulation · solution-focused therapy",
    intro: "For a problem you've had for a while. This lays out what is holding it in place, which is rarely what it looks like from inside." },
  { id: "immunity", name: "Why can't I change this?", m: "Immunity to change",
    intro: "When you truly want to change and keep not changing, part of you is committed to something else. This finds what." },
  { id: "root", name: "Follow it down to the root", m: "Downward arrow · schema therapy",
    intro: "For a reaction that is bigger than the situation deserves. You follow the thought down until you reach the belief that powers it, then look at where that belief came from." },
  { id: "pattern", name: "Find the pattern across your life", m: "Psychodynamic · narrative therapy",
    intro: "For the thing that keeps happening with different people and in different places. Seeing the pattern is what makes the choice point visible." },
  { id: "part", name: "Talk with a part of you", m: "Internal Family Systems-informed",
    intro: "For when you're torn, or when something in you keeps taking over. Speak to that part as you would to a person, and write what comes back." },
  { id: "accept", name: "Change it, or make peace with it?", m: "Acceptance and commitment therapy · radical acceptance",
    intro: "For something you've fought for a long time. This separates what you can still move from what you can't, and works on the second." },
  { id: "letter", name: "The unsent letter", m: "Expressive writing · empty-chair work",
    intro: "For what you never got to say, to someone living or dead, or to a part of your own past. It will not be sent, so hold nothing back." }
];

/* ---------- Safety plan (Stanley-Brown format) ---------- */
IW.safetyPlan = [
  ["signs", "My warning signs that a crisis may be building"],
  ["cope", "Things I can do on my own to take my mind off it"],
  ["places", "People and places that distract me"],
  ["people", "People I can ask for help (names and numbers)"],
  ["pros", "Professionals I can contact (names and numbers)"],
  ["safe", "How I'll make where I am safer"],
  ["reasons", "My reasons for living"]
];

/* ---------- The AI guide ---------- */
IW.guidePrompt = `You are the guide inside Inner Work, a private self-guided therapy program that also holds the person's journal, vision board and Jungian shadow work. The person talking to you is working through structured sessions on their own and comes to you to think things through more deeply. You are not a licensed clinician and you never present yourself as one. What you offer is skilled, warm, honest conversation that draws on the same methods therapists use.

How to work with them

Listen first. Reflect back what you heard in your own words, including what seems to sit underneath it, before you offer anything. Ask one question at a time and wait for the answer. Follow where they go.

Go deep. They want to understand why they are the way they are and why some things don't change, so a conversation that only teaches coping skills falls short. Look for the pattern across what they tell you: the same feeling in different situations, the old relationship being replayed, the belief formed in childhood, the part of them that is protecting something. Offer what you notice as a tentative observation and ask whether it fits. Let them reach the insight where you can. When something in what they say contradicts something they said earlier, name it gently.

Draw on whichever approach fits the moment: cognitive and behavioural methods, behavioural activation, exposure, EMDR-informed work, DBT skills, acceptance and commitment therapy, compassion-focused therapy, schema therapy, parts work in the style of Internal Family Systems, Jungian shadow work and archetypes, psychodynamic and attachment thinking, interpersonal therapy, narrative and existential approaches, motivational interviewing, grief work, and body-based grounding. Explain an idea in plain words when you use it. Do not lecture.

When they are low or distressed right now, help with the state first. Steady the body, bring the intensity down, and only then explore.

When something can't be changed, help them tell apart what they can move from what they can't, and stay with the grief and anger of the second. Do not hurry them toward acceptance.

Be honest. If they are avoiding something, or the story they tell about themselves doesn't match the facts they've given, say so kindly. Warmth without honesty will not help them.

End most replies with either a question that takes them deeper or one small concrete thing to try. Keep replies short enough to feel like conversation: usually a few short paragraphs. Write in plain paragraphs with no headings, bullet lists or other formatting.

Limits you hold

You do not diagnose, and you do not advise starting, stopping or changing any medication or hormone treatment. When those questions come up, help them prepare for a conversation with a doctor and encourage them to have it. Mood changes around menopause deserve a medical review as well as psychological work.

With trauma, go at their pace. Check they can ground themselves before going into detail, keep one foot in the present, and stop to stabilise if they become overwhelmed or start to feel unreal or far away. The app has a self-guided EMDR-style tool (under Deeper) for memories and upsets in the middle range; you can help them choose a suitable target, prepare the negative and positive beliefs, and talk through what came up afterwards. For severe or complex trauma, childhood abuse, or anyone who dissociates, be clear that this should be done with a trained EMDR or trauma therapist.

If they mention thoughts of suicide or self-harm, respond with care and take it seriously. Ask directly and calmly whether they are thinking of ending their life and whether they are safe right now. Stay with them. Point them to the safety plan and the Help now button in the app. In the United States they can call or text 988 at any time, text HOME to 741741, or call 911 if they are in immediate danger; anywhere else, their local emergency number. Encourage them to tell someone they trust today. Do not end the conversation abruptly and do not lecture.

If their check-in scores stay high after they have done the work, say plainly that adding a human therapist or a medical review is the right next step, and that this is a normal part of treatment.

Below is what the app knows about this person. Use it naturally, the way a therapist who had read the file would. Do not recite it back.`;

/* ---------- The guide inside a session ----------
   Used when the guide answers each written reply during a session or Deeper tool. */
IW.inlinePrompt = `You are the guide inside Inner Work, a private self-guided therapy program. The person is in the middle of a structured session, answering one question at a time in writing. After each written answer you respond briefly, the way a good therapist responds to what a client has just said before asking the next thing. You are not a licensed clinician and you never present yourself as one.

Each message gives you the session, what they have written so far, the question they were just asked, their answer, and what the session will ask or say next.

How to respond

Write two to four sentences in plain, warm language, speaking to them as "you". Say back what you heard in your own words, including what seems to sit underneath it, so they can tell they were understood. If something they wrote connects to something earlier in this session, or to what they worked out in earlier sessions, name the link tentatively, and only when it is really there. If their answer shows something they may not have noticed (a contradiction, a word that carries a lot, a feeling under the stated one, harshness toward themselves), point to it gently.

Stay with what they actually wrote. A feeling, a worry or something that can't be changed is not a task: do not offer steps, fixes, lists or reframes for it, and do not hurry them toward acceptance or a bright side. Do not give advice or teach unless they ask. Do not praise the answer or thank them for sharing. Do not repeat their words back at length. Write plain sentences with no headings, lists or bold.

The session asks its next question straight after your reply, so do not ask that question yourself and do not answer it for them. Usually end without a question. Ask one short question of your own only when the answer is thin, vague or steps around what was asked, or when something important is sitting just under what they wrote and one more sentence from them would bring it out. They can answer you or move on.

If they answer back, reply in the same way: brief, responsive, at most one question. After a couple of exchanges, let the session carry on.

If the answer is a bare fact that needs no reflection, one short sentence is enough.

Limits you hold

You do not diagnose, and you do not advise starting, stopping or changing any medication or hormone treatment. With trauma, do not ask for more detail of what happened than they have offered. If they seem overwhelmed, far away or unreal, help them ground first (feet on the floor, today's date, what they can see) and say that stopping here is allowed.

If they mention thoughts of suicide or self-harm, respond with care and take it seriously. Ask directly and calmly whether they are thinking of ending their life and whether they are safe right now. Point them to the Help now button at the top of the screen and to their safety plan, and encourage them to tell someone they trust today. In the United States they can call or text 988 at any time. Do not lecture, and do not move on as if it had not been said.

Below is what the app knows about this person. Use it the way a therapist who had read the file would. Do not recite it.`;

IW.sumAsk = `The work part is finished. Write the summing-up a therapist gives at the end of a session: one paragraph of four to six sentences, speaking to them as "you". Draw together what they found today, using their own words where you can. Name one pattern or link, within today or to an earlier session, if a real one is there. End with the one thing that seems most worth holding on to. No advice list, no praise, no headings, and no question.`;

/* What "Copy for Claude" puts on the clipboard, for someone who would rather have the conversation
   in the Claude app they already use. */
IW.handoff = notes => `I'm working through a self-guided therapy program in an app called Inner Work, and I'd like you to be its guide for this conversation. The guide's instructions come first, then my notes from the app.

=== The guide's instructions ===

${IW.guidePrompt}

=== My notes from the app ===

${notes}

=== How to start ===

Tell me briefly what you notice in my notes, then ask me one question.`;
