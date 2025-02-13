const sequelize = require('../config/database');
const Transaction = require("./Transaction")
const Types = require("./Types")
const Currency = require('./Currency')
const Category = require('./Categories')
const PaymentMethod = require('./PaymentMethods')
// Sincronizar todos los modelos con la base de datos
const initDb = async () => {
  try {
      Transaction.belongsTo(Types, {
        foreignKey: 'type_id',
        as: 'transactionType'
      });

      Transaction.belongsTo(Currency, {
        foreignKey: 'currency_id',
        as: 'transactionCurrency'
      });

      Transaction.belongsTo(Category, {
        foreignKey: 'category_id',
        as: 'transactionCategory'
      });

      Transaction.belongsTo(PaymentMethod, {
        foreignKey: 'payment_method_id',
        as: 'transactionPaymenMethod'
      });

      Category.belongsTo(Types,{
        foreignKey: 'type_id',
        as: 'CategoryTypes'
      })

      PaymentMethod.belongsTo(Currency,{
        foreignKey: 'currency_id',
        as: 'PaymentMethodCurrency'
      })

      Category.hasMany(Transaction, {
        foreignKey: 'category_id',
        as: 'transactions'
    });

    Types.hasMany(Category, {
      foreignKey: 'type_id',
      as: 'types'
    })
    
    Currency.hasMany(PaymentMethod,{
      foreignKey: 'currency_id',
      as: 'currenciesPayment'
    })
    
    PaymentMethod.hasMany(Transaction, {
      foreignKey: 'payment_method_id',
      as: 'transactions'
  });
      Types.hasMany(Transaction, {
          foreignKey: 'type_id',
          as: 'transactions'
      });

      Currency.hasMany(Transaction, {
        foreignKey: 'currency_id',
        as: 'currenciesTransaction'
    });

    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await sequelize.sync({ force: false });
    console.log("Database synchronized.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = initDb;
