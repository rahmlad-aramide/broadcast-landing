// FAQ content for the free-tool pages. Rendered by ToolFaq and emitted as FAQPage
// structured data by each tool's page.tsx — keep answers plain text.
export interface ToolFaqItem { q: string; a: string }

export const FORMATTER_FAQS: ToolFaqItem[] = [
  { q: "Do I need an app or a special font to format WhatsApp text?", a: "No. WhatsApp formats text itself when it sees the markers: *bold*, _italic_, ~strikethrough~ and ```monospace```. This tool just saves you typing them and shows how the result will look." },
  { q: "Does my text leave this browser?", a: "No. The formatter runs entirely in your browser. Nothing you type is uploaded, stored or sent to us." },
  { q: "Why does my message show asterisks instead of bold text?", a: "The marker has to touch the text on both sides. *Friday* becomes bold, but * Friday * does not. Markers inside a word, like snake_case_name, are also left alone." },
  { q: "Where can I use this formatting?", a: "In normal WhatsApp and WhatsApp Business chats and groups, and in messages sent through the WhatsApp Business API. For approved templates sent in bulk, Meta decides which styles are allowed, so check your template in WhatsApp Manager if a style doesn't appear." },
];

export const FEES_FAQS: ToolFaqItem[] = [
  { q: "What does Broadcast charge on top of Meta's WhatsApp fees?", a: "Nothing. Meta bills you directly for the messages you send, using the payment method on your WhatsApp account, and we add no markup. Broadcast's own charge is the flat subscription for the platform." },
  { q: "How does Meta charge for WhatsApp API messages?", a: "Meta charges per delivered template message. The price depends on the message category (Marketing, Utility or Authentication) and the recipient's country. Replies to a customer who messaged you first, within 24 hours, are generally free." },
  { q: "Are the rates in this calculator Meta's real prices?", a: "No. The rate boxes start with example numbers only. Meta's prices vary by country and change on a schedule, so replace them with the current figures from Meta's rate card for the countries you message." },
  { q: "How do I know if a provider is adding a markup?", a: "Compare the per-message price they charge with Meta's published rate for the same country and category. If it is higher, the difference is their markup. Use the comparison in the calculator to see what that adds up to over a year." },
  { q: "Do I pay Meta and Broadcast separately?", a: "Yes. You pay Meta for message usage and Broadcast for the subscription, which is paid in naira through Paystack with no automatic renewal." },
];

export const IMAGE_FAQS: ToolFaqItem[] = [
  { q: "Why compress an image before sending it on WhatsApp?", a: "When you send a picture as a photo, WhatsApp shrinks it (standard quality is roughly 1280 to 1600 pixels on the longest side, HD allows more) and re-compresses it as a lossy image at around 70 to 80 percent quality. If the image is already about that size and weight, WhatsApp has far less to throw away, so the result usually looks better than sending a huge original." },
  { q: "Can I use this for WhatsApp Status?", a: "Yes, and it suits Status well, with one rule: post the compressed file directly, with no edits. Do all your editing before compressing. Then upload the file to Status exactly as it is, and avoid WhatsApp's own editor (crop, draw, text, stickers, filters) because saving those changes compresses the picture again." },
  { q: "Can I edit or crop the image after compressing it?", a: "Please don't. Do all your editing first (crop, brightness, text, filters), then compress as the very last step and send that file as it is. Every time a compressed image is edited, re-saved, screenshotted or exported again, it is compressed a second time and loses more quality, which defeats the purpose." },
  { q: "What exactly does WhatsApp do to my photos?", a: "As generally described: it downscales the image, re-encodes it as a lossy JPEG or WebP at roughly 70 to 80 percent quality, applies 4:2:0 colour subsampling (less colour detail), strips metadata such as camera details and GPS location, and converts the colours to standard sRGB. Fine text and thin lines suffer most." },
  { q: "Will WhatsApp still compress my image?", a: "Often yes, and no tool can switch that off. This reduces the extra damage. For zero recompression, send the original as a Document instead of a photo." },
  { q: "Are my images uploaded anywhere?", a: "No. Compression happens in your browser, and your pictures never leave your device. We never see them." },
  { q: "What size limits apply for the WhatsApp API?", a: "Images sent through the WhatsApp Cloud API (for example in a template header sent through Broadcast) can be up to 5 MB. The API preset keeps your image under that." },
  { q: "Do you remove the photo's location and camera details?", a: "Yes. Re-saving the image drops its embedded metadata, including GPS location, as a side effect of compression." },
];

export const LINK_FAQS: ToolFaqItem[] = [
  { q: "What is a WhatsApp link?", a: "A WhatsApp link (also called a click-to-chat link) is a web address of the form https://wa.me/ followed by a phone number. Anyone who taps it opens a chat with that number in WhatsApp, with no need to save the number first." },
  { q: "What phone number format does a WhatsApp link need?", a: "Full international format with no plus sign, spaces or leading zeros, for example 2348031234567 for a Nigerian number. This tool converts +234 803 123 4567, 08031234567 and similar formats for you." },
  { q: "Can I add a ready-written message to the link?", a: "Yes. Whatever you type in the message box is added to the link, so the chat opens with that text already filled in. The customer just has to press send." },
  { q: "Do I need WhatsApp Business to use a link?", a: "No, a wa.me link works with any WhatsApp number. WhatsApp Business is still recommended for a business because it adds a profile, labels and quick replies." },
  { q: "How do I make a WhatsApp QR code?", a: "Enter your number (and an optional pre-filled message) and the QR code appears beside your link. Download it as a PNG or, for print, an SVG. When someone scans it with their phone camera, a chat with your number opens in WhatsApp." },
  { q: "Does the QR code expire?", a: "No. It simply contains your wa.me link, so it keeps working for as long as that number is on WhatsApp. If you change the number or the pre-filled message, make a new code." },
  { q: "Does my number get stored anywhere?", a: "No. The link and the QR code are built in your browser and nothing is sent to or saved by us." },
];

export const TEMPLATE_FAQS: ToolFaqItem[] = [
  { q: "What is a WhatsApp message template?", a: "A template is a message layout that Meta has approved in advance. Businesses must use one to start a conversation with a customer on the WhatsApp Business API. It can contain variables like {{1}} that are filled in for each person." },
  { q: "How long does template approval take?", a: "Usually from a few minutes to a day, but it can take longer. Meta reviews the wording, the category and any variables, and either approves or rejects it." },
  { q: "Why do templates get rejected?", a: "Common reasons are variables at the very start or end of the message, too many variables for the amount of text, missing sample values, shortened links, promotional wording in a Utility template, and unclear or misleading content. This checker flags those before you submit." },
  { q: "What is the difference between Marketing and Utility?", a: "Utility templates deliver information a customer expects about something they did, like an order update or appointment reminder. Marketing templates promote or encourage a purchase. Marketing usually costs more per message, and Meta may reclassify a template that sounds promotional." },
  { q: "Does this tool submit the template to Meta?", a: "No. It helps you write and check a template and gives you the JSON. To submit it, create it in Broadcast (or WhatsApp Manager). Meta's own review is the final decision, and its rules can change." },
  { q: "What about authentication (OTP) templates?", a: "Authentication templates use a fixed format created in WhatsApp Manager, with Meta's standard code message and a copy-code button, so they can't be freely written. This builder covers Marketing and Utility." },
];
