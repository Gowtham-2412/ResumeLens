const MAX_KEYWORDS = 45;

const TECH_ALIASES = [
    ["nodejs", /\bnode\s*\.?\s*js\b|\bnodejs\b/g],
    ["react", /\breact\s*\.?\s*js\b|\breactjs\b|\breact\b/g],
    ["nextjs", /\bnext\s*\.?\s*js\b|\bnextjs\b/g],
    ["vue", /\bvue\s*\.?\s*js\b|\bvuejs\b|\bvue\b/g],
    ["angular", /\bangular\s*\.?\s*js\b|\bangularjs\b|\bangular\b/g],
    ["express", /\bexpress\s*\.?\s*js\b|\bexpressjs\b|\bexpress\b/g],
    ["mongodb", /\bmongo\s*db\b|\bmongodb\b/g],
    ["postgresql", /\bpostgre\s*sql\b|\bpostgres\b|\bpostgresql\b/g],
    ["mysql", /\bmy\s*sql\b|\bmysql\b/g],
    ["javascript", /\bjava\s*script\b|\bjavascript\b/g],
    ["typescript", /\btype\s*script\b|\btypescript\b/g],
    ["tailwindcss", /\btailwind\s*css\b|\btailwindcss\b|\btailwind\b/g],
    ["html", /\bhtml5?\b/g],
    ["css", /\bcss3?\b/g],
    ["rest api", /\brestful\s*apis?\b|\brest\s*apis?\b/g],
    ["graphql", /\bgraph\s*ql\b|\bgraphql\b/g],
    ["docker", /\bdocker\b/g],
    ["kubernetes", /\bkubernetes\b|\bk8s\b/g],
    ["aws", /\bamazon\s*web\s*services\b|\baws\b/g],
    ["gcp", /\bgoogle\s*cloud\s*platform\b|\bgoogle\s*cloud\b|\bgcp\b/g],
    ["azure", /\bmicrosoft\s*azure\b|\bazure\b/g],
    ["git", /\bgit\b/g],
    ["github", /\bgithub\b|\bgit\s*hub\b/g],
    ["gitlab", /\bgitlab\b|\bgit\s*lab\b/g],
    ["ci cd", /\bci\s*\/?\s*cd\b|\bcontinuous\s*integration\b|\bcontinuous\s*deployment\b/g],
    ["redux", /\bredux\b|\bredux\s*toolkit\b/g],
    ["firebase", /\bfirebase\b/g],
    ["prisma", /\bprisma\b/g],
    ["mongoose", /\bmongoose\b/g],
    ["redis", /\bredis\b/g],
    ["linux", /\blinux\b/g],
    ["python", /\bpython\b/g],
    ["java", /\bjava\b/g],
    ["c++", /\bc\s*\+\+\b|\bcpp\b/g],
    ["c#", /\bc\s*#\b|\bcsharp\b/g],
    ["c", /\bc\b/g],
    ["go", /\bgolang\b|\bgo\b/g],
    ["php", /\bphp\b/g],
    ["ruby", /\bruby\b/g],
    ["swift", /\bswift\b/g],
    ["kotlin", /\bkotlin\b/g],
    ["dart", /\bdart\b/g],
    ["flutter", /\bflutter\b/g],
    ["react native", /\breact\s*native\b/g],
    ["spring boot", /\bspring\s*boot\b/g],
    ["spring", /\bspring\b/g],
    ["django", /\bdjango\b/g],
    ["flask", /\bflask\b/g],
    ["fastapi", /\bfast\s*api\b|\bfastapi\b/g],
    ["laravel", /\blaravel\b/g],
    ["sql", /\bsql\b/g],
    ["nosql", /\bno\s*sql\b|\bnosql\b/g],
    ["sqlite", /\bsqlite\b/g],
    ["sql server", /\bsql\s*server\b|\bmssql\b/g],
    ["oracle", /\boracle\b/g],
    ["jenkins", /\bjenkins\b/g],
    ["terraform", /\bterraform\b/g],
    ["ansible", /\bansible\b/g],
    ["nginx", /\bnginx\b/g],
    ["apache", /\bapache\b/g],
    ["vite", /\bvite\b/g],
    ["webpack", /\bwebpack\b/g],
    ["babel", /\bbabel\b/g],
    ["npm", /\bnpm\b/g],
    ["yarn", /\byarn\b/g],
    ["jest", /\bjest\b/g],
    ["vitest", /\bvitest\b/g],
    ["cypress", /\bcypress\b/g],
    ["playwright", /\bplaywright\b/g],
    ["selenium", /\bselenium\b/g],
    ["figma", /\bfigma\b/g],
    ["postman", /\bpostman\b/g],
    ["jira", /\bjira\b/g],
    ["machine learning", /\bmachine\s*learning\b|\bml\b/g],
    ["deep learning", /\bdeep\s*learning\b/g],
    ["tensorflow", /\btensorflow\b/g],
    ["pytorch", /\bpytorch\b|\bpy\s*torch\b/g],
    ["pandas", /\bpandas\b/g],
    ["numpy", /\bnumpy\b|\bnum\s*py\b/g],
    ["scikit learn", /\bscikit\s*learn\b|\bsklearn\b/g],
    ["api", /\bapi\b|\bapis\b/g],
    ["microservices", /\bmicroservices\b|\bmicroservice\b/g]
];

const normalizeText = (text) => {
    const safeText = typeof text === "string" ? text : "";

    return safeText
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/\s+/g, " ")
        .trim();
};

const sortCandidates = (a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight;
    if (b.frequency !== a.frequency) return b.frequency - a.frequency;
    return a.term.localeCompare(b.term);
};

const countMatches = (text, pattern) => {
    const matches = text.match(pattern);
    return matches ? matches.length : 0;
};

export const extractKeywords = (text, options = {}) => {
    const maxKeywords = options.maxKeywords || MAX_KEYWORDS;
    const normalizedText = normalizeText(text);
    const frequencyMap = {};

    TECH_ALIASES.forEach(([canonicalTerm, pattern]) => {
        const frequency = countMatches(normalizedText, pattern);

        if (frequency > 0) {
            frequencyMap[canonicalTerm] = (frequencyMap[canonicalTerm] || 0) + frequency;
        }
    });

    if (frequencyMap["rest api"] || frequencyMap.graphql) {
        delete frequencyMap.api;
    }

    const candidates = Object.entries(frequencyMap)
        .map(([term, frequency]) => ({
            term,
            frequency,
            type: term.includes(" ") ? "phrase" : "technology",
            weight: frequency * (term.includes(" ") ? 2 : 1)
        }))
        .sort(sortCandidates)
        .slice(0, maxKeywords);

    const keywords = candidates.map(({ term }) => term);

    return {
        rawKeywords: keywords,
        tokenFrequency: frequencyMap,
        keywordFrequency: frequencyMap,
        keywords: candidates,
        keywordSet: new Set(keywords)
    };
};
