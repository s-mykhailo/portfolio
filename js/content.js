/* =============================================================================
   content.js: ALL site texts and contact links live here.
   - CONTACTS: fill the links. An empty "url" hides that button/link.
   - I18N.en / I18N.uk: every visible string of the site, same keys in both.
   Dialogue scripts for the animated demos are in scenarios.js.
   ============================================================================= */

window.CONTACTS = {
  telegram:   { url: 'https://t.me/savchenko_myhailo', label: '@savchenko_myhailo' },
  instagram:  { url: '', label: '' },   // e.g. 'https://instagram.com/yourname', '@yourname'
  builtbybit: { url: '', label: '' },   // e.g. 'https://builtbybit.com/creators/...', 'BuiltByBit'
  discord:    { url: '', label: '' },   // invite or profile link, label e.g. 'yourname'

  /* "Try in Telegram / Discord" buttons on the demo cards.
     Leave '' until the bot is hosted: the button stays hidden. */
  demos: {
    blade:          '',   // 'https://t.me/sm_blade_booking_bot'
    fixit:          '',   // 'https://t.me/sm_fixit_leads_bot'
    vibe:           '',   // 'https://t.me/sm_vibe_store_bot'
    discordTickets: '',
    discordVerify:  ''
  }
};

window.I18N = {

/* ------------------------------------------------------------------ EN --- */
en: {
  meta: {
    title: 'S-Mykhailo | Telegram and Discord bots',
    description: 'Custom Telegram and Discord bots for small businesses and communities. Every project starts with a free working demo.'
  },
  ticker: ['Booking', 'Leads', 'Shop catalog', 'Tickets', 'Roles and verification', 'Minecraft', 'Payments', 'Reminders', 'Owner alerts', 'Admin panel'],
  ui: {
    skip: 'Skip to content',
    navLabel: 'Main navigation',
    langLabel: 'Language',
    theme: 'Switch light/dark theme',
    menu: 'Menu'
  },
  nav: {
    services: 'Services',
    demos: 'Demos',
    process: 'How I work',
    pricing: 'Pricing',
    contact: 'Contact'
  },
  hero: {
    title: 'Custom Telegram and Discord bots for small business and communities',
    lead: 'I’m S-Mykhailo. Every project starts with a free working demo: you test it first and pay after.',
    cta: 'Get a bot',
    secondary: 'See the demos',
    hint: 'This chat is a scripted preview. Tap any button to take over.'
  },
  services: {
    title: 'Services',
    lead: 'Bots for the jobs small teams repeat every day.',
    tg: {
      title: 'Telegram bots',
      items: [
        { icon: 'calendar', name: 'Booking', text: 'Clients pick a service, day and time. Only free slots, reminders before the visit, a simple owner view.' },
        { icon: 'form',     name: 'Leads and requests', text: 'A request form or a cost calculator. The request arrives in your Telegram with all the details.' },
        { icon: 'bag',      name: 'Shop catalog', text: 'Categories, product cards, cart and orders. You manage products inside the bot.' }
      ]
    },
    dc: {
      title: 'Discord bots',
      items: [
        { name: 'tickets',   text: 'A member opens a private channel with staff. One button to open, one to close.' },
        { name: 'verify',    text: 'One button gives a new member their role. Button or reaction roles for the rest.' },
        { name: 'minecraft', text: 'Server status, whitelist requests and player roles linked to your Minecraft server.' }
      ]
    }
  },
  demos: {
    title: 'Demo bots',
    lead: 'Scripted previews of three Telegram bots I built, with their real buttons and texts. The live bots speak Ukrainian, so the dialogue here is translated.',
    tryTelegram: 'Try in Telegram',
    tryDiscord: 'Try in Discord',
    badgeConcept: 'Concept',
    replay: 'Replay',
    auto: 'Let it play',
    statusAuto: 'Playing. Tap a button to take over.',
    statusManual: 'Your turn: tap a button.',
    statusDone: 'End of the script.',
    notScripted: 'Not part of this preview',
    typing: 'typing…',
    typingDc: 'is typing…',
    eph: 'Only you can see this',
    label: 'Animated chat preview',
    input: 'Message',
    list: [
      { id: 'blade', ava: 'assets/avatars/blade.webp',   initial: 'B', name: 'Blade barbershop', handle: '@sm_blade_booking_bot', text: 'Online booking: service, day, time, barber, confirmation. Reminders and an owner view included.', tags: ['Booking'], link: 'blade' },
      { id: 'fixit', ava: 'assets/avatars/fixit.webp',   initial: 'F', name: 'FixIt repair shop', handle: '@sm_fixit_leads_bot', text: 'A repair request in six steps, plus a price calculator and FAQ. The owner gets the full request.', tags: ['Leads'], link: 'fixit' },
      { id: 'vibe', ava: 'assets/avatars/vibe.webp',    initial: 'V', name: 'Vibe Store', handle: '@sm_vibe_store_bot', text: 'Catalog, cart and checkout for a small clothing shop, with delivery and payment options.', tags: ['Shop'], link: 'vibe' },
      { id: 'tickets', initial: '#', name: 'Support tickets', handle: 'Discord', text: 'Sample script. A member opens a ticket, talks to staff, staff closes it.', tags: ['Tickets'], link: 'discordTickets', concept: true, platform: 'discord' },
      { id: 'verify',  initial: '#', name: 'Verification and roles', handle: 'Discord', text: 'Sample script. One button to verify and get the member role.', tags: ['Roles'], link: 'discordVerify', concept: true, platform: 'discord' }
    ]
  },
  process: {
    title: 'How I work',
    lead: 'I’m early in my freelance work, so I don’t ask you to take my word for it. You see the bot working first.',
    steps: [
      { title: 'Agree scope and price', text: 'You describe the idea. I write down what the bot will do and name a fixed price.' },
      { title: 'Test a working demo', text: 'I build it and you try it in Telegram or Discord. Nothing is paid yet.' },
      { title: 'Get code and setup help', text: 'When you are happy with the demo, you pay and receive the code, instructions and help with deployment.' }
    ],
    payMarker: 'Payment comes after the demo'
  },
  pricing: {
    title: 'Pricing',
    lead: 'Prices in USD, fixed before work starts.',
    cards: [
      { name: 'Simple bot', price: 'from $10', text: 'One clear job in Telegram or Discord, for example a request form or a FAQ bot.' },
      { name: 'Tickets and roles', price: '~$20', text: 'Discord support tickets plus verification and role assignment.' },
      { name: 'Custom', price: 'Quote', text: 'Booking, shop, Minecraft integration or anything bigger. Describe the idea and get a fixed price.' }
    ],
    note: 'The demo is free. You pay only after you have tested it.'
  },
  contact: {
    title: 'Contact',
    lead: 'Two or three lines are enough: what the bot should do, who will use it, Telegram or Discord. I’ll reply with scope and price.',
    write: 'Message me on Telegram',
    more: 'Also here'
  },
  footer: {
    copy: '© {year} S-Mykhailo',
    note: 'Plain HTML, CSS and JS. No trackers, no cookies.'
  }
},

/* ------------------------------------------------------------------ UA --- */
uk: {
  meta: {
    title: 'S-Mykhailo | Telegram- і Discord-боти',
    description: 'Кастомні Telegram- і Discord-боти для малого бізнесу та спільнот. Кожен проєкт починається з безкоштовного робочого демо.'
  },
  ticker: ['Запис', 'Заявки', 'Каталог магазину', 'Тікети', 'Ролі та верифікація', 'Minecraft', 'Оплата', 'Нагадування', 'Сповіщення власнику', 'Адмін-панель'],
  ui: {
    skip: 'Перейти до змісту',
    navLabel: 'Головна навігація',
    langLabel: 'Мова',
    theme: 'Перемкнути світлу/темну тему',
    menu: 'Меню'
  },
  nav: {
    services: 'Послуги',
    demos: 'Демо',
    process: 'Як я працюю',
    pricing: 'Ціни',
    contact: 'Контакти'
  },
  hero: {
    title: 'Кастомні Telegram- і Discord-боти для малого бізнесу та спільнот',
    lead: 'Я S-Mykhailo. Кожен проєкт починається з безкоштовного робочого демо: спочатку ви тестуєте, потім платите.',
    cta: 'Замовити бота',
    secondary: 'Дивитись демо',
    hint: 'Це чат за сценарієм. Натисніть будь-яку кнопку, щоб узяти керування.'
  },
  services: {
    title: 'Послуги',
    lead: 'Боти для справ, які малі команди повторюють щодня.',
    tg: {
      title: 'Telegram-боти',
      items: [
        { icon: 'calendar', name: 'Запис', text: 'Клієнт обирає послугу, день і час. Лише вільні слоти, нагадування перед візитом, простий режим власника.' },
        { icon: 'form',     name: 'Заявки', text: 'Форма заявки або калькулятор вартості. Заявка приходить вам у Telegram з усіма деталями.' },
        { icon: 'bag',      name: 'Магазин-каталог', text: 'Категорії, картки товарів, кошик і замовлення. Товарами ви керуєте прямо в боті.' }
      ]
    },
    dc: {
      title: 'Discord-боти',
      items: [
        { name: 'тікети',    text: 'Учасник відкриває приватний канал з командою. Одна кнопка, щоб відкрити, одна, щоб закрити.' },
        { name: 'верифікація', text: 'Одна кнопка дає новому учаснику роль. Ролі за кнопкою чи реакцією для решти.' },
        { name: 'minecraft', text: 'Статус сервера, заявки у whitelist і ролі гравців, пов’язані з вашим Minecraft-сервером.' }
      ]
    }
  },
  demos: {
    title: 'Демо-боти',
    lead: 'Сценарні прев’ю трьох Telegram-ботів, яких я зробив, з їхніми справжніми кнопками й текстами. Живі боти говорять українською.',
    tryTelegram: 'Спробувати в Telegram',
    tryDiscord: 'Спробувати в Discord',
    badgeConcept: 'Концепт',
    replay: 'Спочатку',
    auto: 'Нехай грає',
    statusAuto: 'Грає сценарій. Натисніть кнопку, щоб узяти керування.',
    statusManual: 'Ваш хід: натисніть кнопку.',
    statusDone: 'Кінець сценарію.',
    notScripted: 'Цього кроку немає в прев’ю',
    typing: 'друкує…',
    typingDc: 'друкує…',
    eph: 'Тільки ви це бачите',
    label: 'Анімоване прев’ю чату',
    input: 'Повідомлення',
    list: [
      { id: 'blade', ava: 'assets/avatars/blade.webp',   initial: 'B', name: 'Барбершоп Blade', handle: '@sm_blade_booking_bot', text: 'Онлайн-запис: послуга, день, час, майстер, підтвердження. Є нагадування і режим власника.', tags: ['Запис'], link: 'blade' },
      { id: 'fixit', ava: 'assets/avatars/fixit.webp',   initial: 'F', name: 'Сервіс FixIt', handle: '@sm_fixit_leads_bot', text: 'Заявка на ремонт за шість кроків, плюс калькулятор вартості й FAQ. Власник отримує заявку повністю.', tags: ['Заявки'], link: 'fixit' },
      { id: 'vibe', ava: 'assets/avatars/vibe.webp',    initial: 'V', name: 'Vibe Store', handle: '@sm_vibe_store_bot', text: 'Каталог, кошик і оформлення замовлення для невеликого магазину одягу, з вибором доставки й оплати.', tags: ['Магазин'], link: 'vibe' },
      { id: 'tickets', initial: '#', name: 'Тікети підтримки', handle: 'Discord', text: 'Приклад сценарію. Учасник відкриває тікет, спілкується з командою, а команда закриває тікет.', tags: ['Тікети'], link: 'discordTickets', concept: true, platform: 'discord' },
      { id: 'verify',  initial: '#', name: 'Верифікація і ролі', handle: 'Discord', text: 'Приклад сценарію. Одна кнопка, щоб пройти верифікацію й отримати роль учасника.', tags: ['Ролі'], link: 'discordVerify', concept: true, platform: 'discord' }
    ]
  },
  process: {
    title: 'Як я працюю',
    lead: 'Я на початку фріланс-шляху, тому не прошу вірити мені на слово. Спочатку ви бачите, як бот працює.',
    steps: [
      { title: 'Погоджуємо обсяг і ціну', text: 'Ви описуєте ідею. Я записую, що робитиме бот, і називаю фіксовану ціну.' },
      { title: 'Тестуєте робоче демо', text: 'Я роблю бота, а ви пробуєте його в Telegram чи Discord. Нічого не оплачено.' },
      { title: 'Отримуєте код і допомогу з запуском', text: 'Коли демо вас влаштує, ви платите й отримуєте код, інструкцію та допомогу з розгортанням.' }
    ],
    payMarker: 'Оплата після демо'
  },
  pricing: {
    title: 'Ціни',
    lead: 'Ціни в доларах США, фіксуються до початку роботи.',
    cards: [
      { name: 'Простий бот', price: 'від $10', text: 'Одна зрозуміла задача в Telegram чи Discord, наприклад форма заявки або FAQ-бот.' },
      { name: 'Тікети та ролі', price: '~$20', text: 'Тікети підтримки для Discord разом із верифікацією та видачею ролей.' },
      { name: 'Індивідуально', price: 'За запитом', text: 'Запис, магазин, інтеграція з Minecraft чи щось більше. Опишіть ідею і отримайте фіксовану ціну.' }
    ],
    note: 'Демо безкоштовне. Ви платите лише після того, як протестували бота.'
  },
  contact: {
    title: 'Контакти',
    lead: 'Достатньо двох-трьох рядків: що має робити бот, хто ним користуватиметься, Telegram чи Discord. Відповім з обсягом і ціною.',
    write: 'Написати в Telegram',
    more: 'Також тут'
  },
  footer: {
    copy: '© {year} S-Mykhailo',
    note: 'Чистий HTML, CSS і JS. Без трекерів і cookies.'
  }
}

};
