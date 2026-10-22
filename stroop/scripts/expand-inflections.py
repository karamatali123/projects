#!/usr/bin/env python3
"""Add regular English endings derived from Webster headwords.

Reads /usr/share/dict/words (web2) and a common-word list, then merges missing
-s/-es, -ed/-d, and -ing forms into public/data. Proper names (capitalized
only in web2) are not used as stems. A verbal ending is added when web2
already has one sibling form, or when the form itself is a common word.
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public" / "data"
WEB2 = Path("/usr/share/dict/words")
FREQUENCY = Path("/tmp/google-20k.txt")

VOWELS = set("aeiou")
SKIP_SUFFIXES = (
    "ing",
    "ed",
    "ly",
    "ness",
    "ment",
    "tion",
    "sion",
    "ous",
    "ful",
    "less",
    "able",
    "ible",
    "ity",
    "ism",
    "ist",
    "ize",
    "ise",
    "est",
    "ship",
    "hood",
    "ward",
    "wise",
)

# Common irregulars. Used only when the stem is already a Webster headword,
# so the solver does not invent "maked" or "goed".
IRREGULAR = {
    "be": ["am", "is", "are", "was", "were", "been", "being"],
    "have": ["has", "had", "having"],
    "do": ["does", "did", "done", "doing"],
    "go": ["goes", "went", "gone", "going"],
    "make": ["makes", "made", "making"],
    "take": ["takes", "took", "taken", "taking"],
    "come": ["comes", "came", "coming"],
    "see": ["sees", "saw", "seen", "seeing"],
    "get": ["gets", "got", "gotten", "getting"],
    "give": ["gives", "gave", "given", "giving"],
    "know": ["knows", "knew", "known", "knowing"],
    "think": ["thinks", "thought", "thinking"],
    "say": ["says", "said", "saying"],
    "find": ["finds", "found", "finding"],
    "tell": ["tells", "told", "telling"],
    "become": ["becomes", "became", "becoming"],
    "leave": ["leaves", "left", "leaving"],
    "feel": ["feels", "felt", "feeling"],
    "bring": ["brings", "brought", "bringing"],
    "begin": ["begins", "began", "begun", "beginning"],
    "keep": ["keeps", "kept", "keeping"],
    "hold": ["holds", "held", "holding"],
    "write": ["writes", "wrote", "written", "writing"],
    "stand": ["stands", "stood", "standing"],
    "hear": ["hears", "heard", "hearing"],
    "let": ["lets", "letting"],
    "mean": ["means", "meant", "meaning"],
    "set": ["sets", "setting"],
    "meet": ["meets", "met", "meeting"],
    "run": ["runs", "ran", "running"],
    "pay": ["pays", "paid", "paying"],
    "sit": ["sits", "sat", "sitting"],
    "speak": ["speaks", "spoke", "spoken", "speaking"],
    "lie": ["lies", "lay", "lain", "lying"],
    "lead": ["leads", "led", "leading"],
    "read": ["reads", "reading"],
    "grow": ["grows", "grew", "grown", "growing"],
    "lose": ["loses", "lost", "losing"],
    "fall": ["falls", "fell", "fallen", "falling"],
    "send": ["sends", "sent", "sending"],
    "build": ["builds", "built", "building"],
    "understand": ["understands", "understood", "understanding"],
    "draw": ["draws", "drew", "drawn", "drawing"],
    "break": ["breaks", "broke", "broken", "breaking"],
    "spend": ["spends", "spent", "spending"],
    "cut": ["cuts", "cutting"],
    "rise": ["rises", "rose", "risen", "rising"],
    "drive": ["drives", "drove", "driven", "driving"],
    "buy": ["buys", "bought", "buying"],
    "wear": ["wears", "wore", "worn", "wearing"],
    "choose": ["chooses", "chose", "chosen", "choosing"],
    "eat": ["eats", "ate", "eaten", "eating"],
    "drink": ["drinks", "drank", "drunk", "drinking"],
    "sleep": ["sleeps", "slept", "sleeping"],
    "win": ["wins", "won", "winning"],
    "sell": ["sells", "sold", "selling"],
    "teach": ["teaches", "taught", "teaching"],
    "catch": ["catches", "caught", "catching"],
    "fight": ["fights", "fought", "fighting"],
    "throw": ["throws", "threw", "thrown", "throwing"],
    "forget": ["forgets", "forgot", "forgotten", "forgetting"],
    "hide": ["hides", "hid", "hidden", "hiding"],
    "ride": ["rides", "rode", "ridden", "riding"],
    "sing": ["sings", "sang", "sung", "singing"],
    "swim": ["swims", "swam", "swum", "swimming"],
    "fly": ["flies", "flew", "flown", "flying"],
    "blow": ["blows", "blew", "blown", "blowing"],
    "freeze": ["freezes", "froze", "frozen", "freezing"],
    "steal": ["steals", "stole", "stolen", "stealing"],
    "wake": ["wakes", "woke", "woken", "waking"],
    "bite": ["bites", "bit", "bitten", "biting"],
    "hurt": ["hurts", "hurting"],
    "put": ["puts", "putting"],
    "hit": ["hits", "hitting"],
    "cost": ["costs", "costing"],
    "shut": ["shuts", "shutting"],
    "spread": ["spreads", "spreading"],
    "feed": ["feeds", "fed", "feeding"],
    "shoot": ["shoots", "shot", "shooting"],
    "shake": ["shakes", "shook", "shaken", "shaking"],
    "stick": ["sticks", "stuck", "sticking"],
    "strike": ["strikes", "struck", "striking"],
    "dig": ["digs", "dug", "digging"],
    "hang": ["hangs", "hung", "hanging"],
    "lend": ["lends", "lent", "lending"],
    "seek": ["seeks", "sought", "seeking"],
    "shine": ["shines", "shone", "shining"],
    "sink": ["sinks", "sank", "sunk", "sinking"],
    "slide": ["slides", "slid", "sliding"],
    "tear": ["tears", "tore", "torn", "tearing"],
    "bind": ["binds", "bound", "binding"],
    "bleed": ["bleeds", "bled", "bleeding"],
    "breed": ["breeds", "bred", "breeding"],
    "deal": ["deals", "dealt", "dealing"],
    "flee": ["flees", "fled", "fleeing"],
    "forbid": ["forbids", "forbade", "forbidden", "forbidding"],
    "forgive": ["forgives", "forgave", "forgiven", "forgiving"],
    "lay": ["lays", "laid", "laying"],
    "spell": ["spells", "spelt", "spelling"],
    "spit": ["spits", "spat", "spitting"],
    "spring": ["springs", "sprang", "sprung", "springing"],
    "swear": ["swears", "swore", "sworn", "swearing"],
    "sweep": ["sweeps", "swept", "sweeping"],
    "swing": ["swings", "swung", "swinging"],
    "weep": ["weeps", "wept", "weeping"],
    "wind": ["winds", "wound", "winding"],
}


def vowel_groups(word: str) -> int:
    groups = 0
    previous = False
    for char in word:
        vowel = char in VOWELS
        if vowel and not previous:
            groups += 1
        previous = vowel
    return groups


def doubles_final_consonant(word: str) -> bool:
    if len(word) < 3:
        return False
    if word[-1] in VOWELS or word[-1] in "wxy":
        return False
    if word[-2] not in VOWELS or word[-3] in VOWELS:
        return False
    return vowel_groups(word) == 1


def usable_stem(word: str, vocabulary: set[str]) -> bool:
    if len(word) < 3 or len(word) > 14:
        return False
    if word.endswith(SKIP_SUFFIXES):
        return False
    if not any(char in VOWELS for char in word):
        return False
    # Skip a headword that is already a plural of another headword.
    if word.endswith("s") and word[:-1] in vocabulary:
        return False
    if word.endswith("es") and word[:-2] in vocabulary:
        return False
    if word.endswith("ies") and f"{word[:-3]}y" in vocabulary:
        return False
    # "affronte" would claim "affronted", which already belongs to "affront".
    if word.endswith("e"):
        shorter = word[:-1]
        if shorter in vocabulary and (verbal_forms(word) & verbal_forms(shorter)):
            return False
    return True


def plural_forms(word: str) -> set[str]:
    if word.endswith(("s", "x", "z", "ch", "sh")):
        return {word + "es"}
    if word.endswith("y") and word[-2] not in VOWELS:
        return {word[:-1] + "ies"}
    return {word + "s"}


def verbal_forms(word: str) -> set[str]:
    if word in IRREGULAR:
        return set(IRREGULAR[word])
    forms: set[str] = set()
    if word.endswith("y") and word[-2] not in VOWELS:
        forms.add(word[:-1] + "ied")
    elif word.endswith("e"):
        forms.add(word + "d")
    elif doubles_final_consonant(word):
        forms.add(word + word[-1] + "ed")
    else:
        forms.add(word + "ed")

    if word.endswith("ie"):
        forms.add(word[:-2] + "ying")
    elif word.endswith("e") and not word.endswith("ee"):
        forms.add(word[:-1] + "ing")
    elif doubles_final_consonant(word):
        forms.add(word + word[-1] + "ing")
    else:
        forms.add(word + "ing")
    return forms


def load_web2() -> tuple[set[str], set[str]]:
    vocabulary: set[str] = set()
    stems: set[str] = set()
    for line in WEB2.read_text(errors="replace").splitlines():
        raw = line.strip()
        if not raw.isascii() or not raw.isalpha():
            continue
        vocabulary.add(raw.lower())
        if raw.islower():
            stems.add(raw.lower())
    return vocabulary, stems


def parsed_stems(form: str, vocabulary: set[str]) -> set[str]:
    """Headwords that could regularly produce this surface form."""
    candidates: set[str] = set()
    if form.endswith("ies") and len(form) > 3:
        candidates.add(form[:-3] + "y")
    if form.endswith("es") and len(form) > 2:
        candidates.add(form[:-2])
    if form.endswith("s") and len(form) > 1:
        candidates.add(form[:-1])
    if form.endswith("ied") and len(form) > 3:
        candidates.add(form[:-3] + "y")
    if form.endswith("ed") and len(form) > 2:
        candidates.add(form[:-2])
        if len(form) > 4 and form[-3] == form[-4] and form[-3] not in VOWELS:
            candidates.add(form[:-3])
    if form.endswith("d") and len(form) > 1:
        candidates.add(form[:-1])
    if form.endswith("ying") and len(form) > 4:
        candidates.add(form[:-4] + "ie")
    if form.endswith("ing") and len(form) > 3:
        candidates.add(form[:-3])
        candidates.add(form[:-3] + "e")
        if len(form) > 5 and form[-4] == form[-5] and form[-4] not in VOWELS:
            candidates.add(form[:-4])
    return {stem for stem in candidates if stem in vocabulary}


def ending_rank(stem: str, form: str) -> int:
    """Prefer -ed/-ing over a longer stem that only borrowed the final letter."""
    if form.endswith("ying") and form[:-4] + "ie" == stem:
        return 4
    if form.endswith("ing") and (
        form[:-3] == stem
        or form[:-3] + "e" == stem
        or (len(form) > 5 and form[:-4] == stem and form[-4] == form[-5])
    ):
        return 3
    if form.endswith("ied") and form[:-3] + "y" == stem:
        return 3
    if form.endswith("ed") and (
        form[:-2] == stem or (len(form) > 4 and form[:-3] == stem and form[-3] == form[-4])
    ):
        return 2
    if form.endswith("es") and form[:-2] == stem:
        return 2
    if form.endswith("ies") and form[:-3] + "y" == stem:
        return 3
    if form.endswith("d") and form[:-1] == stem:
        return 1
    if form.endswith("s") and form[:-1] == stem:
        return 1
    return 0


def owner_stem(form: str, vocabulary: set[str]) -> str | None:
    candidates = parsed_stems(form, vocabulary)
    if not candidates:
        return None
    return max(candidates, key=lambda stem: (ending_rank(stem, form), len(stem)))


def collect_additions(vocabulary: set[str], stems: set[str], frequent: set[str]) -> dict[int, set[str]]:
    added: dict[int, set[str]] = {length: set() for length in range(2, 16)}
    for stem in stems:
        if not usable_stem(stem, vocabulary):
            continue
        plurals = plural_forms(stem)
        verbal = verbal_forms(stem)
        has_verbal_sibling = any(
            form in vocabulary and owner_stem(form, vocabulary) == stem for form in verbal
        )
        for form in verbal:
            # Keep a past or -ing form when this stem already has one, or the
            # form is a common word in its own right (played, wanted).
            if has_verbal_sibling or form in frequent:
                consider(form, vocabulary, added)
        for form in plurals:
            if has_verbal_sibling or form in frequent:
                consider(form, vocabulary, added)
    return added


def consider(form: str, vocabulary: set[str], added: dict[int, set[str]]) -> None:
    if not form.isascii() or not form.isalpha():
        return
    if form in vocabulary or not 2 <= len(form) <= 15:
        return
    added[len(form)].add(form)


def read_words(path: Path) -> list[str]:
    if not path.exists():
        return []
    return [line.strip() for line in path.read_text().splitlines() if line.strip()]


def write_words(path: Path, words: list[str]) -> None:
    path.write_text("\n".join(words) + "\n")


def main() -> None:
    dry_run = "--dry-run" in sys.argv
    if not FREQUENCY.exists():
        raise SystemExit(f"Missing frequency list at {FREQUENCY}")
    frequent = {word.strip().lower() for word in FREQUENCY.read_text().splitlines() if word.strip()}
    vocabulary, stems = load_web2()
    added = collect_additions(vocabulary, stems, frequent)

    for length, words in added.items():
        print(f"{length}: +{len(words)}")
    for sample in ("cherished", "cherishes", "played", "houses", "wanted"):
        print(sample, sample in added[len(sample)])

    if dry_run:
        return

    for length in range(2, 16):
        if length == 5:
            continue
        path = DATA / f"words-{length}.txt"
        merged = sorted(set(read_words(path)) | added[length])
        write_words(path, merged)

    allowed_path = DATA / "allowed-guesses.txt"
    allowed = sorted(set(read_words(allowed_path)) | added[5])
    write_words(allowed_path, allowed)

    answer_path = DATA / "answer-words.txt"
    answers = read_words(answer_path)
    seen = set(answers)
    extras = sorted(word for word in added[5] if word in frequent and word not in seen)
    write_words(answer_path, answers + extras)
    print(f"five-letter common answers added: {len(extras)}")
    print(f"five-letter allowed guesses: {len(allowed)}")


if __name__ == "__main__":
    main()
