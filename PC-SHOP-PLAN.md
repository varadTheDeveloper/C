# PC hardware shop website: brief for Claude Desktop

This is a hand-off from a Claude Code cloud session. It explains the project, everything decided
so far, and what this Desktop session needs to do.

**Important: do not start building the website yet.** The owner of this project (the user) said
"do not start yet". First do the research task below, then report back and wait for the user to
say "start".

> **Update (16 Oct 2026):** the Instagram research in section 4 is done. Findings are in
> **section 6**. They change a few things: the shop sells laptops, complete PC setups, open-box
> items and printers (not only parts), some offers show a fixed price, and the shop already does
> online orders / parcels. Google Maps details are in **section 7**. The user's final answers
> are in **section 5** and override earlier text (e.g. no prices at all, even on offers).
> Still waiting for the user to say "start".

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
  *(Check: the shop's Instagram has "Online order" and "Online parcel" highlights, so they may
  already ship outside Jalna. See section 6.)*
- **Be careful with cash on delivery for expensive items** (risk of the customer refusing a
  ₹30,000 part at the door). Not finally decided: COD for small orders only, or a small advance.
- The shopkeeper should use the free **WhatsApp Business app** (quick replies, labels like
  Paid / Pending / Delivered, auto-reply).
- Later, optional: WhatsApp Business API (Interakt, AiSensy, Gupshup) for automatic messages.
  Costs per message, so not now.

### Website features (first version)
- Product pages: photo, name, brand, specs, warranty, stock (In stock / Available on order /
  Out of stock). **No price anywhere.** *(Proposed change, see section 6: allow an optional
  "offer price" on a few featured festival bundles.)*
- Category filter and search. Categories: CPU, GPU, RAM, SSD/Storage, Motherboard, PSU,
  Cabinet, Monitor (to confirm with the shopkeeper). *(See section 6 for suggested categories.)*
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
  *(If offer prices are added: an optional `offer_price` column, shown only when filled.
  An optional `condition` column: New / Open box.)*
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

## 4. Research task: DONE (16 Oct 2026)

The cloud session could not open the shopkeeper's Instagram (Instagram blocks visitors who are
not logged in). It was done through **Claude in Chrome** in the user's own browser.

Accounts checked:
- https://www.instagram.com/computer_warehouse02/ (owner's account)
- https://www.instagram.com/computer_warehouse_jalna/ (shop account)

Results are in section 6. **Wait for the user to say "start" before building anything.**

## 5. Final decisions (user answers, 16 Oct 2026)

These override anything earlier in this file that says otherwise.

- **Shop name:** Computer Warehouse Jalna.
- **WhatsApp number:** **9307570781** (confirmed). All "Get Price on WhatsApp" links use
  `https://wa.me/919307570781?text=...`.
- **Opening hours:** 9am–10:30pm, all 7 days (from Google, section 7).
- **Delivery outside Jalna:** handled **on WhatsApp**. The quote message asks for pickup /
  Jalna delivery / other city (with city name). The shopkeeper replies with the delivery charge.
  The site does not show courier options or charges.
- **Cash on delivery:** decided **on WhatsApp**, order by order. The site does not promise COD.
- **Prices:** **no prices anywhere on the site, including festival offers.** Offer items get a
  "Festival Offer" / "Special Offer" badge and the same "Get Price on WhatsApp" button.
  The `offer_price` column idea from section 2 is **dropped**. Keep an `offer` (yes/no) column
  for the badge, and the `condition` column (New / Open box).
- **Languages:** **Marathi, Hindi and English**, with a language switch at the top.
  Default: Marathi.
- **Logo:** a clean **text logo of the shop name** ("COMPUTER WAREHOUSE" / "Jalna") in the shop's
  yellow and red. Before designing it, look at the shop signboard photos on the Google Maps
  listing so the logo matches the board people already know.
- **Where to build:** in this repo, `varadTheDeveloper/C`, in a **`pc-shop/`** folder. The old
  C files (`hello.c`, `Makefile`, `.gitignore`) were removed and the README now describes this
  project.
- **Domain:** to be decided later. Build so the site works on a free hosting link first.
- **Still open:** permission to use his reel footage / screenshots on the site.

**Status: do not start building until the user says "start".**

---

## 6. Instagram research findings (16 Oct 2026)

### Shop details
- **Shop name:** COMPUTER WAREHOUSE. Posts use **"Computer Warehouse Jalna"**.
- **Owner:** Amol Jagtap Patil (अमोल जगताप पाटील).
- **Two Instagram accounts** (most reels are posted as collabs on both):
  - @computer_warehouse02: owner's account, about 113k followers, 171 posts, "Digital creator".
  - @computer_warehouse_jalna: shop account, about 36.4k followers, about 1,300 posts.
  - Also a Facebook page ("Computer warehouse") and Threads.
- **Address:** Shop No. 17 & 18, Vitthala Tower, Shani Mandir Chowk, Old Jalna
  (bio: शनी मंदिर चौक जुना जालना विठ्ठला टॉवर).
- **Phone:** 9307570781 (main number used in captions), 8888479687. Not marked which is WhatsApp.
- **Bio:** "SALES & SERVICES", "जय महाराष्ट्र", "मराठी उद्योजक".
- **Opening hours:** not shown.

### What they sell
Not only PC parts. From posts and reels:
- **Laptops:** new and **open box** (e.g. open-box Mac Mini M4, 16GB/256GB, 5 months warranty)
- **Complete PC setups** (e.g. Ryzen 5 5600GT + MSI B550 Wi-Fi 6 + 16GB + 512GB NVMe + 500W +
  RGB cabinet, 3 years warranty)
- **Printers**, including colour printers
- PC parts, monitors, accessories
- **Service / repair** ("Sales & Services")

Brands seen: Acer (Nitro), MSI, AMD Ryzen, Apple, HP, Zebronics.

### How they handle prices now
Mixed:
- **Single items:** "Price जाणून घेण्यासाठी Comment करा — PRICE", "DM करा / Shop ला Visit करा".
  So no price shown, which matches the WhatsApp quote plan.
- **Festival offers / bundles:** fixed price shown, e.g. Navratri special PC at ₹46,500.

**Suggestion:** keep "price on WhatsApp" for everything, plus an optional **offer price** for a
few featured bundles that the shopkeeper chooses (shown only when the sheet column is filled).

### Online orders / delivery
Story highlights on the shop account include **"Online order"** and **"ऑनलाइन पार्सल"**
(online parcel). They likely already ship outside Jalna. Confirm before finalising the
"local delivery only" decision.

### Style
- Almost all content is **Marathi** reels with the owner on camera inside the shop.
- Shop look: bright **yellow** shelves, boxes everywhere; text overlays in **red/saffron** and
  white; RGB PCs.
- Tagline: **"तुमचा विश्वास, आमची जबाबदारी!"** (Your trust, our responsibility!)
- Posting: very active, about every 1–3 days. Festival offers (Navratri, Holi); a
  **Diwali lucky draw** is announced as coming soon.
- Other highlights: shop, warehouse, gaming, followers milestones.
- **No proper logo** seen, only the owner's photo as the profile picture.

### Photos
- **No clean product photos.** Content is video with the owner in frame.
- Usable (with permission) for an About / Visit the shop section and for trust, not for
  product cards.
- Product cards: keep the plan from section 2 (SVG placeholders, then the shopkeeper's own
  phone photos or official brand photos).

### Suggestions for the site
- **Site name:** Computer Warehouse Jalna
- **Language:** Marathi + English (audience is Marathi-first)
- **Colours:** warm yellow/saffron as the main colour, red for offers, on near-black or white.
  Matches the shop walls and their post style.
- **Tagline on site:** तुमचा विश्वास, आमची जबाबदारी!
- **Starting categories:**
  1. Laptops
  2. Open Box Deals
  3. Complete PC Setups
  4. Printers
  5. PC Parts (CPU, GPU, RAM, SSD/Storage, Motherboard, PSU, Cabinet)
  6. Monitors
  7. Accessories
  8. Repair & Service (enquiry form to WhatsApp)
- Home page: festival offer banner, featured bundles, "Build my PC", Instagram reels link,
  shop location map, call/WhatsApp buttons.

---

## 7. Google Maps listing (checked 16 Oct 2026)

Listing name: **COMPUTER WAREHOUSE JALNA** (कंप्यूटर वेयरहाउस जलना), category "Computer store".

- **Rating:** 4.9 stars, 284 reviews.
- **Address (as on Google):** Shop No 17, Vitthala Tower, 18, Shani Mandir Road, Old Jalna,
  Bhagya Nagar, Jalna, Maharashtra 431213. Plus code: RVQJ+QR Jalna.
- **Map location:** 19.8394922, 75.8820408
- **Phone:** 093075 70781
- **Website field:** links to their Instagram (no website yet).
- **Hours:** 9am–10:30pm, every day (Mon–Sun). Google notes hours may differ on festival days.
- **Service options:** delivery, on-site services.
- **Offerings:** assembly service (PC building).
- **Payments:** debit cards, NFC mobile payments.
- **Review topics** (how often customers mention them): laptop (61), gaming setup (12),
  refurbished laptops (9), laptop repair (8). Confirms laptops as the top category, plus
  gaming setups, refurbished/open-box and repair.

### Use on the website
- Show **"4.9★ on Google · 284 reviews"** with a link to the Google reviews page. Do not copy
  review text onto the site without the shopkeeper's approval; linking is enough.
- **Location section:** embedded Google Map at the coordinates above, plus a
  **"Get directions"** button (`https://www.google.com/maps/dir/?api=1&destination=19.8394922,75.8820408`).
- Show the hours: **9am–10:30pm, all days**.
- Show payment options at the shop: debit card and tap-to-pay (from Google). Confirm UPI and
  cash with the shopkeeper before listing them.
- After launch, put the new website link in the Google listing's **Website** field
  (it currently points to Instagram). Helps local search.
