const basStudentProfileNotes = {
    1: {
        about: ["Introduces BAS through its student writers and the questions they bring to science.", "يعرّف بمجلّة بشائر من خلال كتّابها التلاميذ والأسئلة التي يطرحونها عن العلم."],
        voice: ["I could bring ideas from my classmates to the club and help turn them into magazine stories.", "فيني آخد أفكار رفقاتي عالنادي ونحوّلها سوا لمقالات بالمجلّة."],
    },
    2: {
        subject: "biology",
        about: ["Looks beyond the mushrooms we see to explore the hidden world of fungi.", "تتجاوز في مقالها الفطر الذي نراه لتستكشف عالم الفطريّات الخفيّ."],
        voice: ["We could look for fungi in places we pass every day and write about what we find.", "فينا ندوّر عالفطريّات بأماكن منمرق فيها كل يوم ونكتب شو لقينا."],
    },
    3: {
        subject: "biology",
        about: ["Uses glowing organisms to bring readers closer to an unusual side of life.", "تقرّب القارئ من جانب غير مألوف من عالم الأحياء من خلال الكائنات المضيئة."],
        voice: ["What other creatures can glow? That’s a question we could take to the club.", "شو في كائنات تانية بتضوّي؟ هيدا سؤال فينا نبحث فيه سوا بالنادي."],
    },
    4: {
        subject: "biology",
        about: ["Finds the science behind an everyday food by following how natural sourdough changes a dough.", "تبحث عن العلم في طعامٍ نأكله كلّ يوم، وتتتبّع كيف يغيّر التخمير الطبيعي العجين."],
        voice: ["We could try two doughs and see which one rises first, then share what happens.", "فينا نجرّب نوعين عجين ونشوف أي واحد بيختمر قبل، ونشارك النتيجة بالمجلّة."],
    },
    8: {
        about: ["Asks how algorithms and artificial intelligence can shape the way students think and learn.", "تطرح سؤالًا عن أثر الخوارزميّات والذكاء الاصطناعي في طريقة تفكير التلاميذ وتعلّمهم."],
        voice: ["The club would be a place to talk about when AI helps us learn and when it does the thinking for us.", "بالنادي فينا نحكي عن إمتى الذكاء الاصطناعي بيساعدنا نتعلّم، وإمتى منخلّيه يفكّر عنّا."],
    },
    10: {
        subject: "physics",
        about: ["Uses the future of space travel to ask how far people might be able to go.", "تطرح من خلال مستقبل السفر الفضائي سؤالًا عن المسافة التي يمكن للبشر أن يبلغوها."],
        voice: ["We could start with one question in the club: what would we need to get to Mars?", "بالنادي فينا نبلّش من سؤال واحد: شو منحتاج لنوصل عالمريخ؟"],
    },
    11: {
        subject: "physics",
        about: ["Connects changes in our climate with how sunlight and heat move through the atmosphere.", "تربط تغيّرات المناخ بكيفيّة انتقال ضوء الشمس والحرارة في الغلاف الجويّ."],
        voice: ["We could look for examples of climate change close to home and tell those stories in the magazine.", "فينا ندوّر عأمثلة عن تغيّر المناخ من بيئتنا ونحكي عنها بالمجلّة."],
    },
    12: {
        subject: "chemistry",
        about: ["Explores how the properties of gold explain its uses beyond jewellery.", "تبحث كيف تفسّر خصائص الذهب استعمالاته خارج عالم المجوهرات."],
        voice: ["We could compare metals in the club and see what makes gold useful in a phone.", "فينا نقارن معادن بالنادي ونشوف شو اللي بيخلّي الذهب ينفع بالتليفون."],
    },
    13: {
        subject: "chemistry",
        about: ["Turns an everyday expression about gold into a question about trace elements in the body.", "تحوّل تعبيرًا مألوفًا عن الذهب إلى سؤال عن العناصر الموجودة بكميّات ضئيلة في الجسم."],
        voice: ["We could take a question like “Is there gold in our bodies?” and see where the evidence leads us.", "فينا ناخد سؤال متل «في ذهب بجسمنا؟» ونشوف لوين بيوصّلنا الدليل."],
    },
    14: {
        subject: "chemistry",
        about: ["Takes a question from the breakfast table and investigates how starch can be detected in labneh.", "تنطلق من مائدة الفطور وتبحث كيف يمكن الكشف عن النشاء في اللبنة."],
        voice: ["With the club, a question about labneh could turn into an experiment worth writing about.", "بالنادي، سؤال عن اللبنة ممكن يصير تجربة تستاهل نكتب عنها بالمجلّة."],
    },
    15: {
        subject: "biology",
        about: ["Follows the changes in cut watermelon and asks what affects how long it stays fresh.", "تتتبّع ما يتغيّر في البطيخ بعد تقطيعه، وتسأل عمّا يؤثّر في مدّة بقائه طازجًا."],
        voice: ["We could compare two pieces of watermelon and see what keeps one fresh for longer.", "فينا نقارن قطعتين بطّيخ ونشوف شو بيخلّي وحدة تضلّ طازة أكتر."],
    },
    16: {
        subject: "biology",
        about: ["Uses optical illusions to ask how the brain makes sense of what the eyes see.", "تستخدم الأوهام البصريّة لتسأل كيف يفسّر الدماغ ما تراه العينان."],
        voice: ["I could bring an optical illusion to the club and see if we all notice the same thing.", "فيني جيب خدعة بصريّة عالنادي وشوف إذا كلّنا مننتبه لنفس الشي."],
    },
    17: {
        subject: "biology",
        about: ["Explains the body’s defences through the image of an army that protects us from within.", "يشرح دفاعات الجسم من خلال تشبيه الجهاز المناعيّ بجيش يحمينا من الداخل."],
        voice: ["We could make a simple model of how the body defends itself and use it to explain immunity.", "فينا نعمل نموذج بسيط عن كيف جسمنا بيدافع عن حاله ونستعمله لنشرح المناعة."],
    },
    18: {
        subject: "biology",
        about: ["Follows the repair of the skin and makes the stages of wound healing easier to picture.", "تتتبّع ترميم الجلد، وتقرّب مراحل التئام الجروح من القارئ."],
        voice: ["We could make a model of how skin heals and use it to explain my article.", "فينا نعمل نموذج بيفرجي كيف الجلد بيلتئم ونستعمله لشرح مقالي."],
    },
    19: {
        subject: "biology",
        about: ["Explores how the body supports the growth of a new life during pregnancy.", "تستكشف كيف يدعم الجسم نموّ حياة جديدة خلال الحمل."],
        voice: ["We could use drawings to explain how a baby grows before birth and share them in the magazine.", "فينا نستعمل رسومات لنوضّح كيف بيكبر البيبي قبل الولادة ونشاركها بالمجلّة."],
    },
    20: {
        subject: "biology",
        about: ["Connects sport with the changes we can notice in our bodies during exercise.", "تربط الرياضة بالتغيّرات التي نلاحظها في أجسامنا أثناء التمرين."],
        voice: ["At the club, we could compare our pulse before and after moving and write about what changes.", "بالنادي فينا نقارن نبضنا قبل الحركة وبعدها ونكتب شو تغيّر."],
    },
    21: {
        subject: "chemistry",
        about: ["Starts with a glass of water and asks what tests can reveal about what’s inside it.", "يبدأ بكأس ماء ويسأل عمّا يمكن أن تكشفه الفحوص عمّا فيه."],
        voice: ["We could take two samples of water that look the same and see what a test can tell us about them.", "فينا ناخد عيّنتين ميّ شكلن نفس الشي ونشوف شو بيخبرنا الفحص عنهن."],
    },
    22: {
        about: ["Examines the difference between using AI in class and understanding what it tells us.", "يركّز على الفرق بين استخدام الذكاء الاصطناعيّ في الصف وفهم ما يقدّمه لنا."],
        voice: ["We could bring an answer from AI to the club and see if we can check it ourselves.", "فينا نجيب جواب من الذكاء الاصطناعي عالنادي ونشوف كيف منتحقّق منه لحالنا."],
    },
    23: {
        subject: "biology",
        about: ["Turns biology questions into a challenge with explanations readers can check after playing.", "تحوّل أسئلة الأحياء إلى تحدٍّ يتبعه شرح يستطيع القارئ مراجعته بعد اللعب."],
        voice: ["I could bring a biology quiz to the club, see which questions get people talking and put those in the magazine.", "فيني جيب مسابقة أحياء عالنادي، وشوف أيّ أسئلة بتفتح نقاش وحطّها بالمجلّة."],
    },
    25: {
        subject: "biology",
        about: ["Introduces the Stroop effect through a task that makes readers notice how their attention works.", "تقدّم تأثير ستروب من خلال مهمّة تساعد القارئ على ملاحظة طريقة عمل انتباهه."],
        voice: ["We could try the Stroop challenge in the club and see if the same colours trip us up.", "فينا نجرّب تحدّي ستروب بالنادي ونشوف إذا نفس الألوان بتربكنا."],
    },
    26: {
        about: ["Invites readers to test familiar claims before checking what the evidence says.", "تدعو القرّاء إلى اختبار أفكار شائعة ثمّ مراجعة ما يقوله الدليل عنها."],
        voice: ["We could pick a claim people repeat and look for enough evidence to call it fact or myth.", "فينا ناخد فكرة كتير منسمعها وندوّر عالدليل لنشوف إذا هي حقيقة أو خرافة."],
    },
    27: {
        subject: "biology",
        about: ["Looks at how the eyes and brain work together, starting with things that can fool our vision.", "تبحث كيف تعمل العينان والدماغ معًا، انطلاقًا ممّا قد يخدع بصرنا."],
        voice: ["We could all look at the same picture and compare what each of us saw first.", "فينا نتطلّع كلّنا عالصورة نفسها ونقارن شو شاف كلّ واحد منّا بالأوّل."],
    },
    28: {
        subject: "physics",
        about: ["Uses clues and detective cases to engage readers with science questions, including how light behaves.", "تستخدم الأدلة وألغاز التحقيق لتشرك القارئ في أسئلة علميّة، ومنها كيف يتصرّف الضوء."],
        voice: ["I could bring a new mystery to the club and see if the clues are enough for my classmates to crack it.", "فيني جيب لغز جديد عالنادي وشوف إذا الأدلّة بتكفّي رفقاتي ليحلّوه."],
    },
};
