const axios = require("axios");

const BASE_URL = "https://pokeapi.co/api/v2";
/**
 * Función que retorna la cantidad total de pokémon con un tipo específico.
 *
 * @param {string} typeName - Nombre del tipo por el que se debe filtrar.
 * @returns {Promise<number>} - Retorna una promesa que resuelve con la cantidad total de pokémon con el tipo especificado.
 * @throws {Error} - Error lanzado si ocurre un problema en la consulta a la API.
 */
const getTotalPokemonsByType = async (typeName) => {
  try {
    const type = await getPokemonTypeByTypeName(typeName); 
    return type.data.pokemon.length;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Función que retorna los nombres de los pokémon con dos tipos específicos.
 *
 * @param {string} typeName1 - Nombre del primer tipo a filtrar.
 * @param {string} typeName2 - Nombre del segundo tipo a filtrar.
 * @returns {Promise<string[]>} - Retorna una promesa que resuelve con un arreglo de nombres de pokémon que cumplen con ambos tipos especificados.
 * @throws {Error} - Error lanzado si ocurre un problema en la consulta a la API.
 */
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

/**
 * Función que retorna el número de un pokémon filtrado por nombre.
 *
 * @param {string} name - Nombre del pokémon a buscar.
 * @returns {Promise<number>} - Retorna una promesa que resuelve con el número del pokémon encontrado.
 * @throws {Error} - Error lanzado si ocurre un problema en la consulta a la API.
 */
const getPokemonNumberByName = async (name) => {
  try {
    const pokemon = await getPokemonListByNameOrId(name);
    return pokemon.data.id;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Función que retorna las stats de un pokémon filtrado por número.
 *
 * @param {number} pokemonId - ID del pokémon a buscar.
 * @returns {Promise<object>} - Retorna una promesa que resuelve con un objeto que contiene las stats del pokémon.
 * @throws {Error} - Error lanzado si ocurre un problema en la consulta a la API.
 */
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


/**
 * Función que retorna un arreglo de información de pokémon ordenados según el parámetro de ordenamiento especificado.
 *
 * @param {number[]} idArray - Arreglo de IDs de pokémon a buscar.
 * @param {string} order - Valor por el cual se debe filtrar el resultado de la búsqueda por IDs. Debe ser "name", "weight" o "type".
 * @returns {Promise<object[]>} - Retorna una promesa que resuelve con un arreglo de objetos que contienen información de los pokémon ordenados según el parámetro especificado.
 * @throws {Error} - Error lanzado si ocurre un problema en la consulta a la API o si el parámetro de orden es inválido.
 */
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

/**
 * Función que retorna un valor booleano indicando si un pokémon buscado por ID tiene un tipo específico.
 *
 * @param {number} pokemonId - ID del pokémon a buscar.
 * @param {string} typeName - Nombre del tipo a validar.
 * @returns {Promise<boolean>} - Retorna una promesa que resuelve con un valor booleano indicando si el pokémon tiene el tipo especificado.
 * @throws {Error} - Error lanzado si ocurre un problema en la consulta a la API.
 */
const hasPokemonType = async (pokemonId, typeName) => {
  try {
    const pokemon = await getPokemonListByNameOrId(pokemonId)
    const typesArray = pokemon.data.types.map((type) =>  type.type.name)

    return typesArray.includes(typeName)
  } catch (error) {
    throw new Error(err.message);
  }
};

/**
 * Función que retorna un listado de pokémon filtrados por nombre o ID.
 *
 * @param {number|string} index - Valor para filtrar los resultados de la API, puede ser un ID numérico o un nombre.
 * @returns {Promise<object>} - Retorna una promesa que resuelve con los datos del pokémon encontrado.
 * @throws {Error} - Error lanzado si ocurre un problema en la consulta a la API.
 */
const getPokemonListByNameOrId = async (index) => {
  try {
    return axios.get(`${BASE_URL}/pokemon/${index}`);
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Función que retorna todos los pokémon de un tipo específico.
 *
 * @param {string} name - Nombre del tipo a buscar.
 * @returns {Promise<object>} - Retorna una promesa que resuelve con los datos del tipo encontrado, incluyendo un listado de los pokémon que cumplen con ese tipo.
 * @throws {Error} - Error lanzado si ocurre un problema en la consulta a la API.
 */
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
