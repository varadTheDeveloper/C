# PC hardware shop website: brief for Claude Desktop

This is a hand-off from a Claude Code cloud session. It explains the project, everything decided
so far, and what this Desktop session needs to do.

**Important: do not start building the website yet.** The owner of this project (the user) said
"do not start yet". First do the research task below, then report back and wait for the user to
say "start".

---

## 1. The problem

A shopkeeper sells PC hardware (CPUs, graphics cards, RAM, SSDs, motherboards and so on) and
wants an online shop. Their worry: **PC part prices change a lot, sometimes daily.** If the
website shows a price and a customer orders at the old price (say ₹10,000), but the shop now has
to buy that part at ₹20,000, the shop loses money. Because of this they hesitate to put prices
on a website.

## 2. The solution we agreed on: no prices on the site, quotes on WhatsApp

The customer never pays until the shopkeeper confirms today's price.

1. The customer browses the website. Products show **photo, specs, brand, warranty and stock
   status, but no price.**
2. They add items to a **quote list** (like a cart, without prices).
3. They press **"Get Price on WhatsApp"**. WhatsApp opens with a ready-made message, for example:
   ```
   Hi, please send price for:
   1× Ryzen 5 7600
   1× RTX 4060 8GB
   2× 16GB DDR5 RAM
   Delivery: Pickup
   ```
   This uses a normal `https://wa.me/<number>?text=<message>` link, which is free with no API.
4. The shopkeeper replies on WhatsApp with **today's price**, valid for a short time
   (for example 24 hours), including any delivery charge.
5. The shopkeeper sends a **UPI QR code or payment link** in the same chat. The customer pays.
6. The shopkeeper sends the bill/invoice on WhatsApp and arranges pickup or delivery.

### Decisions made
- **No login, no OTP, no customer accounts.** The customer messages from their own WhatsApp
  number, so the number is already real.
- **No payment on the website.** Payment happens on WhatsApp after the price is confirmed.
- **Shipping is handled by the shopkeeper:** pickup from the shop, or local delivery by the
  shopkeeper/staff. The delivery charge goes inside the quote. Courier to other cities
  (for example Shiprocket) can come later if needed.
- **Be careful with cash on delivery for expensive items** (risk of the customer refusing a
  ₹30,000 part at the door). Not finally decided: COD for small orders only, or a small advance.
- The shopkeeper should use the free **WhatsApp Business app** (quick replies, labels like
  Paid / Pending / Delivered, auto-reply).
- Later, optional: WhatsApp Business API (Interakt, AiSensy, Gupshup) for automatic messages.
  Costs per message, so not now.

### Website features (first version)
- Product pages: photo, name, brand, specs, warranty, stock (In stock / Available on order /
  Out of stock). **No price anywhere.**
- Category filter and search. Categories: CPU, GPU, RAM, SSD/Storage, Motherboard, PSU,
  Cabinet, Monitor (to confirm with the shopkeeper).
- Quote list with quantity, then "Get Price on WhatsApp". The message includes items, pickup or
  delivery (with area), optional name, optional GST number, and a note.
- **"Build my PC" form:** budget, use (gaming / office / editing), preferences. Sent to WhatsApp.
- Floating WhatsApp button on every page.
- Shop address, opening hours, link to their Instagram.
- Works well on phones (most customers will be on mobile).

### How products get onto the site (chosen: option 1)
- **Option 1 (chosen):** the shopkeeper keeps products in a **Google Sheet** on their phone,
  published as CSV (File > Share > Publish to web > CSV). The website reads that sheet. To add
  a product, the shopkeeper adds a row. Columns, roughly: id, name, category, brand, specs,
  warranty, stock, image link, featured.
- The site is a simple static site (HTML/CSS/JavaScript), so hosting can be free
  (GitHub Pages, Netlify or Cloudflare Pages).
- Option 2 (not chosen for now): reuse the admin panel of the user's other project (below). It
  needs a paid server.

### Photos (the user asked about this several times)
- **While building:** no real product photos. Use simple **category icons drawn in code**
  (SVG) as placeholders. Banner photos, if any, only from free sites like Unsplash, with credit.
- **Real photos come from the shopkeeper:** their own phone photos of the actual boxes in the
  shop (best, builds trust), or official brand photos from the brand's website or their
  distributor (check with the distributor if unsure).
- The shopkeeper uploads a photo to Google Drive and pastes the link into the sheet. The site
  should turn a Drive share link into a direct image link.
- **Never copy photos from Amazon, Flipkart or other shops' websites** (copyright).
- If the shopkeeper's **Instagram** already has real product photos, those are theirs and could
  be used **with their permission.**

## 3. Reference project

The user has another project: https://github.com/varadTheDeveloper/e-commerce
It is a full clothing store for India: Medusa v2 backend + admin panel, Next.js storefront,
Marathi/Hindi/English, phone OTP login, Razorpay, COD, Shiprocket, GST invoices, returns,
wishlist, Docker deployment. We decided the PC shop **does not need most of this** at the
start, because WhatsApp handles pricing, payment and contact. It is a reference for later
(for example if the shop grows and wants an admin panel or online payments).

## 4. What this Desktop session needs to do now

The cloud session could not open the shopkeeper's Instagram (Instagram blocks visitors who are
not logged in). This Desktop session can, through **Claude in Chrome** in the user's own
browser where they are logged in to Instagram.

**Task: research the shopkeeper's Instagram account**
https://www.instagram.com/computer_warehouse02/

Find and write down:
1. Shop name, and the exact name used in the bio
2. City and address
3. Phone / WhatsApp number (if shown in the bio or posts)
4. What they sell most: parts, full PC builds, laptops, used/refurbished items, accessories
5. Popular brands in their posts
6. How they handle prices now: do posts say "DM for price"? Do they ever show prices?
7. Logo and brand colours, and the general style of their posts
8. Whether their posts have good real product photos we could use (with permission)
9. Follower count, roughly how often they post, and opening hours if mentioned
10. Anything else useful for the website (offers, services like PC building or repair,
    reviews)

Then **report back to the user** with a short summary, and suggest the starting product
categories, the site name and colours based on what you found. **Wait for the user to say
"start" before building anything.**

## 5. Still needed from the user before building
- Shop name
- WhatsApp number
- Language: English only, or also Hindi/Marathi
- Where to build it: inside the `varadTheDeveloper/C` repo (in a `pc-shop/` folder) or a new repo
- COD rule (small orders only, or a small advance)
