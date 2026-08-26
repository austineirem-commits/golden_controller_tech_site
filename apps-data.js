/* =========================================================================
   OUR APPS — data file
   =========================================================================
   This is the ONLY file you need to edit to add, remove, or update an app
   on the "Our Apps" page. No HTML or CSS knowledge required.

   HOW TO ADD A NEW APP
   ---------------------
   1. Put your app's icon image in the assets/apps/ folder.
      - Square image works best, e.g. 512x512px, PNG or JPG.
      - Give it a simple filename with no spaces, e.g. "my-app-icon.png".
   2. Copy one of the {...} blocks below (a whole app entry), paste it
      as a new item in the list, and edit the text between the quotes.
   3. Set "url" to the link you want the card to open (App Store, Google
      Play, a live website, etc). If you don't have a link yet, leave it
      as an empty string "" and the card will show a "Coming soon" label
      instead of a button.
   4. Save the file, commit, and push to GitHub — the live site updates
      automatically.

   To remove an app, just delete its whole {...} block (including the
   comma after it, but not the comma on the very last item).
   ========================================================================= */

window.GCT_APPS = [
  {
    name: "Loopable",
    tagline: "social media app",
    description: "A social media app that pays users for watching ads from admob",
    platform: "iOS[comming soon] · Android",
    status: "Live",              // e.g. "Live", "Beta", "In development"
    icon: "assets/apps/Loopable.jpg",
    url: " https://austineirem-commits.github.io/golden_controller_tech_site/Loopable.apk"                      // paste a real link here, or leave blank
  }
];
