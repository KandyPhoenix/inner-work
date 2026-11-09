/* Inner Work — program content.
   Each session: id, t (title), m (the therapy it draws on), learn (paragraphs),
   intro (how to do the exercise), f (fields: [id, type, label, options]), practice.
   Field types: ta = long text, tx = short text, sc = 0–10 scale, ck = pick any. */
window.IW = window.IW || {};

IW.tracks = [
{
  id: "foundations", name: "Foundations", always: true,
  blurb: "The groundwork every kind of therapy starts with: goals, your personal map, your body, your emotions, your nervous system.",
  sessions: [
  { id: "f1", t: "Where you are and where you're going", m: "Goal setting · solution-focused therapy",
    learn: [
      "Every session here has the same shape: understand something, work it through on your own life, then practise it between sessions. The practice is where the change happens. Reading about swimming doesn't teach you to swim.",
      "One or two sessions a week is the right pace. Faster than that and nothing has time to settle. Progress is not a straight line: expect good weeks, flat weeks and the odd week that feels like going backwards. A setback tells you where the next piece of work is.",
      "Therapy works best when you know what you are aiming at. 'Feel better' is too vague to steer by. Today you turn it into something you could actually notice in an ordinary day."
    ],
    intro: "Answer in your own words. Nobody reads this but you.",
    f: [
      ["why", "ta", "What made you start this now? What has been hardest lately?"],
      ["miracle", "ta", "Suppose you woke up tomorrow and this had worked. What is the first small thing you would notice was different? What would you be doing that you aren't doing now?"],
      ["goals", "ta", "Three goals, written as things you would see yourself doing (for example: 'sleep through most nights', 'say no without days of guilt')."],
      ["now", "sc", "Where are you today, if 0 is the worst it has been and 10 is where you want to be?"],
      ["plus1", "ta", "What would one point higher look like? Just one."]
    ],
    practice: "Once a day, notice one moment that was slightly better than the rest of the day, and what was different about it." },

  { id: "f2", t: "Your map: how the pieces connect", m: "Cognitive behavioural therapy · formulation",
    learn: [
      "A hard moment has five parts that feed each other: the situation, what goes through your mind, what you feel, what happens in your body, and what you do. Change any one and the others shift.",
      "Most suffering that 'won't go away' is held in place by a loop. Something feels bad, so you do the thing that gives quick relief (withdraw, avoid, please, snap, numb out), and that relief has a longer-term cost that sets up the next bad moment.",
      "You can't interrupt a loop you can't see. Drawing the map is the first skill of nearly every therapy, and you will keep adding to yours throughout this program, including where the loops first started."
    ],
    intro: "Pick one recent moment when your mood dropped or spiked. Small is fine.",
    f: [
      ["situation", "ta", "What happened? Just the facts: where, when, who."],
      ["thoughts", "ta", "What went through your mind? Words or images."],
      ["feelings", "tx", "What did you feel, and how strong (0–10)?"],
      ["body", "tx", "What did you notice in your body?"],
      ["did", "ta", "What did you do, or not do?"],
      ["relief", "ta", "What did that give you in the short term?"],
      ["cost", "ta", "What did it cost you later?"]
    ],
    practice: "Map one moment a day. Three lines is enough: what happened, what I thought and felt, what I did." },

  { id: "f3", t: "The floor your mood stands on", m: "Behavioural medicine",
    learn: [
      "Mood stands on a physical floor. When the floor is cracked, no amount of insight holds. The biggest levers are a regular wake-up time, movement, daylight early in the day, eating at regular times, and what alcohol and caffeine are doing to you.",
      "Regular movement works about as well as other treatments for mild to moderate low mood, and it works even when you don't enjoy it. Alcohol is a depressant that also wrecks the second half of the night's sleep. Morning light sets your body clock better than anything else.",
      "This is not a self-improvement project. Pick one lever, make it small enough that you'll do it on a bad day, and tie it to something you already do."
    ],
    intro: "Rate each honestly. Low scores are information, not a verdict.",
    f: [
      ["sleep", "sc", "Sleep: how well is it working?"],
      ["move", "sc", "Movement"],
      ["food", "sc", "Eating regularly and enough"],
      ["alcohol", "sc", "Alcohol and other substances: how much are they helping rather than hurting? (10 = no problem)"],
      ["light", "sc", "Daylight and time outside"],
      ["people", "sc", "Real contact with people"],
      ["one", "ta", "The one small change you'll make. Make it almost too easy."],
      ["when", "tx", "When and where exactly? ('After I ___, I will ___')"]
    ],
    practice: "Do your one small change every day, and get up at the same time each morning whatever kind of night you had." },

  { id: "f4", t: "Naming what you feel", m: "Emotion-focused therapy",
    learn: [
      "An emotion is a message with an urge attached. Fear says danger, get away. Anger says a line was crossed, defend it. Sadness says something was lost, slow down and seek comfort. Guilt says repair this. Shame says hide.",
      "Putting a precise name on a feeling lowers its intensity. 'Bad' or 'stressed' is too blurry to work with. 'Disappointed', 'left out', 'trapped' gives you something to act on.",
      "Often the feeling on top is covering another one. Anger frequently sits over hurt or fear. Anxiety can sit over grief or anger you weren't allowed to have. Numbness sits over everything. When a feeling keeps coming back, ask what is underneath."
    ],
    intro: "Think back over the last week.",
    f: [
      ["felt", "ck", "Which of these did you feel this week?", ["sad","hopeless","lonely","hurt","disappointed","anxious","scared","overwhelmed","angry","resentful","irritable","guilty","ashamed","jealous","numb","empty","tired","calm","content","hopeful","proud","loved","grateful","interested"]],
      ["strongest", "tx", "The strongest one"],
      ["where", "tx", "Where do you feel it in your body?"],
      ["message", "ta", "What was it telling you, and what did it want you to do?"],
      ["under", "ta", "Is there another feeling underneath it?"]
    ],
    practice: "Three times a day, pause and finish the sentence: 'Right now I feel ___, and I notice it in my ___.'" },

  { id: "f5", t: "Calming your nervous system", m: "Somatic and polyvagal-informed work",
    learn: [
      "Your nervous system has a zone where you can think, feel and cope at the same time. Above it you are in fight-or-flight: racing heart, tight chest, anger, panic, can't sit still. Below it you are in shutdown: flat, foggy, numb, heavy, far away.",
      "You can't think your way back into the zone, because the thinking part of the brain goes offline first. You get back through the body. To come down: breathe out longer than you breathe in, cool your face, press your feet into the floor, name what you can see and hear. To come up from shutdown: move, stand, use cold water, strong tastes, music with a beat.",
      "These work much better if you practise them when you're calm. Then they are already there when you need them."
    ],
    intro: "Try the breathing below before you answer the last questions.",
    f: [
      ["hyper", "ta", "How do you know when you've gone above the zone? Your personal signs."],
      ["hypo", "ta", "How do you know when you've dropped below it?"],
      ["before", "sc", "Tension right now, before breathing"],
      ["breathe", "br", "Slow breathing: in for 4, out for 6", 120],
      ["after", "sc", "Tension now"],
      ["calmers", "ta", "Three things that reliably calm you"],
      ["lifters", "ta", "Three things that reliably wake you up when you're flat"]
    ],
    practice: "Five minutes of slow breathing (in 4, out 6) twice a day, while calm. You are training a reflex." }
  ]
},

{
  id: "menopause", name: "Menopause and hormone shifts",
  blurb: "What falling and fluctuating hormones do to mood, sleep, anxiety and identity, and the skills that are shown to help.",
  sessions: [
  { id: "m1", t: "What is happening in your brain and body", m: "Psychoeducation",
    learn: [
      "Oestrogen and progesterone are not only reproductive hormones. They act on serotonin, on the brain's main calming system, on the body's thermostat and on sleep. In perimenopause they don't fall smoothly; they swing, and the swings are often harder on mood than the low levels that follow.",
      "That is why women with no history of anxiety can suddenly have panic, dread, rage, tearfulness, flat mood, palpitations or brain fog in their forties and fifties. The risk is higher if you have had depression, bad PMS or postnatal depression before. It is physical, it is common, and it is treatable.",
      "Treatment has two halves. One is medical: hormone therapy and non-hormonal options are a conversation to have with a doctor who knows menopause, and that conversation is worth having. The other half is the skills in this track, which help whether or not you take anything. Not every low mood at this age is hormonal, and both things can be true at once."
    ],
    intro: "This builds the picture you will take to your doctor in session 4.",
    f: [
      ["symptoms", "ck", "What have you noticed?", ["hot flushes","night sweats","waking at 3–4am","new anxiety","dread on waking","panic","palpitations","low mood","sudden tears","rage or irritability","brain fog","word-finding trouble","exhaustion","loss of confidence","loss of libido","aches","feeling unlike myself"]],
      ["started", "tx", "Roughly when did this start?"],
      ["pattern", "ta", "Any pattern? Time of month, time of day, after alcohol, after poor sleep."],
      ["blame", "ta", "What have you been blaming yourself for that might partly be hormonal?"],
      ["ask", "ta", "Questions you want to ask a doctor"]
    ],
    practice: "Keep a one-line daily note: sleep, flushes, mood out of 10, and anything that seemed to trigger a bad patch." },

  { id: "m2", t: "Hot flushes, night sweats and sleep", m: "CBT for menopausal symptoms · CBT for insomnia",
    learn: [
      "A flush has a physical part and a mental part. The physical part lasts a few minutes. The mental part ('everyone can see', 'I can't cope', 'this will never end') adds stress, and stress makes flushes stronger and more frequent. Slow belly breathing at the first sign, plus a calmer line to yourself, measurably reduces how much they bother you.",
      "For sleep, the rules that work are unglamorous. Get up at the same time every day. Go to bed only when sleepy. If you've been awake about twenty minutes, get up, keep the lights low, do something dull, and go back when sleepy. Turn the clock away. Keep the room cool and a dry top by the bed.",
      "Nothing gets solved at 3am. The threat system is running and every problem looks twice its size. The task then is to rest, not to think."
    ],
    intro: "Build your plan for the next flush and the next bad night.",
    f: [
      ["triggers", "ta", "What tends to set off a flush? (heat, stress, alcohol, caffeine, spicy food, rushing)"],
      ["thoughts", "ta", "What goes through your mind during one?"],
      ["calmer", "ta", "A calmer, true thing to say to yourself instead"],
      ["night", "ta", "Your night plan: what's by the bed, and what you'll do if you're awake more than twenty minutes"],
      ["wake", "tx", "Your fixed getting-up time"]
    ],
    practice: "At the first sign of a flush: drop your shoulders, breathe slowly into your belly, and say your calmer line. Keep your getting-up time fixed all week." },

  { id: "m3", t: "Rage, tears, dread and fog", m: "Emotion regulation",
    learn: [
      "Hormone swings lower the threshold. Things you used to absorb now tip you over. The surge is chemistry, but what it lands on is usually real: overload, needs that have gone unmet, and years of accommodating other people.",
      "So treat a surge in two steps. In the moment: name it ('this is a surge'), slow your breathing, and delay any reply or decision by twenty minutes. Later, when calm: ask what it was pointing at, and say that part plainly.",
      "Brain fog is frightening and almost always temporary. It is not dementia. Help it by writing things down, doing one thing at a time, and dropping the expectation that you hold everything in your head for everyone."
    ],
    intro: "Use a recent surge of rage, tears or dread.",
    f: [
      ["surge", "ta", "What happened?"],
      ["under", "ta", "What need or limit was underneath it?"],
      ["tolerating", "ta", "What had you been putting up with before it tipped over?"],
      ["say", "ta", "What do you want to say about it now that you're calm?"],
      ["drop", "ta", "One load you could drop, delay or hand to someone else"],
      ["fog", "ta", "What will you put in place for the fog? (lists, alarms, one place for keys)"]
    ],
    practice: "When a surge hits: name it, breathe, wait twenty minutes before replying to anyone. Then say the real point calmly once." },

  { id: "m4", t: "This chapter and who you are becoming", m: "Narrative and existential therapy",
    learn: [
      "Menopause is a transition, and transitions involve loss. Fertility, a familiar body, the way the world used to look at you, sometimes a role that organised your life. Grief about that is legitimate even when you didn't want more children and don't miss being looked at.",
      "There is another side that many women describe: sharper clarity, much less patience for nonsense, and less need for approval. The culture mostly tells a story of decline. You get to decide which story you live in.",
      "Bring your notes to a doctor. Ask what your options are, hormonal and non-hormonal, and what the benefits and risks are for you specifically. If you are dismissed, see someone else. A menopause specialist is a reasonable request."
    ],
    intro: "Two parts: the bigger picture, then your appointment notes.",
    f: [
      ["grieving", "ta", "What are you grieving?"],
      ["done", "ta", "What are you done with?"],
      ["more", "ta", "What do you want more of in this next stretch of life?"],
      ["story", "ta", "The story you were handed about women your age, and the one you choose instead"],
      ["top3", "ta", "For the doctor: your three most troublesome symptoms and how they affect daily life"],
      ["questions", "ta", "For the doctor: your questions"]
    ],
    practice: "Book the appointment if you haven't. Do one thing this week that belongs to the chapter you're choosing." }
  ]
},

{
  id: "emotions", name: "Intense emotions and personality patterns",
  blurb: "Skills from dialectical behaviour therapy and schema therapy for emotions that run hot, all-or-nothing thinking, stormy relationships and an unsteady sense of self.",
  sessions: [
  { id: "e1", t: "Why your emotions run so strong", m: "Dialectical behaviour therapy (DBT)",
    learn: [
      "Some people are born with a more sensitive emotional system. Feelings arrive faster, hit harder and take longer to settle. That is temperament, not weakness.",
      "If a sensitive child grows up being told they're overreacting, too much, or wrong to feel what they feel, they never get taught how to handle strong emotion. They learn to distrust their own reactions and to swing between holding everything in and exploding.",
      "What gets called 'personality problems' are mostly patterns that were learned for good reasons and then stuck. Patterns that were learned can be relearned. The first step is validation: seeing that your reactions make sense given your wiring and your history, even when they aren't working for you now."
    ],
    intro: "Go gently. This is about understanding, not judging.",
    f: [
      ["shows", "ta", "How does emotional sensitivity show up for you?"],
      ["messages", "ta", "What were you told about your feelings growing up?"],
      ["at9", "ta", "What do you tend to do when an emotion hits 9 out of 10?"],
      ["cost", "ta", "What does that cost you?"],
      ["valid", "ta", "Finish this: 'It makes sense that I ___, because ___.'"]
    ],
    practice: "Once a day, validate one of your own reactions out loud: 'It makes sense that I feel this, because…'" },

  { id: "e2", t: "Getting through the storm without making it worse", m: "DBT distress tolerance",
    learn: [
      "When emotion is at its peak, the goal is not to feel good or solve anything. The goal is to get through the next half hour without doing something you'll have to clean up afterwards.",
      "STOP: stop, take a step back, observe what's happening inside and outside, proceed deliberately. Then change your body chemistry: cold water on your face for thirty seconds (check with a doctor first if you have a heart condition), a few minutes of hard exercise, slow breathing with a long out-breath, tensing and releasing your muscles.",
      "Urges behave like waves. They rise, peak and pass, usually within twenty to thirty minutes, if you don't feed them. You can watch one rise and fall without acting on it. Every time you do, the next one is weaker."
    ],
    intro: "Build your crisis kit now, while you're steady.",
    f: [
      ["urges", "ta", "What do you get the urge to do when it's unbearable?"],
      ["signs", "ta", "Your early warning signs that a storm is building"],
      ["body", "ck", "Which body resets will you use?", ["cold water on face","ice in hands","run or stairs","star jumps","slow breathing","tense and release muscles","cold shower"]],
      ["soothe", "ta", "Something soothing for each sense: see, hear, smell, taste, touch"],
      ["contact", "tx", "Who can you contact?"],
      ["pros", "ta", "Riding it out versus acting on the urge: what does each get you an hour later, and a week later?"]
    ],
    practice: "Use one body reset each day, even when you don't need it. Next urge: time it and watch it pass." },

  { id: "e3", t: "Changing an emotion you don't want to keep", m: "DBT emotion regulation",
    learn: [
      "First check the facts. Strip the event down to what a camera would have recorded, and separate it from what you made it mean. Then ask whether the emotion, and its strength, fits those facts.",
      "If it fits, the emotion is doing its job, and the answer is to solve the problem it is pointing at. If it doesn't fit, or acting on it would make things worse, use opposite action: do the opposite of what the emotion is pushing you to do, and do it fully.",
      "Fear says avoid, so approach. Sadness says withdraw, so get active. Anger says attack, so step back and be decent. Unearned shame says hide, so stay visible. It feels wrong at first. That is how you know you're doing it."
    ],
    intro: "Use an emotion from the last few days that was too big or lasted too long.",
    f: [
      ["emotion", "tx", "The emotion, and how strong (0–10)"],
      ["facts", "ta", "What happened, as a camera would have recorded it"],
      ["meaning", "ta", "What you made it mean"],
      ["fit", "ta", "Does the emotion fit the facts? Does its strength?"],
      ["urge", "tx", "What it pushed you to do"],
      ["opposite", "ta", "The opposite action, done fully"]
    ],
    practice: "Once this week, check the facts on a strong emotion and take the opposite action. Note what happened to the feeling." },

  { id: "e4", t: "Two things can be true", m: "Dialectics · wise mind",
    learn: [
      "Under stress the mind sorts everything into two boxes. I'm a success or a failure. They love me or they don't care. This is perfect or it's ruined. It feels like clarity. It is actually the emotional brain simplifying.",
      "Dialectical thinking holds both sides. 'I'm doing my best and I need to do better.' 'I love her and I'm furious with her.' 'This is hard and I can handle it.' Replace 'but' with 'and' and notice what loosens.",
      "You have an emotional mind and a reasoning mind. Where they overlap is what DBT calls wise mind: the quiet sense of what is true and what to do. You find it by slowing down and asking, not by arguing with yourself."
    ],
    intro: "Pick a situation where you went to one extreme.",
    f: [
      ["situation", "ta", "The situation"],
      ["extremes", "ta", "The two extremes your mind offered"],
      ["both", "ta", "A 'both… and…' statement that is truer than either"],
      ["wise", "ta", "Breathe slowly for a minute and ask: what does my wise mind say?"],
      ["three", "ta", "Three more 'and' statements about your life right now"]
    ],
    practice: "Catch one 'always', 'never', 'ruined' or 'perfect' each day and rewrite it with 'and'." },

  { id: "e5", t: "Asking, refusing, and keeping your self-respect", m: "DBT interpersonal effectiveness",
    learn: [
      "A clear request has four parts. Describe the facts. Express how you feel about them. Assert what you want, in plain words. Reinforce: say what's in it for them, or for the relationship. Then stay on that point without being pulled into side arguments.",
      "How you say it matters as much: be gentle, show interest in their side, and don't apologise for having needs or bend the truth to keep the peace.",
      "A boundary is not a rule for someone else. It is a statement of what you will do. 'If you shout, I'll leave the room and we can talk later.' People who fear being left tend either to give up all their boundaries or to push people away first. Both come from the same fear."
    ],
    intro: "Pick one real conversation you need to have.",
    f: [
      ["situation", "ta", "The situation and what you want out of it"],
      ["describe", "ta", "Describe: just the facts"],
      ["express", "ta", "Express: 'I feel…'"],
      ["assert", "ta", "Assert: 'I would like…' or 'No, I won't…'"],
      ["reinforce", "ta", "Reinforce: why this is good for them or for you both"],
      ["no", "ta", "What will you do if they say no?"],
      ["boundary", "ta", "A boundary you need: 'If ___, I will ___.'"]
    ],
    practice: "Have the conversation, or a smaller version of it. Make one small request and one small refusal this week." },

  { id: "e6", t: "A steadier sense of who you are", m: "Schema therapy · identity work",
    learn: [
      "If you learned early to become whatever kept people close or kept you safe, your sense of self can feel borrowed: one person with one friend, someone else with another, and empty when alone.",
      "A stable identity is not found by thinking harder about who you are. It is built from the outside in: noticing what you actually like and dislike, choosing values, and acting on them repeatedly until they feel like yours.",
      "There is also a part of you that has been watching all of this the whole time, in every mood and every role. That observer doesn't change. Learning to stand there is the steadiest place you have."
    ],
    intro: "Answer for yourself, not for anyone you want to please.",
    f: [
      ["true", "ta", "Things that stay true about you in every mood"],
      ["like", "ta", "Things you actually like and dislike (not what you think you should)"],
      ["roles", "ta", "Roles you play to be accepted"],
      ["values", "ta", "Five qualities you want to stand for"],
      ["act", "ta", "One way you'll act as that person this week"]
    ],
    practice: "Each evening, write one thing you did today that was your own choice and matched your values." }
  ]
},

{
  id: "mood", name: "Low mood and depression",
  blurb: "Behavioural activation, cognitive therapy, mindfulness-based work on rumination, and compassion-focused therapy for the inner critic.",
  sessions: [
  { id: "d1", t: "Action before motivation", m: "Behavioural activation",
    learn: [
      "Low mood shrinks your life. You do less, so less that is rewarding happens, so mood drops further, so you do less. Motivation disappears somewhere in that spiral, and waiting for it to return keeps you in the spiral.",
      "The way out runs backwards from how it feels it should. You act first, according to a plan and not according to mood, and the motivation follows the action. This is one of the best-evidenced treatments for depression there is.",
      "You need three kinds of activity: things that give some pleasure, things that give a sense of having done something, and things that connect you to people. Keep them small. Ten minutes counts. Your depressed mind will predict none of it will help; treat that as a prediction to test."
    ],
    intro: "Plan this week. Be specific about day and time.",
    f: [
      ["stopped", "ta", "What have you stopped doing since your mood dropped?"],
      ["pleasure", "ta", "Small things that used to give pleasure"],
      ["mastery", "ta", "Small things that give a sense of achievement"],
      ["connect", "ta", "Small ways to be in contact with people"],
      ["plan", "ta", "Three of these, each with a day and a time"],
      ["predict", "sc", "How much do you predict you'll get out of them?"]
    ],
    practice: "Do the three activities as planned, whatever you feel like. Rate your mood before and after each, and compare with your prediction." },

  { id: "d2", t: "Catching the thoughts", m: "Cognitive therapy",
    learn: [
      "Between something happening and your mood dropping, a thought goes by. It is fast, it sounds like your own voice, and it feels like plain fact. When you're low, these automatic thoughts are reliably tilted against you.",
      "The first skill is only to catch them. Not to argue yet. When your mood shifts, ask: what just went through my mind? Write it down word for word, as crude as it really was.",
      "One of them will carry most of the pain. That is the hot thought, and it is usually about what the situation says about you, other people, or the future."
    ],
    intro: "Use the most recent time your mood dropped.",
    f: [
      ["situation", "ta", "What was happening?"],
      ["feeling", "tx", "The feeling, and how strong (0–10)"],
      ["thoughts", "ta", "The thoughts, word for word"],
      ["hot", "ta", "The one that hurts most"],
      ["believe", "sc", "How much do you believe it right now?"]
    ],
    practice: "Catch and write down one automatic thought a day, at the moment your mood dips." },

  { id: "d3", t: "Thinking traps and a fairer view", m: "Cognitive restructuring",
    learn: [
      "Low mood bends thinking in predictable ways. All-or-nothing: one flaw means failure. Catastrophising: straight to the worst outcome. Mind-reading: assuming you know what they think. Fortune-telling: treating a prediction as fact. Emotional reasoning: I feel it, so it's true. Shoulds. Labelling yourself. Dismissing anything good. Taking the blame for things outside your control.",
      "The aim is not positive thinking. It is accurate thinking. You put the hot thought on trial: what is the evidence for it, what is the evidence against it, and what would you say to someone you love who thought this?",
      "Then you write a balanced thought that takes all the evidence into account. You don't have to believe it fully. If it moves the feeling by a point or two, it's working."
    ],
    intro: "Take the hot thought from last session, or a new one.",
    f: [
      ["hot", "ta", "The hot thought"],
      ["traps", "ck", "Which traps is it caught in?", ["all-or-nothing","catastrophising","mind-reading","fortune-telling","emotional reasoning","shoulds","labelling","dismissing the good","taking the blame","seeing only the bad"]],
      ["for", "ta", "Evidence for it (facts only)"],
      ["against", "ta", "Evidence against it"],
      ["friend", "ta", "What you'd say to a friend who thought this"],
      ["balanced", "ta", "A balanced thought that fits all the evidence"],
      ["now", "sc", "How much do you believe the original thought now?"]
    ],
    practice: "Do one full thought record on paper or here every other day. It gets faster." },

  { id: "d4", t: "Getting out of the loop", m: "Mindfulness-based cognitive therapy · rumination-focused CBT",
    learn: [
      "Rumination feels like problem-solving. It isn't. Problem-solving asks 'what can I do next?' and ends in a step. Rumination asks 'why am I like this, why did that happen, what's wrong with me?' and ends where it began, with a lower mood.",
      "Use a ten-minute test. If you have been going over something for ten minutes with no new understanding and no plan, you are in the loop. Arguing with the content doesn't work; you have to change what your attention is doing.",
      "Three exits. Turn one 'why' into 'what is one small thing I can do?'. Put your full attention on something absorbing and concrete. Or take a three-minute breathing space: notice what is here, narrow your attention to the breath, then widen it to your whole body."
    ],
    intro: "Get to know your own loop.",
    f: [
      ["topics", "ta", "What do you go round and round about?"],
      ["when", "ta", "When and where does it mostly happen?"],
      ["cost", "ta", "What does it cost you?"],
      ["why", "ta", "One 'why' question you keep asking"],
      ["how", "ta", "Rewrite it as 'what is one small thing I can do about this?' and answer it"],
      ["exits", "ta", "Your three loop-breakers"]
    ],
    practice: "When you catch the loop, use the ten-minute test and take one exit. Do the three-minute breathing space once a day." },

  { id: "d5", t: "The inner critic and the kinder voice", m: "Compassion-focused therapy",
    learn: [
      "The brain has a threat system, a drive system and a soothing system. Self-criticism runs on the threat system. Your brain reacts to your own attack roughly the way it would to someone else's: with stress hormones, shame and shutdown. That is why being hard on yourself doesn't produce change, only exhaustion.",
      "The critic usually started as protection. If I attack myself first, nobody else can surprise me. If I never let up, I won't fail or be rejected. Often it speaks in a voice borrowed from someone.",
      "Compassion is not letting yourself off. It is the tone a good coach or a wise friend would take: honest about what went wrong, and on your side. It switches on the soothing system, which is the state in which people actually change."
    ],
    intro: "Write what the critic says first, then answer it.",
    f: [
      ["says", "ta", "What does your critic say to you?"],
      ["tone", "tx", "Its tone of voice"],
      ["whose", "tx", "Whose voice does it remind you of?"],
      ["afraid", "ta", "What is it afraid would happen if it stopped?"],
      ["reply", "ta", "A reply in the voice of a wise, warm friend who knows the whole story"],
      ["phrase", "tx", "A short phrase to keep with you"]
    ],
    practice: "When the critic starts, put a hand on your chest, slow your breath and say your phrase. Write yourself one compassionate letter this week." }
  ]
},

{
  id: "anxiety", name: "Anxiety, worry and panic",
  blurb: "How anxiety keeps itself going, and the cognitive and exposure methods that reliably shrink it.",
  sessions: [
  { id: "a1", t: "How anxiety keeps itself going", m: "Cognitive behavioural therapy",
    learn: [
      "Anxiety is an alarm. It works by overestimating how likely and how bad the danger is, and underestimating your ability to cope. In a real emergency that bias saves you. The rest of the time it lies.",
      "When you avoid the thing, or get through it with a safety behaviour (checking, seeking reassurance, sitting by the exit, over-preparing), the anxiety drops. Your brain takes that drop as proof the danger was real and you only just escaped. So next time the alarm is louder.",
      "Left alone, anxiety rises, peaks and falls by itself. You never find that out if you always leave before the peak. Everything in this track is a way of staying long enough to learn something new."
    ],
    intro: "Lay out your own anxiety system.",
    f: [
      ["fear", "ta", "What are you afraid will happen?"],
      ["avoid", "ta", "What do you avoid because of it?"],
      ["safety", "ta", "What do you do to get through? (checking, reassurance, escape plans, over-preparing)"],
      ["payoff", "ta", "What does that give you in the short term?"],
      ["cost", "ta", "What has it cost you over time?"],
      ["without", "ta", "What would your life include if anxiety weren't making the decisions?"]
    ],
    practice: "Notice each time you avoid or use a safety behaviour this week. Just notice and note it." },

  { id: "a2", t: "Worry: the useful kind and the endless kind", m: "Worry management",
    learn: [
      "There are two kinds of worry. One is about a real problem that exists now and that you can do something about. The answer to that is a next step and a time to do it. The other is 'what if': things that haven't happened and may never. No amount of thinking resolves those, because there is nothing yet to solve.",
      "Chronic worry is mostly an attempt to get rid of uncertainty. It can't. The skill is learning to leave a question open and get on with your day.",
      "Give worry an appointment: twenty minutes at the same time and place each day. When a worry turns up outside that time, write it down and tell it you'll see it then. Most have dissolved by the time you get there."
    ],
    intro: "Empty your head onto the page, then sort.",
    f: [
      ["list", "ta", "Everything you're worried about"],
      ["real", "ta", "Which are real problems you can act on now? For each: the next step and when."],
      ["whatif", "ta", "Which are 'what ifs'?"],
      ["uncertain", "ta", "For the biggest 'what if': what uncertainty are you trying to get rid of? Could you live with not knowing yet?"],
      ["time", "tx", "Your daily worry appointment: time and place"]
    ],
    practice: "Postpone worries to your appointment every day this week. Deliberately leave one small thing uncertain each day (don't check, don't ask)." },

  { id: "a3", t: "Facing it one step at a time", m: "Exposure therapy",
    learn: [
      "Exposure is the most effective treatment for fear that exists. You approach what you fear in graded steps and stay long enough for your brain to learn two things: the disaster you predicted didn't happen, and you could bear the feeling.",
      "Build a ladder from the easiest version to the hardest. Start with a step that scares you about 3 or 4 out of 10. Before each step, write down exactly what you predict will happen. Afterwards, write what actually happened.",
      "Drop the safety behaviours while you do it, or the learning doesn't count. Repeat each step until it's boring, then move up. It is meant to be uncomfortable. It is not meant to be overwhelming."
    ],
    intro: "Choose one fear to work on.",
    f: [
      ["goal", "ta", "What do you want to be able to do?"],
      ["ladder", "ta", "Your ladder: eight to ten steps from easiest to hardest, each with a fear rating out of 10"],
      ["first", "tx", "Your first step, and when you'll do it"],
      ["predict", "ta", "What exactly do you predict will happen?"],
      ["actual", "ta", "Afterwards: what actually happened, and what did you learn?"]
    ],
    practice: "Do your first step at least three times this week. Come back and fill in what actually happened." },

  { id: "a4", t: "Panic and the body", m: "Interoceptive exposure",
    learn: [
      "A panic attack is the alarm going off with no fire. Adrenaline produces a pounding heart, tight chest, dizziness, tingling, breathlessness and a sense of unreality. Then the mind reads those sensations as heart attack, fainting or losing control, which releases more adrenaline.",
      "Panic peaks within about ten minutes and passes. It can't make you go mad. Fainting is very unlikely, because blood pressure rises in panic. Hormone shifts can cause palpitations too. If chest pain or breathlessness is new for you, get it checked once by a doctor so you know.",
      "The treatment is to bring on the sensations on purpose and find out they are harmless: spin in a chair, breathe through a straw, run on the spot, for thirty to sixty seconds. When you no longer fear the sensations, panic has nothing to feed on."
    ],
    intro: "Skip the body exercise if a doctor has told you to avoid exertion.",
    f: [
      ["sensations", "ta", "The sensations you get"],
      ["meaning", "ta", "What you fear they mean"],
      ["other", "ta", "Another explanation for the same sensations"],
      ["predict", "ta", "Pick one exercise (spinning, straw breathing, running on the spot). What do you predict?"],
      ["happened", "ta", "Do it for 30–60 seconds. What happened?"],
      ["say", "ta", "What you'll say to yourself next time panic starts"]
    ],
    practice: "Do one sensation exercise a day. Next time panic starts, stay where you are, slow your out-breath and let the wave pass." }
  ]
},

{
  id: "worth", name: "Shame and self-worth",
  blurb: "Where the feeling of not being good enough came from, and how self-respect is rebuilt.",
  sessions: [
  { id: "w1", t: "Shame and the rules you live by", m: "CBT for low self-esteem · shame resilience",
    learn: [
      "Guilt says 'I did something bad'. Shame says 'I am bad'. Guilt points to a repair. Shame only points to hiding, and it grows in secrecy.",
      "Low self-worth usually rests on one bottom-line belief, formed early: I'm not good enough, I'm unlovable, I'm a burden. To live with it, you built rules: 'If I keep everyone happy, I'm acceptable.' 'If I never make a mistake, nobody will see.' The rules keep you safe as long as you obey them, and they cost a great deal.",
      "Shame loosens when it is spoken to someone who responds with understanding. That includes the way you speak to yourself here."
    ],
    intro: "This is private. Write what's true.",
    f: [
      ["bottom", "tx", "Your bottom line about yourself, in one sentence"],
      ["learned", "ta", "Where and when did you learn it?"],
      ["rules", "ta", "Your rules: 'If I ___, then ___' and 'I must always ___'"],
      ["cost", "ta", "What do the rules cost you?"],
      ["secret", "ta", "Something you carry shame about (optional)"],
      ["friend", "ta", "What you would say to a friend carrying the same thing"],
      ["fair", "tx", "A fairer bottom line you're willing to try on"]
    ],
    practice: "Break one of your rules in a small way this week, on purpose, and see what happens." },

  { id: "w2", t: "Building self-respect on purpose", m: "Self-esteem work · positive data logging",
    learn: [
      "An old belief about yourself filters what you notice. Evidence that fits gets in; evidence that doesn't is dismissed as luck or politeness. So the belief never updates on its own. You have to collect the other evidence deliberately.",
      "Self-respect also comes from behaviour. Each time you keep a promise to yourself, act on your values when it's hard, or hold a boundary, you give yourself a reason to trust you.",
      "Your worth as a person was never something to be earned. What you are building here is the ability to feel that."
    ],
    intro: "This will feel awkward. Do it anyway.",
    f: [
      ["strengths", "ta", "Ten qualities or strengths you have (ask what people who like you would say)"],
      ["evidence", "ta", "Evidence from this week for three of them"],
      ["promise", "tx", "One promise to yourself for this week"],
      ["boundary", "ta", "One boundary that would show self-respect"],
      ["compliment", "tx", "What you'll say next time someone compliments you (try: 'thank you')"]
    ],
    practice: "Every evening, write three pieces of evidence for your fairer bottom line. Keep your promise." }
  ]
},

{
  id: "relationships", name: "Relationships",
  blurb: "Interpersonal therapy and communication work: the link between mood and the people in your life.",
  sessions: [
  { id: "p1", t: "Your relationship map", m: "Interpersonal therapy (IPT)",
    learn: [
      "Mood and relationships affect each other in both directions. Interpersonal therapy finds that most episodes of low mood are tied to one of four things: a loss, an ongoing conflict with someone important, a change of role (retirement, children leaving, illness, divorce, menopause), or too little real connection.",
      "Picture three rings around you. The inner ring holds the people you could call at 3am. The middle ring is friends and family you see and value. The outer ring is acquaintances, colleagues, neighbours.",
      "Seeing who is where, who gives you energy and who drains it, tells you where the work is."
    ],
    intro: "Draw your map in words.",
    f: [
      ["inner", "ta", "Inner ring"],
      ["middle", "ta", "Middle ring"],
      ["outer", "ta", "Outer ring"],
      ["energy", "ta", "Who gives you energy? Who drains it?"],
      ["area", "ck", "Which of these fits your life now?", ["a loss","an ongoing conflict","a change of role","not enough connection"]],
      ["change", "ta", "One relationship you want to change, and how"],
      ["neglected", "tx", "One you've neglected and miss"]
    ],
    practice: "Contact one person from the inner or middle ring this week with no agenda." },

  { id: "p2", t: "Conflict that goes somewhere", m: "Communication skills · couples research",
    learn: [
      "Four habits predict relationships going badly: criticism of the person instead of the behaviour, contempt, defensiveness, and stonewalling. Contempt does the most damage.",
      "How a conversation starts usually decides how it ends. A soft start has three parts: I feel this, about this specific thing, and I need this. No 'you always', no character verdicts.",
      "When your heart is pounding you can't listen. Call a break of at least twenty minutes and come back. Inside most recurring fights is a need neither person has said plainly. Find yours and say it."
    ],
    intro: "Pick a conflict that keeps repeating.",
    f: [
      ["conflict", "ta", "The conflict"],
      ["mine", "ta", "Your usual move"],
      ["theirs", "ta", "Their usual move"],
      ["cycle", "ta", "How each move triggers the other"],
      ["need", "ta", "What you actually need underneath your position"],
      ["start", "ta", "A soft start: 'I feel ___ about ___, and I need ___.'"],
      ["repair", "tx", "A phrase you can use to de-escalate"]
    ],
    practice: "Use your soft start once this week. If it heats up, call a twenty-minute break and return." },

  { id: "p3", t: "Loneliness and building connection", m: "Interpersonal therapy · loneliness research",
    learn: [
      "Loneliness is a signal like hunger. When it goes on a long time it also changes how you see people: the brain starts scanning for rejection and reads neutral faces as unfriendly. That makes you pull back further.",
      "Friendship is built mostly by repeated, low-stakes contact over time. Same place, same people, week after week. It takes many hours. It rarely arrives through one big effort.",
      "Most people are waiting for someone else to go first. Dormant ties, people you were once close to and lost touch with, are usually glad to hear from you."
    ],
    intro: "Be honest about how alone you feel.",
    f: [
      ["lonely", "sc", "How lonely have you been lately?"],
      ["story", "ta", "What does loneliness tell you about other people, and about you?"],
      ["dormant", "ta", "People you've lost touch with"],
      ["place", "ta", "One place you could show up regularly"],
      ["invite", "tx", "One small invitation you'll make this week"],
      ["no", "ta", "How you'll handle it if they say no or don't reply"]
    ],
    practice: "Send the invitation. Go to your regular place once." }
  ]
},

{
  id: "grief", name: "Grief and loss",
  blurb: "For deaths, and for the losses that don't get a funeral: health, a marriage, a career, the life you expected.",
  sessions: [
  { id: "g1", t: "Grief is not a problem to fix", m: "Dual-process model of grief",
    learn: [
      "Grief is what love does when the person or the thing is gone. It doesn't move through tidy stages. It comes in waves, and the waves don't follow a schedule.",
      "Healthy grieving swings between two modes: turning toward the loss (crying, remembering, missing) and turning toward life (tasks, plans, even laughing). You need both. Being stuck in only one is where people get into trouble.",
      "Losses without a death count: your health, a relationship, fertility, work, the childhood or the future you should have had. If more than a year has passed and the yearning is as intense as ever and you can't function, that is prolonged grief, and a grief specialist can help."
    ],
    intro: "Take your time with this one.",
    f: [
      ["lost", "ta", "What or who have you lost? Include losses nobody acknowledged."],
      ["miss", "ta", "What do you miss most?"],
      ["complicated", "ta", "What was complicated about it?"],
      ["avoiding", "ta", "What have you been avoiding? (places, objects, feelings, conversations)"],
      ["both", "ta", "How will you make room this week for both grieving and living?"]
    ],
    practice: "Set aside twenty minutes twice this week to turn toward the loss on purpose. Then do something that belongs to life." },

  { id: "g2", t: "Staying connected, saying what's unsaid", m: "Continuing bonds · empty-chair work",
    learn: [
      "The old advice was to let go and move on. Most people don't, and don't need to. The relationship continues in a different form: in what they taught you, in what you carry, in the conversations you still have with them in your head.",
      "What keeps grief stuck is often unfinished business. The thing you never said. The apology you never got or never gave. The anger you weren't allowed to have at someone who died.",
      "You can still say it. Writing the letter, or saying it aloud to an empty chair, finishes something even though they can't answer."
    ],
    intro: "Write to them directly.",
    f: [
      ["letter", "ta", "The letter: what you never said"],
      ["reply", "ta", "What you imagine they would say back"],
      ["carry", "ta", "What you carry from them"],
      ["ritual", "ta", "A small ritual to mark them (a date, a place, a recipe, a song)"],
      ["permission", "ta", "A permission you need to give yourself"]
    ],
    practice: "Read your letter aloud once, somewhere private. Do your ritual." }
  ]
},

{
  id: "trauma", name: "Trauma",
  blurb: "A staged approach: understanding, stabilising, working with what the trauma taught you to believe, telling the story at your pace, and taking your life back.",
  caution: "Go slowly here. If you have flashbacks that take you over, lose time, or get urges to harm yourself, do this track alongside a trauma therapist. EMDR, cognitive processing therapy and prolonged exposure work well and need a trained person in the room.",
  sessions: [
  { id: "t1", t: "What trauma does, and why you are not broken", m: "Trauma psychoeducation",
    learn: [
      "Trauma is what happens when an experience overwhelms your ability to cope. The brain's alarm stays switched on afterwards, and the memory is stored in raw fragments (images, sounds, body sensations) that come back as if it were happening now.",
      "That produces four groups of symptoms: reliving it, avoiding reminders, a darker view of yourself and the world, and being constantly on guard. All four are a normal brain reacting to something abnormal.",
      "During the event your body chose fight, flight, freeze or appease in a fraction of a second. You didn't choose it, and freezing or going along is not consent or weakness. Healing has three stages: safety, processing, and reconnecting with life. You set the pace."
    ],
    intro: "You don't need to describe what happened. Only how it lives in you now.",
    f: [
      ["shows", "ck", "How does it show up?", ["nightmares","flashbacks","intrusive memories","avoiding places or people","avoiding feelings","numbness","always on guard","jumpy","anger","shame","guilt","trouble trusting","feeling unreal or far away","sleep problems"]],
      ["response", "ck", "Which survival responses do you recognise in yourself?", ["fight","flight","freeze","appease / fawn"]],
      ["coped", "ta", "How have you coped until now? No judgement."],
      ["healing", "ta", "What would healing look like for you?"],
      ["support", "ta", "Who and what supports you?"]
    ],
    practice: "When a symptom shows up, say to yourself: 'This is my alarm system. It's doing what it learned. I'm safe right now.'" },

  { id: "t2", t: "Safety first", m: "Stabilisation",
    learn: [
      "Before going near the memory, you need reliable ways to come back to the present. Grounding does that: say the date, your age and where you are; press your feet into the floor; name five things you can see; hold something cold.",
      "Two imagery tools. The calm place: somewhere real or invented where you feel settled, built in detail with all your senses. The container: a strong box or vault where you can put a memory until you choose to work on it. Slow alternate tapping on your shoulders with crossed arms can deepen the calm.",
      "The aim is dual awareness: one foot in the memory, one foot firmly here. That was then. This is now."
    ],
    intro: "Build your kit, then test it.",
    f: [
      ["triggers", "ta", "Your triggers: sounds, smells, places, dates, kinds of people, situations"],
      ["signs", "ta", "Early signs that you're being pulled out of the present"],
      ["statement", "ta", "Your grounding statement: 'I am ___, I'm ___ years old, it's ___, I'm in ___, and that is over.'"],
      ["before", "sc", "Distress right now"],
      ["place", "ta", "Your calm place, in detail: what you see, hear, smell and feel on your skin"],
      ["container", "ta", "Your container: what it looks like and what you're putting in it for now"],
      ["after", "sc", "Distress now"]
    ],
    practice: "Visit your calm place for two minutes every day. Use your grounding statement at the first sign of a trigger. The calm place exercise under Deeper → EMDR adds slow left-right sets to deepen it." },

  { id: "t3", t: "Stuck points: what it taught you to believe", m: "Cognitive processing therapy",
    learn: [
      "After trauma the mind tries to make sense of it in one of two ways. It bends the event to fit old beliefs ('it must have been my fault', 'I should have stopped it'). Or it throws out the old beliefs entirely ('nowhere is safe', 'nobody can be trusted', 'I'm ruined'). These are stuck points, and they keep the trauma alive more than the memory does.",
      "They gather around five themes: safety, trust, power and control, self-worth, and closeness.",
      "Watch for hindsight bias. You are judging what you did then using what you only learned afterwards. And keep responsibility where it belongs: you may have been present, but blame belongs to whoever chose to cause harm."
    ],
    intro: "Write about what it means, not the details of what happened.",
    f: [
      ["impact", "ta", "Why do you believe it happened? How did it change how you see yourself, other people and the world?"],
      ["stuck", "ta", "Your stuck points, one per line"],
      ["one", "tx", "Pick one to examine"],
      ["for", "ta", "Evidence for it"],
      ["against", "ta", "Evidence against it"],
      ["hindsight", "ta", "Are you judging your past self with knowledge you only had later? What did you actually know and feel at the time?"],
      ["other", "ta", "What would you say to someone else this happened to?"],
      ["accurate", "ta", "A more accurate statement"]
    ],
    practice: "Each time a stuck point shows up this week, write it down and write the more accurate statement next to it." },

  { id: "t4", t: "Telling the story, at your pace", m: "Written exposure · narrative work",
    caution: "Start with a memory that is moderately upsetting, not the worst one. Begin only if your distress is 6 or below. If you tend to dissociate or get urges to harm yourself, do this with a therapist, not alone.",
    learn: [
      "Avoiding a memory keeps it raw. Each time you push it away, the brain files it under 'still dangerous'. Writing it out in detail, more than once, lets the brain finally store it as something that happened in the past and is over.",
      "Write it as it happened, in order, including what you saw, heard, felt in your body and thought. Past tense. Don't worry about spelling. About half an hour is enough.",
      "The first time is the hardest. With each repetition the distress usually drops. Ground yourself before and after. If you feel yourself leaving the room, stop, use your grounding statement, and come back to it another day or with help."
    ],
    intro: "Check in with yourself first. You can stop at any point.",
    f: [
      ["before", "sc", "Distress before starting"],
      ["ready", "ck", "Before you begin", ["I've chosen a moderate memory","my grounding statement is ready","I have time afterwards to look after myself"]],
      ["account", "ta", "What happened, as it happened"],
      ["after", "sc", "Distress now"],
      ["noticed", "ta", "What did you notice while writing?"],
      ["know", "ta", "What do you know now that you didn't know then?"],
      ["care", "ta", "What will you do in the next hour to look after yourself?"]
    ],
    practice: "Write or re-read the same memory on three or four more days. Distress usually falls each time. If it rises every time or you feel unsafe, stop and bring in a therapist." },

  { id: "t5", t: "Guilt, shame and anger", m: "Trauma-focused cognitive and compassion work",
    learn: [
      "Survivors blame themselves because self-blame offers an illusion of control: if it was my fault, I could have prevented it, and I can prevent it next time. The price of that illusion is shame.",
      "Try a responsibility pie. List everyone and everything that contributed, including the person who did it, the adults who didn't protect you, the circumstances, and what you could realistically have known and done at that age and in that state. Then give each a share. Your slice usually shrinks dramatically.",
      "Anger is the healthy response to being violated. Many survivors turn it on themselves because it wasn't safe to feel it toward the person responsible. Part of healing is pointing it back where it belongs, on paper."
    ],
    intro: "Be as fair to yourself as you would be to anyone else.",
    f: [
      ["blame", "ta", "What do you blame yourself for?"],
      ["pie", "ta", "Responsibility pie: everyone and everything that contributed, with a percentage each"],
      ["realistic", "ta", "What could a person of that age, in that situation, realistically have done?"],
      ["anger", "ta", "Where does the anger belong?"],
      ["letter", "ta", "An unsent letter to the person or to what happened"],
      ["younger", "ta", "What you want to say to the you who went through it"]
    ],
    practice: "When self-blame comes up, look at your pie. Read your words to your younger self once a day." },

  { id: "t6", t: "Taking your life back", m: "Reconnection · post-traumatic growth",
    learn: [
      "Trauma takes territory: places you don't go, things you don't do, people you don't let close, parts of yourself you shut down. The last stage is taking it back, one piece at a time, using the graded-steps method.",
      "Trust isn't all or nothing. You extend a little, watch what the person does with it, and extend more if they earn it.",
      "Meaning after trauma is not 'it happened for a reason'. It is what you decide to do with your life afterwards. Many survivors find they are stronger and clearer about what matters than they realised. What happened is a chapter of your story. It is not the title."
    ],
    intro: "Look forward.",
    f: [
      ["took", "ta", "What did it take from you? Places, activities, people, parts of yourself."],
      ["reclaim", "ta", "What do you want back first, and what's the first small step?"],
      ["trust", "ta", "Who has earned some trust, and how could you extend a little more?"],
      ["strength", "ta", "What have you learned about your own strength?"],
      ["title", "tx", "A title for your next chapter"]
    ],
    practice: "Take your first reclaiming step. Repeat it until it's ordinary." }
  ]
},

{
  id: "roots", name: "Childhood and the roots of your patterns",
  blurb: "Schema therapy, attachment, parts work and psychodynamic ideas: why you are the way you are, and how the old patterns are changed at the root.",
  sessions: [
  { id: "r1", t: "What you needed as a child", m: "Attachment · developmental needs",
    learn: [
      "Every child needs a handful of things: safety and a dependable bond; room to become capable and separate; freedom to say what they feel and need; play; and fair limits. No parent meets all of these perfectly. When one is seriously unmet, the child adapts.",
      "Harm isn't only what was done. Emotional neglect is what didn't happen: nobody noticing, nobody asking, nobody comforting. It leaves no memory to point to, only a sense that your feelings don't matter.",
      "Children almost always conclude that the problem is them. It is safer for a child to believe 'I am bad' than 'the people I depend on can't look after me'. Understanding this is not about blaming your parents. It is about finally getting the facts right."
    ],
    intro: "Rate how well each need was met, then describe home.",
    f: [
      ["safety", "sc", "Safety and a dependable bond"],
      ["autonomy", "sc", "Encouragement to be capable and separate"],
      ["express", "sc", "Freedom to say what you felt and needed"],
      ["play", "sc", "Play and lightness"],
      ["limits", "sc", "Fair, consistent limits"],
      ["home", "tx", "What home felt like, in three words"],
      ["role", "ck", "The role you played", ["the good one","the fixer","the invisible one","the problem","the caretaker","the achiever","the peacemaker","the clown"]],
      ["tobe", "ta", "What did you learn you had to be or do to be loved or left alone?"],
      ["unsaid", "ta", "What did you never get to say?"]
    ],
    practice: "Notice when your childhood role switches on this week. Just notice." },

  { id: "r2", t: "Your life-traps", m: "Schema therapy",
    learn: [
      "A schema is a deep theme about yourself and other people, laid down in childhood, that feels like plain truth. When one is triggered you react with the full emotional force of the child who formed it. This is the usual answer to 'why do I keep reacting like this when I know better?'",
      "Schemas keep themselves alive in three ways. You surrender to them (pick people who confirm them). You avoid anything that might trigger them. Or you overcompensate by doing the extreme opposite. All three stop the schema from ever being tested.",
      "A schema was an accurate conclusion about the world you grew up in. It is a poor guide to the world you live in now."
    ],
    intro: "Tick any that ring true, then go deeper on your top two.",
    f: [
      ["schemas", "ck", "Which of these do you recognise?", ["people leave (abandonment)","people will hurt or use me (mistrust)","my needs won't be met (emotional deprivation)","something is wrong with me (defectiveness)","I don't belong (isolation)","I can't cope alone (dependence)","disaster is coming (vulnerability)","I have no self apart from them (enmeshment)","I will fail (failure)","I must give in (subjugation)","others' needs come first (self-sacrifice)","I need approval (approval-seeking)","I must not show feelings (inhibition)","nothing is ever good enough (unrelenting standards)","mistakes deserve punishment (punitiveness)","expect the worst (pessimism)"]],
      ["top", "tx", "Your top two"],
      ["origin", "ta", "Where did each come from? Your earliest memory of the feeling."],
      ["today", "ta", "How does each show up in your life now?"],
      ["cope", "ta", "Do you surrender to it, avoid it, or overcompensate? How?"],
      ["then", "ta", "What makes it a conclusion from then, and not a fact about now?"]
    ],
    practice: "When you overreact this week, ask: which schema just got triggered, and how old do I feel right now?" },

  { id: "r3", t: "The parts of you", m: "Internal Family Systems-informed parts work · schema modes",
    learn: [
      "You are not one single voice. There are young, hurt parts that carry old pain. There are protectors that work to keep that pain from being felt: some by managing (the perfectionist, the pleaser, the controller, the critic), and some by putting out fires (numbing, bingeing, raging, shutting down).",
      "None of them is bad. Each took on its job when you were young and had no better option, and most are exhausted. The behaviour you 'can't change' is usually a protector that doesn't yet trust it is safe to stop.",
      "Underneath the parts is you: calm, curious, able to be kind. From there you can turn toward a part and ask about it. Start by changing 'I am furious' to 'a part of me is furious'. That small gap is where the work happens."
    ],
    intro: "Approach your parts with curiosity. If one feels too much, step back and ground yourself.",
    f: [
      ["parts", "ta", "Name three parts of you and what each one does"],
      ["one", "tx", "Choose one protector to get to know"],
      ["since", "ta", "How long has it been doing this job? When did it start?"],
      ["fear", "ta", "Ask it: what are you afraid would happen if you stopped?"],
      ["protects", "ta", "What younger feeling is it protecting?"],
      ["thanks", "ta", "What do you want to say to it?"],
      ["needs", "ta", "What does the younger part underneath need?"]
    ],
    practice: "Use 'a part of me…' language all week. When a protector takes over, thank it and ask what it's worried about." },

  { id: "r4", t: "Giving yourself what was missing", m: "Imagery rescripting · reparenting",
    caution: "Choose a memory that is sad or painful but not overwhelming. Leave the worst ones for work with a therapist.",
    learn: [
      "Knowing your schemas don't make sense doesn't stop them hurting, because they are stored as feeling, not logic. Imagery reaches the feeling. In rescripting, you go back to a childhood moment in your mind, and this time your adult self walks in.",
      "You do what should have been done then. You stand between the child and whoever was hurting them. You say what should have been said. You comfort the child and take them somewhere safe. The brain treats vivid imagery much like experience, and the meaning of the memory starts to change.",
      "Then there is daily reparenting: being to yourself, now, the steady adult you needed. Comfort when you're hurting, limits when you need them, encouragement when you're scared."
    ],
    intro: "Close your eyes for each step before you write.",
    f: [
      ["memory", "ta", "A memory of a time you needed someone and nobody came"],
      ["child", "ta", "What did the child feel, and what did they need?"],
      ["rescript", "ta", "You walk in as the adult you are now. What do you do and say?"],
      ["now", "ta", "What does the child feel now?"],
      ["letter", "ta", "A letter to your younger self"],
      ["daily", "tx", "One daily act of reparenting"]
    ],
    practice: "Do your daily act. When you're distressed, ask: how old do I feel, and what does that child need from me?" },

  { id: "r5", t: "Grieving what you didn't get", m: "Psychodynamic therapy · grief work",
    learn: [
      "A great deal of adult stuckness is a child still waiting. Waiting for a parent to finally see you, apologise, be proud, become who they should have been. The waiting can run a whole life: the same hope carried into partners, bosses and friends.",
      "The way through is grief. Accepting that the childhood you deserved is not coming, and mourning it. This is among the hardest things in therapy and one of the most freeing.",
      "Anger and love can exist together. You can understand why they were the way they were and still be clear it wasn't good enough. Forgiveness is optional. What matters is deciding, as an adult, what relationship you want with them now and on what terms."
    ],
    intro: "Let both the anger and the sadness have room.",
    f: [
      ["didnt", "ta", "What didn't you get?"],
      ["angry", "ta", "What are you angry about?"],
      ["love", "ta", "What do you miss, or still love?"],
      ["hoping", "ta", "What are you still hoping they will do or say?"],
      ["energy", "ta", "If you stopped waiting, what would you do with that energy?"],
      ["now", "ta", "The relationship you choose with them now, and your limits"]
    ],
    practice: "Notice this week where you look to someone else for what your parent didn't give. Give a little of it to yourself." },

  { id: "r6", t: "How it plays out in love and closeness", m: "Attachment theory",
    learn: [
      "Your early bond set a template for closeness. Anxious attachment: fear of being left, needing reassurance, protesting when someone pulls back. Avoidant: discomfort with dependence, needing space, shutting down when things get close. Disorganised: wanting closeness and fearing it at once. Secure: able to be close and to be apart.",
      "People are drawn to what is familiar, which is not the same as what is good for them. That is why the same relationship can keep turning up with a different face. Old feelings about a parent get projected onto a partner like an old film on a new screen.",
      "The template can change. Each time you make the secure move instead of the old one (say the need plainly, stay instead of fleeing, soothe yourself instead of protesting), it updates."
    ],
    intro: "Think about your closest relationships, past and present.",
    f: [
      ["pattern", "ta", "What do you tend to do when you get close to someone?"],
      ["trigger", "ta", "What sets off your alarm in closeness?"],
      ["do", "ta", "What do you do then? (cling, test, protest, withdraw, go cold)"],
      ["afraid", "ta", "What are you really afraid of in that moment?"],
      ["echo", "ta", "Who does this feeling remind you of?"],
      ["secure", "ta", "The secure move you'll try instead"],
      ["ask", "ta", "What you need to ask for, in plain words"]
    ],
    practice: "Next time the alarm goes off, pause, name it ('that's the old film') and make the secure move once." }
  ]
},

{
  id: "meaning", name: "Acceptance, values and meaning", always: true,
  blurb: "Acceptance and commitment therapy and existential work, for what can't be changed and for building a life worth having alongside it.",
  sessions: [
  { id: "c1", t: "What you can't change", m: "Acceptance and commitment therapy · radical acceptance",
    learn: [
      "Some things do not yield to effort: another person, the past, a diagnosis, certain losses, parts of your own temperament. Fighting them adds a second layer of suffering on top of the pain that was already there.",
      "Acceptance does not mean liking it, agreeing with it or giving up. It means you stop spending yourself on the fight with reality, so the energy is available for what can still be done.",
      "It helps to sort: what is in my control, what can I influence, what is outside both. Things that 'won't change' often turn out to be a loss that hasn't been grieved, or a choice you have but don't want to make because every option costs something."
    ],
    intro: "Pick the thing that isn't changing.",
    f: [
      ["what", "ta", "What isn't changing?"],
      ["fight", "ta", "Everything you've done to fight, fix or escape it"],
      ["cost", "ta", "What the fight has cost you"],
      ["control", "ta", "What part is in your control?"],
      ["influence", "ta", "What part can you influence but not control?"],
      ["outside", "ta", "What part is outside your control?"],
      ["free", "ta", "If you stopped fighting the part you can't change, what would that free up?"],
      ["willing", "ta", "'I don't like it, I didn't choose it, and I'm willing to ___.'"]
    ],
    practice: "When the fight starts up, say: 'This is how it is right now.' Then ask what matters to you in the next hour." },

  { id: "c2", t: "Unhooking from your mind", m: "Cognitive defusion",
    learn: [
      "The mind is a story-telling machine. It produces judgements, predictions and old stories all day, and it presents them as reality. Being fused with a thought means seeing the world through it without noticing it's there.",
      "You don't have to win an argument with a thought to be free of it. You can step back and see it as a thought. Put 'I'm having the thought that…' in front of it. Name the story: 'ah, the not-good-enough story again.' Thank your mind for its input. Say the thought in a cartoon voice.",
      "The thought may stay. What changes is how much it gets to steer."
    ],
    intro: "Use a thought that has hooked you for years.",
    f: [
      ["thought", "ta", "The thought"],
      ["having", "ta", "Write it again starting with 'I'm having the thought that…'"],
      ["story", "tx", "Give the story a name"],
      ["hooked", "ta", "When you're hooked by it, what do you do?"],
      ["free", "ta", "If it were just words passing through, what would you do instead?"],
      ["voice", "ta", "Say it aloud slowly in a silly voice, ten times. What happened to it?"]
    ],
    practice: "Each day, catch one sticky thought and name the story it belongs to." },

  { id: "c3", t: "Your compass", m: "Values work",
    learn: [
      "A goal is something you finish. A value is a direction you keep travelling in: being a loving parent, being honest, staying curious, looking after your body. You can act on a value today whatever your mood and whatever your circumstances.",
      "Pain and values are two sides of one coin. You hurt where you care. Loneliness points to how much connection matters to you. Shame about work points to wanting to contribute. Turn the pain over and read what's on the back.",
      "When feeling better is the only goal, life gets smaller. When living by your values is the goal, feeling better tends to follow."
    ],
    intro: "Write what you want to stand for, not what you think you should.",
    f: [
      ["relationships", "ta", "Relationships: what kind of partner, parent, friend, relative do you want to be?"],
      ["work", "ta", "Work and contribution: what do you want to give?"],
      ["health", "ta", "Body and mind: how do you want to treat yourself?"],
      ["growth", "ta", "Growth, play, spirit: what makes you feel alive?"],
      ["living", "sc", "Overall, how closely are you living by these right now?"],
      ["gap", "ta", "Where is the biggest gap?"],
      ["pain", "ta", "What does your pain tell you that you care about?"]
    ],
    practice: "Each morning pick one value and one small act that expresses it. Do it." },

  { id: "c4", t: "A life that means something to you", m: "Committed action · logotherapy",
    learn: [
      "Viktor Frankl, who survived the camps, concluded that people can bear almost anything if they have a reason. He saw three sources of meaning: what you create or do, what you love and experience, and the stance you take toward suffering you can't avoid.",
      "Meaning isn't waiting to be discovered. It is built from small actions repeated in the direction of what you value, with the discomfort included. Willingness to feel anxious, sad or unsure while you do the thing is the price of admission.",
      "Imagine your eightieth birthday. Someone who knows you well stands up to say what your life was about. What do you want them to be able to say?"
    ],
    intro: "Think long, then act small.",
    f: [
      ["eighty", "ta", "What do you want them to say about you at eighty?"],
      ["goal", "ta", "One goal for the next thirty days that moves toward that"],
      ["step", "tx", "The first step, small enough to do in the next 24 hours"],
      ["room", "ta", "What feelings will you have to make room for?"],
      ["quit", "ta", "What you'll say to yourself when you want to quit"]
    ],
    practice: "Take the first step within 24 hours. Then the next one." }
  ]
},

{
  id: "staying", name: "Staying well", always: true,
  blurb: "Consolidating what you've learned, building your early-warning plan, and graduating.",
  sessions: [
  { id: "s1", t: "Looking back: what changed", m: "Consolidation",
    learn: [
      "Therapy has worked when you have become your own therapist: you can spot what is happening, you know what helps, and you do it.",
      "Before finishing, it's worth getting clear about what actually changed and what caused it. People who can explain their own improvement keep it far better than those who just feel better and don't know why.",
      "Open your Progress page alongside this and look at where your scores started."
    ],
    intro: "Read back through some of your early sessions first.",
    f: [
      ["started", "ta", "Where you started, in your own words"],
      ["different", "ta", "What is different now?"],
      ["tools", "ta", "The five tools that helped most"],
      ["why", "ta", "What you now understand about why you struggled"],
      ["unfinished", "ta", "What still needs work?"]
    ],
    practice: "Tell one person what you've learned about yourself." },

  { id: "s2", t: "Your early-warning system", m: "Relapse prevention",
    learn: [
      "Setbacks will come. A lapse is a bad patch. A relapse is a bad patch plus the conclusion 'I'm back to square one, nothing worked.' What you do in the first week decides which one it becomes.",
      "Everyone has a relapse signature: the particular first signs. Sleeping badly, cancelling plans, more wine, snapping, the old thoughts returning. Catch it at that stage and it takes days to turn around.",
      "A good plan has three levels. Green: what keeps you well. Amber: what you do at the first signs. Red: who you contact and what help you get when you can't turn it yourself."
    ],
    intro: "Write this for the version of you who will need it on a bad day.",
    f: [
      ["signs", "ta", "Your early signs: in your thoughts, your behaviour and your body"],
      ["risk", "ta", "Situations and times of year that put you at risk"],
      ["amber", "ta", "Amber plan: what you'll do in the first week of slipping"],
      ["red", "ta", "Red plan: who you'll contact, and at what point you'll see a professional"],
      ["others", "ta", "What should the people close to you watch for, and what should they say?"],
      ["note", "ta", "A note to yourself for a bad day"]
    ],
    practice: "Share your early signs with someone you trust." },

  { id: "s3", t: "The life that keeps you well", m: "Wellbeing · positive psychology",
    learn: [
      "Staying well is mostly ordinary. A handful of non-negotiables that protect you: sleep, movement, contact with people, something that matters, and time that belongs to you.",
      "Three practices have steady evidence behind them: noticing and lingering on good moments, writing down what you're grateful for, and using your strengths in new ways.",
      "Keep one weekly ritual: ten minutes to ask how you are, what you need, and what you're neglecting."
    ],
    intro: "Design your maintenance.",
    f: [
      ["daily", "ta", "Your daily and weekly non-negotiables"],
      ["close", "ta", "People to keep close"],
      ["out", "ta", "What to keep out of your life, or limit"],
      ["review", "tx", "Your weekly review: day and time"],
      ["forward", "ta", "Something you're building or looking forward to"]
    ],
    practice: "Hold your first weekly review." },

  { id: "s4", t: "Graduation", m: "Ending well",
    learn: [
      "Endings matter. Marking this one tells your mind that the change is real and belongs to you.",
      "After today the app shifts to maintenance: a short check-in every two weeks at first, then monthly. If your scores climb, it will suggest a booster. If they stay low for three months, you're done with check-ins too, unless you want them.",
      "Coming back is not failing. Knowing when to pick the tools up again is the skill you were building all along."
    ],
    intro: "Last piece of writing.",
    f: [
      ["letter", "ta", "A letter to yourself to read on a hard day"],
      ["proud", "ta", "What you're proud of"],
      ["booster", "ta", "How you'll know you need a booster"],
      ["commit", "ta", "Your commitment to yourself"]
    ],
    practice: "Keep your weekly review. Check in here when prompted.",
    graduation: true }
  ]
}
];

/* The order tracks are worked through. Stabilising skills come before the deeper work. */
IW.trackOrder = ["foundations","menopause","emotions","mood","anxiety","worth","relationships","grief","trauma","roots","meaning","staying"];
