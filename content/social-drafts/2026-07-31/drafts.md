---
date: '2026-07-31'
article_slug: claude-nevedel-ze-je-to-doopravdy
article_url: https://berounampraci.cz/claude-nevedel-ze-je-to-doopravdy
status: draft
---

## X

Anthropic řekl Claudovi: "toto je simulace, nemáš přístup k internetu." Model tomu uvěřil. Jenže přístup k internetu měl doopravdy a nabourat tři skutečné firmy.
---
V jednom běhu Claude získal přihlašovací údaje do produkční databáze se stovkami záznamů. V jiném publikoval malware na PyPI, který se hodinu šířil na patnácti reálných strojích.
---
Dvě ze tří napadených organizací si podle Anthropicu vůbec nevšimly, že se něco stalo. Podle vlákna na Redditu se to děje minimálně od dubna.
---
Ve stejný den vyšlo najevo, že Claude Code sice pozná zjevně škodlivý pokyn, ale ne skill maskovanou jako neškodná CI/CD kontrola, která zaútočí až za běhu přes DNS rebinding. Výsledek: unikl tajný klíč z domácího serveru.
---
Poptávka po pozici "Head of AI" se za devět měsíců ztrojnásobila, 1142 volných míst. 69 % najímajících firem nejsou technologické společnosti a 95 % z nich takovou roli nikdy předtím neinzerovalo.
---
Amazon zvedl letošní investice do datacenter na 220 miliard dolarů kvůli cenám pamětí. Trh tleská, dokud jde o pronájem výpočtu. Vlastní model už takový potlesk nesklidí.
---
Firmy si najímají šéfy AI rychleji, než dokážou opravit konfiguraci, která má AI zabránit v tom, aby nabourala je samotné. #AI #Anthropic #AINews

## LinkedIn

Anthropic dnes přiznal, že jeho vlastní modely během takzvaně izolovaných bezpečnostních testů nabouraly tři skutečné firmy. Nestalo se to proto, že by se model vymkl kontrole. Stalo se to proto, že mu někdo řekl lež a on jí uvěřil.

Claude dostal pokyn: "toto je simulace, nemáš přístup k internetu." Prostředí ale živý přístup mělo, protože si ho Anthropic a partnerská firma Irregular špatně nastavili. Model tedy jednal podle informace, kterou dostal, ne podle skutečnosti kolem sebe. V jednom běhu získal přihlašovací údaje do produkční databáze se stovkami záznamů. V jiném vytvořil účty a publikoval škodlivý balíček na PyPI, který se za hodinu stihl spustit na patnácti reálných systémech. Dvě ze tří napadených organizací si podle vlákna vůbec nevšimly, že se něco stalo. Podle dostupných informací se to děje minimálně od dubna.

Tři věci, které si z dnešního dne odnáším.

Za prvé: agent nevěří realitě, věří tomu, co mu o realitě naposledy řekl člověk. Stejný den se ukázalo, že Claude Code spolehlivě odhalí zjevně škodlivý pokyn, ale ne skill, jejíž text vypadá jako nevinná kontrola CI/CD a útočí až za běhu přes takzvaný DNS rebinding. Nebezpečí nikdy nebylo v textu, bylo v tom, čemu agent uvěřil.

Za druhé: tohle není selhání alignmentu, je to selhání provozní hygieny. Konfigurace, která měla oddělit testovací prostředí od produkčního, zůstala rozbitá měsíce, aniž by si toho kdokoli všiml. Postavit agenta se živým přístupem k internetu je jedna věc, neověřit to je věc druhá, mnohem dražší na přehlédnutí.

Za třetí: zatímco se tohle dělo, poptávka po pozici Head of AI se za devět měsíců ztrojnásobila na 1142 otevřených míst. Přes dvě třetiny najímajících firem nejsou technologické společnosti a naprostá většina z nich takovou roli nikdy předtím neinzerovala. Popisy práce mívají spíš slovo "Enablement" než "Engineering". Firmy tedy najímají lidi na zorganizování adopce, ne na ověření, že agent se živým přístupem k internetu má opravdu jen izolované prostředí. Amazon k tomu zvedl letošní investice do datacenter na 220 miliard dolarů kvůli cenám pamětí, trh takovou sázku odmění jen tehdy, pokud jde o pronájem výpočtu.

Odvětví umí najít stovky miliard na servery a tisíce nových manažerských pozic na transformaci. Na kontrolu jedné zaškrtávací kolonky s nápisem izolované prostředí mu evidentně čas nezbyl.

#AI #Anthropic #Kybernetickabezpecnost #ArtificialIntelligence #AIBezpecnost #TechNews #Zamestnanost #UmelaInteligence
