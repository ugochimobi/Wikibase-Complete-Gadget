# Wikibase Complete Gadget

## 📌Introduction

The WikidataComplete Gadget is a **[Wikidata](https://www.wikidata.org/)** gadget that is intended to help users in adding more facts to the Wikidata knowledge base. 
The tool is currently being developed for **[Gratisdata](https://gratisdata.miraheze.org/)** for the same purpose.
The tool is fetching suggestions from an API and shows them to the user directly within the Wikidata Web frontend, s.t., adding more facts is becoming convenient.
The suggestions are computed automatically from other sources (e.g., Web Content, Knowledge Bases).
This project was the part of [Google Summer of Code Program 2021 (GSoC'21)]().

## ⚡Installation

### Step 1: Create a Gratisdata [account](https://gratisdata.miraheze.org/w/index.php?title=Special:CreateAccount)

### Step 2: After logging in create your own [common.js](https://gratisdata.miraheze.org/wiki/Special:MyPage/common.js)

### Step 3: Now add the following line of code to your [common.js](https://gratisdata.miraheze.org/wiki/Special:MyPage/common.js):

```bash
mw.loader.load("//gratisdata.miraheze.org/w/index.php?title=MediaWiki:Gadget-GratisdataComplete.js&action=raw&ctype=text/javascript");
```

### Step 4: Now visit any [random item](https://gratisdata.miraheze.org/wiki/Special:Random) at Gratisdata and start editing 🥳

## :camera: Video Guide:
Check out the [video guide](https://www.youtube.com/watch?v=Ju2ExZ_khxQ)
## 💻 Maintainers

- [Dennis Diefenbach](https://github.com/D063520)
- [Andreas Both](https://github.com/anbo-de)
- [Aleksandr Perevalov](https://github.com/Perevalov)
- [Kunpeng Guo](https://github.com/gabinguo)
- [Dhairya Khanna](https://github.com/Dhairya3124)

## :fireworks: Contribution Guide
Check out the contribution [guide](https://github.com/Dhairya3124/Wikidata-Complete-Gadget/blob/main/Contribution.md)

