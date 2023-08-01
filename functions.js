const axios = require("axios");

const BASE_URL = "https://pokeapi.co/api/v2";
// ** typeName: string "Nombre del tipo por el que se debe filtrar"
// Funcion que retorna la cantidad total de pokemons con un tipo
const getTotalPokemonsByType = async (typeName) => {
  try {
    const type = await getPokemonTypeByTypeName(typeName); 
    return type.data.pokemon.length;
  } catch (err) {
    throw new Error(err.message);
  }
};

// ** typeName1: string  "Nombre del primer tipo a filtrar"
// ** typeName2: string  "Nombre del segundo tipo a filtrar"
// Funcion que retorna los nombres de los pokemons con 2 tipos
const getPokemonNamesByTwoTypes = async (typeName1, typeName2) => {
  try {
    const type1 = await getPokemonTypeByTypeName(typeName1);
    const type2 =
      typeName1 === typeName2
        ? type1
        : await getPokemonTypeByTypeName(typeName2);

    const pokemons1 = type1.data.pokemon.map((poke) => poke.pokemon.name);
    const pokemons2 = type2.data.pokemon.map((poke) => poke.pokemon.name);

    return pokemons1.filter((pokeName) => pokemons2.includes(pokeName));
  } catch (err) {
    throw new Error(err.message);
  }
};

// ** name: string  "Nombre del pokemon a buscar"
// Funcion que retorna el id de un pokemon filtrado por nombre
const getPokemonNumberByName = async (name) => {
  try {
    const pokemon = await getPokemonListByNameOrId(name);
    return pokemon.data.id;
  } catch (err) {
    throw new Error(err.message);
  }
};

// ** pokemonId: number  "Id del pokemon a buscar"
// Funcion que retorna las stats de un pokemon filtrado por nombre
const getStatsByPokemonId = async (pokemonId) => {
  try {
    const pokemon = await getPokemonListByNameOrId(pokemonId);
    const stats = {};
    pokemon.data.stats.forEach(
      (stat) => (stats[stat.stat.name] = stat.base_stat)
    );
    return stats;
  } catch (err) {
    throw new Error(err.message);
  }
};


// ** idArray: numbner[]  "Arreglo de ids de pokemons a buscar"
// ** order: string  "Valor por el cual se debe filtrar el resultado de la busqueda por ids"
// Funcion que retorna un arreglo de info de pokemons ordenados por el ordenador
const getPokemonsInfoByIds = async (idArray, order) => {
  try {
    const pokemonPromises = idArray.map(async (id) => {
      const result = await getPokemonListByNameOrId(id);
      return {
        name: result.data.name,
        weight: result.data.weight,
        type: result.data.types.map((type) => type.type.name),
      };
    });

    const pokemonArray = await Promise.all(pokemonPromises);

    switch (order) {
      case "name":
        return pokemonArray.sort((a, b) => a.name.localeCompare(b.name));
      case "weight":
        return pokemonArray.sort((a, b) => a.weight - b.weight);
      case "type":
        return pokemonArray.sort((a, b) =>
          a.type.join(",").localeCompare(b.type.join(","))
        );
      default:
        throw new Error(
          'Invalid order parameter. Should be "name", "weight", or "type"'
        );
    }
  } catch (error) {
    throw new Error(err.message);
  }
};

// ** pokemonId: number  "Id del pokemon a buscar"
// ** typeName: string  "Nombre del tipo a validar"
// Funcion que retorna un valor booleano definiendo si un pokemon buscado por id tiene un tipo ene specifico
const hasPokemonType = async (pokemonId, typeName) => {
  try {
    const pokemon = await getPokemonListByNameOrId(pokemonId)
    const typesArray = pokemon.data.types.map((type) =>  type.type.name)

    return typesArray.includes(typeName)
  } catch (error) {
    throw new Error(err.message);
  }
};

// ** index: number | string  "Valor para filtrar los resultados de la API, puede ser un id numerico o un name"
// Funcion que retorna un listado de pokemon filtrados
const getPokemonListByNameOrId = async (index) => {
  try {
    return axios.get(`${BASE_URL}/pokemon/${index}`);
  } catch (err) {
    throw new Error(err.message);
  }
};

// ** name: string  "Nombre del tipo a buscar"
// Funcion que retorna todos los pokemon por un tipo en epecifico
const getPokemonTypeByTypeName = async (name) => {
  try {
    return axios.get(`${BASE_URL}/type/${name}`);
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  getTotalPokemonsByType,
  getPokemonNamesByTwoTypes,
  getPokemonNumberByName,
  getStatsByPokemonId,
  getPokemonsInfoByIds,
  hasPokemonType,
};
