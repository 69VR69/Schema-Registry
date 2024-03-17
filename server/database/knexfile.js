module.exports = {
    client: 'better-sqlite3',
    connection: {
      filename: '/path/to/db.sqlite3',
      options: {
        readonly: true,
      },
    },
  };