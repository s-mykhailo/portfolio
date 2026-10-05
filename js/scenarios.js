/* =============================================================================
   scenarios.js: dialogue scripts for the animated demos (EN and UA).
   Texts and buttons are taken from the real demo bots (Blade, FixIt, Vibe Store).

   window.SCENARIOS[lang][id] = { platform, bot, steps }
     platform  'tg' (Telegram look) or 'dc' (Discord look)
     bot       { name, initial, channel }       header of the chat window
     steps     played in order

   STEPS
     { k:'user', t:'text' }                         message typed by the user
     { k:'bot',  t:'text', kb:[[btn, btn], ...] }   bot message with inline buttons
     { k:'bot',  t:'text', reply:[[btn]] }          bot message with a reply keyboard
     { k:'chan', name:'ticket-0001' }               Discord: switch channel (clears chat)

   STEP OPTIONS
     edit:true       replace the previous bot message in place (how inline menus work)
     photo:'ph-x'    photo placeholder above the text (CSS class in chat.css)
     when:{key:val}  play only if ctx[key] equals val (or is in the array)
     v:{key:val}     (user steps) save values into ctx after the message
     after:ms        extra pause after the step
     eph:true        Discord: "Only you can see this" message
     who:'Name'      Discord: author name (human:true = a person, not a bot)
     embed:{title}   Discord: put the text in an embed box

   BUTTONS  btn('label', { options })
     def:true     the button the auto-player presses
     v:{...}      values saved to ctx on press, usable later as {key}
     off:true     visible, but not part of this preview
     dis:true     shown as unavailable
     keep:true    press does not move the dialogue on (use with def to press it first)
     toast:'..'   short popup when pressed
     when:{...}   hide the button unless ctx matches
     echo:'..'    reply keyboards: text of the user bubble
     s:'p'        Discord: primary (accent) button

   TOKENS in text: any ctx key like {service}, dates {d0}..{d5} (from tomorrow),
   {end} (time + duration). Markup: **bold**, //italic//, lines starting "> " = quote.
   ============================================================================= */

(function () {

function row() { return Array.prototype.slice.call(arguments); }
function btn(t, o) { var b = { t: t }; if (o) for (var k in o) b[k] = o[k]; return b; }

/* FixIt: the "what is wrong" list depends on the chosen device. */
function problemSteps(lead, byDevice) {
  return Object.keys(byDevice).map(function (dev) {
    return {
      k: 'bot', edit: true, when: { dev: dev }, t: lead,
      kb: byDevice[dev].map(function (p, i) {
        return [btn(p, { v: { problem: p }, def: i === 0 })];
      })
    };
  });
}

var S = window.SCENARIOS = { en: {}, uk: {} };

/* ============================================================== EN: Blade == */
(function () {
  var nav = row(btn('⬅️ Back', { off: true }), btn('🏠 Main menu', { off: true }));
  S.en.blade = {
    platform: 'tg',
    bot: { name: 'Blade', initial: 'B', ava: 'assets/avatars/blade.webp' },
    steps: [
      { k: 'user', t: '/start' },
      { k: 'bot', photo: 'ph-shop',
        t: '**Blade**\nBarbershop in central Dnipro\n\nHi! 👋 This is the bot of the Blade barbershop in Dnipro. You can book in a minute, no calls.',
        kb: [ [btn('✂️ Book', { def: true })], [btn('📅 My bookings', { off: true })], [btn('💈 Services and prices', { off: true })], [btn('👥 Our staff', { off: true })], [btn('📍 Contacts', { off: true })] ] },
      { k: 'bot', edit: true, t: 'Which service are we booking?',
        kb: [
          [btn("Men's haircut — 350 UAH", { v: { service: "Men's haircut", skey: 'haircut', price: '350 UAH', durText: '40 min', dur: 40 } })],
          [btn('Haircut + beard — 550 UAH', { def: true, v: { service: 'Haircut + beard', skey: 'combo', price: '550 UAH', durText: '1 h', dur: 60 } })],
          [btn('Beard trim — 250 UAH', { v: { service: 'Beard trim', skey: 'beard', price: '250 UAH', durText: '30 min', dur: 30 } })],
          [btn("Kids' haircut — 250 UAH", { v: { service: "Kids' haircut", skey: 'kids', price: '250 UAH', durText: '30 min', dur: 30 } })],
          [btn('Royal shave — 400 UAH', { v: { service: 'Royal shave', skey: 'shave', price: '400 UAH', durText: '40 min', dur: 40 } })],
          nav ] },
      { k: 'bot', edit: true, t: 'Selected: **{service}** — {price}, {durText}\n\nPick a date:',
        kb: [
          [btn('{d0}', { v: { date: '{d0}' } }), btn('{d1}', { def: true, v: { date: '{d1}' } })],
          [btn('{d2}', { v: { date: '{d2}' } }), btn('🚫 {d3}', { dis: true })],
          [btn('{d4}', { v: { date: '{d4}' } }), btn('{d5}', { v: { date: '{d5}' } })],
          nav ] },
      { k: 'bot', edit: true, t: 'Date: {date}\nPick a time:',
        kb: [
          [btn('🕐 10:00', { v: { time: '10:00' } }), btn('🕐 10:30', { v: { time: '10:30' } }), btn('🕐 11:00', { def: true, v: { time: '11:00' } })],
          [btn('🕐 11:30', { v: { time: '11:30' } }), btn('🕐 12:00', { v: { time: '12:00' } }), btn('🕐 14:00', { v: { time: '14:00' } })],
          [btn('🕐 15:30', { v: { time: '15:30' } }), btn('🕐 16:00', { v: { time: '16:00' } }), btn('🕐 17:30', { v: { time: '17:30' } })],
          nav ] },
      { k: 'bot', edit: true, t: 'Date: {date}, time: {time}\n\nPick a barber:',
        kb: [
          [btn('🎲 Any available', { v: { master: 'Oleksiy' } })],
          [btn('👤 Oleksiy', { def: true, v: { master: 'Oleksiy' } })],
          [btn('👤 Dmytro', { v: { master: 'Dmytro' }, when: { skey: ['haircut', 'combo', 'beard', 'shave'] } })],
          [btn('👤 Ihor', { v: { master: 'Ihor' }, when: { skey: ['haircut', 'beard', 'kids'] } })],
          nav ] },
      { k: 'bot', edit: true, photo: 'ph-person',
        t: 'Check the details:\n\n💈 Service: {service}\n👤 Barber: {master}\n📅 Date: {date}\n🕐 Time: {time}–{end}\n💰 Price: {price}\n📍 Address: 29 Sicheslavska Naberezhna St\n\nAll correct?',
        kb: [ [btn('✅ Confirm', { def: true })], nav ] },
      { k: 'bot', t: 'Got a photo of the haircut you want? Send it, it helps the barber understand what you need 📸 Or tap “Skip”.',
        kb: [ [btn('➡️ Skip', { def: true })] ] },
      { k: 'bot', t: 'What should we call you? Send your name (and surname if you like):' },
      { k: 'user', t: 'Andriy', v: { name: 'Andriy' } },
      { k: 'bot', t: 'Now your phone number: tap the button below or type it in (format +380XXXXXXXXX):',
        reply: [ [btn('📱 Send my number', { def: true, echo: '📞 +380 50 000 00 00', v: { phone: '+380500000000' } })] ] },
      { k: 'bot', t: 'Thanks! Booking it…' },
      { k: 'bot', t: '✅ Done! You’re booked:\n\n💈 {service}\n👤 Barber: {master}\n📅 {date} at {time}\n💰 {price}\n📍 29 Sicheslavska Naberezhna St\n\nI’ll remind you a day and 2 hours before the visit 🙂',
        kb: [ [btn('🏠 Main menu', { off: true })] ] },
      { k: 'bot', after: 3000,
        t: '👔 **This is what the business owner sees**\n(this is a demo; in a real bot this message goes to the admin)\n\n🆕 New booking!\nService: {service}\nBarber: {master}\nWhen: {date} at {time}\nPrice: {price}\nClient: {name}, {phone}',
        kb: [ [btn('✅ Confirm', { off: true }), btn('❌ Cancel', { off: true })] ] }
    ]
  };
})();

/* ============================================================= EN: FixIt == */
S.en.fixit = {
  platform: 'tg',
  bot: { name: 'FixIt Dnipro', initial: 'F', ava: 'assets/avatars/fixit.webp' },
  steps: [].concat([
    { k: 'user', t: '/start' },
    { k: 'bot',
      t: '👋 Welcome to **FixIt Dnipro**!\nRepair of phones and laptops of any complexity\n\nWe repair phones, laptops and tablets of any brand. Free diagnostics, warranty on all work, repairs from 1 day.\n\nPick what you need:',
      kb: [ [btn('📝 Leave a request', { def: true })], [btn('🧮 Estimate the cost', { off: true })], [btn('📋 Services and prices', { off: true })], [btn('❓ FAQ', { off: true })], [btn('📍 Contacts', { off: true })] ] },
    { k: 'bot', edit: true, t: '📝 **Repair request**\n\nStep 1/6. What device do you have?',
      kb: [
        [btn('📱 Phone', { def: true, v: { dev: 'phone', device: '📱 Phone' } })],
        [btn('💻 Laptop', { v: { dev: 'laptop', device: '💻 Laptop' } })],
        [btn('📲 Tablet', { v: { dev: 'tablet', device: '📲 Tablet' } })],
        [btn('🖥 Computer (PC)', { v: { dev: 'pc', device: '🖥 Computer (PC)' } })],
        [btn('🎧 Other device', { v: { dev: 'other', device: '🎧 Other device' } })],
        [btn('❌ Cancel', { off: true })] ] }
  ], problemSteps('🔧 {device}\n\nStep 2/6. What exactly is wrong?', {
    phone: ['🖼 Broken screen / touch not working', '🔋 Battery drains fast', '🔌 Not charging', '⛔ Won’t turn on', '💧 Liquid damage', '📷 Camera / speaker / microphone', '🐢 Slow, glitchy, apps', '❓ Other'],
    laptop: ['⛔ Won’t turn on', '🔥 Overheats / noisy / shuts down', '🖥 Screen: broken, lines, dark', '⌨️ Keyboard / touchpad', '💧 Liquid spilled', '🔌 Not charging / port', '🐢 Slow, Windows / apps', '❓ Other'],
    tablet: ['🖼 Broken screen / touch', '🔋 Battery / not charging', '⛔ Won’t turn on', '💧 Liquid damage', '🐢 Slow, apps', '❓ Other'],
    pc: ['⛔ Won’t turn on / won’t boot', '🔥 Overheats / noisy', '🐢 Slow, Windows / apps', '💾 Lost data / disk', '🔧 Upgrade / build', '❓ Other'],
    other: ['⛔ Won’t turn on', '🔋 Battery / charger', '🔊 Sound / picture', '💧 Liquid damage', '❓ Other']
  }), [
    { k: 'bot', t: 'Step 3/6. 📷 Send a photo of the problem, it helps the technician estimate the repair.\n\nNo photo? Just skip this step.',
      kb: [ [btn('➡️ Skip photo', { def: true })] ] },
    { k: 'bot', t: 'Step 4/6. ✍️ Describe the problem in your own words: what happened, when, what you already tried.\n\n//Example: “Dropped it, the screen is cracked, touch only works at the bottom”//' },
    { k: 'user', t: 'Dropped it, the screen is cracked, touch only works at the bottom', v: { desc: 'Dropped it, the screen is cracked, touch only works at the bottom' } },
    { k: 'bot', t: 'Step 5/6. 👤 What should we call you?\n\nType your name or pick a button.',
      kb: [ [btn('👤 Andriy', { def: true, v: { name: 'Andriy' } })] ] },
    { k: 'bot', t: 'Step 6/6. 💬 Where should the technician write to you?\n\nTap the button with your Telegram or send another contact: @username or a phone number.',
      kb: [ [btn('✅ My Telegram: @username', { def: true })] ] },
    { k: 'bot', t: '✅ **Request #1 accepted!**\n\n🔧 {device} — {problem}\n💬 Contact: @username\n\nThe technician will review the request and write to you to arrange details. If you want to add something, just write here in the chat.' },
    { k: 'bot', after: 3000,
      t: '🔔 **This is what the business owner sees:**\n\n📋 **Request #1** — 🆕 New\n\n🔧 **Device:** {device}\n⚠️ **Problem:** {problem}\n📝 **Description:**\n> {desc}\n\n👤 **Name:** {name}\n💬 **Contact:** @username',
      kb: [ [btn('💬 Write to @username', { off: true })], [btn('📁 In progress', { off: true }), btn('📝 Note', { off: true })] ] }
  ])
};

/* ============================================================= EN: Vibe === */
(function () {
  var card = '🏷 "Cloud" oversized hoodie\n\nSoft fleece, oversized cut, kangaroo pocket. The main piece of any outfit.\n\n💵 1290 UAH';
  var pager = row(btn('⬅️ 📷', { off: true }), btn('Photo 1/5', { off: true }), btn('📷 ➡️', { off: true }));
  var items = row(btn('◀️', { off: true }), btn('1/4', { off: true }), btn('▶️', { off: true }));
  var menu = '👋 Hi! This is Vibe Store. Browse the catalog and order your favorite things right in Telegram, no hassle.';
  S.en.vibe = {
    platform: 'tg',
    bot: { name: 'Vibe Store', initial: 'V', ava: 'assets/avatars/vibe.webp' },
    steps: [
      { k: 'user', t: '/start' },
      { k: 'bot', t: menu,
        kb: [ [btn('🛍 Catalog', { def: true }), btn('🛒 Cart', { off: true })], [btn('📦 My orders', { off: true }), btn('ℹ️ About us', { off: true })], [btn('❓ Help', { off: true })] ] },
      { k: 'bot', edit: true, t: '🛍 Pick a category:',
        kb: [ [btn('📂 Hoodies and sweatshirts', { def: true })], [btn('📂 T-shirts', { off: true })], [btn('📂 Accessories', { off: true })], [btn('🏠 Main menu', { off: true })] ] },
      { k: 'bot', edit: true, photo: 'ph-garment', t: card,
        kb: [ pager,
          [btn('S', { off: true }), btn('M', { def: true, v: { size: 'M' } }), btn('L', { off: true })],
          [btn('XL', { off: true })],
          [btn('➕ Add to cart', { off: true })],
          items,
          row(btn('⬅️ Back', { off: true }), btn('🏠 Main menu', { off: true })) ] },
      { k: 'bot', edit: true, photo: 'ph-garment', t: card,
        kb: [ pager,
          [btn('S', { off: true }), btn('✅ M', { off: true }), btn('L', { off: true })],
          [btn('XL', { off: true })],
          [btn('➕ Add to cart', { def: true, keep: true, toast: 'Added to cart ✅' })],
          items,
          row(btn('⬅️ Back', { off: true }), btn('🏠 Main menu', { def: true })) ] },
      { k: 'bot', edit: true, t: menu,
        kb: [ [btn('🛍 Catalog', { off: true }), btn('🛒 Cart', { def: true })], [btn('📦 My orders', { off: true }), btn('ℹ️ About us', { off: true })], [btn('❓ Help', { off: true })] ] },
      { k: 'bot', edit: true, t: '🛒 Your cart:\n\n• "Cloud" oversized hoodie (M) × 1 = 1290 UAH\n\nSubtotal: 1290 UAH\n💰 Total: 1290 UAH',
        kb: [ [btn('"Cloud" oversized hoodie (M)', { off: true })],
          [btn('➖', { off: true }), btn('1 pc · 1290 UAH', { off: true }), btn('➕', { off: true }), btn('🗑', { off: true })],
          [btn('🧹 Clear cart', { off: true })],
          [btn('✅ Checkout', { def: true })] ] },
      { k: 'bot', edit: true, t: 'What should we call you? Type your name 🙂' },
      { k: 'user', t: 'Andriy', v: { name: 'Andriy' } },
      { k: 'bot', t: 'Nice to meet you, Andriy! 👋\n\nNow your phone number: use the button below or type it in.',
        reply: [ [btn('📞 Send my phone number', { def: true, echo: '📞 +380 50 000 00 00', v: { phone: '+380500000000' } })] ] },
      { k: 'bot', t: 'Thanks! 👌\n\nHow would you like to get the order?',
        kb: [ [btn('Nova Poshta (branch)', { v: { dkey: 'np', delivery: 'Nova Poshta (branch)' } })],
          [btn('Pickup from the showroom', { def: true, v: { dkey: 'pickup', delivery: 'Pickup from the showroom' } })],
          [btn('Courier in the city', { v: { dkey: 'courier', delivery: 'Courier in the city' } })],
          [btn('🚫 Cancel', { off: true })] ] },
      { k: 'bot', when: { dkey: 'np' }, t: 'Which city should we ship to? Type the city name:' },
      { k: 'user', when: { dkey: 'np' }, t: 'Kyiv', v: { city: 'Kyiv' } },
      { k: 'bot', when: { dkey: 'np' }, t: 'City: Kyiv 👍\n\nNow the Nova Poshta branch number:' },
      { k: 'user', when: { dkey: 'np' }, t: '25', v: { loc: '\n🏙 City: Kyiv\n📮 Branch: 25' } },
      { k: 'bot', t: 'How do you plan to pay?',
        kb: [ [btn('Cash on delivery', { def: true, v: { pkey: 'cod', payment: 'Cash on delivery' } })],
          [btn('Card transfer', { v: { pkey: 'card', payment: 'Card transfer' } })],
          [btn('🚫 Cancel', { off: true })] ] },
      { k: 'bot', when: { pkey: 'card' }, t: 'Send a screenshot of the payment 📸' },
      { k: 'user', when: { pkey: 'card' }, photo: 'ph-receipt', t: '' },
      { k: 'bot', t: 'Got a promo code? Type it, or skip this step:',
        kb: [ [btn('⏭ Skip', { def: true })], [btn('🚫 Cancel', { off: true })] ] },
      { k: 'bot', t: 'Want to add anything to the order? Type a comment, or skip:',
        kb: [ [btn('⏭ Skip', { def: true })], [btn('🚫 Cancel', { off: true })] ] },
      { k: 'bot', t: '📝 Please check the order:\n\n• "Cloud" oversized hoodie (M) × 1 = 1290 UAH\n\nSubtotal: 1290 UAH\n💰 Total: 1290 UAH\n\n👤 Name: {name}\n📞 Phone: {phone}\n🚚 Delivery: {delivery}{loc}\n💳 Payment: {payment}',
        kb: [ [btn('✅ Confirm order', { def: true })], [btn('🚫 Cancel', { off: true })] ] },
      { k: 'bot', t: '🎉 Order #1 accepted!\n\nWe’ll contact you shortly. Thanks for your purchase 💛' }
    ]
  };
})();

/* ===================================================== EN: Discord concepts == */
S.en.tickets = {
  platform: 'dc',
  bot: { name: 'Support Bot', initial: 'S', channel: 'support' },
  steps: [
    { k: 'bot', embed: { title: 'Support tickets' }, t: 'Need help? Press the button below to open a private ticket with our team.',
      kb: [ [btn('🎫 Open ticket', { s: 'p', def: true })] ] },
    { k: 'bot', eph: true, t: 'Your ticket was created: **#ticket-0001**' },
    { k: 'chan', name: 'ticket-0001' },
    { k: 'bot', embed: { title: 'Ticket opened' }, t: 'Hi @new_member, our team will be with you shortly. Please describe your problem.',
      kb: [ [btn('🔒 Close ticket', { off: true }), btn('🙋 Claim', { off: true })] ] },
    { k: 'user', who: 'new_member', t: 'I verified, but my role is missing.' },
    { k: 'bot', who: 'Mod_Kate', human: true, t: 'Hi! Checking it now.' },
    { k: 'bot', who: 'Mod_Kate', human: true, t: 'Fixed. Restart Discord and look again.' },
    { k: 'user', who: 'new_member', t: 'It works, thanks!' },
    { k: 'bot', embed: { title: 'Close this ticket?' }, t: 'The channel will be deleted after closing.',
      kb: [ [btn('🔒 Close', { s: 'p', def: true }), btn('Keep open', { off: true })] ] },
    { k: 'bot', t: 'Ticket closed. Thanks for reaching out.' }
  ]
};

S.en.verify = {
  platform: 'dc',
  bot: { name: 'Verify Bot', initial: 'V', channel: 'verify' },
  steps: [
    { k: 'bot', embed: { title: 'Welcome to the server' }, t: 'Press the button below to verify and get access to the channels.',
      kb: [ [btn('✅ Verify', { s: 'p', def: true })] ] },
    { k: 'bot', eph: true, t: 'You are verified. The **Member** role was added.' },
    { k: 'bot', embed: { title: 'Pick your roles' }, t: 'Choose what you are into. You can change it any time.',
      kb: [ [ btn('🎮 Gamer', { s: 's', v: { role: 'Gamer' } }), btn('🎨 Artist', { s: 's', v: { role: 'Artist' } }), btn('⛏ Minecraft', { s: 's', def: true, v: { role: 'Minecraft' } }) ] ] },
    { k: 'bot', eph: true, t: 'Role **{role}** added.' }
  ]
};

/* ============================================================== UA: Blade == */
(function () {
  var nav = row(btn('⬅️ Назад', { off: true }), btn('🏠 Головне меню', { off: true }));
  S.uk.blade = {
    platform: 'tg',
    bot: { name: 'Blade', initial: 'B', ava: 'assets/avatars/blade.webp' },
    steps: [
      { k: 'user', t: '/start' },
      { k: 'bot', photo: 'ph-shop',
        t: '**Blade**\nБарбершоп у центрі Дніпра\n\nПривіт! 👋 Це бот барбершопу «Blade» у Дніпрі. Тут можна записатись за хвилину, без дзвінків.',
        kb: [ [btn('✂️ Записатися', { def: true })], [btn('📅 Мої записи', { off: true })], [btn('💈 Послуги та ціни', { off: true })], [btn('👥 Наш персонал', { off: true })], [btn('📍 Контакти', { off: true })] ] },
      { k: 'bot', edit: true, t: 'Яку послугу оформляємо?',
        kb: [
          [btn('Чоловіча стрижка — 350 грн', { v: { service: 'Чоловіча стрижка', skey: 'haircut', price: '350 грн', durText: '40 хв', dur: 40 } })],
          [btn('Стрижка + борода — 550 грн', { def: true, v: { service: 'Стрижка + борода', skey: 'combo', price: '550 грн', durText: '1 год', dur: 60 } })],
          [btn('Оформлення бороди — 250 грн', { v: { service: 'Оформлення бороди', skey: 'beard', price: '250 грн', durText: '30 хв', dur: 30 } })],
          [btn('Дитяча стрижка — 250 грн', { v: { service: 'Дитяча стрижка', skey: 'kids', price: '250 грн', durText: '30 хв', dur: 30 } })],
          [btn('Королівське гоління — 400 грн', { v: { service: 'Королівське гоління', skey: 'shave', price: '400 грн', durText: '40 хв', dur: 40 } })],
          nav ] },
      { k: 'bot', edit: true, t: 'Обраний варіант: **{service}** — {price}, {durText}\n\nОберіть зручну дату:',
        kb: [
          [btn('{d0}', { v: { date: '{d0}' } }), btn('{d1}', { def: true, v: { date: '{d1}' } })],
          [btn('{d2}', { v: { date: '{d2}' } }), btn('🚫 {d3}', { dis: true })],
          [btn('{d4}', { v: { date: '{d4}' } }), btn('{d5}', { v: { date: '{d5}' } })],
          nav ] },
      { k: 'bot', edit: true, t: 'Дата: {date}\nОберіть час:',
        kb: [
          [btn('🕐 10:00', { v: { time: '10:00' } }), btn('🕐 10:30', { v: { time: '10:30' } }), btn('🕐 11:00', { def: true, v: { time: '11:00' } })],
          [btn('🕐 11:30', { v: { time: '11:30' } }), btn('🕐 12:00', { v: { time: '12:00' } }), btn('🕐 14:00', { v: { time: '14:00' } })],
          [btn('🕐 15:30', { v: { time: '15:30' } }), btn('🕐 16:00', { v: { time: '16:00' } }), btn('🕐 17:30', { v: { time: '17:30' } })],
          nav ] },
      { k: 'bot', edit: true, t: 'Дата: {date}, час: {time}\n\nОберіть майстра:',
        kb: [
          [btn('🎲 Будь-який вільний', { v: { master: 'Олексій' } })],
          [btn('👤 Олексій', { def: true, v: { master: 'Олексій' } })],
          [btn('👤 Дмитро', { v: { master: 'Дмитро' }, when: { skey: ['haircut', 'combo', 'beard', 'shave'] } })],
          [btn('👤 Ігор', { v: { master: 'Ігор' }, when: { skey: ['haircut', 'beard', 'kids'] } })],
          nav ] },
      { k: 'bot', edit: true, photo: 'ph-person',
        t: 'Перевірте деталі:\n\n💈 Послуга: {service}\n👤 Майстер: {master}\n📅 Дата: {date}\n🕐 Час: {time}–{end}\n💰 Ціна: {price}\n📍 Адреса: вул. Січеславська Набережна, 29\n\nВсе вірно?',
        kb: [ [btn('✅ Підтвердити', { def: true })], nav ] },
      { k: 'bot', t: 'Маєте фото бажаної стрижки? Надішліть фото — це допоможе майстру зрозуміти, що ви хочете 📸 Або натисніть «Пропустити».',
        kb: [ [btn('➡️ Пропустити', { def: true })] ] },
      { k: 'bot', t: 'Як до вас звертатись? Напишіть ім’я (і, за бажанням, прізвище):' },
      { k: 'user', t: 'Андрій', v: { name: 'Андрій' } },
      { k: 'bot', t: 'Тепер номер телефону — натисніть кнопку нижче або введіть вручну (формат +380XXXXXXXXX):',
        reply: [ [btn('📱 Надіслати номер', { def: true, echo: '📞 +380 50 000 00 00', v: { phone: '+380500000000' } })] ] },
      { k: 'bot', t: 'Дякую! Оформляю запис…' },
      { k: 'bot', t: '✅ Готово! Записав вас:\n\n💈 {service}\n👤 Майстер: {master}\n📅 {date} о {time}\n💰 {price}\n📍 вул. Січеславська Набережна, 29\n\nНагадаю за добу і за 2 години до візиту 🙂',
        kb: [ [btn('🏠 Головне меню', { off: true })] ] },
      { k: 'bot', after: 3000,
        t: '👔 **Так це побачить власник бізнесу**\n(це демо — у реальному боті таке повідомлення прийде адміну)\n\n🆕 Новий запис!\nПослуга: {service}\nМайстер: {master}\nКоли: {date} о {time}\nЦіна: {price}\nКлієнт: {name}, {phone}',
        kb: [ [btn('✅ Підтвердити', { off: true }), btn('❌ Скасувати', { off: true })] ] }
    ]
  };
})();

/* ============================================================= UA: FixIt == */
S.uk.fixit = {
  platform: 'tg',
  bot: { name: 'FixIt Дніпро', initial: 'F', ava: 'assets/avatars/fixit.webp' },
  steps: [].concat([
    { k: 'user', t: '/start' },
    { k: 'bot',
      t: '👋 Вітаємо у **FixIt Дніпро**!\nРемонт телефонів та ноутбуків будь-якої складності\n\nРемонтуємо телефони, ноутбуки та планшети будь-яких брендів. Безкоштовна діагностика, гарантія на всі роботи, ремонт від 1 дня.\n\nОберіть, що вас цікавить:',
      kb: [ [btn('📝 Залишити заявку', { def: true })], [btn('🧮 Розрахувати вартість', { off: true })], [btn('📋 Послуги та ціни', { off: true })], [btn('❓ Часті питання', { off: true })], [btn('📍 Контакти', { off: true })] ] },
    { k: 'bot', edit: true, t: '📝 **Заявка на ремонт**\n\nКрок 1/6. Яка у вас техніка?',
      kb: [
        [btn('📱 Телефон', { def: true, v: { dev: 'phone', device: '📱 Телефон' } })],
        [btn('💻 Ноутбук', { v: { dev: 'laptop', device: '💻 Ноутбук' } })],
        [btn('📲 Планшет', { v: { dev: 'tablet', device: '📲 Планшет' } })],
        [btn('🖥 Комп’ютер (ПК)', { v: { dev: 'pc', device: '🖥 Комп’ютер (ПК)' } })],
        [btn('🎧 Інша техніка', { v: { dev: 'other', device: '🎧 Інша техніка' } })],
        [btn('❌ Скасувати', { off: true })] ] }
  ], problemSteps('🔧 {device}\n\nКрок 2/6. Що саме не так?', {
    phone: ['🖼 Розбитий екран / не працює сенсор', '🔋 Швидко сідає батарея', '🔌 Не заряджається', '⛔ Не вмикається', '💧 Потрапила рідина', '📷 Камера / динамік / мікрофон', '🐢 Гальмує, глючить, програми', '❓ Інше'],
    laptop: ['⛔ Не вмикається', '🔥 Гріється / шумить / вимикається', '🖥 Екран: розбитий, смуги, темний', '⌨️ Клавіатура / тачпад', '💧 Залили рідиною', '🔌 Не заряджається / роз’єм', '🐢 Гальмує, Windows / програми', '❓ Інше'],
    tablet: ['🖼 Розбитий екран / сенсор', '🔋 Батарея / не заряджається', '⛔ Не вмикається', '💧 Потрапила рідина', '🐢 Гальмує, програми', '❓ Інше'],
    pc: ['⛔ Не вмикається / не запускається', '🔥 Гріється / шумить', '🐢 Гальмує, Windows / програми', '💾 Втрачені дані / диск', '🔧 Апгрейд / збірка', '❓ Інше'],
    other: ['⛔ Не вмикається', '🔋 Батарея / зарядка', '🔊 Звук / зображення', '💧 Потрапила рідина', '❓ Інше']
  }), [
    { k: 'bot', t: 'Крок 3/6. 📷 Надішліть фото проблеми — так майстру буде простіше оцінити ремонт.\n\nНемає фото — просто пропустіть цей крок.',
      kb: [ [btn('➡️ Пропустити фото', { def: true })] ] },
    { k: 'bot', t: 'Крок 4/6. ✍️ Опишіть проблему своїми словами: що сталося, коли, що вже пробували.\n\n//Наприклад: «Впав з рук, екран у тріщинах, сенсор працює лише знизу»//' },
    { k: 'user', t: 'Впав з рук, екран у тріщинах, сенсор працює лише знизу', v: { desc: 'Впав з рук, екран у тріщинах, сенсор працює лише знизу' } },
    { k: 'bot', t: 'Крок 5/6. 👤 Як до вас звертатись?\n\nНапишіть ім’я або оберіть кнопкою.',
      kb: [ [btn('👤 Андрій', { def: true, v: { name: 'Андрій' } })] ] },
    { k: 'bot', t: 'Крок 6/6. 💬 Куди майстру вам написати?\n\nНатисніть кнопку з вашим Telegram або надішліть інший контакт — @нікнейм чи номер телефону.',
      kb: [ [btn('✅ Мій Telegram: @username', { def: true })] ] },
    { k: 'bot', t: '✅ **Заявку №1 прийнято!**\n\n🔧 {device} — {problem}\n💬 Контакт: @username\n\nМайстер перегляне заявку й напише вам, щоб домовитись про деталі. Якщо захочете щось додати — просто напишіть сюди в чат.' },
    { k: 'bot', after: 3000,
      t: '🔔 **Так це побачить власник бізнесу:**\n\n📋 **Заявка №1** — 🆕 Нова\n\n🔧 **Техніка:** {device}\n⚠️ **Що не так:** {problem}\n📝 **Опис:**\n> {desc}\n\n👤 **Ім’я:** {name}\n💬 **Контакт:** @username',
      kb: [ [btn('💬 Написати @username', { off: true })], [btn('📁 В роботу', { off: true }), btn('📝 Нотатка', { off: true })] ] }
  ])
};

/* ============================================================= UA: Vibe === */
(function () {
  var card = '🏷 Худі \'Cloud\' оверсайз\n\nМ’яка байка, оверсайз крій, кишеня-кенгуру. Головна річ будь-якого образу.\n\n💵 1290 грн';
  var pager = row(btn('⬅️ 📷', { off: true }), btn('Фото 1/5', { off: true }), btn('📷 ➡️', { off: true }));
  var items = row(btn('◀️', { off: true }), btn('1/4', { off: true }), btn('▶️', { off: true }));
  var menu = 'Привіт! 👋 Це Vibe Store — тут можна погортати каталог і замовити улюблені речі прямо в Telegram, без зайвого клопоту.';
  S.uk.vibe = {
    platform: 'tg',
    bot: { name: 'Vibe Store', initial: 'V', ava: 'assets/avatars/vibe.webp' },
    steps: [
      { k: 'user', t: '/start' },
      { k: 'bot', t: menu,
        kb: [ [btn('🛍 Каталог', { def: true }), btn('🛒 Кошик', { off: true })], [btn('📦 Мої замовлення', { off: true }), btn('ℹ️ Про нас', { off: true })], [btn('❓ Допомога', { off: true })] ] },
      { k: 'bot', edit: true, t: '🛍 Обирайте категорію:',
        kb: [ [btn('📂 Худі та світшоти', { def: true })], [btn('📂 Футболки', { off: true })], [btn('📂 Аксесуари', { off: true })], [btn('🏠 Головне меню', { off: true })] ] },
      { k: 'bot', edit: true, photo: 'ph-garment', t: card,
        kb: [ pager,
          [btn('S', { off: true }), btn('M', { def: true, v: { size: 'M' } }), btn('L', { off: true })],
          [btn('XL', { off: true })],
          [btn('➕ У кошик', { off: true })],
          items,
          row(btn('⬅️ Назад', { off: true }), btn('🏠 Головне меню', { off: true })) ] },
      { k: 'bot', edit: true, photo: 'ph-garment', t: card,
        kb: [ pager,
          [btn('S', { off: true }), btn('✅ M', { off: true }), btn('L', { off: true })],
          [btn('XL', { off: true })],
          [btn('➕ У кошик', { def: true, keep: true, toast: 'Додано у кошик ✅' })],
          items,
          row(btn('⬅️ Назад', { off: true }), btn('🏠 Головне меню', { def: true })) ] },
      { k: 'bot', edit: true, t: menu,
        kb: [ [btn('🛍 Каталог', { off: true }), btn('🛒 Кошик', { def: true })], [btn('📦 Мої замовлення', { off: true }), btn('ℹ️ Про нас', { off: true })], [btn('❓ Допомога', { off: true })] ] },
      { k: 'bot', edit: true, t: '🛒 Ваш кошик:\n\n• Худі \'Cloud\' оверсайз (M) × 1 = 1290 грн\n\nСума: 1290 грн\n💰 Разом: 1290 грн',
        kb: [ [btn('Худі \'Cloud\' оверсайз (M)', { off: true })],
          [btn('➖', { off: true }), btn('1 шт. · 1290 грн', { off: true }), btn('➕', { off: true }), btn('🗑', { off: true })],
          [btn('🧹 Очистити кошик', { off: true })],
          [btn('✅ Оформити', { def: true })] ] },
      { k: 'bot', edit: true, t: 'Як до вас звертатися? Напишіть ім’я 🙂' },
      { k: 'user', t: 'Андрій', v: { name: 'Андрій' } },
      { k: 'bot', t: 'Приємно познайомитись, Андрій! 👋\n\nТепер номер телефону — кнопкою нижче або напишіть вручну.',
        reply: [ [btn('📞 Надіслати номер телефону', { def: true, echo: '📞 +380 50 000 00 00', v: { phone: '+380500000000' } })] ] },
      { k: 'bot', t: 'Дякую! 👌\n\nЯк вам зручніше отримати замовлення?',
        kb: [ [btn('Нова Пошта (відділення)', { v: { dkey: 'np', delivery: 'Нова Пошта (відділення)' } })],
          [btn('Самовивіз із шоуруму', { def: true, v: { dkey: 'pickup', delivery: 'Самовивіз із шоуруму' } })],
          [btn('Кур’єр по місту', { v: { dkey: 'courier', delivery: 'Кур’єр по місту' } })],
          [btn('🚫 Скасувати', { off: true })] ] },
      { k: 'bot', when: { dkey: 'np' }, t: 'До якого міста відправляти? Напишіть назву міста:' },
      { k: 'user', when: { dkey: 'np' }, t: 'Київ', v: { city: 'Київ' } },
      { k: 'bot', when: { dkey: 'np' }, t: 'Місто: Київ 👍\n\nТепер номер відділення Нової Пошти:' },
      { k: 'user', when: { dkey: 'np' }, t: '25', v: { loc: '\n🏙 Місто: Київ\n📮 Відділення: 25' } },
      { k: 'bot', t: 'Як плануєте оплатити?',
        kb: [ [btn('Накладений платіж', { def: true, v: { pkey: 'cod', payment: 'Накладений платіж' } })],
          [btn('Переказ на картку', { v: { pkey: 'card', payment: 'Переказ на картку' } })],
          [btn('🚫 Скасувати', { off: true })] ] },
      { k: 'bot', when: { pkey: 'card' }, t: 'Надішліть скрін оплати 📸' },
      { k: 'user', when: { pkey: 'card' }, photo: 'ph-receipt', t: '' },
      { k: 'bot', t: 'Є промокод? Напишіть його, або пропустіть цей крок:',
        kb: [ [btn('⏭ Пропустити', { def: true })], [btn('🚫 Скасувати', { off: true })] ] },
      { k: 'bot', t: 'Хочете щось додати до замовлення? Напишіть коментар, або пропустіть:',
        kb: [ [btn('⏭ Пропустити', { def: true })], [btn('🚫 Скасувати', { off: true })] ] },
      { k: 'bot', t: '📝 Перевірте, будь ласка, замовлення:\n\n• Худі \'Cloud\' оверсайз (M) × 1 = 1290 грн\n\nСума: 1290 грн\n💰 Разом: 1290 грн\n\n👤 Ім’я: {name}\n📞 Телефон: {phone}\n🚚 Отримання: {delivery}{loc}\n💳 Оплата: {payment}',
        kb: [ [btn('✅ Підтвердити замовлення', { def: true })], [btn('🚫 Скасувати', { off: true })] ] },
      { k: 'bot', t: '🎉 Замовлення №1 прийнято!\n\nМи зв’яжемось з вами найближчим часом. Дякуємо за покупку 💛' }
    ]
  };
})();

/* ===================================================== UA: Discord concepts == */
S.uk.tickets = {
  platform: 'dc',
  bot: { name: 'Support Bot', initial: 'S', channel: 'підтримка' },
  steps: [
    { k: 'bot', embed: { title: 'Тікети підтримки' }, t: 'Потрібна допомога? Натисніть кнопку нижче, щоб відкрити приватний тікет із нашою командою.',
      kb: [ [btn('🎫 Відкрити тікет', { s: 'p', def: true })] ] },
    { k: 'bot', eph: true, t: 'Ваш тікет створено: **#ticket-0001**' },
    { k: 'chan', name: 'ticket-0001' },
    { k: 'bot', embed: { title: 'Тікет відкрито' }, t: 'Привіт, @new_member, наша команда скоро відповість. Опишіть, будь ласка, свою проблему.',
      kb: [ [btn('🔒 Закрити тікет', { off: true }), btn('🙋 Взяти в роботу', { off: true })] ] },
    { k: 'user', who: 'new_member', t: 'Я пройшов верифікацію, але ролі немає.' },
    { k: 'bot', who: 'Mod_Kate', human: true, t: 'Привіт! Зараз перевірю.' },
    { k: 'bot', who: 'Mod_Kate', human: true, t: 'Виправила. Перезапустіть Discord і гляньте ще раз.' },
    { k: 'user', who: 'new_member', t: 'Працює, дякую!' },
    { k: 'bot', embed: { title: 'Закрити тікет?' }, t: 'Після закриття канал буде видалено.',
      kb: [ [btn('🔒 Закрити', { s: 'p', def: true }), btn('Залишити відкритим', { off: true })] ] },
    { k: 'bot', t: 'Тікет закрито. Дякуємо за звернення.' }
  ]
};

S.uk.verify = {
  platform: 'dc',
  bot: { name: 'Verify Bot', initial: 'V', channel: 'верифікація' },
  steps: [
    { k: 'bot', embed: { title: 'Ласкаво просимо на сервер' }, t: 'Натисніть кнопку нижче, щоб пройти верифікацію й отримати доступ до каналів.',
      kb: [ [btn('✅ Пройти верифікацію', { s: 'p', def: true })] ] },
    { k: 'bot', eph: true, t: 'Верифікацію пройдено. Роль **Member** додано.' },
    { k: 'bot', embed: { title: 'Оберіть свої ролі' }, t: 'Виберіть, що вам цікаво. Змінити можна будь-коли.',
      kb: [ [ btn('🎮 Геймер', { s: 's', v: { role: 'Геймер' } }), btn('🎨 Художник', { s: 's', v: { role: 'Художник' } }), btn('⛏ Minecraft', { s: 's', def: true, v: { role: 'Minecraft' } }) ] ] },
    { k: 'bot', eph: true, t: 'Роль **{role}** додано.' }
  ]
};

})();
