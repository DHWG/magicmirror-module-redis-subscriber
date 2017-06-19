Module.register('redis-subscriber', {

  defaults: {
    redis: {
      host: 'localhost'
    },
    fields: [
      {
        path: '$.name'
      },
      {
        path: '$.text'
      }
    ],
    redisTopic: 'chat',
    numberOfMessages: 10,
    maxCellLength: 40
  },

  _data: [],

  /**
   * Initialize the module.
   */
  start: function() {
    // pass module config on to node module
    this.sendSocketNotification('configure', this.config);
  },

  /**
   * Handle incoming messages from the back-end.
   */
  socketNotificationReceived: function(notification, payload) {
    switch (notification) {
      case 'message':
        if (this._data.length >= this.config.numberOfMessages) {
          this._data.shift();
        }
        this._data.push(payload);
        this.updateDom(500);
        break;
    }
  },

  /**
   * Produce HTML representation.
   */
  getDom: function() {
    let wrapper = document.createElement('div');
    wrapper.className = 'chat-wrapper';

    var html = '<table>';
    for (let message of this._data) {
      html += '<tr>';
      
      for (let field of this.config.fields) {
        let results = jsonPath(message, field.path);
        if (results.length < 1) continue;
        let value = results[0];
        if (value.length > this.config.maxCellLength) {
          value = value.substring(0, this.config.maxCellLength - 3) + '...';
        }
        html += `<td>${value}</td>`;
      }

      html += '</tr>';
    }
    html += '</table>';

    wrapper.innerHTML = html;
    return wrapper;
  },

  getStyles: function() {
    return ['redis-subscriber.css'];
  },

  getScripts: function() {
    return ['jsonpath-0.8.0.js']
  }

});
