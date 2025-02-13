class UtilService{
    renameKeyInResults = (results, oldKey, newKey) => {
        return results.map(item => {
          const itemJson = item.toJSON();
          // Cambiar el nombre de la propiedad
          itemJson[newKey] = itemJson[oldKey];
          delete itemJson[oldKey];  // Eliminar la propiedad original
          return itemJson;
        });
      };
      
}

module.exports = UtilService