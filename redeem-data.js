/* =========================================================================
   REDEEM STORE — data file
   =========================================================================
   Edit this file to add, remove, or update items on the Redeem page — and
   to swap in real photos of each item. No HTML or CSS knowledge required.

   HOW TO ADD A PHOTO FOR AN ITEM
   -------------------------------
   1. Put your image in the assets/redeem/ folder.
      - Square-ish photos look best (roughly 1:1), JPG or PNG.
      - Give it a simple filename with no spaces, e.g. "headset.jpg".
   2. Set that item's "image" field below to "assets/redeem/headset.jpg"
      (matching whatever filename you used).
   3. Save, commit, and push — the live site updates automatically.

   Until you add a real photo, items show a placeholder "add product
   photo" graphic so it's obvious which ones still need one.

   HOW TO ADD OR REMOVE AN ITEM
   ------------------------------
   Copy one of the {...} blocks below to add a new item, or delete a
   whole block to remove one (keep the commas between items correct).
   ========================================================================= */

window.GCT_REDEEM_ITEMS = [
  {
    name: "Headset",
    cost: "35,000",
    image: "assets/redeem/headset.png"
  },
  {
    name: "T-Shirt",
    cost: "70,000",
    image: "assets/redeem/tshirt.png"
  },
  {
    name: "iPhone 12",
    cost: "2,250,000",
    image: "assets/redeem/iphone12.png"
  },
  {
    name: "PS5",
    cost: "3,750,000",
    image: "assets/redeem/ps5.png"
  },
  {
    name: "Mitsubishi Pajero 3.5 V6 GDi Elegance (2005)",
    cost: "25,000,000",
    image: "assets/redeem/pajero.png"
  }
];