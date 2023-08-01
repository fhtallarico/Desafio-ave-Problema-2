const pokeApiFunctions = require('./functions');

(async () => {
    try {
      // Ejemplo 1
      const type1 = 'dark';
      console.log(`Total de pokémon de tipo "${type1}":`, await pokeApiFunctions.getTotalPokemonsByType(type1));
  
      // Ejemplo 2
      const type2 = 'ghost';
      const type3 = 'fairy';
      console.log(`Pokémon de tipo "${type2}" y "${type3}":`, await pokeApiFunctions.getPokemonNamesByTwoTypes(type2, type3));
  
      // Ejemplo 3
      const name = 'pikachu';
      console.log(`Número del pokémon "${name}":`, await pokeApiFunctions.getPokemonNumberByName(name));
  
      // Ejemplo 4
      const pokemonId = 25;
      console.log(`Stats base del pokémon ${pokemonId}:`, await pokeApiFunctions.getStatsByPokemonId(pokemonId));
  
      // Ejemplo 5
      const ids = [4, 2, 8, 1, 6];
      const orderBy = 'type'; // Puedes cambiar a 'name' o 'type'
      console.log('Pokémon ordenados por peso:', await pokeApiFunctions.getPokemonsInfoByIds(ids, orderBy));

      // Ejemplo 6
      const type4 = 'electric';
      const pokemonId2 = 25
      console.log(`El pokémon ${pokemonId2} tiene el tipo "${type4}":`, await pokeApiFunctions.hasPokemonType(pokemonId2, type4));
    } catch (error) {
      console.error(error.message);
    }
  })();