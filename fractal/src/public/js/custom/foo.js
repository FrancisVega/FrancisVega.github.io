/* Esto es un archivo fake en js.
 * Podría ser un buen sitio para el típico archivo app.js o index.js que maneja la web-app
 *
 * Se está usando ramdajs
 */

const addMember = (n, r, a, members) => R.append({name: n, race: r, age: a}, members);

const addFrodo = addMember('Frodo', 'Hobbit', 50, []);
const addSamwise = addMember('Samwise', 'Hobbit', 38, addFrodo);
const addMerri = addMember('Merri', 'Hobbit', 36, addSamwise);
const addPippin = addMember('Pippin', 'Hobbit', 28, addMerri);
const addAragorn = addMember('Aragorn', 'Human', 37, addPippin);
const addBoromir = addMember('Boromir', 'Human', 48, addAragorn);
const addLegolas = addMember('Legolas', 'Elf', 2931, addBoromir);
const addGimli = addMember('Gimli', 'Dwarf', 139, addLegolas);
const addGandalf = addMember('Gandalf', 'Ainur', 2021, addGimli);

console.log('The fellowship of the Ring.');
console.log('---------------------------');
R.map(member =>
  console.log(`*${member.name}*, ${member.race} with ${member.age} years old.`),
  addGandalf,
);
