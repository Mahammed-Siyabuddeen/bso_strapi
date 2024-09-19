'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi,env }) {
    const io = require("socket.io")(strapi.server.httpServer, {
      cors: {
        origin: process.env.FRONT_END_URL,
        Headers: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        enabled: true,
        credentials: true,
      },
    });
    io.on('connection',(socket)=>{
      console.log('socket connected');

      strapi.db.lifecycles.subscribe({
        models: ["plugin::users-permissions.user"],
        async afterUpdate(event) {
          const { result, params } = event;
          try {
            socket.emit('cartUpdated',params)
          } catch (error) {
            console.log("error",error);
          }
        },
      });
    })

  },
};
