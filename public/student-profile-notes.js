const basStudentProfileNotes = {
    1: {
        about: ["Introduces BAS through its student writers and the questions they bring to science.", "يعرّف بمجلّة بشائر من خلال كتّابها التلاميذ والأسئلة التي يطرحونها عن العلم."],
        voice: ["I’d like to help more students share their ideas in the magazine and find a place for them in the club.", "أحبّ أن أساعد زملائي على مشاركة أفكارهم في المجلّة وإيجاد مساحة لها في النادي."],
    },
    2: {
        subject: "biology",
        about: ["Looks beyond the mushrooms we see to explore the hidden world of fungi.", "تتجاوز في مقالها الفطر الذي نراه لتستكشف عالم الفطريّات الخفيّ."],
        voice: ["I’d like to write about living things we often overlook and observe them more closely in the club.", "أحبّ أن أكتب عن الكائنات التي قد لا ننتبه إليها، وأن أراقبها عن قرب في النادي."],
    },
    3: {
        subject: "biology",
        about: ["Uses glowing organisms to bring readers closer to an unusual side of life.", "تقرّب القارئ من جانب غير مألوف من عالم الأحياء من خلال الكائنات المضيئة."],
        voice: ["I’d like to tell stories about surprising living things and see what other questions we can explore together in the club.", "أحبّ أن أروي قصصًا عن كائنات تثير الدهشة، وأن أكتشف مع زملائي في النادي أسئلة أخرى تستحقّ البحث."],
    },
    4: {
        subject: "biology",
        about: ["Finds the science behind an everyday food by following how natural sourdough changes a dough.", "تبحث عن العلم في طعامٍ نأكله كلّ يوم، وتتتبّع كيف يغيّر التخمير الطبيعي العجين."],
        voice: ["I’d like to write about the science in our kitchens and compare how different doughs rise with the club.", "أحبّ أن أكتب عن العلم في مطابخنا، وأن أقارن مع زملائي في النادي كيف تنتفخ أنواع مختلفة من العجين."],
    },
    8: {
        about: ["Asks how algorithms and artificial intelligence can shape the way students think and learn.", "تطرح سؤالًا عن أثر الخوارزميّات والذكاء الاصطناعي في طريقة تفكير التلاميذ وتعلّمهم."],
        voice: ["I’d like to write about the choices we make with technology and discuss them with other students in the club.", "أحبّ أن أكتب عن خياراتنا في استخدام التكنولوجيا، وأن أناقشها مع زملائي في النادي."],
    },
    10: {
        subject: "physics",
        about: ["Uses the future of space travel to ask how far people might be able to go.", "تطرح من خلال مستقبل السفر الفضائي سؤالًا عن المسافة التي يمكن للبشر أن يبلغوها."],
        voice: ["I’d like to take readers on a journey into space and explore with the club what it takes to get there.", "أحبّ أن أصطحب القرّاء في رحلة إلى الفضاء، وأن أبحث مع النادي عمّا نحتاجه للوصول إليه."],
    },
    11: {
        subject: "physics",
        about: ["Connects changes in our climate with how sunlight and heat move through the atmosphere.", "تربط تغيّرات المناخ بكيفيّة انتقال ضوء الشمس والحرارة في الغلاف الجويّ."],
        voice: ["I’d like to make climate questions easier to follow in the magazine and explore local examples with the club.", "أحبّ أن أقرّب أسئلة المناخ من قرّاء المجلّة، وأن أبحث مع النادي عن أمثلة من بيئتنا."],
    },
    12: {
        subject: "chemistry",
        about: ["Explores how the properties of gold explain its uses beyond jewellery.", "تبحث كيف تفسّر خصائص الذهب استعمالاته خارج عالم المجوهرات."],
        voice: ["I’d like to write about materials we think we know and compare their properties in the club.", "أحبّ أن أكتب عن موادّ نظنّ أنّنا نعرفها جيّدًا، وأن أقارن خصائصها مع زملائي في النادي."],
    },
    13: {
        subject: "chemistry",
        about: ["Turns an everyday expression about gold into a question about trace elements in the body.", "تحوّل تعبيرًا مألوفًا عن الذهب إلى سؤال عن العناصر الموجودة بكميّات ضئيلة في الجسم."],
        voice: ["I’d like to start with a surprising question in the magazine and follow the evidence with the club.", "أحبّ أن أبدأ بسؤال يفاجئ قرّاء المجلّة، ثمّ أتتبّع الدليل مع زملائي في النادي."],
    },
    14: {
        subject: "chemistry",
        about: ["Takes a question from the breakfast table and investigates how starch can be detected in labneh.", "تنطلق من مائدة الفطور وتبحث كيف يمكن الكشف عن النشاء في اللبنة."],
        voice: ["I’d like to share food investigations in the magazine and turn everyday ingredients into club experiments.", "أحبّ أن أشارك تحقيقات عن الطعام في المجلّة، وأن نحوّل مكوّنات يوميّة إلى تجارب في النادي."],
    },
    15: {
        subject: "biology",
        about: ["Follows the changes in cut watermelon and asks what affects how long it stays fresh.", "تتتبّع ما يتغيّر في البطيخ بعد تقطيعه، وتسأل عمّا يؤثّر في مدّة بقائه طازجًا."],
        voice: ["I’d like to explain changes we notice at home and compare what affects freshness with the club.", "أحبّ أن أشرح تغيّرات نلاحظها في البيت، وأن أقارن مع زملائي في النادي ما يؤثّر في طزاجة الطعام."],
    },
    16: {
        subject: "biology",
        about: ["Uses optical illusions to ask how the brain makes sense of what the eyes see.", "تستخدم الأوهام البصريّة لتسأل كيف يفسّر الدماغ ما تراه العينان."],
        voice: ["I’d like readers to try an illusion themselves and then compare what we noticed in the club.", "أحبّ أن يجرّب القرّاء خدعة بصريّة بأنفسهم، ثمّ نقارن في النادي ما لاحظه كلّ منّا."],
    },
    17: {
        subject: "biology",
        about: ["Explains the body’s defences through the image of an army that protects us from within.", "يشرح دفاعات الجسم من خلال تشبيه الجهاز المناعيّ بجيش يحمينا من الداخل."],
        voice: ["I’d like to explain what happens inside our bodies with examples that are easy to picture and discuss in the club.", "أحبّ أن أشرح ما يحدث داخل أجسامنا بأمثلة يسهل تخيّلها ومناقشتها في النادي."],
    },
    18: {
        subject: "biology",
        about: ["Follows the repair of the skin and makes the stages of wound healing easier to picture.", "تتتبّع ترميم الجلد، وتقرّب مراحل التئام الجروح من القارئ."],
        voice: ["I’d like to write about everyday changes in our bodies and make simple models of them with the club.", "أحبّ أن أكتب عن تغيّرات نلاحظها في أجسامنا، وأن نصنع في النادي نماذج بسيطة توضّحها."],
    },
    19: {
        subject: "biology",
        about: ["Explores how the body supports the growth of a new life during pregnancy.", "تستكشف كيف يدعم الجسم نموّ حياة جديدة خلال الحمل."],
        voice: ["I’d like to explain how the body adapts and explore more questions about development with the club.", "أحبّ أن أشرح كيف يتكيّف الجسم، وأن أبحث مع النادي في أسئلة أخرى عن النموّ."],
    },
    20: {
        subject: "biology",
        about: ["Connects sport with the changes we can notice in our bodies during exercise.", "تربط الرياضة بالتغيّرات التي نلاحظها في أجسامنا أثناء التمرين."],
        voice: ["I’d like to bring sport into the magazine and compare how our bodies respond to movement in the club.", "أحبّ أن أكتب عن الرياضة في المجلّة، وأن نقارن في النادي كيف تستجيب أجسامنا للحركة."],
    },
    21: {
        subject: "chemistry",
        about: ["Starts with a glass of water and asks what tests can reveal about what’s inside it.", "يبدأ بكأس ماء ويسأل عمّا يمكن أن تكشفه الفحوص عمّا فيه."],
        voice: ["I’d like to investigate everyday questions about water and try simple water-quality demonstrations with the club.", "أحبّ أن أبحث في أسئلة يوميّة عن الماء، وأن أجرّب مع النادي أنشطة بسيطة عن نوعيّته."],
    },
    22: {
        about: ["Examines the difference between using AI in class and understanding what it tells us.", "يركّز على الفرق بين استخدام الذكاء الاصطناعيّ في الصف وفهم ما يقدّمه لنا."],
        voice: ["I’d like to write about how we learn with AI and compare ways to check its answers in the club.", "أحبّ أن أكتب عن طريقة تعلّمنا مع الذكاء الاصطناعيّ، وأن نقارن في النادي طرق التحقّق من إجاباته."],
    },
    23: {
        subject: "biology",
        about: ["Turns biology questions into a challenge with explanations readers can check after playing.", "تحوّل أسئلة الأحياء إلى تحدٍّ يتبعه شرح يستطيع القارئ مراجعته بعد اللعب."],
        voice: ["I’d like to design science quizzes for the magazine and try them out with the club.", "أحبّ أن أصمّم تحدّيات علميّة للمجلّة، وأن أجرّبها مع زملائي في النادي."],
    },
    25: {
        subject: "biology",
        about: ["Introduces the Stroop effect through a task that makes readers notice how their attention works.", "تقدّم تأثير ستروب من خلال مهمّة تساعد القارئ على ملاحظة طريقة عمل انتباهه."],
        voice: ["I’d like to invite readers to try short challenges and compare our observations in the club.", "أحبّ أن أدعو القرّاء إلى تجربة تحدّيات قصيرة، وأن نقارن ملاحظاتنا في النادي."],
    },
    26: {
        about: ["Invites readers to test familiar claims before checking what the evidence says.", "تدعو القرّاء إلى اختبار أفكار شائعة ثمّ مراجعة ما يقوله الدليل عنها."],
        voice: ["I’d like to turn claims we hear every day into a magazine quiz and look up the evidence together in the club.", "أحبّ أن أحوّل الأفكار التي نسمعها كلّ يوم إلى اختبار في المجلّة، وأن نبحث معًا في النادي عن الدليل."],
    },
    27: {
        subject: "biology",
        about: ["Looks at how the eyes and brain work together, starting with things that can fool our vision.", "تبحث كيف تعمل العينان والدماغ معًا، انطلاقًا ممّا قد يخدع بصرنا."],
        voice: ["I’d like to write about what we notice and what we miss, then try visual challenges with the club.", "أحبّ أن أكتب عمّا نلاحظه وما قد يفوتنا، وأن أجرّب تحدّيات بصريّة مع زملائي في النادي."],
    },
    28: {
        subject: "physics",
        about: ["Uses clues and detective cases to engage readers with science questions, including how light behaves.", "تستخدم الأدلة وألغاز التحقيق لتشرك القارئ في أسئلة علميّة، ومنها كيف يتصرّف الضوء."],
        voice: ["I’d like to write mysteries where each clue matters and build more science challenges with the club.", "أحبّ أن أكتب ألغازًا لكلّ دليل فيها دور، وأن أبتكر تحدّيات علميّة أخرى مع زملائي في النادي."],
    },
};
