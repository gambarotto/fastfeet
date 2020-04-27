require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true, // Faz com que todas as tabelas do banco tenham creatAt,updateAt
    underscored: true, // Faz com q o sequelize padronize as tabelas, ex nova_tabela
    underscoredAll: true,
  },
};
