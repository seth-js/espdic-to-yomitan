# espdic-to-yomitan

### Creates a Yomitan compatible Esperanto-English dictionary from [ESPDIC](http://www.denisowski.org/Esperanto/ESPDIC/espdic_readme.html) data.
You can download the dictionary from the [Releases](https://github.com/seth-js/espdic-to-yomitan/releases) page, and then import that into [Yomitan](https://yomitan.wiki/).

#### Example (espdic-eo-en and [kty-eo-en](https://github.com/yomidevs/kaikki-to-yomitan/blob/master/downloads.md) in use):
https://github.com/user-attachments/assets/d365ed31-0f89-4bf3-bc91-49378f3f6994

Notes:
- It includes ~50,000 entries that aren't present on Wiktionary.
- The dictionary is best used in combination with [kty-eo-en](https://github.com/yomidevs/kaikki-to-yomitan/releases/latest/download/kty-eo-en.zip) and its [IPA dictionary](https://github.com/yomidevs/kaikki-to-yomitan/releases/latest/download/kty-eo-en-ipa.zip).

If you'd like to modify the creation script, you can:

1. Download/clone the repo.
2. Make your necessary modifications.
3. Open a terminal in the repo's directory.
4. Run `node create.js`.
5. Zip and import your created dictionary.
