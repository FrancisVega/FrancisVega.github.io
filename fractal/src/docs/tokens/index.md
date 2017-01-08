---
title: "Design tokens"
label: "Design tokens"
---
Los [Design tokens](https://medium.com/eightshapes-llc/25dd82d58421) son entidades que guardan información de elementos de diseño. Estos son usados en lugar de escribir directamente el valor en propiedades css (hard-coded), ayudando así a mantener un sistema escalable y consistente.


{% for designtoken in designtokens -%}
# {{ designtoken.title }}
{{ designtoken.desc }}


Token  | Valor
-------|------------
{% for key, value in designtoken.tokens -%}
`${{ key }}` | {{ value }}
{% endfor -%}
{% endfor -%}
